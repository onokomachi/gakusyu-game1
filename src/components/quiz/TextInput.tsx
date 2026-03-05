import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Question } from '@/types'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

interface TextInputProps {
  question: Question
  onAnswer: (answer: string) => void
  disabled: boolean
}

export function TextInput({ question, onAnswer, disabled }: TextInputProps) {
  const [value, setValue] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [question.id])

  const handleSubmit = () => {
    if (!value.trim() || disabled || submitted) return
    setSubmitted(true)
    onAnswer(value.trim())
  }

  const isCorrect = submitted && value.trim().toLowerCase() === (question.correctAnswer ?? '').trim().toLowerCase()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="答えを入力..."
          disabled={disabled || submitted}
          className={`flex-1 rounded-xl border-2 bg-muted px-4 py-3 text-sm outline-none transition-all ${
            submitted
              ? isCorrect
                ? 'border-success bg-success/10'
                : 'border-destructive bg-destructive/10'
              : 'border-border focus:border-primary'
          }`}
        />
        <Button
          onClick={handleSubmit}
          disabled={!value.trim() || disabled || submitted}
          size="icon"
          className="h-12 w-12 rounded-xl"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>

      {submitted && !isCorrect && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground"
        >
          正解: <span className="font-bold text-success">{question.correctAnswer}</span>
        </motion.p>
      )}
    </motion.div>
  )
}
