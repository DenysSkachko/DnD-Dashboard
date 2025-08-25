'use client'

import { useEffect } from 'react'
import {
  useCharacterFeatures,
  useCreateCharacterFeature,
  useUpdateCharacterFeature,
  useDeleteCharacterFeature,
  type CharacterFeature,
} from '@/queries/characterFeaturesQueries'
import FormTitle from '@/ui/FormTitle'
import ActionButton from '@/ui/ActionButton'
import FeatureCard from '@/ui/FeatureCard'
import { useEditableSection } from '@/hooks/useEditableSection'
import FeatureForm from './forms/FeatureForm'
import { Loader } from '@/ui/Loader'

const CharacterFeaturesSection = () => {
  const { data: features = [], isLoading, refetch } = useCharacterFeatures()
  const createFeature = useCreateCharacterFeature()
  const updateFeature = useUpdateCharacterFeature()
  const deleteFeature = useDeleteCharacterFeature()

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
  } = useEditableSection<CharacterFeature>({
    data: features,
    emptyItem: { name: '', description: '', level_required: 0 },
    stripKeys: ['id', 'character_id'],
    createFn: item =>
      createFeature.mutateAsync(item as Omit<CharacterFeature, 'id' | 'character_id'>),
    updateFn: (id, item) =>
      updateFeature.mutateAsync({ id, ...(item as Omit<CharacterFeature, 'id' | 'character_id'>) }),
    deleteFn: id => deleteFeature.mutateAsync(id),
  })

  useEffect(() => {
    setLocalList(prev =>
      [...prev].sort((a, b) => (a.level_required ?? 0) - (b.level_required ?? 0))
    )
  }, [features, setLocalList])

  if (isLoading) return <Loader />

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
        <FormTitle>Особенности</FormTitle>
        <ActionButton type="add" onClick={startAdd} />
      </div>

      {newItem && (
        <FeatureForm
          feature={newItem}
          onChange={setNewItem}
          onSave={handleAddNew}
          onCancel={cancelAdd}
          isNew
        />
      )}

      <ul className="flex flex-col gap-2">
        {localList.map((f, idx) => {
          const isEditing = editingIdx === idx
          return (
            <div key={idx} className="flex flex-col gap-2">
              {!isEditing ? (
                <FeatureCard
                  name={f.name}
                  description={f.description ?? ''}
                  level={f.level_required ?? 0}
                  onEdit={() => setEditingIdx(idx)}
                />
              ) : (
                <FeatureForm
                  feature={f}
                  onChange={updated => {
                    const copy = [...localList]
                    copy[idx] = updated as CharacterFeature
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

export default CharacterFeaturesSection
