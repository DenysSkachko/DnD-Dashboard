import {
  useCharacterInventory,
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
  type CharacterInventory,
} from '@/queries/characterInventoryQueries'
import Input from '@/ui/Input'
import FormTitle from '@/ui/FormTitle'
import ActionButton from '@/ui/ActionButton'
import InventoryCard from '@/ui/InventoryCard'
import { useEditableSection } from '@/hooks/useEditableSection'
import InventoryForm from './forms/InventoryForm'

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
    emptyItem: { item_name: '', quantity: null, description: '', gold: null },
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

  if (isLoading) return <p>Loading inventory...</p>

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
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <FormTitle>Инвентарь</FormTitle>
        <ActionButton type="add" onClick={startAdd} />
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
            <div key={idx} className="flex flex-col gap-2">
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
            </div>
          )
        })}
      </ul>
    </div>
  )
}

export default CharacterInventorySection
