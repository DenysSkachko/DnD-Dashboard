'use client'

import { useState } from 'react'
import { useCharacterFeatures, type CharacterFeature } from '@/queries/characterFeaturesQueries'
import FormTitle from '@/ui/FormTitle'
import ActionButton from '@/ui/ActionButton'
import { Loader } from '@/ui/Loader'
import FeatureCard from '@/ui/FeatureCard'
import FeatureForm from './forms/FeatureForm'

const EditableFeatureItem = ({
  feature,
  onSave,
  onDelete,
  onCancel,
}: {
  feature: CharacterFeature
  onSave: (id: number, updated: Partial<CharacterFeature>) => void | Promise<void>
  onDelete: (id: number) => void | Promise<void>
  onCancel: () => void
}) => {
  const [draft, setDraft] = useState(feature)

  return (
    <FeatureForm
      feature={draft}
      onChange={(field, value) => setDraft({ ...draft, [field]: value })}
      onSave={() => onSave(feature.id, draft)}
      onDelete={() => onDelete(feature.id)}
      onCancel={onCancel}
    />
  )
}

const CharacterFeaturesSection = () => {
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
  } = useCharacterFeatures()

  if (isLoading) return <Loader />

  return (
    <>
      <div className="flex-center">
        <FormTitle>Особенности</FormTitle>
        <ActionButton type="add" onClick={startAddItem} />
      </div>

      {/* фильтр по уровню */}
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

      {newItem && (
        <FeatureForm
          feature={newItem}
          onChange={(field, value) => setNewItem({ ...newItem, [field]: value })}
          onSave={saveNewItem}
          onCancel={cancelAddItem}
          isNew
        />
      )}

      <ul className="flex flex-col gap-2">
        {list.map(feature => {
          const isEditing = editingId === feature.id
          return (
            <div key={feature.id} className="flex flex-col gap-2">
              {!isEditing ? (
                <FeatureCard
                  name={feature.name}
                  description={feature.description ?? ''}
                  level={feature.level_required ?? 0}
                  onEdit={() => startEditItem(feature.id)}
                />
              ) : (
                <EditableFeatureItem
                  feature={feature}
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

export default CharacterFeaturesSection
