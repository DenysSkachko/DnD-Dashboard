'use client'

import {
  useCharacterInventory,
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
  type CharacterInventory,
} from '@/queries/characterInventoryQueries'
import FormTitle from '@/ui/FormTitle'
import ActionButton from '@/ui/ActionButton'
import InventoryCard from '@/ui/InventoryCard'
import { useEditableSection } from '@/hooks/useEditableSection'
import InventoryForm from './InventoryForm'
import { useState, useEffect } from 'react'
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa'
import { Loader } from '@/ui/Loader'

const CharacterInventorySection = () => {
  const { data: inventory = [], isLoading } = useCharacterInventory()
  const createItem = useCreateInventoryItem()
  const updateItem = useUpdateInventoryItem()
  const deleteItem = useDeleteInventoryItem()

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
  } = useEditableSection<CharacterInventory>({
    data: inventory,
    emptyItem: { item_name: '', quantity: 0, description: '', gold: 0 },
    stripKeys: ['id', 'character_id'],
    createFn: item =>
      createItem.mutateAsync(item as Omit<CharacterInventory, 'id' | 'character_id'>),
    updateFn: (id, item) =>
      updateItem.mutateAsync({
        id,
        ...(item as Omit<CharacterInventory, 'id' | 'character_id'>),
      }),
    deleteFn: id => deleteItem.mutateAsync(id),
  })

  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  // Сортируем localList при изменении sortOrder
  useEffect(() => {
    setLocalList(prev =>
      [...prev].sort((a, b) => {
        const goldA = a.gold ?? 0
        const goldB = b.gold ?? 0
        return sortOrder === 'asc' ? goldA - goldB : goldB - goldA
      })
    )
  }, [sortOrder, setLocalList])

  if (isLoading) return <Loader />

  const handleAddNew = async () => {
    await addNew()
  }

  const handleSaveExisting = async (idx: number) => {
    await saveExisting(idx)
  }

  const handleDeleteExisting = async (idx: number) => {
    await deleteExisting(idx)
  }

  return (
    <div className="flex flex-col gap-3 p-6">
      <div className="flex justify-between items-center">
        <FormTitle>Инвентарь</FormTitle>
        <div className="flex items-center gap-2">
          <button
            className="w-11 h-11 bg-dark-hover text-3xl text-accent rounded-md flex items-center justify-center cursor-pointer"
            onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
            title="Сортировать по золоту"
          >
            {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
          </button>
          <ActionButton type="add" onClick={startAdd} />
        </div>
      </div>

      {newItem && (
        <InventoryForm
          item={newItem}
          onChange={(field, value) => setNewItem({ ...newItem, [field]: value })}
          onSave={handleAddNew}
          onCancel={cancelAdd}
        />
      )}

      <ul className="flex flex-col gap-2">
        {localList.map((item, idx) => {
          const isEditing = editingIdx === idx
          return (
            <li key={item.id ?? `temp-${idx}`} className="flex flex-col gap-2">
              {!isEditing ? (
                <InventoryCard
                  name={item.item_name}
                  quantity={item.quantity ?? 0}
                  gold={item.gold ?? 0}
                  description={item.description || ' '}
                  onEdit={() => setEditingIdx(idx)}
                />
              ) : (
                <InventoryForm
                  item={item}
                  onChange={(field, value) => {
                    const copy = [...localList]
                    copy[idx] = { ...item, [field]: value }
                    setLocalList(copy)
                  }}
                  onSave={() => handleSaveExisting(idx)}
                  onDelete={() => handleDeleteExisting(idx)}
                  onCancel={() => setEditingIdx(null)}
                />
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default CharacterInventorySection
