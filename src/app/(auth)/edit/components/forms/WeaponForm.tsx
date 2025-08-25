'use client'

import Input from '@/ui/Input'
import Select from '@/ui/Select'
import Checkbox from '@/ui/Checkbox'
import ActionButton from '@/ui/ActionButton'
import { type CharacterWeapon } from '@/queries/characterWeaponsQueries'

const statOptions = ['str', 'dex', 'con', 'int', 'wis', 'cha']
const diceOptions = ['d4', 'd6', 'd8', 'd10', 'd12']

interface WeaponFormProps {
  weapon: Partial<CharacterWeapon>
  onChange: (field: keyof CharacterWeapon, value: any) => void
  onSave: () => void
  onCancel: () => void
  onDelete?: () => void
  isNew?: boolean
}

const WeaponForm = ({ weapon, onChange, onSave, onCancel, onDelete, isNew }: WeaponFormProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Input
        label="Название"
        value={weapon.name || ''}
        onChange={e => onChange('name', e.target.value)}
      />
      <Select
        label="Кубик"
        value={weapon.damage_dice || ''}
        options={diceOptions}
        onChange={val => onChange('damage_dice', val)}
      />
      <Select
        label="Аттрибут"
        value={weapon.damage_stat || ''}
        options={statOptions}
        onChange={val => onChange('damage_stat', val)}
      />
      <Input
        label="Доп. урон"
        type="number"
        value={weapon.extra_damage ?? ''}
        onChange={e =>
          onChange('extra_damage', e.target.value === '' ? null : Number(e.target.value))
        }
      />
      <Input
        label="Доп. бонус к атаке"
        type="number"
        value={weapon.extra_attack ?? ''}
        onChange={e =>
          onChange('extra_attack', e.target.value === '' ? null : Number(e.target.value))
        }
      />

      <Checkbox
        checked={weapon.use_proficiency || false}
        onChange={val => onChange('use_proficiency', val)}
        label="Бонус мастерства"
      />

      <div className="flex gap-2">
        <ActionButton type="save" onClick={onSave} />
        {isNew ? (
          <ActionButton type="cancel" onClick={onCancel} />
        ) : (
          <>
            <ActionButton type="delete" onClick={onDelete} />
            <ActionButton type="cancel" onClick={onCancel} />
          </>
        )}
      </div>
    </div>
  )
}

export default WeaponForm
