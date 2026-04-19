import { useMemo } from 'react'
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

  if (!similar.length) {
    return <p className="text-slate-500 text-sm">No similar occupations found.</p>
  }

  return (
    <div className="space-y-2">
      {similar.map((occ) => {
        const score = occ.exposureScore.overall
        const bgColor = scoreToColor(score)
        const txtColor = getTextColor(score)
        return (
          <Link key={occ.id} to={`/occupation/${occ.id}`}>
            <div className="bg-slate-800 rounded-lg p-3 hover:bg-slate-700 transition-colors">
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
}
