import { formatWage } from './utils/formatScore'

interface Props {
  currentWage: number
  wageEffect: number
  timeline: string
}

export default function WageProjection({ currentWage, wageEffect, timeline }: Props) {
  const projectedWage = currentWage * (1 + wageEffect / 100)
  const isPositive = wageEffect >= 0
  const absEffect = Math.abs(wageEffect)

  return (
    <div className="flex items-center gap-4">
      {/* Current */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-slate-500 uppercase tracking-wide mb-1">Current</span>
        <span className="text-lg font-semibold text-slate-200 font-mono">
          {formatWage(currentWage)}
        </span>
      </div>

      {/* Arrow + pct */}
      <div className="flex flex-col items-center">
        <span
          className={`text-2xl font-bold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}
        >
          {isPositive ? '↑' : '↓'}
        </span>
        <span
          className={`text-xs font-semibold ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}
        >
          {isPositive ? '+' : '-'}{absEffect.toFixed(1)}%
        </span>
        <span className="text-xs text-slate-500 mt-0.5">{timeline}</span>
      </div>

      {/* Projected */}
      <div className="flex flex-col items-center">
        <span className="text-xs text-slate-500 uppercase tracking-wide mb-1">Projected</span>
        <span
          className={`text-lg font-semibold font-mono ${
            isPositive ? 'text-emerald-300' : 'text-red-300'
          }`}
        >
          {formatWage(projectedWage)}
        </span>
      </div>
    </div>
  )
}
