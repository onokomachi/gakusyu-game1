import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { Button } from '@/components/ui/button'

const rarityColors = {
  common: 'from-gray-400 to-gray-600',
  rare: 'from-blue-400 to-blue-600',
  epic: 'from-purple-400 to-purple-600',
  legendary: 'from-yellow-400 to-orange-500',
}

const rarityLabels = {
  common: 'コモン',
  rare: 'レア',
  epic: 'エピック',
  legendary: 'レジェンド',
}

const rarityGlows = {
  common: '',
  rare: 'drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]',
  epic: 'drop-shadow-[0_0_15px_rgba(168,85,247,0.5)]',
  legendary: 'drop-shadow-[0_0_20px_rgba(245,158,11,0.7)]',
}

export function TreasureChest() {
  const { state, dispatch } = useGame()
  const { showTreasure, lastDrop } = state
  const [opened, setOpened] = useState(false)

  useEffect(() => {
    if (showTreasure) setOpened(false)
  }, [showTreasure])

  if (!showTreasure || !lastDrop) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={() => !opened && setOpened(true)}
      >
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200 }}
          className="flex flex-col items-center gap-4"
          onClick={(e) => e.stopPropagation()}
        >
          {!opened ? (
            <motion.div
              whileHover={{ scale: 1.1, rotate: [0, -3, 3, -3, 0] }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer"
              onClick={() => setOpened(true)}
            >
              <div className="relative">
                <div className="text-8xl select-none">
                  {''}
                </div>
                <div className={`absolute inset-0 text-8xl select-none ${rarityGlows[lastDrop.rarity]}`}>
                  {''}
                </div>
              </div>
              <p className="mt-4 text-center text-lg font-bold text-foreground animate-pulse">
                タップして開ける!
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', damping: 10, stiffness: 150 }}
              className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-card p-8"
            >
              <div
                className={`bg-gradient-to-br ${rarityColors[lastDrop.rarity]} rounded-full p-4 ${
                  lastDrop.rarity === 'legendary' ? 'animate-rainbow' : ''
                }`}
              >
                <span className="text-5xl select-none">
                  {lastDrop.type === 'coins' ? '' : lastDrop.type === 'xp' ? '' : ''}
                </span>
              </div>

              <div className="text-center">
                <p
                  className={`text-sm font-bold bg-gradient-to-r ${rarityColors[lastDrop.rarity]} bg-clip-text text-transparent`}
                >
                  {rarityLabels[lastDrop.rarity]}
                </p>
                <p className="mt-1 text-xl font-bold text-foreground">{lastDrop.name}</p>
                {lastDrop.amount && (
                  <p className="mt-1 text-2xl font-bold text-accent">
                    +{lastDrop.amount} {lastDrop.type === 'coins' ? 'コイン' : 'XP'}
                  </p>
                )}
              </div>

              <Button variant="accent" size="lg" onClick={() => dispatch({ type: 'CLEAR_TREASURE' })}>
                受け取る
              </Button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
