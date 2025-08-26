'use client'

import { useState } from 'react'
import { useCharacterSpells, type CharacterSpell } from '@/queries/characterSpellsQueries'
import FormTitle from '@/ui/FormTitle'
import ActionButton from '@/ui/ActionButton'
import { Loader } from '@/ui/Loader'
import SpellCard from '@/ui/SpellCard'
import SpellForm from './forms/SpellForm'

const EditableSpellItem = ({
  spell,
  onSave,
  onDelete,
  onCancel,
}: {
  spell: CharacterSpell
  onSave: (id: number, updated: Partial<CharacterSpell>) => void | Promise<void>
  onDelete: (id: number) => void | Promise<void>
  onCancel: () => void
}) => {
  const [draft, setDraft] = useState(spell)

  return (
    <SpellForm
      spell={draft}
      onChange={(field, value) => setDraft({ ...draft, [field]: value })}
      onSave={() => onSave(spell.id, draft)}
      onDelete={() => onDelete(spell.id)}
      onCancel={onCancel}
    />
  )
}

const CharacterSpellsSection = () => {
  const {
    isLoading,
    list,
    newItem,
    editingId,
    selectedLevel,
    availableLevels,
    startAddItem,
    cancelAddItem,
    setNewItem,
    saveNewItem,
    startEditItem,
    cancelEditItem,
    saveEditItem,
    deleteItem,
    toggleLevelFilter,
  } = useCharacterSpells()

  if (isLoading) return <Loader />

  return (
    <>
      <div className="flex-center">
        <FormTitle>Заклинания</FormTitle>
        <ActionButton type="add" onClick={startAddItem} />
      </div>

      {/* фильтр по уровню */}
      <div className="flex flex-wrap gap-2 mb-2">
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

      {newItem && (
        <SpellForm
          spell={newItem}
          onChange={(field, value) => setNewItem({ ...newItem, [field]: value })}
          onSave={saveNewItem}
          onCancel={cancelAddItem}
          isNew
        />
      )}

      <ul className="flex flex-col gap-2">
        {list.map(spell => {
          const isEditing = editingId === spell.id
          return (
            <div key={spell.id} className="flex flex-col gap-2">
              {!isEditing ? (
                <SpellCard
                  name={spell.name}
                  level={spell.level}
                  action={spell.action || ''}
                  range={spell.range || ''}
                  duration={spell.duration || ''}
                  concentration={spell.concentration ?? false}
                  description={spell.description || ''}
                  onEdit={() => startEditItem(spell.id)}
                />
              ) : (
                <EditableSpellItem
                  spell={spell}
                  onSave={saveEditItem}
                  onDelete={deleteItem}
                  onCancel={cancelEditItem}
                />
              )}
            </div>
          )
        })}
      </ul>
    </>
  )
}

export default CharacterSpellsSection
