import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react'
import type { DebateState, DebateAction } from '../types'

const INITIAL_STATE: DebateState = {
  topic: null,
  status: 'idle',
  rounds: [],
  currentSpeaker: null,
  summary: null,
  errorMessage: null,
}

function debateReducer(state: DebateState, action: DebateAction): DebateState {
  switch (action.type) {
    case 'START_DEBATE':
      return {
        ...INITIAL_STATE,
        topic: action.payload.occupationId,
        status: 'debating',
      }

    case 'SET_SPEAKER':
      return { ...state, currentSpeaker: action.payload }

    case 'APPEND_TOKEN': {
      const { personaId, token, round } = action.payload
      const existingIdx = state.rounds.findIndex((r) => r.round === round)
      if (existingIdx === -1) {
        return {
          ...state,
          rounds: [
            ...state.rounds,
            { round, responses: { [personaId]: token } },
          ],
        }
      }
      const updatedRound = {
        ...state.rounds[existingIdx],
        responses: {
          ...state.rounds[existingIdx].responses,
          [personaId]:
            (state.rounds[existingIdx].responses[personaId] ?? '') + token,
        },
      }
      const newRounds = [...state.rounds]
      newRounds[existingIdx] = updatedRound
      return { ...state, rounds: newRounds }
    }

    case 'COMPLETE_TURN':
      return state

    case 'SET_SUMMARY':
      return {
        ...state,
        summary: action.payload,
        status: 'complete',
        currentSpeaker: null,
      }

    case 'SET_STATUS':
      return { ...state, status: action.payload }

    case 'SET_ERROR':
      return { ...state, status: 'error', errorMessage: action.payload }

    default:
      return state
  }
}

interface DebateContextValue {
  state: DebateState
  dispatch: Dispatch<DebateAction>
}

const DebateContext = createContext<DebateContextValue | null>(null)

interface DebateProviderProps {
  children: ReactNode
}

export function DebateProvider({ children }: DebateProviderProps) {
  const [state, dispatch] = useReducer(debateReducer, INITIAL_STATE)

  return (
    <DebateContext.Provider value={{ state, dispatch }}>
      {children}
    </DebateContext.Provider>
  )
}

export function useDebateContext(): DebateContextValue {
  const ctx = useContext(DebateContext)
  if (!ctx) {
    throw new Error('useDebateContext must be used within a DebateProvider')
  }
  return ctx
}
