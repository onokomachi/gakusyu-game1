import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Subject } from '@/types'
import { useGame } from '@/contexts/GameContext'
import { QuizSession } from '@/components/quiz/QuizSession'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'

const subjects: { key: Subject; name: string; color: string; icon: string }[] = [
  { key: 'math', name: '数学', color: 'border-blue-500 hover:bg-blue-500/10', icon: '/' },
  { key: 'english', name: '英語', color: 'border-green-500 hover:bg-green-500/10', icon: 'A' },
  { key: 'science', name: '理科', color: 'border-yellow-500 hover:bg-yellow-500/10', icon: '' },
  { key: 'japanese', name: '国語', color: 'border-pink-500 hover:bg-pink-500/10', icon: '' },
  { key: 'social', name: '社会', color: 'border-purple-500 hover:bg-purple-500/10', icon: '' },
]

export function StudyPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { dispatch } = useGame()
  const initialSubject = searchParams.get('subject') as Subject | null
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(initialSubject)
  const [studying, setStudying] = useState(!!initialSubject)

  const startStudy = (subject: Subject) => {
    setSelectedSubject(subject)
    setStudying(true)
    dispatch({ type: 'RESET_SESSION' })
    dispatch({ type: 'SELECT_SUBJECT', payload: subject })
  }

  const handleComplete = () => {
    setStudying(false)
    setSelectedSubject(null)
    navigate('/')
  }

  if (studying && selectedSubject) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => { setStudying(false); setSelectedSubject(null) }}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          教科選択に戻る
        </Button>
        <QuizSession subject={selectedSubject} onComplete={handleComplete} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">学習を始めよう</h1>
        <p className="text-sm text-muted-foreground">教科を選んでスタート</p>
      </div>

      <div className="grid gap-3">
        {subjects.map(({ key, name, color, icon }, i) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Card
              className={`cursor-pointer border-l-4 transition-all ${color}`}
              onClick={() => startStudy(key)}
            >
              <CardContent className="flex items-center gap-4 py-4">
                <span className="text-3xl">{icon}</span>
                <div>
                  <p className="font-bold">{name}</p>
                  <p className="text-xs text-muted-foreground">問題に挑戦する</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
