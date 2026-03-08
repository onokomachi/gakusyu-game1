import { Link, useLocation } from 'react-router-dom'
import { Flame, Coins, Sparkles, BookOpen, TreePine, User, BarChart3, Home } from 'lucide-react'
import { useGame } from '@/contexts/GameContext'
import { calculateLevel, formatNumber } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'

const navItems = [
  { path: '/', icon: Home, label: 'ホーム' },
  { path: '/study', icon: BookOpen, label: '学習' },
  { path: '/skill-tree', icon: TreePine, label: 'スキル' },
  { path: '/avatar', icon: User, label: 'アバター' },
  { path: '/dashboard', icon: BarChart3, label: '成績' },
]

export function Header() {
  const { state } = useGame()
  const location = useLocation()
  const { user, currentStreak } = state

  if (!user) return null

  const { level, currentXp, requiredXp } = calculateLevel(user.totalXp)

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
              Lv{level}
            </div>
            <div className="hidden sm:block">
              <Progress value={(currentXp / requiredXp) * 100} className="h-2 w-24" indicatorClassName="bg-xp" />
              <p className="text-[10px] text-muted-foreground">
                {currentXp}/{requiredXp} XP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentStreak > 0 && (
              <div className="flex items-center gap-1 text-streak">
                <Flame className="h-4 w-4" />
                <span className="text-sm font-bold">{currentStreak}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-coin">
              <Coins className="h-4 w-4" />
              <span className="text-sm font-bold">{formatNumber(user.coins)}</span>
            </div>
            <div className="flex items-center gap-1 text-xp">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-bold">{formatNumber(user.totalXp)}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-around py-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center gap-0.5 px-3 py-1.5 text-[10px] transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'drop-shadow-[0_0_6px_var(--color-primary)]' : ''}`} />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
