import type { Occupation, PersonaId, DebateRound } from '../types'
import { PERSONAS } from './personas'
import { formatWage } from '../components/charts/utils/formatScore'

// ─── System Prompts ───────────────────────────────────────────────────────────

export function buildSystemPrompt(personaId: PersonaId): string {
  switch (personaId) {
    case 'optimist':
      return `You are The Optimist in a structured debate about AI's impact on occupations.
Your perspective: AI is primarily a tool for augmentation and productivity growth.
You believe technology creates more opportunities than it eliminates and that
workers who adapt will thrive.

Rules:
- Stay in character as The Optimist
- Reference the specific occupation and its tasks — avoid generic commentary
- Acknowledge real risks while arguing for the positive trajectory
- Do not invent statistics or cite fake studies
- Keep your response to 200-400 words
- End with a clear, stated position`

    case 'realist':
      return `You are The Realist in a structured debate about AI's impact on occupations.
Your perspective: AI impact varies enormously by occupation, task, and context.
You focus on task-level analysis over sweeping predictions and acknowledge that
both optimists and pessimists are often wrong on timelines.

Rules:
- Stay in character as The Realist
- Reference the specific occupation and its tasks — avoid generic commentary
- Take a clear position — synthesize, do not fence-sit
- Do not invent statistics or cite fake studies
- Keep your response to 200-400 words
- End with a clear, stated position`

    case 'skeptic':
      return `You are The Skeptic in a structured debate about AI's impact on occupations.
Your perspective: AI disruption is real and underestimated. Displacement risks are
concentrated among vulnerable workers. Past technological transitions caused
significant hardship before benefits materialized.

Rules:
- Stay in character as The Skeptic
- Reference the specific occupation and its tasks — avoid generic commentary
- Acknowledge genuine benefits of AI while arguing the cautionary case
- Do not invent statistics or cite fake studies
- Keep your response to 200-400 words
- End with a clear, stated position`

    case 'worker-advocate':
      return `You are The Worker Advocate in a structured debate about AI's impact on occupations.
Your perspective: Centered on what workers need — retraining, wage protection, and
policy support. You focus on concrete transition plans and actionable recommendations
rather than abstract economic arguments.

Rules:
- Stay in character as The Worker Advocate
- Reference the specific occupation and its tasks — avoid generic commentary
- Engage with economic arguments while centering worker needs
- Do not invent statistics or cite fake studies
- Keep your response to 200-400 words
- End with a clear, stated position and specific recommendations`
  }
}

// ─── Context Helpers ─────────────────────────────────────────────────────────

const TIER_KEY = `LLM exposure tiers (Eloundou et al. 2023): E0 = LLM cannot reduce task time ≥50% (physical/social/novel); E1 = LLM alone can; E2 = LLM + specialized tools can.`

const RESEARCH_CONTEXT = `## Academic Research Context
These are real published findings you may reference by author name:
- Autor, Levy & Murnane (2003): Routine Task Intensity (RTI) — routine cognitive/manual tasks are automatable; non-routine analytical and interpersonal tasks resist automation. RTI < 0 means the occupation is non-routine-dominant.
- Frey & Osborne (2013): Estimated 47% of US jobs at high automation risk, but widely criticized for occupation-level conflation — task-level analysis is more accurate.
- Felten, Raj & Seamans (2018): AIOE index — correlates 0.83 with observed AI adoption data; high-AIOE occupations skew toward higher wages, unlike prior automation waves.
- Acemoglu & Restrepo (2022): Task-based framework — automation creates a displacement effect (tasks replaced) and a productivity effect; wages rise only if new reinstatement tasks emerge. Displacement can dominate even when productivity rises.
- Eloundou et al. (2023): ~80% of US jobs have ≥10% of tasks at E1/E2 exposure; white-collar, high-wage occupations are more exposed than in prior automation waves.
- Humlum & Vestergaard (2025): Danish administrative data finds near-zero wage and hours effects from AI adoption so far — large gap between measured exposure and realized labor market impact.
- Gupta & Kumar (2026): Agentic Task Exposure (ATE) — workflow-level displacement by autonomous AI agents; significantly higher impact than single-task LLM exposure estimates.`

function formatTasks(occupation: Occupation): string {
  const bottleneckIds = new Set(occupation.bottleneckTaskIds)
  return occupation.tasks
    .map((t) => {
      const pct = Math.round(t.timeWeight * 100)
      const bottleneck = bottleneckIds.has(t.id) ? ' [bottleneck]' : ''
      return `- ${t.name} — ${pct}% of time | tier: ${t.llmExposureTier}${bottleneck} | auto risk: ${t.automationRisk}/100 | aug potential: ${t.augmentationPotential}/100`
    })
    .join('\n')
}

function formatSkills(occupation: Occupation): string {
  const gained = occupation.skills.filter((s) => s.impact === 'gained').map((s) => s.name)
  const transformed = occupation.skills.filter((s) => s.impact === 'transformed').map((s) => s.name)
  const displaced = occupation.skills.filter((s) => s.impact === 'displaced').map((s) => s.name)
  const lines: string[] = []
  if (gained.length) lines.push(`  Gained: ${gained.join(', ')}`)
  if (transformed.length) lines.push(`  Transformed: ${transformed.join(', ')}`)
  if (displaced.length) lines.push(`  Displaced: ${displaced.join(', ')}`)
  return lines.join('\n')
}

function educationLabel(level: string): string {
  const map: Record<string, string> = {
    'high-school': "High school diploma",
    'associate': "Associate's degree",
    'bachelor': "Bachelor's degree",
    'master': "Master's degree",
    'doctoral': "Doctoral degree",
  }
  return map[level] ?? level
}

// ─── Round Prompts ────────────────────────────────────────────────────────────

export function buildRound1Prompt(occupation: Occupation, industryName: string): string {
  const es = occupation.exposureScore
  const wageEffectStr = es.wageEffect >= 0 ? `+${es.wageEffect}%` : `${es.wageEffect}%`

  return `The occupation under discussion is ${occupation.title} in the ${industryName} industry.

## Occupation Data
- Median wage: ${formatWage(occupation.medianWage)} | Education: ${educationLabel(occupation.educationLevel)}
- Overall AI exposure: ${Math.round(es.overall)}/100 | Automation risk: ${es.automationRisk}/100 | Augmentation potential: ${es.augmentationPotential}/100
- Net displacement score: ${es.netDisplacement} (negative = augmentation-dominant)
- Complementarity score: ${es.complementarityScore}/100 (how much the role benefits from working with AI)
- Routine Task Intensity (RTI): ${es.routineTaskIntensity.toFixed(2)} (negative = non-routine-dominant)
- Projected wage effect: ${wageEffectStr} | Timeline: ${es.timeline} | Model confidence: ${es.confidence}

## Task Breakdown
${TIER_KEY}
${formatTasks(occupation)}

## Skills
${formatSkills(occupation)}

${RESEARCH_CONTEXT}

Provide your opening analysis of how AI will impact this occupation. Ground your arguments in the occupation data and research above — reference specific tasks, scores, tiers, and authors where relevant.`
}

export function buildRound2Prompt(priorResponses: string): string {
  return `Here are the opening statements from all participants:

${priorResponses}

Respond to the other participants' arguments. Where do you agree or disagree?
What did they miss or overstate? Refine your position based on the discussion.`
}

export function buildRound3Prompt(occupationTitle: string, priorResponses: string): string {
  return `Here is the full debate so far:

${priorResponses}

Provide your closing statement. Summarize your position, address the strongest
counterarguments, and offer specific recommendations for ${occupationTitle} workers.`
}

export function buildSynthesisPrompt(
  occupation: Occupation,
  industryName: string,
  allRoundResponses: string
): string {
  return `You are an objective analyst summarizing a structured debate about AI's impact on the occupation of ${occupation.title} in ${industryName}.

Full debate transcript:
${allRoundResponses}

Return ONLY valid JSON — no markdown, no explanation, no code fences. Use plain prose sentences only: no **bold**, no ## headers, no bullet characters, no numbered prefixes, no tables, no horizontal rules.

{
  "keyTakeaways": ["string (1–2 sentences each)", ...],
  "riskAssessment": {
    "level": "low" | "moderate" | "high" | "critical",
    "explanation": "2–4 sentence plain prose explanation"
  },
  "recommendationsForWorkers": ["string (1 actionable sentence each)", ...],
  "projectedChanges": {
    "skills": "1–2 sentence plain prose",
    "wages": "1–2 sentence plain prose",
    "employment": "1–2 sentence plain prose"
  },
  "areasOfAgreement": ["string (1 sentence each)", ...],
  "areasOfDisagreement": ["string (1 sentence each)", ...]
}

Rules:
- keyTakeaways: 3–5 items, reference specific participant arguments
- recommendationsForWorkers: 3–5 items, concrete and actionable, no leading numbers
- areasOfAgreement: 2–4 items
- areasOfDisagreement: 2–4 items
- Be balanced and specific`
}

// ─── Prior Round Formatter ────────────────────────────────────────────────────

export function formatPriorResponses(
  rounds: DebateRound[],
  upToRound: number,
  personaNames: Record<PersonaId, string>
): string {
  const sections: string[] = []

  for (const round of rounds) {
    if (round.round > upToRound) continue

    const roundLabel = round.round === 1 ? 'Round 1 — Opening' : round.round === 2 ? 'Round 2 — Rebuttal' : 'Round 3 — Closing'
    sections.push(`=== ${roundLabel} ===`)

    for (const persona of PERSONAS) {
      const text = round.responses[persona.id]
      if (text) {
        sections.push(`[${personaNames[persona.id]}]:\n${text}`)
      }
    }
  }

  return sections.join('\n\n')
}
