import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { calculateLevel, formatNumber } from '@/lib/utils'
import { Sparkles, Coins, Flame, Target, BookOpen, TrendingUp } from 'lucide-react'
import type { Subject } from '@/types'

const subjectNames: Record<Subject, string> = {
  math: '数学',
  english: '英語',
  science: '理科',
  japanese: '国語',
  social: '社会',
}

const subjectColors: Record<Subject, string> = {
  math: 'bg-blue-500',
  english: 'bg-green-500',
  science: 'bg-yellow-500',
  japanese: 'bg-pink-500',
  social: 'bg-purple-500',
}

export function DashboardPage() {
  const { state } = useGame()
  const { user } = state

  if (!user) return null

  const { level, currentXp, requiredXp } = calculateLevel(user.totalXp)

  const stats = useMemo(() => {
    const history = user.studyHistory
    const totalQuestions = history.reduce((sum, s) => sum + s.questionsAnswered, 0)
    const totalCorrect = history.reduce((sum, s) => sum + s.correctAnswers, 0)
    const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0

    // Subject breakdown
    const bySubject: Partial<Record<Subject, { total: number; correct: number }>> = {}
    for (const session of history) {
      if (!bySubject[session.subject]) {
        bySubject[session.subject] = { total: 0, correct: 0 }
      }
      bySubject[session.subject]!.total += session.questionsAnswered
      bySubject[session.subject]!.correct += session.correctAnswers
    }

    return { totalQuestions, totalCorrect, accuracy, bySubject }
  }, [user.studyHistory])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">成績ダッシュボード</h1>
        <p className="text-sm text-muted-foreground">きみの成長を確認しよう</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}>
          <Card>
            <CardContent className="flex flex-col items-center py-4">
              <Sparkles className="h-6 w-6 text-xp" />
              <p className="mt-2 text-2xl font-bold">{formatNumber(user.totalXp)}</p>
              <p className="text-xs text-muted-foreground">総合XP</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <Card>
            <CardContent className="flex flex-col items-center py-4">
              <Coins className="h-6 w-6 text-coin" />
              <p className="mt-2 text-2xl font-bold">{formatNumber(user.coins)}</p>
              <p className="text-xs text-muted-foreground">コイン</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="flex flex-col items-center py-4">
              <Flame className="h-6 w-6 text-streak" />
              <p className="mt-2 text-2xl font-bold">{user.streakDays}</p>
              <p className="text-xs text-muted-foreground">連続日数</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <Card>
            <CardContent className="flex flex-col items-center py-4">
              <Target className="h-6 w-6 text-success" />
              <p className="mt-2 text-2xl font-bold">{stats.accuracy}%</p>
              <p className="text-xs text-muted-foreground">正答率</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Level Progress */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-5 w-5 text-primary" />
              レベル進捗
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground">
                {level}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-sm">
                  <span>Lv.{level}</span>
                  <span>Lv.{level + 1}</span>
                </div>
                <Progress
                  value={(currentXp / requiredXp) * 100}
                  className="mt-1 h-3"
                  indicatorClassName="bg-gradient-to-r from-primary to-magic"
                />
                <p className="mt-1 text-xs text-muted-foreground text-right">
                  {currentXp} / {requiredXp} XP
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Subject Performance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BookOpen className="h-5 w-5 text-primary" />
              教科別成績
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(stats.bySubject).length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                まだ学習記録がありません。学習を始めよう!
              </p>
            ) : (
              <div className="space-y-4">
                {(Object.entries(stats.bySubject) as [Subject, { total: number; correct: number }][]).map(
                  ([subject, data]) => {
                    const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
                    return (
                      <div key={subject}>
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium">{subjectNames[subject]}</span>
                          <span className="text-muted-foreground">
                            {data.correct}/{data.total} ({pct}%)
                          </span>
                        </div>
                        <Progress
                          value={pct}
                          className="mt-1 h-2"
                          indicatorClassName={subjectColors[subject]}
                        />
                      </div>
                    )
                  }
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Skills Unlocked */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <Card>
          <CardContent className="py-4">
            <p className="text-center text-sm text-muted-foreground">
              解放済みスキル: <span className="font-bold text-foreground">{user.unlockedSkills.length}</span> / 9
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
