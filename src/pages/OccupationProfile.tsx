import { useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getOccupation, getIndustries } from '../api/dataApi'
import { scoreToColor, ndToColor } from '../components/charts/utils/createColorScale'
import { getTextColor, formatWage } from '../components/charts/utils/formatScore'
import AutomationGauge from '../components/charts/AutomationGauge'
import SkillImpactBar from '../components/charts/SkillImpactBar'
import WageProjection from '../components/charts/WageProjection'
import OccupationComparison from '../components/OccupationComparison'
import TaskBreakdown from '../components/TaskBreakdown'

export default function OccupationProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const occupation = useMemo(() => (id ? getOccupation(id) : null), [id])
  const industries = useMemo(() => getIndustries(), [])
  const industryMap = useMemo(
    () => new Map(industries.map((i) => [i.id, i.name])),
    [industries]
  )

  if (!occupation) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-slate-300 text-lg font-medium">Occupation not found.</p>
        <Link
          to="/"
          className="text-teal-400 hover:text-teal-300 text-sm underline underline-offset-2"
        >
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  const score = occupation.exposureScore.overall
  const scoreColor = scoreToColor(score)
  const scoreTextColor = getTextColor(score)
  const industryName = industryMap.get(occupation.industryId) ?? occupation.industryId

  const timelineLabel: Record<string, string> = {
    'near-term': 'Near-term',
    'mid-term': 'Mid-term',
    'long-term': 'Long-term',
  }

  const confidenceColor: Record<string, string> = {
    low: 'text-amber-400',
    medium: 'text-teal-400',
    high: 'text-emerald-400',
  }

  return (
    <div className="space-y-8">
      {/* Back link */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="text-slate-400 hover:text-slate-200 text-sm transition-colors"
        >
          ← Back
        </button>
      </div>

      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold text-slate-100 leading-tight">{occupation.title}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs">
                {industryName}
              </span>
              {occupation.socCode && (
                <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded text-xs font-mono">
                  SOC {occupation.socCode}
                </span>
              )}
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs">
                {occupation.educationLevel.charAt(0).toUpperCase() + occupation.educationLevel.slice(1)}
              </span>
              <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-xs">
                {timelineLabel[occupation.exposureScore.timeline] ?? occupation.exposureScore.timeline}
              </span>
              <span
                className={`text-xs font-medium ${
                  confidenceColor[occupation.exposureScore.confidence] ?? 'text-slate-400'
                }`}
              >
                {occupation.exposureScore.confidence} confidence
              </span>
            </div>
            <p className="text-slate-400 text-sm mt-3 max-w-2xl">{occupation.description}</p>
            <p className="text-slate-300 font-semibold mt-3 text-lg">
              {formatWage(occupation.medianWage)}{' '}
              <span className="text-slate-500 text-sm font-normal">median annual wage</span>
            </p>
          </div>

          {/* Overall score badge */}
          <div
            className="shrink-0 w-20 h-20 rounded-2xl flex flex-col items-center justify-center shadow-lg"
            style={{ backgroundColor: scoreColor, color: scoreTextColor }}
          >
            <span className="text-3xl font-bold font-mono leading-none">
              {Math.round(score)}
            </span>
            <span className="text-xs font-medium mt-1 opacity-80">/ 100</span>
          </div>
        </div>

        {/* Sub-scores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          {[
            { label: 'Automation Risk', value: occupation.exposureScore.automationRisk, isND: false },
            { label: 'Augmentation', value: occupation.exposureScore.augmentationPotential, isND: false },
            { label: 'Net Displacement', value: occupation.exposureScore.netDisplacement, isND: true },
            { label: 'Complementarity', value: occupation.exposureScore.complementarityScore, isND: false },
          ].map(({ label, value, isND }) => {
            const c = isND ? ndToColor(value) : scoreToColor(value)
            const tc = getTextColor(value)
            return (
              <div key={label} className="bg-slate-800 rounded-lg px-3 py-2.5 flex items-center gap-3">
                <div
                  className="shrink-0 w-9 h-9 rounded flex items-center justify-center text-sm font-bold font-mono"
                  style={{ backgroundColor: c, color: tc }}
                >
                  {Math.round(value)}
                </div>
                <span className="text-xs text-slate-400">{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gauge */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
              Exposure Score
            </h2>
            <AutomationGauge score={score} label="Overall AI Exposure" />
          </div>

          {/* Wage projection */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
              Wage Projection
            </h2>
            <WageProjection
              currentWage={occupation.medianWage}
              wageEffect={occupation.exposureScore.wageEffect}
              timeline={timelineLabel[occupation.exposureScore.timeline] ?? occupation.exposureScore.timeline}
            />
          </div>

          {/* Skill impact */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
              Skill Impact
            </h2>
            <SkillImpactBar skills={occupation.skills} />
          </div>
        </div>

        {/* Right: similar occupations */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 sticky top-20">
            <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
              Similar Occupations
            </h2>
            <OccupationComparison occupation={occupation} />
          </div>
        </div>
      </div>

      {/* Task breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wide mb-4">
          Task Breakdown
        </h2>
        <TaskBreakdown tasks={occupation.tasks} />
      </div>

      {/* CTA */}
      <div className="flex justify-center pb-4">
        <Link
          to={`/debate?occupation=${occupation.id}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-colors shadow-lg"
        >
          Start a Debate about {occupation.title} →
        </Link>
      </div>
    </div>
  )
}
