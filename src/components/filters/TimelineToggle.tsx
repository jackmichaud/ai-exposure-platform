import { useFilterContext } from '../../context/FilterContext'

const TIMELINE_OPTIONS = [
  { value: 'near-term' as const, label: 'Near-term' },
  { value: 'mid-term' as const, label: 'Mid-term' },
  { value: 'long-term' as const, label: 'Long-term' },
]

export default function TimelineToggle() {
  const { state, dispatch } = useFilterContext()

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1">
        Timeline
      </span>
      {TIMELINE_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          onClick={() =>
            dispatch({
              type: 'SET_TIMELINE',
              payload: state.timeline === opt.value ? null : opt.value,
            })
          }
          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors duration-150 ${
            state.timeline === opt.value
              ? 'bg-indigo-600 text-white'
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  )
}
