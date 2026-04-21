import { useState, useMemo } from 'react'
import type { Task } from '../types'
import { scoreToColor } from './charts/utils/createColorScale'
import { getTextColor } from './charts/utils/formatScore'

interface Props {
  tasks: Task[]
}

type SortKey = 'name' | 'automationRisk' | 'augmentationPotential' | 'timeWeight'
type SortDir = 'asc' | 'desc'

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  return (
    <span className={`ml-1 text-xs ${active ? 'text-teal-400' : 'text-slate-600'}`}>
      {active ? (dir === 'asc' ? '▲' : '▼') : '⇅'}
    </span>
  )
}

function categoryBadge(cat: Task['category']) {
  const map = {
    cognitive: 'bg-blue-900/50 text-blue-300',
    physical: 'bg-orange-900/50 text-orange-300',
    interpersonal: 'bg-purple-900/50 text-purple-300',
  } as const
  return map[cat]
}

export default function TaskBreakdown({ tasks }: Props) {
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: 'automationRisk',
    dir: 'desc',
  })

  const sorted = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const dir = sort.dir === 'asc' ? 1 : -1
      if (sort.key === 'name') return dir * a.name.localeCompare(b.name)
      if (sort.key === 'automationRisk') return dir * (a.automationRisk - b.automationRisk)
      if (sort.key === 'augmentationPotential')
        return dir * (a.augmentationPotential - b.augmentationPotential)
      return dir * (a.timeWeight - b.timeWeight)
    })
  }, [tasks, sort])

  function handleSort(key: SortKey) {
    setSort((prev) =>
      prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' }
    )
  }

  function thClass(key: SortKey) {
    return `px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide cursor-pointer select-none whitespace-nowrap ${
      sort.key === key ? 'text-teal-400' : 'text-slate-400 hover:text-slate-200'
    }`
  }

  return (
    <div>
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              <th className={thClass('name')} onClick={() => handleSort('name')}>
                Task Name <SortIcon active={sort.key === 'name'} dir={sort.dir} />
              </th>
              <th className="px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                Category
              </th>
              <th className={thClass('automationRisk')} onClick={() => handleSort('automationRisk')}>
                Auto Risk <SortIcon active={sort.key === 'automationRisk'} dir={sort.dir} />
              </th>
              <th
                className={thClass('augmentationPotential')}
                onClick={() => handleSort('augmentationPotential')}
              >
                Aug Potential{' '}
                <SortIcon active={sort.key === 'augmentationPotential'} dir={sort.dir} />
              </th>
              <th className={thClass('timeWeight')} onClick={() => handleSort('timeWeight')}>
                Time % <SortIcon active={sort.key === 'timeWeight'} dir={sort.dir} />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((task) => {
              const riskColor = scoreToColor(task.automationRisk)
              return (
                <tr
                  key={task.id}
                  className="border-b border-slate-800 hover:bg-slate-800/40 transition-colors"
                  style={{ backgroundColor: `${riskColor}14` }}
                >
                  <td className="px-3 py-2.5 text-slate-200 font-medium max-w-xs">
                    <p className="truncate">{task.name}</p>
                    <p className="text-xs text-slate-500 truncate">{task.description}</p>
                  </td>
                  <td className="px-3 py-2.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${categoryBadge(task.category)}`}
                    >
                      {task.category}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center text-xs font-mono font-bold shrink-0"
                        style={{
                          backgroundColor: riskColor,
                          color: getTextColor(task.automationRisk),
                        }}
                      >
                        {Math.round(task.automationRisk)}
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-700 rounded-full h-1.5 w-16">
                        <div
                          className="h-1.5 rounded-full bg-teal-500"
                          style={{ width: `${task.augmentationPotential}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-400 font-mono w-6 text-right">
                        {Math.round(task.augmentationPotential)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-400 font-mono">
                    {Math.round(task.timeWeight * 100)}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden space-y-2">
        {sorted.map((task) => {
          const riskColor = scoreToColor(task.automationRisk)
          return (
            <div
              key={task.id}
              className="bg-slate-800 rounded-lg p-3 transition-all duration-150 hover:shadow-md"
              style={{ borderLeft: `3px solid ${riskColor}` }}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-100 truncate">{task.name}</p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${categoryBadge(task.category)}`}
                  >
                    {task.category}
                  </span>
                </div>
                <div
                  className="shrink-0 w-8 h-8 rounded flex items-center justify-center text-xs font-mono font-bold"
                  style={{ backgroundColor: riskColor, color: getTextColor(task.automationRisk) }}
                >
                  {Math.round(task.automationRisk)}
                </div>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div>
                  Aug Potential:{' '}
                  <span className="text-teal-400 font-mono">
                    {Math.round(task.augmentationPotential)}
                  </span>
                </div>
                <div>
                  Time:{' '}
                  <span className="text-slate-300 font-mono">{Math.round(task.timeWeight * 100)}%</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
