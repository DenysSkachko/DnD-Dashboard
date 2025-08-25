'use client'

import { useState, useMemo } from 'react'
import { useCharacterSpells } from '@/queries/characterSpellsQueries'
import { useCharacterFeatures } from '@/queries/characterFeaturesQueries'
import FormTitle from '@/ui/FormTitle'
import SpellCard from '@/ui/SpellCard'
import FeatureCard from '@/ui/FeatureCard'
import { Loader } from '@/ui/Loader'
import { FaMagic, FaStar } from 'react-icons/fa'

const CharacterMagicAndFeatures = () => {
  const [tab, setTab] = useState<'spells' | 'features'>('spells')

  // ---- заклинания ----
  const {
    isLoading: isSpellsLoading,
    list: spells,
    selectedLevel,
    availableLevels,
    toggleLevelFilter,
  } = useCharacterSpells()

  // ---- особенности ----
  const { isLoading: isFeaturesLoading, list: features } = useCharacterFeatures()

  const sortedFeatures = useMemo(
    () => [...features].sort((a, b) => (a.level_required ?? 0) - (b.level_required ?? 0)),
    [features]
  )

  if (isSpellsLoading || isFeaturesLoading) return <Loader />

  return (
    <div className="flex flex-col gap-4 p-6">
      {/* табы */}
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

      {/* блок заклинаний */}
      {tab === 'spells' && (
        <div className="flex flex-col gap-4">
          <FormTitle>Заклинания</FormTitle>

          {/* фильтр по уровню */}
          {availableLevels.length > 1 && (
            <div className="flex flex-wrap gap-2">
              {availableLevels.map(level => (
                <button
                  key={level === null ? 'all' : level}
                  className={`px-3 py-1 rounded ${
                    selectedLevel === level ? 'bg-accent text-light' : 'bg-alt text-light'
                  }`}
                  onClick={() => toggleLevelFilter(level)}
                >
                  {level === null ? 'Все' : level}
                </button>
              ))}
            </div>
          )}

          {spells.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {spells.map(s => (
                <SpellCard
                  key={s.id}
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
          ) : (
            <p className="text-light text-sm opacity-70">Нет доступных заклинаний</p>
          )}
        </div>
      )}

      {/* блок особенностей */}
      {tab === 'features' && (
        <div className="flex flex-col gap-4">
          <FormTitle>Особенности</FormTitle>

          {sortedFeatures.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {sortedFeatures.map(f => (
                <FeatureCard
                  key={f.id}
                  name={f.name}
                  description={f.description ?? ''}
                  level={f.level_required ?? 0}
                />
              ))}
            </ul>
          ) : (
            <p className="text-light text-sm opacity-70">Нет особенностей</p>
          )}
        </div>
      )}
    </div>
  )
}

export default CharacterMagicAndFeatures
