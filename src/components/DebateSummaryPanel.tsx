import type { DebateSummary } from '../types'

interface Props {
  summary: DebateSummary | null
  isSynthesizing: boolean
}

function riskBadgeClasses(level: DebateSummary['riskAssessment']['level']): string {
  switch (level) {
    case 'low':
      return 'bg-emerald-950/50 border border-emerald-700 text-emerald-400'
    case 'moderate':
      return 'bg-amber-950/50 border border-amber-700 text-amber-400'
    case 'high':
      return 'bg-orange-950/50 border border-orange-700 text-orange-400'
    case 'critical':
      return 'bg-red-950/50 border border-red-700 text-red-400'
  }
}

export default function DebateSummaryPanel({ summary, synthesisText, isSynthesizing }: Props) {
  if (isSynthesizing) {
    return (
      <div className="bg-slate-900 border border-indigo-800 rounded-xl p-6 ring-1 ring-indigo-800 animate-pulse-border">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin shrink-0" />
          <h2 className="text-slate-200 font-semibold">Generating Synthesis…</h2>
        </div>
      </div>
    )
  }

  if (!summary) return null

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
      <h2 className="text-slate-100 font-bold text-lg">Debate Synthesis</h2>

      {/* 1. Key Takeaways */}
      <section className="space-y-2">
        <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">
          Key Takeaways
        </h3>
        <ul className="space-y-1.5">
          {summary.keyTakeaways.map((item, i) => (
            <li key={i} className="flex gap-2 text-slate-300 text-sm leading-relaxed">
              <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 2. Risk Assessment */}
      <section className="space-y-2">
        <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">
          Risk Assessment
        </h3>
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold capitalize shrink-0 ${riskBadgeClasses(summary.riskAssessment.level)}`}
          >
            {summary.riskAssessment.level}
          </span>
          <p className="text-slate-300 text-sm leading-relaxed">
            {summary.riskAssessment.explanation}
          </p>
        </div>
      </section>

      {/* 3. Recommendations */}
      <section className="space-y-2">
        <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">
          Recommendations for Workers
        </h3>
        <ol className="space-y-1.5">
          {summary.recommendationsForWorkers.map((item, i) => (
            <li key={i} className="flex gap-2 text-slate-300 text-sm leading-relaxed">
              <span className="text-indigo-400 font-medium shrink-0">{i + 1}.</span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* 4. Projected Changes */}
      <section className="space-y-2">
        <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">
          Projected Changes
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: 'Skills', value: summary.projectedChanges.skills },
            { label: 'Wages', value: summary.projectedChanges.wages },
            { label: 'Employment', value: summary.projectedChanges.employment },
          ].map(({ label, value }) => (
            <div key={label} className="bg-slate-800/60 rounded-lg p-3 space-y-1">
              <p className="text-slate-500 text-xs font-medium uppercase tracking-wide">{label}</p>
              <p className="text-slate-300 text-sm leading-relaxed">{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Areas of Agreement */}
      <section className="space-y-2">
        <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">
          Areas of Agreement
        </h3>
        <ul className="space-y-1.5">
          {summary.areasOfAgreement.map((item, i) => (
            <li key={i} className="flex gap-2 text-slate-300 text-sm leading-relaxed">
              <span className="text-emerald-500 mt-0.5 shrink-0">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* 6. Areas of Disagreement */}
      <section className="space-y-2">
        <h3 className="text-slate-300 font-semibold text-sm uppercase tracking-wide">
          Areas of Disagreement
        </h3>
        <ul className="space-y-1.5">
          {summary.areasOfDisagreement.map((item, i) => (
            <li key={i} className="flex gap-2 text-slate-300 text-sm leading-relaxed">
              <span className="text-amber-500 mt-0.5 shrink-0">↔</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
