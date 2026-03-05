import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import type { Question, Subject } from '@/types'
import { MultipleChoice } from './MultipleChoice'
import { TextInput } from './TextInput'
import { SortingQuestion } from './SortingQuestion'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowRight, Trophy, Coins, Sparkles, RotateCcw } from 'lucide-react'

interface QuizSessionProps {
  subject: Subject
  onComplete: () => void
}

export function QuizSession({ subject, onComplete }: QuizSessionProps) {
  const { getQuestions, processAnswer, state } = useGame()
  const [questions] = useState<Question[]>(() => getQuestions(subject, 10))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [finished, setFinished] = useState(false)
  const startTimeRef = useRef(Date.now())

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + (answered ? 1 : 0)) / questions.length) * 100

  const handleAnswer = useCallback(
    (answer: string) => {
      if (answered) return
      const timeMs = Date.now() - startTimeRef.current
      processAnswer(currentQuestion.id, answer, timeMs)
      setAnswered(true)
    },
    [answered, currentQuestion, processAnswer]
  )

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setAnswered(false)
      startTimeRef.current = Date.now()
    } else {
      setFinished(true)
    }
  }

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">この教科の問題はまだありません</p>
          <Button variant="outline" className="mt-4" onClick={onComplete}>
            戻る
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (finished) {
    const accuracy = state.sessionTotal > 0 ? Math.round((state.sessionCorrect / state.sessionTotal) * 100) : 0
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center gap-6 text-center">
              <Trophy className="h-16 w-16 text-accent drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
              <div>
                <h2 className="text-2xl font-bold">学習完了!</h2>
                <p className="mt-1 text-muted-foreground">お疲れさまでした</p>
              </div>

              <div className="grid w-full grid-cols-3 gap-4">
                <div className="rounded-xl bg-muted p-4">
                  <p className="text-2xl font-bold text-success">{accuracy}%</p>
                  <p className="text-xs text-muted-foreground">正答率</p>
                </div>
                <div className="rounded-xl bg-muted p-4">
                  <div className="flex items-center justify-center gap-1">
                    <Sparkles className="h-4 w-4 text-xp" />
                    <p className="text-2xl font-bold text-xp">{state.sessionXp}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">獲得XP</p>
                </div>
                <div className="rounded-xl bg-muted p-4">
                  <div className="flex items-center justify-center gap-1">
                    <Coins className="h-4 w-4 text-coin" />
                    <p className="text-2xl font-bold text-coin">{state.sessionCoins}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">獲得コイン</p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={onComplete}>
                  ホームへ
                </Button>
                <Button
                  onClick={() => {
                    setCurrentIndex(0)
                    setAnswered(false)
                    setFinished(false)
                    startTimeRef.current = Date.now()
                  }}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  もう一度
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <Progress value={progress} className="h-2 flex-1" />
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1}/{questions.length}
        </span>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardContent className="py-6">
              <div className="mb-1 flex items-center gap-2">
                <span className="rounded-md bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                  {currentQuestion.type === 'multiple-choice'
                    ? '4択'
                    : currentQuestion.type === 'text-input'
                      ? '入力'
                      : '並べ替え'}
                </span>
                <span className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {currentQuestion.difficulty === 'easy'
                    ? '基本'
                    : currentQuestion.difficulty === 'normal'
                      ? '標準'
                      : '発展'}
                </span>
              </div>

              <h3 className="mb-6 text-lg font-bold leading-relaxed">{currentQuestion.question}</h3>

              {currentQuestion.type === 'multiple-choice' && (
                <MultipleChoice question={currentQuestion} onAnswer={handleAnswer} disabled={answered} />
              )}
              {currentQuestion.type === 'text-input' && (
                <TextInput question={currentQuestion} onAnswer={handleAnswer} disabled={answered} />
              )}
              {currentQuestion.type === 'sorting' && (
                <SortingQuestion question={currentQuestion} onAnswer={handleAnswer} disabled={answered} />
              )}

              {answered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 flex justify-end"
                >
                  <Button onClick={handleNext} size="lg">
                    {currentIndex < questions.length - 1 ? (
                      <>
                        次の問題
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        結果を見る
                        <Trophy className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
