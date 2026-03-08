export type QuestionType = 'multiple-choice' | 'text-input' | 'sorting'

export type Subject = 'math' | 'english' | 'science' | 'japanese' | 'social'

export type Difficulty = 'easy' | 'normal' | 'hard'

export interface Question {
  id: string
  type: QuestionType
  subject: Subject
  difficulty: Difficulty
  question: string
  choices?: string[]
  correctAnswer?: string
  sortItems?: string[]
  correctOrder?: string[]
  hint?: string
  xpReward: number
  coinReward: number
}

export interface AnswerResult {
  questionId: string
  correct: boolean
  timeMs: number
  xpEarned: number
  coinsEarned: number
  bonusDrop?: TreasureDrop | null
}

export interface TreasureDrop {
  type: 'coins' | 'xp' | 'avatar-item' | 'magic-spell'
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  name: string
  amount?: number
  itemId?: string
}

export interface UserProfile {
  uid: string
  displayName: string
  totalXp: number
  coins: number
  streakDays: number
  lastLoginDate: string
  avatarConfig: AvatarConfig
  unlockedSkills: string[]
  unlockedItems: string[]
  studyHistory: StudySession[]
}

export interface AvatarConfig {
  body: string
  face: string
  hat: string | null
  accessory: string | null
  effect: string | null
}

export interface StudySession {
  date: string
  subject: Subject
  questionsAnswered: number
  correctAnswers: number
  xpEarned: number
  coinsEarned: number
  timeSpentMs: number
}

export interface SkillNode {
  id: string
  name: string
  description: string
  icon: string
  cost: number
  requires: string[]
  effect: SkillEffect
  position: { x: number; y: number }
}

export interface SkillEffect {
  type: 'xp-boost' | 'coin-boost' | 'hint-unlock' | 'visual-effect' | 'avatar-item'
  value: number | string
}

export interface WisdomTree {
  health: number
  stage: 'seed' | 'sprout' | 'sapling' | 'tree' | 'great-tree'
  lastWatered: string
}
