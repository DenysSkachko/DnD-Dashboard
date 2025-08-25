'use client'

import { useState } from 'react'
import { useCharacterSpells, type CharacterSpell } from '@/queries/characterSpellsQueries'
import { useCharacterFeatures, type CharacterFeature } from '@/queries/characterFeaturesQueries'
import FormTitle from '@/ui/FormTitle'
import SpellCard from '@/ui/SpellCard'
import FeatureCard from '@/ui/FeatureCard'
import { Loader } from '@/ui/Loader'
import { FaMagic, FaStar } from 'react-icons/fa'

const CharacterMagicAndFeatures = () => {
  const [tab, setTab] = useState<'spells' | 'features'>('spells')
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)

  const { data: spells = [], isLoading: isSpellsLoading } = useCharacterSpells()
  const { data: features = [], isLoading: isFeaturesLoading } = useCharacterFeatures()

  const levels = Array.from(new Set(spells.map(s => s.level ?? 0))).sort((a, b) => a - b)

  const sortedSpells = [...spells].sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
  const filteredSpells =
    selectedLevel === null
      ? sortedSpells
      : sortedSpells.filter(s => (s.level ?? 0) === selectedLevel)

  const sortedFeatures = [...features].sort((a, b) => (a.level_required ?? 0) - (b.level_required ?? 0))

  if (isSpellsLoading || isFeaturesLoading) return <Loader />

  return (
    <div className="flex flex-col gap-4 p-6">
     
      <div className="flex gap-4">
        <button
          className={`flex-1 h-11 bg-dark-hover flex justify-center items-center gap-2 rounded-md text-3xl font-bold ${
            tab === 'spells' ? 'text-accent' : 'text-white'
          }`}
          onClick={() => setTab('spells')}
        >
          <FaMagic />
        </button>
        <button
          className={`flex-1 h-11 bg-dark-hover flex justify-center items-center gap-2 rounded-md text-3xl font-bold ${
            tab === 'features' ? 'text-accent' : 'text-white'
          }`}
          onClick={() => setTab('features')}
        >
          <FaStar />
        </button>
      </div>

      {tab === 'spells' && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <FormTitle>Заклинания</FormTitle>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className={`px-3 py-1 rounded ${
                selectedLevel === null ? 'bg-accent text-light' : 'bg-alt text-light'
              }`}
              onClick={() => setSelectedLevel(null)}
            >
              Все
            </button>
            {levels.map(level => (
              <button
                key={level}
                className={`px-3 py-1 rounded ${
                  selectedLevel === level ? 'bg-accent text-light' : 'bg-alt text-light'
                }`}
                onClick={() => setSelectedLevel(level)}
              >
                {level}
              </button>
            ))}
          </div>

          <ul className="flex flex-col gap-2">
            {filteredSpells.map((s, idx) => (
              <SpellCard
                key={idx}
                name={s.name ?? ''}
                level={s.level ?? 0}
                action={s.action ?? ''}
                range={s.range ?? ''}
                duration={s.duration ?? ''}
                concentration={s.concentration ?? false}
                description={s.description ?? ''}
              />
            ))}
          </ul>
        </div>
      )}

      {tab === 'features' && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <FormTitle>Особенности</FormTitle>
          </div>

          <ul className="flex flex-col gap-2">
            {sortedFeatures.map((f, idx) => (
              <FeatureCard
                key={idx}
                name={f.name}
                description={f.description ?? ''}
                level={f.level_required ?? 0}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CharacterMagicAndFeatures
