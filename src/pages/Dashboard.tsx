import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOccupations, getIndustries, getFilterOptions } from '../api/dataApi'
import type { EducationLevel } from '../types'
import HeatmapChart from '../components/charts/HeatmapChart'

const TIMELINE_OPTIONS = [
  { value: 'near-term' as const, label: 'Near-term' },
  { value: 'mid-term' as const, label: 'Mid-term' },
  { value: 'long-term' as const, label: 'Long-term' },
]

export default function Dashboard() {
  const navigate = useNavigate()

  const allOccupations = useMemo(() => getOccupations(), [])
  const industries = useMemo(() => getIndustries(), [])
  const filterOptions = useMemo(() => getFilterOptions(), [])

  const [industryFilter, setIndustryFilter] = useState<string[]>([])
  const [wageRange, setWageRange] = useState<[number, number]>([
    filterOptions.wageRange.min,
    filterOptions.wageRange.max,
  ])
  const [educationFilter, setEducationFilter] = useState<string>('')
  const [timelineFilter, setTimelineFilter] = useState<'near-term' | 'mid-term' | 'long-term' | ''>('')

  const isFiltered =
    industryFilter.length > 0 ||
    educationFilter !== '' ||
    timelineFilter !== '' ||
    wageRange[0] !== filterOptions.wageRange.min ||
    wageRange[1] !== filterOptions.wageRange.max

  const filtered = useMemo(() => {
    return allOccupations.filter((occ) => {
      if (industryFilter.length > 0 && !industryFilter.includes(occ.industryId)) return false
      if (occ.medianWage < wageRange[0] || occ.medianWage > wageRange[1]) return false
      if (educationFilter && occ.educationLevel !== (educationFilter as EducationLevel)) return false
      if (timelineFilter && occ.exposureScore.timeline !== timelineFilter) return false
      return true
    })
  }, [allOccupations, industryFilter, wageRange, educationFilter, timelineFilter])

  const visibleIndustries = useMemo(() => {
    if (industryFilter.length === 0) return industries
    return industries.filter((ind) => industryFilter.includes(ind.id))
  }, [industries, industryFilter])

  function toggleIndustry(id: string) {
    setIndustryFilter((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  function clearFilters() {
    setIndustryFilter([])
    setWageRange([filterOptions.wageRange.min, filterOptions.wageRange.max])
    setEducationFilter('')
    setTimelineFilter('')
  }

  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-100">AI Exposure Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">
          Explore how occupations across industries are exposed to AI disruption.
        </p>
      </div>

      {/* Filter bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 mb-6 space-y-3">
        {/* Industry filters */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1">
            Industry
          </span>
          {filterOptions.industries.map((ind) => (
            <button
              key={ind.id}
              onClick={() => toggleIndustry(ind.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                industryFilter.includes(ind.id)
                  ? 'bg-teal-700 text-teal-100'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
              }`}
            >
              {ind.name}
            </button>
          ))}
        </div>

        {/* Second row: timeline + education + clear */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Timeline toggle */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1">
              Timeline
            </span>
            {TIMELINE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() =>
                  setTimelineFilter((prev) => (prev === opt.value ? '' : opt.value))
                }
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  timelineFilter === opt.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Education filter */}
          <div className="flex items-center gap-1">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide mr-1">
              Education
            </span>
            <select
              value={educationFilter}
              onChange={(e) => setEducationFilter(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-teal-500"
            >
              <option value="">All</option>
              {filterOptions.educationLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Clear filters */}
          {isFiltered && (
            <button
              onClick={clearFilters}
              className="ml-auto px-3 py-1 rounded-md text-xs font-medium bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Results summary */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-slate-500">
          {filtered.length} occupation{filtered.length !== 1 ? 's' : ''}
          {isFiltered ? ' (filtered)' : ''}
        </p>
      </div>

      {/* Heatmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <HeatmapChart
          data={filtered}
          industries={visibleIndustries}
          onCellClick={(id) => navigate(`/occupation/${id}`)}
        />
      </div>
    </div>
  )
}
