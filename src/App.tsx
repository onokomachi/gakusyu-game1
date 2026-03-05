import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GameProvider } from '@/contexts/GameContext'
import { Header } from '@/components/layout/Header'
import { TreasureChest } from '@/components/gamification/TreasureChest'
import { AnswerEffect } from '@/components/gamification/AnswerEffect'
import { HomePage } from '@/pages/HomePage'
import { StudyPage } from '@/pages/StudyPage'
import { SkillTreePage } from '@/pages/SkillTreePage'
import { AvatarPage } from '@/pages/AvatarPage'
import { DashboardPage } from '@/pages/DashboardPage'

function App() {
  return (
    <BrowserRouter>
      <GameProvider>
        <div className="relative min-h-dvh pb-16 pt-0">
          <Header />
          <main className="mx-auto max-w-2xl px-4 py-4">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/study" element={<StudyPage />} />
              <Route path="/skill-tree" element={<SkillTreePage />} />
              <Route path="/avatar" element={<AvatarPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
          <TreasureChest />
          <AnswerEffect />
        </div>
      </GameProvider>
    </BrowserRouter>
  )
}

export default App
