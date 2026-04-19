import { useFilterContext } from '../../context/FilterContext'
import IndustryFilter from './IndustryFilter'
import TimelineToggle from './TimelineToggle'
import EducationFilter from './EducationFilter'
import WageRangeSlider from './WageRangeSlider'

const DEFAULT_WAGE_MIN = 0
const DEFAULT_WAGE_MAX = 400000

interface Props {
  resultCount: number
}

export default function FilterBar({ resultCount }: Props) {
  const { state, dispatch } = useFilterContext()

  const isFiltered =
    state.industry !== null ||
    state.educationLevel !== null ||
    state.timeline !== null ||
    state.wageRange[0] !== DEFAULT_WAGE_MIN ||
    state.wageRange[1] !== DEFAULT_WAGE_MAX

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 mb-6 space-y-3">
      {/* Row 1: Industry */}
      <IndustryFilter />

      {/* Row 2: Timeline + Education + Wage + Clear */}
      <div className="flex flex-wrap items-center gap-3">
        <TimelineToggle />
        <EducationFilter />
        <WageRangeSlider />

        {isFiltered && (
          <button
            onClick={() => dispatch({ type: 'RESET' })}
            className="px-3 py-1 text-xs bg-slate-700 text-slate-300 hover:bg-slate-600 rounded-md transition-colors duration-150"
          >
            Clear
          </button>
        )}
      </div>

      {/* Result count */}
      <p className="text-xs text-slate-500">
        {resultCount} occupation{resultCount !== 1 ? 's' : ''}
        {isFiltered ? ' (filtered)' : ''}
      </p>
    </div>
  )
}
