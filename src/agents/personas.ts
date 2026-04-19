import type { PersonaId } from '../types'

export interface PersonaMeta {
  id: PersonaId
  name: string
  shortName: string
  icon: string
  borderColor: string
  bgColor: string
  textColor: string
}

export const PERSONAS: PersonaMeta[] = [
  {
    id: 'optimist',
    name: 'The Optimist',
    shortName: 'Optimist',
    icon: '🌅',
    borderColor: 'border-emerald-500',
    bgColor: 'bg-emerald-950/30',
    textColor: 'text-emerald-400',
  },
  {
    id: 'realist',
    name: 'The Realist',
    shortName: 'Realist',
    icon: '⚖️',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-950/30',
    textColor: 'text-blue-400',
  },
  {
    id: 'skeptic',
    name: 'The Skeptic',
    shortName: 'Skeptic',
    icon: '⚠️',
    borderColor: 'border-amber-500',
    bgColor: 'bg-amber-950/30',
    textColor: 'text-amber-400',
  },
  {
    id: 'worker-advocate',
    name: 'The Worker Advocate',
    shortName: 'Advocate',
    icon: '🪖',
    borderColor: 'border-indigo-500',
    bgColor: 'bg-indigo-950/30',
    textColor: 'text-indigo-400',
  },
]

export const PERSONA_ORDER: PersonaId[] = [
  'optimist',
  'realist',
  'skeptic',
  'worker-advocate',
]
