import { useState } from 'react'
import { motion } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { skillTree } from '@/data/skills'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Coins, Lock, Check, Sparkles, Flame, Zap, BookOpen, Rainbow } from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap: Record<string, typeof Sparkles> = {
  sparkles: Sparkles,
  coins: Coins,
  'book-open': BookOpen,
  flame: Flame,
  zap: Zap,
  rainbow: Rainbow,
  'hat-wizard': Sparkles,
}

export function SkillTreePage() {
  const { state, dispatch } = useGame()
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null)
  const { user } = state

  if (!user) return null

  const isUnlocked = (id: string) => user.unlockedSkills.includes(id)
  const canUnlock = (skill: typeof skillTree[0]) =>
    !isUnlocked(skill.id) &&
    skill.requires.every((r) => isUnlocked(r)) &&
    user.coins >= skill.cost

  const handleUnlock = (skillId: string) => {
    const skill = skillTree.find((s) => s.id === skillId)
    if (!skill || !canUnlock(skill)) return
    dispatch({ type: 'UPDATE_COINS', payload: -skill.cost })
    dispatch({ type: 'UNLOCK_SKILL', payload: skillId })
    setSelectedSkill(null)
  }

  const selected = skillTree.find((s) => s.id === selectedSkill)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">スキルツリー</h1>
        <p className="flex items-center gap-1 text-sm text-muted-foreground">
          <Coins className="h-4 w-4 text-coin" />
          {user.coins} コインで能力を解放しよう
        </p>
      </div>

      {/* Skill Tree Grid */}
      <Card>
        <CardContent className="py-6">
          <div className="relative mx-auto" style={{ maxWidth: 400, height: 450 }}>
            {/* Connection lines */}
            <svg className="absolute inset-0 h-full w-full" style={{ zIndex: 0 }}>
              {skillTree.map((skill) =>
                skill.requires.map((reqId) => {
                  const req = skillTree.find((s) => s.id === reqId)
                  if (!req) return null
                  const bothUnlocked = isUnlocked(skill.id) && isUnlocked(reqId)
                  return (
                    <line
                      key={`${reqId}-${skill.id}`}
                      x1={`${req.position.x}%`}
                      y1={`${req.position.y}%`}
                      x2={`${skill.position.x}%`}
                      y2={`${skill.position.y}%`}
                      stroke={bothUnlocked ? '#8b5cf6' : isUnlocked(reqId) ? '#3b2d5e' : '#1a1230'}
                      strokeWidth={2}
                      strokeDasharray={bothUnlocked ? 'none' : '4 4'}
                    />
                  )
                })
              )}
            </svg>

            {/* Skill nodes */}
            {skillTree.map((skill, i) => {
              const unlocked = isUnlocked(skill.id)
              const available = canUnlock(skill)
              const requiresMet = skill.requires.every((r) => isUnlocked(r))
              const Icon = iconMap[skill.icon] || Sparkles

              return (
                <motion.button
                  key={skill.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setSelectedSkill(skill.id)}
                  className={cn(
                    'absolute z-10 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border-2 transition-all cursor-pointer',
                    unlocked &&
                      'border-primary bg-primary/20 shadow-[0_0_10px_rgba(139,92,246,0.3)]',
                    available && !unlocked && 'border-accent bg-accent/10 animate-pulse-glow',
                    !unlocked && !available && requiresMet && 'border-border bg-muted',
                    !unlocked && !requiresMet && 'border-border/50 bg-muted/50 opacity-40'
                  )}
                  style={{ left: `${skill.position.x}%`, top: `${skill.position.y}%` }}
                >
                  {unlocked ? (
                    <Icon className="h-6 w-6 text-primary" />
                  ) : requiresMet ? (
                    <Icon className="h-6 w-6 text-muted-foreground" />
                  ) : (
                    <Lock className="h-5 w-5 text-muted-foreground/50" />
                  )}
                </motion.button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Selected skill detail */}
      {selected && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isUnlocked(selected.id) && <Check className="h-5 w-5 text-success" />}
                {selected.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-sm text-muted-foreground">{selected.description}</p>

              {isUnlocked(selected.id) ? (
                <p className="text-sm font-medium text-success">解放済み</p>
              ) : canUnlock(selected) ? (
                <Button onClick={() => handleUnlock(selected.id)} variant="accent">
                  <Coins className="mr-2 h-4 w-4" />
                  {selected.cost} コインで解放
                </Button>
              ) : (
                <div className="text-sm text-muted-foreground">
                  {!selected.requires.every((r) => isUnlocked(r)) && (
                    <p>必要スキル: {selected.requires.map((r) => skillTree.find((s) => s.id === r)?.name).join(', ')}</p>
                  )}
                  {user.coins < selected.cost && <p>コインが足りません ({selected.cost} コイン必要)</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
