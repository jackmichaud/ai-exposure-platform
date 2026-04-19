import type { PersonaMeta } from '../agents/personas'
import type { DebateState } from '../types'

interface Props {
  persona: PersonaMeta
  response: string
  isCurrentSpeaker: boolean
  roundsCompleted: number
  status: DebateState['status']
}

export default function PersonaPanel({
  persona,
  response,
  isCurrentSpeaker,
  roundsCompleted,
  status,
}: Props) {
  const hasResponse = response.length > 0
  const isDebating = status === 'debating'
  const isComplete = roundsCompleted >= 3

  function getRoundsBadge() {
    if (isComplete) {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-300 font-medium">
          Complete
        </span>
      )
    }
    if (roundsCompleted > 0) {
      return (
        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-700 text-slate-400">
          Round {roundsCompleted}/3
        </span>
      )
    }
    return null
  }

  function renderBody() {
    if (!hasResponse && isCurrentSpeaker && isDebating) {
      // Typing indicator
      return (
        <div className="flex items-center gap-1 py-2">
          <span
            className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"
            style={{ animationDelay: '200ms' }}
          />
          <span
            className="w-2 h-2 rounded-full bg-slate-500 animate-pulse"
            style={{ animationDelay: '400ms' }}
          />
        </div>
      )
    }

    if (!hasResponse) {
      return (
        <p className="text-slate-600 text-sm italic">
          Waiting to speak…
        </p>
      )
    }

    return (
      <div className="max-h-64 overflow-y-auto pr-1">
        <p className="whitespace-pre-wrap text-slate-300 text-sm leading-relaxed">
          {response}
          {isCurrentSpeaker && isDebating && (
            <span className="inline-block w-0.5 h-4 bg-slate-400 ml-0.5 animate-pulse align-middle" />
          )}
        </p>
      </div>
    )
  }

  return (
    <div
      className={[
        'border-t-2',
        persona.borderColor,
        'bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3',
        isCurrentSpeaker && isDebating
          ? `ring-1 ring-offset-0 ring-offset-slate-950 ${persona.borderColor.replace('border-', 'ring-')}`
          : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl" role="img" aria-label={persona.name}>
            {persona.icon}
          </span>
          <span className={`font-semibold text-sm ${persona.textColor}`}>
            {persona.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isCurrentSpeaker && isDebating && (
            <span className={`text-xs font-medium ${persona.textColor} animate-pulse`}>
              Speaking…
            </span>
          )}
          {getRoundsBadge()}
        </div>
      </div>

      {/* Body */}
      <div className={`flex-1 rounded-lg p-3 ${persona.bgColor}`}>
        {renderBody()}
      </div>
    </div>
  )
}
