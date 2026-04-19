import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Occupation } from '../types'
import { getSimilarOccupations, getIndustries } from '../api/dataApi'
import { scoreToColor } from './charts/utils/createColorScale'
import { getTextColor, formatWage } from './charts/utils/formatScore'

interface Props {
  occupation: Occupation
}

export default function OccupationComparison({ occupation }: Props) {
  const similar = useMemo(() => getSimilarOccupations(occupation.id, 3), [occupation.id])
  const industries = useMemo(() => getIndustries(), [])
  const industryMap = useMemo(
    () => new Map(industries.map((i) => [i.id, i.name])),
    [industries]
  )

  // Mobile accordion — closed by default on mobile, open on desktop (handled via CSS)
  const [mobileOpen, setMobileOpen] = useState(false)

  if (!similar.length) {
    return <p className="text-slate-500 text-sm">No similar occupations found.</p>
  }

  const cards = (
    <div className="space-y-2">
      {similar.map((occ) => {
        const score = occ.exposureScore.overall
        const bgColor = scoreToColor(score)
        const txtColor = getTextColor(score)
        return (
          <Link key={occ.id} to={`/occupation/${occ.id}`}>
            <div className="bg-slate-800 rounded-lg p-3 hover:bg-slate-700 transition-all duration-150 hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-100 truncate">{occ.title}</p>
                  <span className="inline-block mt-1 text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded">
                    {industryMap.get(occ.industryId) ?? occ.industryId}
                  </span>
                  <p className="text-xs text-slate-500 mt-1">{formatWage(occ.medianWage)}</p>
                </div>
                <div
                  className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs"
                  style={{ backgroundColor: bgColor, color: txtColor }}
                >
                  {Math.round(score)}
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )

  return (
    <div>
      {/* Mobile accordion toggle — hidden on lg+ */}
      <button
        className="lg:hidden flex items-center justify-between w-full text-sm font-semibold text-slate-300 mb-2 transition-colors duration-150 hover:text-slate-100"
        onClick={() => setMobileOpen((prev) => !prev)}
        aria-expanded={mobileOpen}
      >
        <span>Similar Occupations</span>
        <span className="text-slate-500 transition-transform duration-300" style={{ transform: mobileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▼
        </span>
      </button>

      {/* Mobile: collapsible with max-height transition */}
      <div
        className={`lg:hidden overflow-hidden transition-[max-height] duration-300 ease-in-out ${
          mobileOpen ? 'max-h-[600px]' : 'max-h-0'
        }`}
      >
        {cards}
      </div>

      {/* Desktop: always visible */}
      <div className="hidden lg:block">
        {cards}
      </div>
    </div>
  )
}
