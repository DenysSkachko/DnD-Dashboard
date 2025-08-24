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

      <ul className="flex flex-col gap-2">
        {localList.map((s, idx) => {
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
