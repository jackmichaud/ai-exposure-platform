import { useState, useRef, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDebateContext } from '../context/DebateContext'
import { runDebate } from '../agents/debateOrchestrator'
import { PERSONAS, PERSONA_ORDER } from '../agents/personas'
import { getOccupations, getIndustries } from '../api/dataApi'
import { formatScore } from '../components/charts/utils/formatScore'
import PersonaPanel from '../components/PersonaPanel'
import DebateControls from '../components/DebateControls'
import DebateSummaryPanel from '../components/DebateSummaryPanel'
import type { PersonaId } from '../types'

export default function DebateArena() {
  const { state, dispatch } = useDebateContext()
  const [searchParams] = useSearchParams()
  const [selectedOccupationId, setSelectedOccupationId] = useState<string>('')
  const abortControllerRef = useRef<AbortController | null>(null)

  const occupations = getOccupations()
  const industries = getIndustries()

  // Pre-select from URL param
  useEffect(() => {
    const param = searchParams.get('occupation')
    if (param) setSelectedOccupationId(param)
  }, [searchParams])

  const selectedOccupation = occupations.find((o) => o.id === selectedOccupationId) ?? null
  const selectedIndustry = selectedOccupation
    ? industries.find((i) => i.id === selectedOccupation.industryId)
    : null

  // Derive current round from rounds completed
  const currentRound =
    state.status === 'idle'
      ? 0
      : state.rounds.length > 0
      ? state.rounds[state.rounds.length - 1].round
      : 1

  // Derive per-persona response: latest round this persona has spoken in
  function getPersonaResponse(personaId: PersonaId): string {
    // Show the latest round's text only
    for (let i = state.rounds.length - 1; i >= 0; i--) {
      const text = state.rounds[i].responses[personaId]
      if (text) return text
    }
    return ''
  }

  // Count rounds completed per persona
  function getRoundsCompleted(personaId: PersonaId): number {
    return state.rounds.filter((r) => r.responses[personaId] !== undefined).length
  }

  async function handleStart() {
    if (!selectedOccupationId) return

    // Abort any in-progress debate
    abortControllerRef.current?.abort()
    const ctrl = new AbortController()
    abortControllerRef.current = ctrl
    await runDebate(selectedOccupationId, dispatch, ctrl.signal)
  }

  function handleCancel() {
    abortControllerRef.current?.abort()
    dispatch({ type: 'SET_STATUS', payload: 'idle' })
  }

  const showSummaryPanel =
    state.status === 'summarizing' || state.status === 'complete'

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-100">Debate Arena</h1>
        <p className="text-slate-400 text-sm mt-1">
          Four AI personas debate how AI will impact a chosen occupation across three structured rounds.
        </p>
      </div>

      {/* Occupation Selector — only shown when idle */}
      {state.status === 'idle' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h2 className="text-slate-200 font-semibold text-sm uppercase tracking-wide">
            Select an Occupation
          </h2>
          <select
            value={selectedOccupationId}
            onChange={(e) => setSelectedOccupationId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Choose an occupation…</option>
            {industries.map((industry) => (
              <optgroup key={industry.id} label={industry.name}>
                {occupations
                  .filter((o) => o.industryId === industry.id)
                  .map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.title}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>

          {/* Selected occupation summary card */}
          {selectedOccupation && (
            <div className="bg-slate-800/60 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="text-slate-100 font-medium">{selectedOccupation.title}</p>
                <p className="text-slate-400 text-sm">{selectedIndustry?.name ?? ''}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-slate-500">AI Exposure</p>
                  <p className="text-lg font-bold text-slate-100">
                    {formatScore(selectedOccupation.exposureScore.overall)}
                    <span className="text-sm text-slate-400">/100</span>
                  </p>
                </div>
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{
                    background: `conic-gradient(#6366f1 ${selectedOccupation.exposureScore.overall}%, #1e293b 0%)`,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Debate Controls */}
      <DebateControls
        status={state.status}
        currentSpeaker={state.currentSpeaker}
        currentRound={currentRound}
        onStart={handleStart}
        onCancel={handleCancel}
        occupationTitle={selectedOccupation?.title ?? ''}
      />

      {/* Persona Panels Grid */}
      {state.status !== 'idle' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {PERSONA_ORDER.map((personaId) => {
            const persona = PERSONAS.find((p) => p.id === personaId)!
            return (
              <PersonaPanel
                key={personaId}
                persona={persona}
                response={getPersonaResponse(personaId)}
                isCurrentSpeaker={state.currentSpeaker === personaId}
                roundsCompleted={getRoundsCompleted(personaId)}
                status={state.status}
              />
            )
          })}
        </div>
      )}

      {/* Synthesis / Summary Panel */}
      {showSummaryPanel && (
        <DebateSummaryPanel
          summary={state.summary}
          isSynthesizing={state.status === 'summarizing'}
        />
      )}
    </div>
  )
}
