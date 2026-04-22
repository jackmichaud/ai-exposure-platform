import type { Dispatch } from 'react'
import type { DebateAction, PersonaId, DebateRound, DebateSummary } from '../types'
import { getOccupation, getIndustries } from '../api/dataApi'
import { streamTurn } from '../api/claudeClient'
import { PERSONA_ORDER } from './personas'
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
  signal: AbortSignal
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
        const maxTok = roundNum === 3 ? 1536 : 1024

        for await (const token of streamTurn(system, userPrompt, maxTok, signal)) {
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

    for await (const token of streamTurn('', synthesisPrompt, 8192, signal, 120_000)) {
      if (signal.aborted) return
      fullSynthesisText += token
    }

    if (signal.aborted) return

    // 5. Parse and dispatch summary
    console.log('[synthesis] raw text:', fullSynthesisText)
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
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  const json = start !== -1 && end > start ? text.slice(start, end + 1) : text.trim()
  try {
    return JSON.parse(json) as DebateSummary
  } catch (err) {
    console.error('[synthesis] parse failed. extracted slice:', json, 'error:', err)
    return {
      keyTakeaways: ['Synthesis could not be parsed. Please try again.'],
      riskAssessment: { level: 'moderate', explanation: '' },
      recommendationsForWorkers: [],
      projectedChanges: { skills: '', wages: '', employment: '' },
      areasOfAgreement: [],
      areasOfDisagreement: [],
    }
  }
}
