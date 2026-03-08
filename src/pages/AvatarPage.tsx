import { motion } from 'framer-motion'
import { useGame } from '@/contexts/GameContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

const bodyOptions = [
  { id: 'default', label: 'ノーマル', emoji: '', unlockId: 'default-body' },
  { id: 'warrior', label: '戦士', emoji: '', unlockId: 'warrior-body' },
  { id: 'mage', label: '魔法使い', emoji: '', unlockId: 'mage-body' },
]

const faceOptions = [
  { id: 'smile', label: 'スマイル', emoji: '', unlockId: 'smile-face' },
  { id: 'cool', label: 'クール', emoji: '', unlockId: 'cool-face' },
  { id: 'star', label: 'スター', emoji: '', unlockId: 'star-face' },
]

const hatOptions = [
  { id: null, label: 'なし', emoji: '----', unlockId: null },
  { id: 'wizard-hat', label: '魔法の帽子', emoji: '', unlockId: 'wizard-hat' },
  { id: 'crown', label: '王冠', emoji: '', unlockId: 'legendary-crown' },
]

const effectOptions = [
  { id: null, label: 'なし', emoji: '----', unlockId: null },
  { id: 'fire', label: '炎', emoji: '', unlockId: 'fire-spell' },
  { id: 'lightning', label: '雷', emoji: '', unlockId: 'lightning-spell' },
  { id: 'rainbow', label: '虹', emoji: '', unlockId: 'rainbow-magic' },
]

export function AvatarPage() {
  const { state, dispatch } = useGame()
  const { user } = state

  if (!user) return null

  const isItemUnlocked = (unlockId: string | null) => {
    if (unlockId === null) return true
    return user.unlockedItems.includes(unlockId) || user.unlockedSkills.includes(unlockId)
  }

  const renderSection = (
    title: string,
    options: { id: string | null; label: string; emoji: string; unlockId: string | null }[],
    currentValue: string | null,
    configKey: keyof typeof user.avatarConfig
  ) => (
    <div>
      <h3 className="mb-2 text-sm font-bold text-muted-foreground">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const unlocked = isItemUnlocked(opt.unlockId)
          const isSelected = currentValue === opt.id
          return (
            <motion.button
              key={opt.id ?? 'none'}
              whileTap={{ scale: 0.95 }}
              onClick={() => unlocked && dispatch({ type: 'SET_AVATAR', payload: { [configKey]: opt.id } })}
              disabled={!unlocked}
              className={cn(
                'flex flex-col items-center gap-1 rounded-xl border-2 p-3 text-center transition-all min-w-[70px] cursor-pointer',
                isSelected && 'border-primary bg-primary/10',
                !isSelected && unlocked && 'border-border bg-muted hover:border-primary/50',
                !unlocked && 'border-border/30 bg-muted/30 opacity-40 cursor-not-allowed'
              )}
            >
              <span className="text-2xl">{opt.emoji}</span>
              <span className="text-[10px] font-medium">{opt.label}</span>
              {!unlocked && <span className="text-[8px] text-muted-foreground">LOCKED</span>}
            </motion.button>
          )
        })}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">アバター</h1>
        <p className="text-sm text-muted-foreground">見た目をカスタマイズしよう</p>
      </div>

      {/* Avatar Preview */}
      <Card>
        <CardContent className="flex flex-col items-center py-8">
          <motion.div
            className="relative animate-float"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10 }}
          >
            <div className="text-8xl select-none">
              {bodyOptions.find((b) => b.id === user.avatarConfig.body)?.emoji || ''}
            </div>
            {user.avatarConfig.hat && (
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-4xl">
                {hatOptions.find((h) => h.id === user.avatarConfig.hat)?.emoji}
              </div>
            )}
            {user.avatarConfig.effect && (
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-2xl animate-pulse">
                {effectOptions.find((e) => e.id === user.avatarConfig.effect)?.emoji}
              </div>
            )}
          </motion.div>
          <p className="mt-4 text-lg font-bold">{user.displayName}</p>
        </CardContent>
      </Card>

      {/* Customization Options */}
      <Card>
        <CardHeader>
          <CardTitle>カスタマイズ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderSection('からだ', bodyOptions, user.avatarConfig.body, 'body')}
          {renderSection('かお', faceOptions, user.avatarConfig.face, 'face')}
          {renderSection('ぼうし', hatOptions, user.avatarConfig.hat, 'hat')}
          {renderSection('エフェクト', effectOptions, user.avatarConfig.effect, 'effect')}
        </CardContent>
      </Card>
    </div>
  )
}
