'use client'

import { useState } from 'react'
import { useCharacterSpells, type CharacterSpell } from '@/queries/characterSpellsQueries'
import FormTitle from '@/ui/FormTitle'
import SpellCard from '@/ui/SpellCard'
import { Loader } from '@/ui/Loader'
import ActionButton from '@/ui/ActionButton'

const CharacterSpellsSection = () => {
  const { data: spells = [], isLoading } = useCharacterSpells()
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)

  if (isLoading) return <Loader />

  // Все уровни заклинаний (уникальные, отсортированные)
  const levels = Array.from(new Set(spells.map(s => s.level ?? 0))).sort((a, b) => a - b)

  // Сортируем и фильтруем
  const sortedSpells = [...spells].sort(
    (a: CharacterSpell, b: CharacterSpell) => (a.level ?? 0) - (b.level ?? 0)
  )
  const filteredSpells =
    selectedLevel === null
      ? sortedSpells
      : sortedSpells.filter(s => (s.level ?? 0) === selectedLevel)

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex justify-between items-center">
        <FormTitle>Заклинания</FormTitle>
      </div>

      {/* Панель уровней */}
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

      {/* Список заклинаний */}
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
  )
}

export default CharacterSpellsSection
