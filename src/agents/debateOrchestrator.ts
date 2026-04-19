import type { Dispatch } from 'react'
import type { DebateAction, PersonaId, DebateRound, DebateSummary } from '../types'
import { getOccupation, getIndustries } from '../api/dataApi'
import { streamTurn } from '../api/claudeClient'
import { PERSONA_ORDER, PERSONAS } from './personas'
import {
  buildSystemPrompt,
  buildRound1Prompt,
  buildRound2Prompt,
  buildRound3Prompt,
  buildSynthesisPrompt,
  formatPriorResponses,
} from './promptBuilder'

const PERSONA_NAMES: Record<PersonaId, string> = {
  optimist: 'The Optimist',
  realist: 'The Realist',
  skeptic: 'The Skeptic',
  'worker-advocate': 'The Worker Advocate',
}

export async function runDebate(
  occupationId: string,
  dispatch: Dispatch<DebateAction>,
  signal: AbortSignal,
  onSynthesisToken: (token: string) => void
): Promise<void> {
  try {
    // 1. Load occupation + industry
    const occupation = getOccupation(occupationId)
    if (!occupation) throw new Error(`Occupation not found: ${occupationId}`)

    const industries = getIndustries()
    const industry = industries.find((i) => i.id === occupation.industryId)
    const industryName = industry?.name ?? occupation.industryId

    // 2. Start debate
    dispatch({ type: 'START_DEBATE', payload: { occupationId } })

    // Track rounds locally so we can build context without waiting on state
    const localRounds: DebateRound[] = []

    // 3. Three rounds
    for (const roundNum of [1, 2, 3] as const) {
      if (signal.aborted) return

      for (const personaId of PERSONA_ORDER) {
        if (signal.aborted) return

        dispatch({ type: 'SET_SPEAKER', payload: personaId })

        const system = buildSystemPrompt(personaId)
        let userPrompt: string

        if (roundNum === 1) {
          userPrompt = buildRound1Prompt(occupation, industryName)
        } else if (roundNum === 2) {
          const prior = formatPriorResponses(localRounds, 1, PERSONA_NAMES)
          userPrompt = buildRound2Prompt(prior)
        } else {
          const prior = formatPriorResponses(localRounds, 2, PERSONA_NAMES)
          userPrompt = buildRound3Prompt(occupation.title, prior)
        }

        let accumulatedText = ''

        for await (const token of streamTurn(system, userPrompt, 1024, signal)) {
          if (signal.aborted) return
          accumulatedText += token
          dispatch({ type: 'APPEND_TOKEN', payload: { personaId, token, round: roundNum } })
        }

        if (signal.aborted) return

        dispatch({ type: 'COMPLETE_TURN', payload: { personaId, round: roundNum } })

        // Update local round tracking
        const existingRound = localRounds.find((r) => r.round === roundNum)
        if (existingRound) {
          existingRound.responses[personaId] = accumulatedText
        } else {
          localRounds.push({ round: roundNum, responses: { [personaId]: accumulatedText } })
        }
      }
    }

    if (signal.aborted) return

    // 4. Synthesis
    dispatch({ type: 'SET_STATUS', payload: 'summarizing' })
    dispatch({ type: 'SET_SPEAKER', payload: null })

    const fullTranscript = formatPriorResponses(localRounds, 3, PERSONA_NAMES)
    const synthesisPrompt = buildSynthesisPrompt(occupation, industryName, fullTranscript)

    let fullSynthesisText = ''

    for await (const token of streamTurn('', synthesisPrompt, 2048, signal)) {
      if (signal.aborted) return
      fullSynthesisText += token
      onSynthesisToken(token)
    }

    if (signal.aborted) return

    // 5. Parse and dispatch summary
    const summary = parseSynthesis(fullSynthesisText)
    dispatch({ type: 'SET_SUMMARY', payload: summary })
  } catch (err) {
    if (signal.aborted) return
    const message = err instanceof Error ? err.message : String(err)
    dispatch({ type: 'SET_ERROR', payload: message })
  }
}

// ─── Synthesis Parser ─────────────────────────────────────────────────────────

export function parseSynthesis(text: string): DebateSummary {
  const lines = text.split('\n')

  function extractSection(heading: RegExp): string[] {
    const bullets: string[] = []
    let inSection = false

    for (const line of lines) {
      if (heading.test(line)) {
        inSection = true
        continue
      }
      // Stop at the next numbered section heading
      if (inSection && /^\s*\d+\.\s/.test(line) && !heading.test(line)) {
        break
      }
      if (inSection) {
        const trimmed = line.replace(/^[-•*]\s*/, '').trim()
        if (trimmed.length > 0) bullets.push(trimmed)
      }
    }

    return bullets
  }

  function extractParagraphSection(heading: RegExp): string {
    let inSection = false
    const collected: string[] = []

    for (const line of lines) {
      if (heading.test(line)) {
        inSection = true
        continue
      }
      if (inSection && /^\s*\d+\.\s/.test(line)) break
      if (inSection) {
        const trimmed = line.trim()
        if (trimmed.length > 0) collected.push(trimmed)
      }
    }

    return collected.join(' ')
  }

  // Risk assessment: look for level keyword in the Risk Assessment section
  function extractRiskAssessment(): DebateSummary['riskAssessment'] {
    const levels = ['critical', 'high', 'moderate', 'low'] as const
    let inSection = false
    let explanation = ''
    let level: DebateSummary['riskAssessment']['level'] = 'moderate'

    for (const line of lines) {
      if (/2\.\s*Risk Assessment/i.test(line)) {
        inSection = true
        continue
      }
      if (inSection && /^\s*\d+\.\s/.test(line)) break
      if (inSection) {
        const lower = line.toLowerCase()
        for (const l of levels) {
          if (lower.includes(l)) {
            level = l
            break
          }
        }
        const trimmed = line.replace(/^[-•*]\s*/, '').trim()
        if (trimmed.length > 0) explanation += (explanation ? ' ' : '') + trimmed
      }
    }

    return { level, explanation: explanation || 'See full synthesis for details.' }
  }

  // Projected changes
  function extractProjectedChanges(): DebateSummary['projectedChanges'] {
    let inSection = false
    let skills = ''
    let wages = ''
    let employment = ''

    for (const line of lines) {
      if (/4\.\s*Projected Changes/i.test(line)) {
        inSection = true
        continue
      }
      if (inSection && /^\s*\d+\.\s/.test(line)) break
      if (inSection) {
        const lower = line.toLowerCase()
        if (/skills?:/i.test(line)) {
          skills = line.replace(/^\s*-?\s*skills?:\s*/i, '').trim()
        } else if (/wages?:/i.test(line)) {
          wages = line.replace(/^\s*-?\s*wages?:\s*/i, '').trim()
        } else if (/employment:/i.test(line)) {
          employment = line.replace(/^\s*-?\s*employment:\s*/i, '').trim()
        } else if (lower.includes('skill') && !skills) {
          skills = line.replace(/^[-•*]\s*/, '').trim()
        } else if (lower.includes('wage') && !wages) {
          wages = line.replace(/^[-•*]\s*/, '').trim()
        } else if (lower.includes('employ') && !employment) {
          employment = line.replace(/^[-•*]\s*/, '').trim()
        }
      }
    }

    return {
      skills: skills || 'See full synthesis for skill projections.',
      wages: wages || 'See full synthesis for wage projections.',
      employment: employment || 'See full synthesis for employment projections.',
    }
  }

  const keyTakeaways = extractSection(/1\.\s*Key Takeaways/i)
  const riskAssessment = extractRiskAssessment()
  const recommendationsForWorkers = extractSection(/3\.\s*Recommendations for Workers/i)
  const projectedChanges = extractProjectedChanges()
  const areasOfAgreement = extractSection(/5\.\s*Areas of Agreement/i)
  const areasOfDisagreement = extractSection(/6\.\s*Areas of Disagreement/i)

  // Fallbacks if parsing finds nothing
  const fallback = (arr: string[], msg: string) => (arr.length > 0 ? arr : [msg])

  return {
    keyTakeaways: fallback(keyTakeaways, 'See full synthesis for key takeaways.'),
    riskAssessment,
    recommendationsForWorkers: fallback(
      recommendationsForWorkers,
      'See full synthesis for recommendations.'
    ),
    projectedChanges,
    areasOfAgreement: fallback(areasOfAgreement, 'See full synthesis for areas of agreement.'),
    areasOfDisagreement: fallback(
      areasOfDisagreement,
      'See full synthesis for areas of disagreement.'
    ),
  }
}
