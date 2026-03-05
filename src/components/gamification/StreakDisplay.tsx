import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'

interface StreakDisplayProps {
  days: number
}

const streakColors = [
  'text-orange-300',
  'text-orange-400',
  'text-orange-500',
  'text-red-500',
  'text-red-600',
]

export function StreakDisplay({ days }: StreakDisplayProps) {
  const colorIndex = Math.min(Math.floor(days / 7), streakColors.length - 1)
  const flames = Math.min(Math.ceil(days / 7), 5)

  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="flex flex-col items-center gap-2"
    >
      <div className="flex items-center gap-0.5">
        {Array.from({ length: flames }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <Flame
              className={`h-6 w-6 ${streakColors[Math.min(i, streakColors.length - 1)]} drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]`}
            />
          </motion.div>
        ))}
      </div>
      <div className="text-center">
        <p className={`text-2xl font-bold ${streakColors[colorIndex]}`}>{days}</p>
        <p className="text-xs text-muted-foreground">連続日数</p>
      </div>
    </motion.div>
  )
}
