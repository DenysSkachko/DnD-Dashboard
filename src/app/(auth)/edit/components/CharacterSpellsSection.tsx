'use client'

import {
  useCharacterSpells,
  useCreateCharacterSpell,
  useUpdateCharacterSpell,
  useDeleteCharacterSpell,
  type CharacterSpell,
} from '@/queries/characterSpellsQueries'
import FormTitle from '@/ui/FormTitle'
import ActionButton from '@/ui/ActionButton'
import SpellCard from '@/ui/SpellCard'
import { useEditableSection } from '@/hooks/useEditableSection'
import SpellForm from './forms/SpellForm'
import { Loader } from '@/ui/Loader'
import { useState } from 'react'

const CharacterSpellsSection = () => {
  const { data: spells = [], isLoading, refetch } = useCharacterSpells()
  const createSpell = useCreateCharacterSpell()
  const updateSpell = useUpdateCharacterSpell()
  const deleteSpell = useDeleteCharacterSpell()

  const {
    localList,
    setLocalList,
    editingIdx,
    setEditingIdx,
    newItem,
    setNewItem,
    startAdd,
    cancelAdd,
    addNew,
    saveExisting,
    deleteExisting,
  } = useEditableSection<CharacterSpell>({
    data: spells,
    emptyItem: {
      name: '',
      level: 0,
      concentration: false,
      action: 'main',
      range: '',
      duration: '',
      description: '',
    },
    stripKeys: ['id', 'character_id'],
    createFn: item => createSpell.mutateAsync(item as Omit<CharacterSpell, 'id' | 'character_id'>),
    updateFn: (id, item) =>
      updateSpell.mutateAsync({ id, ...(item as Omit<CharacterSpell, 'id' | 'character_id'>) }),
    deleteFn: id => deleteSpell.mutateAsync(id),
  })

  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)

  if (isLoading) return <Loader />

  const levels = Array.from(new Set(localList.map(s => s.level ?? 0))).sort((a, b) => a - b)

  const filteredSpells = [...localList]
    .sort((a, b) => (a.level ?? 0) - (b.level ?? 0))
    .filter(s => (selectedLevel === null ? true : s.level === selectedLevel))

  const handleAddNew = async () => {
    await addNew()
    await refetch()
  }

  const handleSaveExisting = async (idx: number) => {
    await saveExisting(idx)
    await refetch()
  }

  const handleDeleteExisting = async (idx: number) => {
    await deleteExisting(idx)
    await refetch()
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <FormTitle>Заклинания</FormTitle>
        <ActionButton type="add" onClick={startAdd} />
      </div>

      {newItem && (
        <SpellForm
          spell={newItem}
          onChange={setNewItem}
          onSave={handleAddNew}
          onCancel={cancelAdd}
          isNew
        />
      )}

      <div className="flex flex-wrap gap-2 mb-2">
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
        {filteredSpells.map((s, idx) => {
          const isEditing = editingIdx === idx
          return (
            <div key={idx} className="flex flex-col gap-2">
              {!isEditing ? (
                <SpellCard
                  name={s.name ?? ''}
                  level={s.level ?? 0}
                  action={s.action ?? ''}
                  range={s.range ?? ''}
                  duration={s.duration ?? ''}
                  concentration={s.concentration ?? false}
                  description={s.description ?? ''}
                  onEdit={() => setEditingIdx(idx)}
                />
              ) : (
                <SpellForm
                  spell={s}
                  onChange={updated => {
                    const copy = [...localList]
                    copy[idx] = updated as CharacterSpell
                    setLocalList(copy)
                  }}
                  onSave={() => handleSaveExisting(idx)}
                  onDelete={() => handleDeleteExisting(idx)}
                  onCancel={() => setEditingIdx(null)}
                />
              )}
            </div>
          )
        })}
      </ul>
    </div>
  )
}

export default CharacterSpellsSection
