import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { Check, X } from 'lucide-react'

export function AnswerEffect() {
  const { state, dispatch } = useGame()
  const { correctAnswerEffect } = state

  useEffect(() => {
    if (correctAnswerEffect) {
      const timer = setTimeout(() => dispatch({ type: 'CLEAR_EFFECT' }), 800)
      return () => clearTimeout(timer)
    }
  }, [correctAnswerEffect, dispatch])

  return (
    <AnimatePresence>
      {correctAnswerEffect && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center"
        >
          {correctAnswerEffect === 'correct' ? (
            <>
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1.5, rotate: 0 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', damping: 8, stiffness: 200 }}
                className="rounded-full bg-success/20 p-8"
              >
                <Check className="h-16 w-16 text-success drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]" />
              </motion.div>
              {/* Particle burst */}
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos((i * Math.PI * 2) / 8) * 120,
                    y: Math.sin((i * Math.PI * 2) / 8) * 120,
                    opacity: 0,
                    scale: 0,
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute h-3 w-3 rounded-full bg-success"
                />
              ))}
            </>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1.2, x: [0, -10, 10, -10, 10, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="rounded-full bg-destructive/20 p-8"
            >
              <X className="h-16 w-16 text-destructive drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]" />
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
