#!/usr/bin/env node
/**
 * Generates a scored occupation entry by combining O*NET data with Claude scoring.
 *
 * O*NET provides grounded Work Activities and Work Context importance scores.
 * Claude maps those scores to our 8 sub-dimension rubric and produces task breakdowns.
 * Rollup formulas (automationRisk, augmentationPotential, overall, netDisplacement)
 * are computed deterministically in this script — not by Claude.
 *
 * Usage:
 *   npx tsx scripts/generate-occupation.ts --soc <code> --industry <id> [options]
 *
 * Options:
 *   --soc       SOC code, e.g. 29-1141 (required)
 *   --industry  Industry ID from industries.json, e.g. healthcare (required)
 *   --wage      Median annual wage USD override (optional)
 *   --output    Output file path (default: scripts/output/<soc>.json)
 *
 * Environment variables required:
 *   ONET_USERNAME     Register free at https://services.onetcenter.org/developer/
 *   ONET_PASSWORD
 *   ANTHROPIC_API_KEY
 */

import Anthropic from '@anthropic-ai/sdk';
import { readFile, writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─── CLI ──────────────────────────────────────────────────────────────────────

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i !== -1 ? args[i + 1] : undefined;
  };
  const socCode = get('--soc');
  const industryId = get('--industry');
  const wage = get('--wage') ? parseInt(get('--wage')!, 10) : undefined;
  const output = get('--output');
  if (!socCode || !industryId) {
    console.error(
      'Usage: npx tsx scripts/generate-occupation.ts --soc <code> --industry <id> [--wage <number>] [--output <path>]'
    );
    process.exit(1);
  }
  return { socCode, industryId, wage, output };
}

// ─── O*NET API ────────────────────────────────────────────────────────────────

interface OnetElement {
  id: string;
  name: string;
  importance: number | null; // 1–5 scale
  level: number | null;      // 0–7 scale
}

interface OnetTask {
  id: number;
  name: string;
  importance: number | null;
}

interface OnetData {
  socCode: string;
  title: string;
  description: string;
  workActivities: OnetElement[];
  workContext: OnetElement[];
  tasks: OnetTask[];
  skills: OnetElement[];
}

function onetAuthHeader(): string {
  const user = process.env.ONET_USERNAME;
  const pass = process.env.ONET_PASSWORD;
  if (!user || !pass) {
    throw new Error(
      'ONET_USERNAME and ONET_PASSWORD required. Register free at https://services.onetcenter.org/developer/'
    );
  }
  return 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
}

async function onetGet(endpoint: string): Promise<unknown> {
  const url = `https://services.onetcenter.org/ws${endpoint}`;
  const res = await fetch(url, {
    headers: { Authorization: onetAuthHeader(), Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`O*NET ${res.status}: ${url}`);
  return res.json();
}

function pickScore(scores: unknown, scaleId: string): number | null {
  if (!Array.isArray(scores)) return null;
  const match = scores.find((s: Record<string, unknown>) => (s?.scale as Record<string, unknown>)?.id === scaleId);
  return typeof (match as Record<string, unknown>)?.value === 'number'
    ? ((match as Record<string, unknown>).value as number)
    : null;
}

function parseElements(data: Record<string, unknown>, key = 'element'): OnetElement[] {
  return ((data[key] as unknown[]) || []).map((el: unknown) => {
    const e = el as Record<string, unknown>;
    return {
      id: (e.id as string) ?? '',
      name: (e.name as string) ?? '',
      importance: pickScore(e.score, 'IM'),
      level: pickScore(e.score, 'LV'),
    };
  });
}

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

async function fetchOnetData(rawSoc: string): Promise<OnetData> {
  // O*NET uses 8-char format: "29-1141.00"
  const soc = rawSoc.includes('.') ? rawSoc : `${rawSoc}.00`;
  console.log(`\nFetching O*NET data for ${soc}…`);

  // Sequential requests to respect 3 req/sec rate limit
  const summary = await onetGet(`/occupations/${soc}`) as Record<string, unknown>;
  await sleep(400);
  const workActivitiesRaw = await onetGet(`/occupations/${soc}/details/work_activities`) as Record<string, unknown>;
  await sleep(400);
  const workContextRaw = await onetGet(`/occupations/${soc}/details/work_context`) as Record<string, unknown>;
  await sleep(400);
  const tasksRaw = await onetGet(`/occupations/${soc}/details/tasks`) as Record<string, unknown>;
  await sleep(400);
  const skillsRaw = await onetGet(`/occupations/${soc}/details/skills`) as Record<string, unknown>;

  const allTasks: OnetTask[] = ((tasksRaw.task as unknown[]) || []).map((t: unknown) => {
    const task = t as Record<string, unknown>;
    return { id: task.id as number, name: task.name as string, importance: pickScore(task.score, 'IM') };
  });
  const topTasks = allTasks
    .sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0))
    .slice(0, 15);

  return {
    socCode: rawSoc,
    title: (summary.title as string) ?? '',
    description: (summary.description as string) ?? '',
    workActivities: parseElements(workActivitiesRaw),
    workContext: parseElements(workContextRaw),
    tasks: topTasks,
    skills: parseElements(skillsRaw).slice(0, 10),
  };
}

// ─── Claude scoring ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a labor economist scoring occupations for AI disruption exposure.
You receive O*NET survey data (Work Activities and Work Context, rated on importance 1–5) and
produce a structured JSON scoring for the occupation.

## Sub-dimensions to score per task (each 0–25)

### Automation Risk
- routineness: 0 = novel judgment every time; 25 = fixed procedure
  O*NET anchor: "Making Decisions" importance (inverted) + "Scheduling Work" importance
- dataIntensity: 0 = sparse qualitative inputs; 25 = rich structured data
  O*NET anchor: "Analyzing Data or Information" + "Processing Information" importance
- physicalBottleneck: 0 = requires dexterous on-site presence; 25 = fully digital
  O*NET anchor: Work Context physical proximity / physical demand elements (inverted)
- socialBottleneck: 0 = deep interpersonal trust essential; 25 = minimal human interaction
  O*NET anchor: "Performing for/with Public" + "Assisting/Caring for Others" importance (inverted)

automationRisk per task = routineness + dataIntensity + physicalBottleneck + socialBottleneck

### Augmentation Potential
- informationSynthesis: 0 = simple lookups; 25 = complex multi-source synthesis
  O*NET anchor: "Getting Information" + "Interpreting the Meaning of Information" importance
- decisionSupport: 0 = no/trivial decisions; 25 = high-stakes data-rich decisions
  O*NET anchor: "Making Decisions and Solving Problems" + "Judging Qualities" importance
- creativeLeverage: 0 = no creative output; 25 = ideation, drafting, design
  O*NET anchor: "Thinking Creatively" + "Developing Objectives and Strategies" importance
- productivityMultiplier: 0 = fixed throughput; 25 = output scales with AI tools
  O*NET anchor: "Processing Information" + "Documenting/Recording Information" importance

augmentationPotential per task = sum of 4 augmentation sub-scores

## O*NET importance → sub-dimension score guidance
Use these as starting anchors, adjust ±3 for task-specific context:
  1.0–1.9 → 2–6
  2.0–2.9 → 7–12
  3.0–3.9 → 13–17
  4.0–4.9 → 18–22
  5.0     → 23–25

## LLM Exposure Tiers (Eloundou et al.)
- E0: AI cannot reduce task time ≥50% (physical, social, or highly novel)
- E1: LLM alone reduces task time ≥50% (writing, research, analysis, synthesis)
- E2: LLM + specialized tools reduces task time ≥50% (data modeling, coding, forecasting)

## Output
Return ONLY valid JSON — no markdown, no explanation — matching this exact schema:

{
  "title": "string",
  "description": "2–3 sentence description of the occupation",
  "educationLevel": "high-school" | "associate" | "bachelor" | "master" | "doctoral",
  "medianWage": number,
  "tasks": [
    {
      "id": "short-kebab-id",
      "name": "string",
      "description": "1–2 sentence task description",
      "category": "cognitive" | "physical" | "interpersonal",
      "timeWeight": number,
      "llmExposureTier": "E0" | "E1" | "E2",
      "automationSubScores": {
        "routineness": number,
        "dataIntensity": number,
        "physicalBottleneck": number,
        "socialBottleneck": number
      },
      "augmentationSubScores": {
        "informationSynthesis": number,
        "decisionSupport": number,
        "creativeLeverage": number,
        "productivityMultiplier": number
      }
    }
  ],
  "skills": [
    { "id": "kebab-id", "name": "string", "impact": "gained" | "displaced" | "transformed", "relevance": number }
  ],
  "routineTaskIntensity": number,
  "complementarityScore": number,
  "timeline": "near-term" | "mid-term" | "long-term",
  "wageEffect": number,
  "confidence": "low" | "medium" | "high",
  "similarOccupationIds": ["string"],
  "_reasoning": { "task-id": "brief justification for key score choices" }
}

Rules:
- 3–5 tasks; timeWeights must sum to 1.0
- Each sub-score must be 0–25
- routineTaskIntensity = ln(routine_cognitive + routine_manual + ε) − ln(nonroutine_analytical + nonroutine_interpersonal + ε)
  where ε = 0.01 to avoid log(0)
- complementarityScore 0–100: how much the role benefits from working *with* AI (high = augmentation-dominant)
- wageEffect: projected % wage change −50 to +50
- similarOccupationIds: suggest from the provided existing IDs list`;

function formatPrompt(data: OnetData, industryId: string, wage: number | undefined, existingIds: string[]): string {
  const topActivities = [...data.workActivities]
    .filter(a => a.importance !== null)
    .sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0))
    .slice(0, 20);

  const topContext = [...data.workContext]
    .filter(c => c.importance !== null)
    .sort((a, b) => (b.importance ?? 0) - (a.importance ?? 0))
    .slice(0, 15);

  return [
    `Occupation: ${data.title} (SOC: ${data.socCode})`,
    `Industry: ${industryId}`,
    data.description ? `Description: ${data.description}` : '',
    wage ? `Median annual wage (BLS): $${wage.toLocaleString()}` : '',
    '',
    '## O*NET Work Activities (importance 1–5)',
    ...topActivities.map(a => `  [${a.importance!.toFixed(2)}] ${a.name}`),
    '',
    '## O*NET Work Context (importance 1–5)',
    ...topContext.map(c => `  [${c.importance!.toFixed(2)}] ${c.name}`),
    '',
    '## O*NET Task Statements (top 15 by importance)',
    ...data.tasks.map((t, i) => `  ${i + 1}. [${t.importance?.toFixed(2) ?? 'n/a'}] ${t.name}`),
    '',
    '## O*NET Skills (top 10)',
    ...data.skills.map(s => `  [${s.importance?.toFixed(2) ?? 'n/a'}] ${s.name}`),
    '',
    `## Existing occupation IDs (for similarOccupationIds)`,
    existingIds.join(', '),
  ]
    .filter(l => l !== undefined)
    .join('\n');
}

interface ClaudeTaskOutput {
  id: string;
  name: string;
  description: string;
  category: 'cognitive' | 'physical' | 'interpersonal';
  timeWeight: number;
  llmExposureTier: 'E0' | 'E1' | 'E2';
  automationSubScores: {
    routineness: number;
    dataIntensity: number;
    physicalBottleneck: number;
    socialBottleneck: number;
  };
  augmentationSubScores: {
    informationSynthesis: number;
    decisionSupport: number;
    creativeLeverage: number;
    productivityMultiplier: number;
  };
}

interface ClaudeOutput {
  title: string;
  description: string;
  educationLevel: string;
  medianWage: number;
  tasks: ClaudeTaskOutput[];
  skills: Array<{ id: string; name: string; impact: string; relevance: number }>;
  routineTaskIntensity: number;
  complementarityScore: number;
  timeline: 'near-term' | 'mid-term' | 'long-term';
  wageEffect: number;
  confidence: 'low' | 'medium' | 'high';
  similarOccupationIds: string[];
  _reasoning: Record<string, string>;
}

async function scoreWithClaude(
  onetData: OnetData,
  industryId: string,
  wage: number | undefined,
  existingIds: string[]
): Promise<ClaudeOutput> {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY environment variable required');
  }
  const client = new Anthropic();
  console.log('Sending to Claude for scoring…');

  const message = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    temperature: 0,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: formatPrompt(onetData, industryId, wage, existingIds) }],
  });

  const text = message.content[0].type === 'text' ? message.content[0].text : '';
  const json = text.replace(/^```(?:json)?\n?/m, '').replace(/\n?```\s*$/m, '').trim();

  try {
    return JSON.parse(json) as ClaudeOutput;
  } catch {
    console.error('Claude returned invalid JSON:\n', text);
    throw new Error('Claude scoring failed — invalid JSON response');
  }
}

// ─── Deterministic rollup ─────────────────────────────────────────────────────

function computeTaskRollup(task: ClaudeTaskOutput) {
  const { routineness, dataIntensity, physicalBottleneck, socialBottleneck } = task.automationSubScores;
  const { informationSynthesis, decisionSupport, creativeLeverage, productivityMultiplier } = task.augmentationSubScores;
  return {
    automationRisk: routineness + dataIntensity + physicalBottleneck + socialBottleneck,
    augmentationPotential: informationSynthesis + decisionSupport + creativeLeverage + productivityMultiplier,
  };
}

function computeExposureScore(
  tasks: ClaudeTaskOutput[],
  claudeOutput: ClaudeOutput
) {
  const totalWeight = tasks.reduce((s, t) => s + t.timeWeight, 0);
  const scored = tasks.map(t => ({ ...t, ...computeTaskRollup(t) }));

  const automationRisk = scored.reduce((s, t) => s + t.automationRisk * t.timeWeight, 0) / totalWeight;
  const augmentationPotential = scored.reduce((s, t) => s + t.augmentationPotential * t.timeWeight, 0) / totalWeight;

  return {
    scored,
    exposureScore: {
      overall: Math.round(Math.max(automationRisk, augmentationPotential)),
      automationRisk: Math.round(automationRisk),
      augmentationPotential: Math.round(augmentationPotential),
      netDisplacement: Math.round(automationRisk - augmentationPotential),
      complementarityScore: claudeOutput.complementarityScore,
      routineTaskIntensity: claudeOutput.routineTaskIntensity,
      timeline: claudeOutput.timeline,
      wageEffect: claudeOutput.wageEffect,
      confidence: claudeOutput.confidence,
    },
  };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const { socCode, industryId, wage, output } = parseArgs();

  // Load existing occupation IDs for similarOccupationIds suggestions
  const occupationsPath = path.join(__dirname, '../src/data/occupations.json');
  let existingIds: string[] = [];
  try {
    const raw = await readFile(occupationsPath, 'utf8');
    existingIds = (JSON.parse(raw) as Array<{ id: string }>).map(o => o.id);
  } catch {
    console.warn('Could not load occupations.json — similarity suggestions will be empty');
  }

  const onetData = await fetchOnetData(socCode);
  console.log(`O*NET title: ${onetData.title}`);
  console.log(`  Work Activities fetched: ${onetData.workActivities.length}`);
  console.log(`  Work Context fetched:    ${onetData.workContext.length}`);
  console.log(`  Tasks fetched:           ${onetData.tasks.length}`);

  const claudeOutput = await scoreWithClaude(onetData, industryId, wage, existingIds);

  const { scored, exposureScore } = computeExposureScore(claudeOutput.tasks, claudeOutput);

  const occupationId = claudeOutput.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  const prefix = occupationId.split('-').map(w => w[0]).join('').slice(0, 4);

  const finalTasks = scored.map(t => ({
    id: `${prefix}-${t.id}`,
    name: t.name,
    description: t.description,
    category: t.category,
    timeWeight: t.timeWeight,
    llmExposureTier: t.llmExposureTier,
    automationRisk: t.automationRisk,
    augmentationPotential: t.augmentationPotential,
    automationSubScores: t.automationSubScores,
    augmentationSubScores: t.augmentationSubScores,
  }));

  const bottleneckTaskIds = [...finalTasks]
    .sort((a, b) => a.automationRisk - b.automationRisk)
    .slice(0, 2)
    .map(t => t.id);

  const occupation = {
    id: occupationId,
    title: claudeOutput.title,
    industryId,
    socCode,
    medianWage: wage ?? claudeOutput.medianWage,
    educationLevel: claudeOutput.educationLevel,
    description: claudeOutput.description,
    tasks: finalTasks,
    skills: claudeOutput.skills,
    exposureScore,
    bottleneckTaskIds,
    similarOccupationIds: claudeOutput.similarOccupationIds,
    _reasoning: claudeOutput._reasoning,
  };

  const outputDir = path.join(__dirname, 'output');
  await mkdir(outputDir, { recursive: true });
  const outputPath = output ?? path.join(outputDir, `${socCode.replace(/\./g, '_')}.json`);
  await writeFile(outputPath, JSON.stringify(occupation, null, 2), 'utf8');

  console.log(`\n── Results for ${occupation.title} ──`);
  console.log(`  Automation Risk:        ${exposureScore.automationRisk}/100`);
  console.log(`  Augmentation Potential: ${exposureScore.augmentationPotential}/100`);
  console.log(`  Net Displacement:       ${exposureScore.netDisplacement}`);
  console.log(`  Timeline:               ${exposureScore.timeline}`);
  console.log(`  Confidence:             ${exposureScore.confidence}`);
  console.log(`\nOutput: ${outputPath}`);
  console.log(`Review, strip _reasoning field, then add to src/data/occupations.json`);
}

main().catch(err => {
  console.error('\nError:', err.message);
  process.exit(1);
});
