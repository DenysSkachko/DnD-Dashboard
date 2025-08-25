'use client'

import Input from '@/ui/Input'
import Select from '@/ui/Select'
import ActionButton from '@/ui/ActionButton'
import { type CharacterFeature } from '@/queries/characterFeaturesQueries'

const levelOptions = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

interface FeatureFormProps {
  feature: Partial<CharacterFeature>
  onChange: (field: keyof CharacterFeature, value: any) => void
  onSave: () => void
  onCancel: () => void
  onDelete?: () => void
  isNew?: boolean
}

const FeatureForm = ({ feature, onChange, onSave, onCancel, onDelete, isNew }: FeatureFormProps) => {
  return (
    <div className="flex flex-col gap-2">
      <Input
        label="Название"
        value={feature.name || ''}
        onChange={e => onChange('name', e.target.value)}
      />
      <Select
        label="Уровень"
        value={String(feature.level_required ?? 0)}
        options={levelOptions}
        onChange={val => onChange('level_required', Number(val))}
      />
      <Input
        label="Описание"
        value={feature.description || ''}
        onChange={e => onChange('description', e.target.value)}
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

export default FeatureForm
