import Input from '@/ui/Input'
import Select from '@/ui/Select'
import Checkbox from '@/ui/Checkbox'
import ActionButton from '@/ui/ActionButton'
import { type CharacterSpell } from '@/queries/characterSpellsQueries'

const levelOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const actionOptions = ['main', 'bonus']

interface SpellFormProps {
  spell: Partial<CharacterSpell>
  onChange: (spell: Partial<CharacterSpell>) => void
  onSave: () => void
  onCancel: () => void
  onDelete?: () => void
  isNew?: boolean
}

const SpellForm = ({ spell, onChange, onSave, onCancel, onDelete, isNew }: SpellFormProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Input
        label="Название"
        value={spell.name || ''}
        onChange={e => onChange({ ...spell, name: e.target.value })}
      />
      <Select
        label="Уровень"
        value={String(spell.level || 0)}
        options={levelOptions}
        onChange={val => onChange({ ...spell, level: Number(val) })}
      />
      <Select
        label="Действие"
        value={spell.action || 'main'}
        options={actionOptions}
        onChange={val => onChange({ ...spell, action: val as 'main' | 'bonus' })}
      />
      <Input
        label="Расстояние"
        value={spell.range || ''}
        onChange={e => onChange({ ...spell, range: e.target.value })}
      />
      <Input
        label="Длительность"
        value={spell.duration || ''}
        onChange={e => onChange({ ...spell, duration: e.target.value })}
      />
      <Input
        label="Описание"
        value={spell.description || ''}
        onChange={e => onChange({ ...spell, description: e.target.value })}
      />
      <Checkbox
        checked={spell.concentration || false}
        onChange={val => onChange({ ...spell, concentration: val })}
        label="Концентрация"
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

export default SpellForm
