import {
  useCharacterWeapons,
  useCreateWeapon,
  useUpdateWeapon,
  useDeleteWeapon,
  type CharacterWeapon,
} from '@/queries/characterWeaponsQueries'
import { useCharacterStats, type CharacterStat } from '@/queries/characterStatsQueries'
import FormTitle from '@/ui/FormTitle'
import ActionButton from '@/ui/ActionButton'
import WeaponCard from '@/ui/WeaponCard'
import { useEditableSection } from '@/hooks/useEditableSection'
import WeaponForm from './forms/WeaponForm'
import { Loader } from '@/ui/Loader'

const diceOptions = ['d4', 'd6', 'd8', 'd10']

const CharacterWeaponsSection = () => {
  const { data: weapons = [], isLoading } = useCharacterWeapons()
  const { data: stats } = useCharacterStats()
  const createWeapon = useCreateWeapon()
  const updateWeapon = useUpdateWeapon()
  const deleteWeapon = useDeleteWeapon()

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
  } = useEditableSection<CharacterWeapon>({
    data: weapons,
    emptyItem: {
      name: '',
      damage_dice: '',
      damage_stat: '',
      extra_damage: null,
      use_proficiency: false,
    },
    stripKeys: ['id', 'character_id'],
    createFn: (item) =>
      createWeapon.mutateAsync(
        item as Omit<CharacterWeapon, 'id' | 'character_id' | 'attack_bonus' | 'damage'>
      ),
    updateFn: (id, item) =>
      updateWeapon.mutateAsync({
        id,
        ...(item as Omit<CharacterWeapon, 'id' | 'character_id' | 'attack_bonus' | 'damage'>),
      }),
    deleteFn: (id) => deleteWeapon.mutateAsync(id),
  })

  if (isLoading) return <Loader />

  const statOptions = stats
    ? Object.keys(stats).filter(
        (k) => k !== 'id' && k !== 'character_id' && k !== 'proficiency_bonus'
      )
    : []

  const calcDamageAndAttack = (
    w: Omit<CharacterWeapon, 'id' | 'character_id' | 'attack_bonus' | 'damage'>
  ) => {
    if (!w.damage_dice || !w.damage_stat) return { damage: '-', attack_bonus: 0 }
    const statValue = Number((stats as any)[w.damage_stat as keyof CharacterStat] || 0)
    const damageStr = `${w.damage_dice} + ${statValue}${
      w.extra_damage ? ` + ${w.extra_damage}` : ''
    }`
    const attackBonus =
      statValue + (w.use_proficiency ? Number((stats as any).proficiency_bonus || 0) : 0)
    return { damage: damageStr, attack_bonus: attackBonus }
  }

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
        <FormTitle>Оружие</FormTitle>
        <ActionButton type="add" onClick={startAdd} />
      </div>

      {newItem && (
        <WeaponForm
          weapon={newItem}
          statOptions={statOptions}
          diceOptions={diceOptions}
          onChange={(w) => setNewItem(w)}
          onSave={handleAddNew}
          onCancel={cancelAdd}
          isNew
        />
      )}

      <ul className="flex flex-col gap-2">
        {localList.map((w, idx) => {
          const isEditing = editingIdx === idx
          const { damage, attack_bonus } = calcDamageAndAttack(w as any)
          return (
            <div key={idx} className="flex flex-col gap-2">
              {!isEditing ? (
                <WeaponCard
                  name={w.name}
                  damage={damage}
                  attack_bonus={attack_bonus}
                  onEdit={() => setEditingIdx(idx)}
                />
              ) : (
                <WeaponForm
                  weapon={w}
                  statOptions={statOptions}
                  diceOptions={diceOptions}
                  onChange={(newW) => {
                    const copy = [...localList]
                    copy[idx] = newW
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

export default CharacterWeaponsSection
