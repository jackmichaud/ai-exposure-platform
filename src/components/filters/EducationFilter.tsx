import { getFilterOptions } from '../../api/dataApi'
import { useFilterContext } from '../../context/FilterContext'

const filterOptions = getFilterOptions()

export default function EducationFilter() {
  const { state, dispatch } = useFilterContext()

  return (
    <div className="flex items-center gap-1">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1">
        Education
      </span>
      <select
        value={state.educationLevel ?? ''}
        onChange={(e) =>
          dispatch({
            type: 'SET_EDUCATION',
            payload: e.target.value || null,
          })
        }
        className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
      >
        <option value="">All levels</option>
        {filterOptions.educationLevels.map((lvl) => (
          <option key={lvl} value={lvl}>
            {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
          </option>
        ))}
      </select>
    </div>
  )
}
