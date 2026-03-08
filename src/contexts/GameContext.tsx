import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react'
import type { UserProfile, AnswerResult, TreasureDrop, Subject, Difficulty } from '@/types'
import { sampleQuestions } from '@/data/questions'
import { randomInt } from '@/lib/utils'

interface GameState {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  currentStreak: number
  sessionXp: number
  sessionCoins: number
  sessionCorrect: number
  sessionTotal: number
  lastDrop: TreasureDrop | null
  showTreasure: boolean
  correctAnswerEffect: string | null
  selectedSubject: Subject | null
  currentDifficulty: Difficulty
  consecutiveCorrect: number
  consecutiveWrong: number
}

type GameAction =
  | { type: 'SET_USER'; payload: UserProfile }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'ANSWER_RESULT'; payload: AnswerResult }
  | { type: 'CLEAR_EFFECT' }
  | { type: 'CLEAR_TREASURE' }
  | { type: 'SELECT_SUBJECT'; payload: Subject | null }
  | { type: 'UNLOCK_SKILL'; payload: string }
  | { type: 'UPDATE_COINS'; payload: number }
  | { type: 'RESET_SESSION' }
  | { type: 'UPDATE_STREAK' }
  | { type: 'SET_AVATAR'; payload: Partial<UserProfile['avatarConfig']> }

const TREASURE_DROP_CHANCE = 0.15

function rollTreasureDrop(): TreasureDrop | null {
  if (Math.random() > TREASURE_DROP_CHANCE) return null

  const roll = Math.random()
  if (roll < 0.5) {
    return { type: 'coins', rarity: 'common', name: 'コインの小箱', amount: randomInt(10, 25) }
  } else if (roll < 0.8) {
    return { type: 'xp', rarity: 'rare', name: 'XPの宝石', amount: randomInt(20, 50) }
  } else if (roll < 0.95) {
    return { type: 'coins', rarity: 'epic', name: '黄金の宝箱', amount: randomInt(50, 100) }
  } else {
    return { type: 'avatar-item', rarity: 'legendary', name: '伝説の冠', itemId: 'legendary-crown' }
  }
}

function adjustDifficulty(state: GameState): Difficulty {
  if (state.consecutiveCorrect >= 5) return 'hard'
  if (state.consecutiveCorrect >= 3) return 'normal'
  if (state.consecutiveWrong >= 3) return 'easy'
  if (state.consecutiveWrong >= 2) {
    return state.currentDifficulty === 'hard' ? 'normal' : 'easy'
  }
  return state.currentDifficulty
}

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload, isAuthenticated: true, isLoading: false }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'ANSWER_RESULT': {
      const { correct, xpEarned, coinsEarned, bonusDrop } = action.payload
      const newConsecutiveCorrect = correct ? state.consecutiveCorrect + 1 : 0
      const newConsecutiveWrong = correct ? 0 : state.consecutiveWrong + 1
      const newState = {
        ...state,
        sessionXp: state.sessionXp + xpEarned,
        sessionCoins: state.sessionCoins + coinsEarned,
        sessionCorrect: state.sessionCorrect + (correct ? 1 : 0),
        sessionTotal: state.sessionTotal + 1,
        lastDrop: bonusDrop ?? null,
        showTreasure: bonusDrop != null,
        correctAnswerEffect: correct ? 'correct' : 'wrong',
        consecutiveCorrect: newConsecutiveCorrect,
        consecutiveWrong: newConsecutiveWrong,
        user: state.user
          ? {
              ...state.user,
              totalXp: state.user.totalXp + xpEarned,
              coins: state.user.coins + coinsEarned + (bonusDrop?.amount ?? 0),
            }
          : null,
      }
      newState.currentDifficulty = adjustDifficulty(newState)
      return newState
    }
    case 'CLEAR_EFFECT':
      return { ...state, correctAnswerEffect: null }
    case 'CLEAR_TREASURE':
      return { ...state, showTreasure: false, lastDrop: null }
    case 'SELECT_SUBJECT':
      return { ...state, selectedSubject: action.payload }
    case 'UNLOCK_SKILL':
      if (!state.user) return state
      return {
        ...state,
        user: {
          ...state.user,
          unlockedSkills: [...state.user.unlockedSkills, action.payload],
        },
      }
    case 'UPDATE_COINS':
      if (!state.user) return state
      return {
        ...state,
        user: { ...state.user, coins: state.user.coins + action.payload },
      }
    case 'RESET_SESSION':
      return {
        ...state,
        sessionXp: 0,
        sessionCoins: 0,
        sessionCorrect: 0,
        sessionTotal: 0,
        consecutiveCorrect: 0,
        consecutiveWrong: 0,
        currentDifficulty: 'easy',
      }
    case 'UPDATE_STREAK':
      if (!state.user) return state
      {
        const today = new Date().toISOString().split('T')[0]
        const lastLogin = state.user.lastLoginDate
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
        let newStreak = state.user.streakDays
        if (lastLogin === yesterday) {
          newStreak += 1
        } else if (lastLogin !== today) {
          newStreak = 1
        }
        return {
          ...state,
          currentStreak: newStreak,
          user: { ...state.user, streakDays: newStreak, lastLoginDate: today },
        }
      }
    case 'SET_AVATAR':
      if (!state.user) return state
      return {
        ...state,
        user: {
          ...state.user,
          avatarConfig: { ...state.user.avatarConfig, ...action.payload },
        },
      }
    default:
      return state
  }
}

const initialState: GameState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  currentStreak: 0,
  sessionXp: 0,
  sessionCoins: 0,
  sessionCorrect: 0,
  sessionTotal: 0,
  lastDrop: null,
  showTreasure: false,
  correctAnswerEffect: null,
  selectedSubject: null,
  currentDifficulty: 'easy',
  consecutiveCorrect: 0,
  consecutiveWrong: 0,
}

interface GameContextType {
  state: GameState
  dispatch: React.Dispatch<GameAction>
  getQuestions: (subject?: Subject, count?: number) => typeof sampleQuestions
  processAnswer: (questionId: string, answer: string, timeMs: number) => AnswerResult
}

const GameContext = createContext<GameContextType | null>(null)

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState)

  useEffect(() => {
    // Initialize with demo user for now
    const demoUser: UserProfile = {
      uid: 'demo-user',
      displayName: '冒険者',
      totalXp: 250,
      coins: 100,
      streakDays: 3,
      lastLoginDate: new Date(Date.now() - 86400000).toISOString().split('T')[0],
      avatarConfig: { body: 'default', face: 'smile', hat: null, accessory: null, effect: null },
      unlockedSkills: [],
      unlockedItems: ['default-body', 'smile-face'],
      studyHistory: [],
    }
    dispatch({ type: 'SET_USER', payload: demoUser })
    dispatch({ type: 'UPDATE_STREAK' })
  }, [])

  function getQuestions(subject?: Subject, count = 10) {
    let filtered = sampleQuestions
    if (subject) {
      filtered = filtered.filter((q) => q.subject === subject)
    }
    filtered = filtered.filter((q) => q.difficulty === state.currentDifficulty || filtered.length < 5)

    // Shuffle and limit
    const shuffled = [...filtered].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  function processAnswer(questionId: string, answer: string, timeMs: number): AnswerResult {
    const question = sampleQuestions.find((q) => q.id === questionId)
    if (!question) {
      return { questionId, correct: false, timeMs, xpEarned: 0, coinsEarned: 0 }
    }

    let correct = false
    if (question.type === 'sorting') {
      correct = answer === question.correctOrder?.join(',')
    } else {
      correct = answer.trim().toLowerCase() === (question.correctAnswer ?? '').trim().toLowerCase()
    }

    const timeBonus = timeMs < 5000 ? 1.5 : timeMs < 10000 ? 1.2 : 1.0
    const xpEarned = correct ? Math.floor(question.xpReward * timeBonus) : 0
    const coinsEarned = correct ? Math.floor(question.coinReward * timeBonus) : 0
    const bonusDrop = correct ? rollTreasureDrop() : undefined

    const result: AnswerResult = { questionId, correct, timeMs, xpEarned, coinsEarned, bonusDrop }
    dispatch({ type: 'ANSWER_RESULT', payload: result })

    return result
  }

  return (
    <GameContext.Provider value={{ state, dispatch, getQuestions, processAnswer }}>
      {children}
    </GameContext.Provider>
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (!context) throw new Error('useGame must be used within a GameProvider')
  return context
}
