import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { Question } from '@/types'
import { Button } from '@/components/ui/button'
import { cn, shuffleArray } from '@/lib/utils'
import { Check, RotateCcw } from 'lucide-react'

interface SortingQuestionProps {
  question: Question
  onAnswer: (answer: string) => void
  disabled: boolean
}

export function SortingQuestion({ question, onAnswer, disabled }: SortingQuestionProps) {
  const [available, setAvailable] = useState(() => shuffleArray(question.sortItems ?? []))
  const [ordered, setOrdered] = useState<string[]>([])
  const [submitted, setSubmitted] = useState(false)

  const handleSelect = useCallback(
    (item: string) => {
      if (disabled || submitted) return
      setAvailable((prev) => prev.filter((x) => x !== item))
      setOrdered((prev) => [...prev, item])
    },
    [disabled, submitted]
  )

  const handleRemove = useCallback(
    (item: string) => {
      if (disabled || submitted) return
      setOrdered((prev) => prev.filter((x) => x !== item))
      setAvailable((prev) => [...prev, item])
    },
    [disabled, submitted]
  )

  const handleReset = () => {
    if (disabled || submitted) return
    setAvailable(shuffleArray(question.sortItems ?? []))
    setOrdered([])
  }

  const handleSubmit = () => {
    if (ordered.length === 0 || disabled || submitted) return
    setSubmitted(true)
    onAnswer(ordered.join(','))
  }

  const isCorrect = submitted && ordered.join(',') === question.correctOrder?.join(',')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Answer area */}
      <div
        className={cn(
          'min-h-[60px] rounded-xl border-2 border-dashed p-3 transition-colors',
          submitted && isCorrect && 'border-success bg-success/5',
          submitted && !isCorrect && 'border-destructive bg-destructive/5',
          !submitted && 'border-primary/30'
        )}
      >
        <p className="mb-2 text-xs text-muted-foreground">並べた順番:</p>
        <div className="flex flex-wrap gap-2">
          {ordered.map((item, i) => (
            <motion.button
              key={`ordered-${item}`}
              layout
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => handleRemove(item)}
              disabled={disabled || submitted}
              className={cn(
                'rounded-lg px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer',
                submitted && question.correctOrder?.[i] === item
                  ? 'bg-success/20 text-success'
                  : submitted
                    ? 'bg-destructive/20 text-destructive'
                    : 'bg-primary/20 text-primary hover:bg-primary/30'
              )}
            >
              {item}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Available items */}
      <div className="flex flex-wrap gap-2">
        {available.map((item) => (
          <motion.button
            key={`avail-${item}`}
            layout
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSelect(item)}
            disabled={disabled || submitted}
            className="cursor-pointer rounded-lg border border-border bg-muted px-3 py-1.5 text-sm font-medium transition-colors hover:border-primary hover:bg-primary/10"
          >
            {item}
          </motion.button>
        ))}
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          disabled={disabled || submitted || ordered.length === 0}
        >
          <RotateCcw className="mr-1 h-4 w-4" />
          リセット
        </Button>
        <Button
          size="sm"
          onClick={handleSubmit}
          disabled={disabled || submitted || available.length > 0}
          className="ml-auto"
        >
          <Check className="mr-1 h-4 w-4" />
          回答する
        </Button>
      </div>

      {submitted && !isCorrect && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground"
        >
          正解: <span className="font-bold text-success">{question.correctOrder?.join(' → ')}</span>
        </motion.p>
      )}
    </motion.div>
  )
}
