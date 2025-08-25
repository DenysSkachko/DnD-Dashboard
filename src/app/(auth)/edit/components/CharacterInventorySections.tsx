'use client'

import { useState } from 'react'
import { useCharacterInventory, type CharacterInventory } from '@/queries/characterInventoryQueries'
import FormTitle from '@/ui/FormTitle'
import ActionButton from '@/ui/ActionButton'
import InventoryCard from '@/ui/InventoryCard'
import InventoryForm from './forms/InventoryForm'
import { Loader } from '@/ui/Loader'

const EditableInventoryItem = ({
  item,
  onSave,
  onDelete,
  onCancel,
}: {
  item: CharacterInventory
  onSave: (id: number, updated: Partial<CharacterInventory>) => void | Promise<void>
  onDelete: (id: number) => void | Promise<void>
  onCancel: () => void
}) => {
  const [draft, setDraft] = useState(item)

  return (
    <InventoryForm
      item={draft}
      onChange={(field, value) => setDraft({ ...draft, [field]: value })}
      onSave={() => onSave(item.id, draft)}
      onDelete={() => onDelete(item.id)}
      onCancel={onCancel}
    />
  )
}

const CharacterInventorySection = () => {
  const {
    isLoading,
    list,
    newItem,
    editingId,
    startAddItem,
    cancelAddItem,
    setNewItem,
    saveNewItem,
    startEditItem,
    cancelEditItem,
    saveEditItem,
    deleteItem,
  } = useCharacterInventory()

  if (isLoading) return <Loader />

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <FormTitle>Инвентарь</FormTitle>
        <ActionButton type="add" onClick={startAddItem} />
      </div>

      {newItem && (
        <InventoryForm
          item={newItem}
          onChange={(field, value) => setNewItem({ ...newItem, [field]: value })}
          onSave={saveNewItem}
          onCancel={cancelAddItem}
        />
      )}

      <ul className="flex flex-col gap-2">
        {list.map((item) => {
          const isEditing = editingId === item.id
          return (
            <div key={item.id} className="flex flex-col gap-2">
              {!isEditing ? (
                <InventoryCard
                  name={item.item_name}
                  quantity={item.quantity ?? 0}
                  gold={item.gold ?? 0}
                  description={item.description || ' '}
                  onEdit={() => startEditItem(item.id)}
                />
              ) : (
                <EditableInventoryItem
                  item={item}
                  onSave={saveEditItem}
                  onDelete={deleteItem}
                  onCancel={cancelEditItem}
                />
              )}
            </div>
          )
        })}
      </ul>
    </div>
  )
}

export default CharacterInventorySection
