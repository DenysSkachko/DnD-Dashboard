import Input from '@/ui/Input'
import Select from '@/ui/Select'
import Checkbox from '@/ui/Checkbox'
import ActionButton from '@/ui/ActionButton'
import { type CharacterWeapon } from '@/queries/characterWeaponsQueries'

interface WeaponFormProps {
  weapon: CharacterWeapon | Omit<CharacterWeapon, 'id' | 'character_id' | 'attack_bonus' | 'damage'>
  statOptions: string[]
  diceOptions: string[]
  onChange: (w: any) => void
  onSave: () => void
  onCancel: () => void
  onDelete?: () => void
  isNew?: boolean
}

const WeaponForm = ({
  weapon,
  statOptions,
  diceOptions,
  onChange,
  onSave,
  onCancel,
  onDelete,
  isNew = false,
}: WeaponFormProps) => {
  return (
    <div className="flex flex-col gap-2 ">
      <Input
        label="Название"
        value={weapon.name}
        onChange={e => onChange({ ...weapon, name: e.target.value })}
      />
      <Select
        label="Кубик"
        value={weapon.damage_dice}
        options={diceOptions}
        onChange={val => onChange({ ...weapon, damage_dice: val })}
      />
      <Select
        label="Аттрибут"
        value={weapon.damage_stat}
        options={statOptions}
        onChange={val => onChange({ ...weapon, damage_stat: val })}
      />
      <Input
        label="Доп. урон"
        type="number"
        value={weapon.extra_damage ?? ''}
        onChange={e =>
          onChange({
            ...weapon,
            extra_damage: e.target.value === '' ? null : Number(e.target.value),
          })
        }
      />
      <Input
        label="Доп. бонус к атаке"
        type="number"
        value={weapon.extra_attack ?? ''}
        onChange={e =>
          onChange({
            ...weapon,
            extra_attack: e.target.value === '' ? null : Number(e.target.value),
          })
        }
      />

      <Checkbox
        checked={weapon.use_proficiency}
        onChange={val => onChange({ ...weapon, use_proficiency: val })}
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
