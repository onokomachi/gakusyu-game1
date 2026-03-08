import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { StreakDisplay } from '@/components/gamification/StreakDisplay'
import { calculateLevel } from '@/lib/utils'
import { BookOpen, TreePine, Sparkles, Target } from 'lucide-react'

const subjectInfo = {
  math: { name: '数学', color: 'text-blue-400', bg: 'bg-blue-500/10', icon: '/' },
  english: { name: '英語', color: 'text-green-400', bg: 'bg-green-500/10', icon: 'A' },
  science: { name: '理科', color: 'text-yellow-400', bg: 'bg-yellow-500/10', icon: '' },
  japanese: { name: '国語', color: 'text-pink-400', bg: 'bg-pink-500/10', icon: '' },
  social: { name: '社会', color: 'text-purple-400', bg: 'bg-purple-500/10', icon: '' },
}

export function HomePage() {
  const { state } = useGame()
  const { user, currentStreak } = state

  if (!user) return null

  const { level, currentXp, requiredXp } = calculateLevel(user.totalXp)

  return (
    <div className="space-y-6">
      {/* Welcome & Level */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="overflow-hidden">
          <div className="absolute inset-0 animate-shimmer opacity-30" />
          <CardContent className="relative py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">おかえり!</p>
                <h1 className="text-2xl font-bold">{user.displayName}</h1>
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary font-bold text-primary-foreground">
                    {level}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-xp" />
                      <span className="text-xs text-muted-foreground">
                        Lv.{level} → Lv.{level + 1}
                      </span>
                    </div>
                    <Progress value={(currentXp / requiredXp) * 100} className="mt-1 h-2" indicatorClassName="bg-xp" />
                  </div>
                </div>
              </div>
              <StreakDisplay days={currentStreak} />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Study */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <CardHeader className="px-0">
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            教科を選んで学習
          </CardTitle>
        </CardHeader>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {(Object.entries(subjectInfo) as [string, typeof subjectInfo.math][]).map(
            ([key, { name, color, bg, icon }], i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 + i * 0.05 }}
              >
                <Link to={`/study?subject=${key}`}>
                  <Card className="group cursor-pointer transition-all hover:border-primary hover:shadow-[0_0_15px_rgba(139,92,246,0.2)]">
                    <CardContent className="flex flex-col items-center gap-2 py-6">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl ${bg} text-2xl transition-transform group-hover:scale-110`}
                      >
                        {icon}
                      </div>
                      <span className={`text-sm font-bold ${color}`}>{name}</span>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            )
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/skill-tree">
            <Button variant="outline" className="h-auto w-full flex-col gap-2 py-4">
              <TreePine className="h-6 w-6 text-success" />
              <span className="text-xs">スキルツリー</span>
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="outline" className="h-auto w-full flex-col gap-2 py-4">
              <Target className="h-6 w-6 text-accent" />
              <span className="text-xs">成績を見る</span>
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
