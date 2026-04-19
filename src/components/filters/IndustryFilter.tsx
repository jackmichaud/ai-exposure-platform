import { getFilterOptions } from '../../api/dataApi'
import { useFilterContext } from '../../context/FilterContext'

const filterOptions = getFilterOptions()

export default function IndustryFilter() {
  const { state, dispatch } = useFilterContext()

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1">
        Industry
      </span>
      {filterOptions.industries.map((ind) => (
        <button
          key={ind.id}
          onClick={() =>
            dispatch({
              type: 'SET_INDUSTRY',
              payload: state.industry === ind.id ? null : ind.id,
            })
          }
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-150 ${
            state.industry === ind.id
              ? 'bg-teal-700 text-teal-100'
              : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
          }`}
        >
          {ind.name}
        </button>
      ))}
    </div>
  )
}
