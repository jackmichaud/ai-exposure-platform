import { useState } from 'react'
import { useFilterContext } from '../../context/FilterContext'

const MIN = 0
const MAX = 400000
const STEP = 5000

function formatLabel(value: number): string {
  return `$${Math.round(value / 1000)}k`
}

export default function WageRangeSlider() {
  const { state, dispatch } = useFilterContext()
  const [localRange, setLocalRange] = useState<[number, number]>(state.wageRange)

  function commitRange(range: [number, number]) {
    dispatch({ type: 'SET_WAGE_RANGE', payload: range })
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide shrink-0">
        Wage
      </span>
      <div className="flex flex-col gap-1 min-w-[140px]">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>{formatLabel(localRange[0])}</span>
          <span>&ndash;</span>
          <span>{formatLabel(localRange[1])}</span>
        </div>
        <div className="relative flex flex-col gap-1">
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={localRange[0]}
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), localRange[1] - STEP)
              setLocalRange([val, localRange[1]])
            }}
            onMouseUp={() => commitRange(localRange)}
            onTouchEnd={() => commitRange(localRange)}
            className="w-full h-1 rounded appearance-none bg-slate-700 accent-teal-500 cursor-pointer"
          />
          <input
            type="range"
            min={MIN}
            max={MAX}
            step={STEP}
            value={localRange[1]}
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), localRange[0] + STEP)
              setLocalRange([localRange[0], val])
            }}
            onMouseUp={() => commitRange(localRange)}
            onTouchEnd={() => commitRange(localRange)}
            className="w-full h-1 rounded appearance-none bg-slate-700 accent-teal-500 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}
