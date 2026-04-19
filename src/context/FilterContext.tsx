import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type Dispatch,
  type ReactNode,
} from 'react'
import { useSearchParams, useLocation } from 'react-router-dom'
import type { FilterState, FilterAction } from '../types'

const INITIAL_STATE: FilterState = {
  industry: null,
  wageRange: [0, 400000],
  educationLevel: null,
  timeline: null,
  sortBy: 'exposure',
}

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case 'SET_INDUSTRY':
      return { ...state, industry: action.payload }
    case 'SET_WAGE_RANGE':
      return { ...state, wageRange: action.payload }
    case 'SET_EDUCATION':
      return { ...state, educationLevel: action.payload }
    case 'SET_TIMELINE':
      return { ...state, timeline: action.payload }
    case 'SET_SORT':
      return { ...state, sortBy: action.payload.sortBy }
    case 'RESET':
      return INITIAL_STATE
    default:
      return state
  }
}

interface FilterContextValue {
  state: FilterState
  dispatch: Dispatch<FilterAction>
}

const FilterContext = createContext<FilterContextValue | null>(null)

interface FilterProviderProps {
  children: ReactNode
}

export function FilterProvider({ children }: FilterProviderProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  // Hydrate initial state from URL params on first mount
  function getInitialState(): FilterState {
    const industry = searchParams.get('industry')
    const education = searchParams.get('education')
    const timeline = searchParams.get('timeline')
    const sortBy = searchParams.get('sortBy')
    const wageMin = searchParams.get('wageMin')
    const wageMax = searchParams.get('wageMax')

    const validTimelines = ['near-term', 'mid-term', 'long-term'] as const
    type Timeline = (typeof validTimelines)[number]

    return {
      industry: industry ?? null,
      wageRange: [
        wageMin ? parseInt(wageMin, 10) : 0,
        wageMax ? parseInt(wageMax, 10) : 400000,
      ],
      educationLevel: education ?? null,
      timeline: validTimelines.includes(timeline as Timeline)
        ? (timeline as Timeline)
        : null,
      sortBy:
        sortBy === 'wage' || sortBy === 'name'
          ? sortBy
          : 'exposure',
    }
  }

  const [state, dispatch] = useReducer(filterReducer, undefined, getInitialState)

  // Sync state back to URL only on the '/' route
  useEffect(() => {
    if (location.pathname !== '/') return

    const params = new URLSearchParams()
    if (state.industry) params.set('industry', state.industry)
    if (state.educationLevel) params.set('education', state.educationLevel)
    if (state.timeline) params.set('timeline', state.timeline)
    if (state.sortBy !== 'exposure') params.set('sortBy', state.sortBy)
    if (state.wageRange[0] !== 0) params.set('wageMin', String(state.wageRange[0]))
    if (state.wageRange[1] !== 400000) params.set('wageMax', String(state.wageRange[1]))

    setSearchParams(params, { replace: true })
  }, [state, location.pathname, setSearchParams])

  return (
    <FilterContext.Provider value={{ state, dispatch }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilterContext(): FilterContextValue {
  const ctx = useContext(FilterContext)
  if (!ctx) {
    throw new Error('useFilterContext must be used within a FilterProvider')
  }
  return ctx
}
