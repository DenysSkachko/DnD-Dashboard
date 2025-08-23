'use client'

import { useState } from 'react'
import CharacterSection from './components/CharacterSection'
import CharacterStatsSection from './components/CharacterStatsSection'
import CharacterSkillsSection from './components/CharacterSkillsSection'
import CharacterSavingThrowsSection from './components/CharacterSavingThrowsSection'
import CharacterInventorySection from './components/CharacterInventorySections'
import CharacterWeaponsSection from './components/CharacterWeaponsSection'
import CharacterSpellsSection from './components/CharacterSpellsSection'
import CharacterCombatSection from './components/CharacterCombatSection'

const tabs = [
  { name: 'Персонаж', component: <CharacterSection /> },
  { name: 'Статы', component: <CharacterStatsSection /> },
  { name: 'Навыки', component: <CharacterSkillsSection /> },

  { name: 'Сражение', component: <CharacterCombatSection /> },
  { name: 'Инвентарь', component: <CharacterInventorySection /> },
  { name: 'Оружие', component: <CharacterWeaponsSection /> },
  { name: 'Заклинания', component: <CharacterSpellsSection /> },

  { name: 'Спасброски', component: <CharacterSavingThrowsSection /> },
]

const HomePage = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].name)

  return (
    <div className="min-h-screen p-6">
      {/* Табы */}
      <div className="flex flex-wrap gap-2 mb-4 w-full">
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-1 min-w-[30%] px-4 py-2 rounded-md font-medium transition-colors text-center  text-sm
              ${
                activeTab === tab.name
                  ? 'bg-white text-black'
                  : 'bg-white/20 text-white hover:bg-white/40'
              }`}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Контент активной вкладки */}
      <div>
        {tabs.map(
          tab =>
            tab.name === activeTab && (
              <div key={tab.name} className="space-y-6">
                {tab.component}
              </div>
            )
        )}
      </div>
    </div>
  )
}

export default HomePage
