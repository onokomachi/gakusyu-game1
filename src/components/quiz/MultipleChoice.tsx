import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Question } from '@/types'
import { cn } from '@/lib/utils'

interface MultipleChoiceProps {
  question: Question
  onAnswer: (answer: string) => void
  disabled: boolean
}

export function MultipleChoice({ question, onAnswer, disabled }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const handleSelect = (choice: string) => {
    if (disabled || selected) return
    setSelected(choice)
    onAnswer(choice)
  }

  return (
    <div className="grid gap-3">
      {question.choices?.map((choice, i) => {
        const isSelected = selected === choice
        const isCorrect = choice === question.correctAnswer
        const showResult = selected !== null

        return (
          <motion.button
            key={choice}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            onClick={() => handleSelect(choice)}
            disabled={disabled || selected !== null}
            className={cn(
              'w-full rounded-xl border-2 px-4 py-3 text-left text-sm font-medium transition-all duration-200',
              !showResult && 'border-border bg-muted hover:border-primary hover:bg-primary/10 cursor-pointer',
              showResult && isCorrect && 'border-success bg-success/10 text-success',
              showResult && isSelected && !isCorrect && 'border-destructive bg-destructive/10 text-destructive',
              showResult && !isSelected && !isCorrect && 'border-border bg-muted opacity-50'
            )}
          >
            <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-secondary text-xs font-bold">
              {String.fromCharCode(65 + i)}
            </span>
            {choice}
          </motion.button>
        )
      })}
    </div>
  )
}
