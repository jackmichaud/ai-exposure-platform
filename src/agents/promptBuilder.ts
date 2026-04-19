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

function formatTasks(occupation: Occupation): string {
  return occupation.tasks
    .map(
      (t) =>
        `- ${t.name} (auto risk: ${t.automationRisk}, aug potential: ${t.augmentationPotential}, ${Math.round(t.timeWeight * 100)}% of time)`
    )
    .join('\n')
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
  return `The occupation under discussion is ${occupation.title} in the ${industryName} industry.

Key facts:
- Median wage: ${formatWage(occupation.medianWage)}
- Education: ${educationLabel(occupation.educationLevel)}
- Overall AI exposure score: ${Math.round(occupation.exposureScore.overall)}/100

Task breakdown:
${formatTasks(occupation)}

Provide your opening analysis of how AI will impact this occupation. Address
automation risks, augmentation opportunities, and implications for workers.`
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
  return `You are an objective analyst summarizing a structured debate about AI's impact
on the occupation of ${occupation.title} in ${industryName}.

Full debate transcript:
${allRoundResponses}

Produce a structured summary with:
1. Key Takeaways (3-5 bullets)
2. Risk Assessment (low/moderate/high/critical + explanation)
3. Recommendations for Workers (3-5 actionable items)
4. Projected Changes (skills, wages, employment)
5. Areas of Agreement
6. Areas of Disagreement

Be balanced and specific. Reference points made by each participant.`
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
