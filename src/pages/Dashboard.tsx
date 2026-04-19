import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getOccupations, getIndustries } from '../api/dataApi'
import { useFilterContext } from '../context/FilterContext'
import HeatmapChart from '../components/charts/HeatmapChart'
import FilterBar from '../components/filters/FilterBar'

export default function Dashboard() {
  const navigate = useNavigate()
  const { state } = useFilterContext()

  const allOccupations = useMemo(() => getOccupations(), [])
  const industries = useMemo(() => getIndustries(), [])

  const filtered = useMemo(() => {
    return allOccupations
      .filter((occ) => {
        if (state.industry && occ.industryId !== state.industry) return false
        if (occ.medianWage < state.wageRange[0] || occ.medianWage > state.wageRange[1]) return false
        if (state.educationLevel && occ.educationLevel !== state.educationLevel) return false
        if (state.timeline && occ.exposureScore.timeline !== state.timeline) return false
        return true
      })
      .sort((a, b) => {
        if (state.sortBy === 'wage') return b.medianWage - a.medianWage
        if (state.sortBy === 'name') return a.title.localeCompare(b.title)
        return b.exposureScore.overall - a.exposureScore.overall
      })
  }, [allOccupations, state])

  const visibleIndustries = useMemo(() => {
    if (!state.industry) return industries
    return industries.filter((ind) => ind.id === state.industry)
  }, [industries, state.industry])

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
      <FilterBar resultCount={filtered.length} />

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
