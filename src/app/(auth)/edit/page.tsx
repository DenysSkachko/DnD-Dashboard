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
import CharacterFeaturesSection from './components/CharacterFeaturesSection'

const tabs = [
  { name: 'Персонаж', component: <CharacterSection /> },
  { name: 'Статы', component: <CharacterStatsSection /> },
  { name: 'Спасброски', component: <CharacterSavingThrowsSection /> },
  { name: 'Навыки', component: <CharacterSkillsSection /> },
  { name: 'Инвентарь', component: <CharacterInventorySection /> },
  { name: 'Оружие', component: <CharacterWeaponsSection /> },
  { name: 'Заклинания', component: <CharacterSpellsSection /> },
  { name: 'Особенности', component: <CharacterFeaturesSection/> },
  { name: 'Сражение', component: <CharacterCombatSection /> },
]

const EditPage = () => {
  const [activeTab, setActiveTab] = useState(tabs[0].name)

  return (
    <div className="min-h-screen p-6">
  
      <div className="flex flex-wrap gap-2 mb-4 w-full">
        {tabs.map(tab => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex-1 min-w-[30%] px-3 py-2 rounded-md font-medium transition-colors text-center  text-xs
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

      <div>
        {tabs.map(
          tab =>
            tab.name === activeTab && (
              <div key={tab.name} className="flex flex-col gap-3 ">
                {tab.component}
              </div>
            )
        )}
      </div>
    </div>
  )
}

export default EditPage
