import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toString()
}

export function getStreakEmoji(days: number): string {
  if (days >= 30) return 'fire-max'
  if (days >= 14) return 'fire-high'
  if (days >= 7) return 'fire-mid'
  if (days >= 3) return 'fire-low'
  return 'fire-start'
}

export function calculateLevel(xp: number): { level: number; currentXp: number; requiredXp: number } {
  let level = 1
  let totalXpNeeded = 100
  let xpRemaining = xp

  while (xpRemaining >= totalXpNeeded) {
    xpRemaining -= totalXpNeeded
    level++
    totalXpNeeded = Math.floor(100 * Math.pow(1.5, level - 1))
  }

  return { level, currentXp: xpRemaining, requiredXp: totalXpNeeded }
}
