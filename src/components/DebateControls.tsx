import type { DebateState, PersonaId } from '../types'
import { PERSONAS } from '../agents/personas'

interface Props {
  status: DebateState['status']
  currentSpeaker: PersonaId | null
  currentRound: number
  onStart: () => void
  onCancel: () => void
  onReset: () => void
  occupationTitle: string
}

export default function DebateControls({
  status,
  currentSpeaker,
  currentRound,
  onStart,
  onCancel,
  onReset,
  occupationTitle,
}: Props) {
  const currentPersona = currentSpeaker
    ? PERSONAS.find((p) => p.id === currentSpeaker)
    : null

  function renderRoundBar() {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className={[
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              n < currentRound
                ? 'bg-indigo-500'
                : n === currentRound
                ? 'bg-indigo-400 animate-pulse'
                : 'bg-slate-700',
            ].join(' ')}
          />
        ))}
      </div>
    )
  }

  if (status === 'idle') {
    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Selected Occupation</p>
          <p className="text-slate-200 font-medium">{occupationTitle || 'None selected'}</p>
        </div>
        <button
          onClick={onStart}
          disabled={!occupationTitle}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-colors text-sm whitespace-nowrap"
        >
          Start Debate
        </button>
      </div>
    )
  }

  if (status === 'debating') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wide">Round {currentRound} of 3</p>
              {currentPersona && (
                <p className={`text-sm font-medium ${currentPersona.textColor}`}>
                  {currentPersona.icon} {currentPersona.name} is speaking…
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-600 text-slate-300 hover:bg-slate-800 rounded-lg text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
        <div className="max-w-xs">{renderRoundBar()}</div>
      </div>
    )
  }

  if (status === 'summarizing') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
        <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-300 text-sm font-medium">Generating synthesis…</p>
      </div>
    )
  }

  if (status === 'complete') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-emerald-400 text-sm">✓</span>
          <span className="px-3 py-1 bg-emerald-950/40 border border-emerald-800 text-emerald-400 text-sm rounded-full font-medium">
            Debate Complete
          </span>
        </div>
        <button
          onClick={onReset}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-sm"
        >
          Start New Debate
        </button>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="bg-slate-900 border border-red-900 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-red-400 text-sm">An error occurred during the debate.</p>
        <button
          onClick={onStart}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors text-sm"
        >
          Retry
        </button>
      </div>
    )
  }

  return null
}
