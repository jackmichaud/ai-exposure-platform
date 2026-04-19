import type { Skill } from '../../types'

interface Props {
  skills: Skill[]
}

const IMPACT_CONFIG = {
  gained: {
    label: 'Gained Skills',
    color: 'bg-emerald-500',
    textColor: 'text-emerald-400',
  },
  displaced: {
    label: 'Displaced Skills',
    color: 'bg-red-500',
    textColor: 'text-red-400',
  },
  transformed: {
    label: 'Transformed Skills',
    color: 'bg-amber-500',
    textColor: 'text-amber-400',
  },
} as const

export default function SkillImpactBar({ skills }: Props) {
  if (!skills.length) {
    return <p className="text-slate-500 text-sm">No skill data available.</p>
  }

  const groups = (['gained', 'displaced', 'transformed'] as const).map((impact) => ({
    impact,
    skills: skills
      .filter((s) => s.impact === impact)
      .sort((a, b) => b.relevance - a.relevance),
  })).filter((g) => g.skills.length > 0)

  // Show top 5 total across all groups
  let remaining = 5
  const slicedGroups = groups.map((g) => {
    const shown = g.skills.slice(0, Math.max(0, remaining))
    remaining -= shown.length
    return { ...g, skills: shown }
  }).filter((g) => g.skills.length > 0)

  return (
    <div className="space-y-4">
      {slicedGroups.map(({ impact, skills: groupSkills }) => {
        const config = IMPACT_CONFIG[impact]
        return (
          <div key={impact}>
            <p className={`text-xs font-semibold uppercase tracking-wide mb-2 ${config.textColor}`}>
              {config.label}
            </p>
            {groupSkills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2 mb-1.5">
                <span className="text-xs text-slate-400 w-32 truncate shrink-0">{skill.name}</span>
                <div className="flex-1 bg-slate-800 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${config.color}`}
                    style={{ width: `${skill.relevance}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500 w-6 text-right">{skill.relevance}</span>
              </div>
            ))}
          </div>
        )
      })}
    </div>
  )
}
