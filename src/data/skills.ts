import type { SkillNode } from '@/types'

export const skillTree: SkillNode[] = [
  // Tier 1 - Base skills
  {
    id: 'xp-boost-1',
    name: 'XP強化 I',
    description: '獲得XPが10%アップ',
    icon: 'sparkles',
    cost: 50,
    requires: [],
    effect: { type: 'xp-boost', value: 0.1 },
    position: { x: 50, y: 80 },
  },
  {
    id: 'coin-boost-1',
    name: 'コイン強化 I',
    description: '獲得コインが10%アップ',
    icon: 'coins',
    cost: 50,
    requires: [],
    effect: { type: 'coin-boost', value: 0.1 },
    position: { x: 30, y: 80 },
  },
  {
    id: 'hint-1',
    name: 'ヒントの書',
    description: 'ヒントが使えるようになる',
    icon: 'book-open',
    cost: 30,
    requires: [],
    effect: { type: 'hint-unlock', value: 1 },
    position: { x: 70, y: 80 },
  },

  // Tier 2
  {
    id: 'xp-boost-2',
    name: 'XP強化 II',
    description: '獲得XPが25%アップ',
    icon: 'sparkles',
    cost: 150,
    requires: ['xp-boost-1'],
    effect: { type: 'xp-boost', value: 0.25 },
    position: { x: 50, y: 55 },
  },
  {
    id: 'coin-boost-2',
    name: 'コイン強化 II',
    description: '獲得コインが25%アップ',
    icon: 'coins',
    cost: 150,
    requires: ['coin-boost-1'],
    effect: { type: 'coin-boost', value: 0.25 },
    position: { x: 30, y: 55 },
  },
  {
    id: 'fire-spell',
    name: '炎の魔法',
    description: '正解時に炎のエフェクトが出る',
    icon: 'flame',
    cost: 100,
    requires: ['hint-1'],
    effect: { type: 'visual-effect', value: 'fire' },
    position: { x: 70, y: 55 },
  },

  // Tier 3
  {
    id: 'wizard-hat',
    name: '魔法使いの帽子',
    description: 'アバターに魔法使いの帽子が付く',
    icon: 'hat-wizard',
    cost: 200,
    requires: ['xp-boost-2', 'coin-boost-2'],
    effect: { type: 'avatar-item', value: 'wizard-hat' },
    position: { x: 40, y: 30 },
  },
  {
    id: 'lightning-spell',
    name: '雷の魔法',
    description: '正解時に稲妻のエフェクトが出る',
    icon: 'zap',
    cost: 250,
    requires: ['fire-spell'],
    effect: { type: 'visual-effect', value: 'lightning' },
    position: { x: 70, y: 30 },
  },

  // Tier 4 - Ultimate
  {
    id: 'rainbow-magic',
    name: '虹の魔法',
    description: '正解時に虹色エフェクトが出る',
    icon: 'rainbow',
    cost: 500,
    requires: ['wizard-hat', 'lightning-spell'],
    effect: { type: 'visual-effect', value: 'rainbow' },
    position: { x: 50, y: 10 },
  },
]
