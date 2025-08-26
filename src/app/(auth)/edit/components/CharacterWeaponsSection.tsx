'use client'

import { useState } from 'react'
import {
  useCharacterWeapons,
  type CharacterWeapon,
} from '@/queries/characterWeaponsQueries'
import { useCharacterStats, type CharacterStat } from '@/queries/characterStatsQueries'
import FormTitle from '@/ui/FormTitle'
import ActionButton from '@/ui/ActionButton'
import WeaponCard from '@/ui/WeaponCard'
import WeaponForm from './forms/WeaponForm'
import { Loader } from '@/ui/Loader'

const diceOptions = ['d4', 'd6', 'd8', 'd10']

const EditableWeaponItem = ({
  weapon,
  statOptions,
  onSave,
  onDelete,
  onCancel,
}: {
  weapon: CharacterWeapon
  statOptions: string[]
  onSave: (id: number, updated: CharacterWeapon) => void | Promise<void>
  onDelete: (id: number) => void | Promise<void>
  onCancel: () => void
}) => {
  const [draft, setDraft] = useState<Partial<CharacterWeapon>>(weapon)

  const handleChange = (field: keyof CharacterWeapon, value: any) => {
    setDraft(prev => ({ ...prev, [field]: value }))
  }

  return (
    <WeaponForm
      weapon={draft}
      onChange={handleChange}
      onSave={() => onSave(weapon.id, draft as CharacterWeapon)}
      onDelete={() => onDelete(weapon.id)}
      onCancel={onCancel}
      isNew={false}
    />
  )
}

const CharacterWeaponsSection = () => {
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
  } = useCharacterWeapons()

  const { data: stats } = useCharacterStats()

  if (isLoading) return <Loader />

  const statOptions = stats
    ? Object.keys(stats).filter(
        k => k !== 'id' && k !== 'character_id' && k !== 'proficiency_bonus'
      )
    : []

  const calcDamageAndAttack = (w: CharacterWeapon) => {
    if (!w.damage_dice || !w.damage_stat || !stats) return { damage: '-', attack_bonus: 0 }
    const statValue = Number((stats as any)[w.damage_stat as keyof CharacterStat] || 0)
    const damageStr = `${w.damage_dice} + ${statValue}${
      w.extra_damage ? ` + ${w.extra_damage}` : ''
    }`
    const attackBonus =
      statValue +
      (w.use_proficiency ? Number((stats as any).proficiency_bonus || 0) : 0) +
      (w.extra_attack ?? 0)
    return { damage: damageStr, attack_bonus: attackBonus }
  }

  const handleNewItemChange = (field: keyof CharacterWeapon, value: any) => {
    setNewItem(prev => ({ ...prev, [field]: value }))
  }

  return (
    <>
      <div className="flex-center">
        <FormTitle>Оружие</FormTitle>
        <ActionButton type="add" onClick={startAddItem} />
      </div>

      {newItem && (
        <WeaponForm
          weapon={newItem}
          onChange={handleNewItemChange}
          onSave={saveNewItem}
          onCancel={cancelAddItem}
          isNew
        />
      )}

      <ul className="flex flex-col gap-2">
        {list.map(w => {
          const isEditing = editingId === w.id
          const { damage, attack_bonus } = calcDamageAndAttack(w)
          return (
            <div key={w.id} className="flex flex-col gap-2">
              {!isEditing ? (
                <WeaponCard
                  name={w.name}
                  damage={damage}
                  attack_bonus={attack_bonus}
                  onEdit={() => startEditItem(w.id)}
                />
              ) : (
                <EditableWeaponItem
                  weapon={w}
                  statOptions={statOptions}
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

export default CharacterWeaponsSection
