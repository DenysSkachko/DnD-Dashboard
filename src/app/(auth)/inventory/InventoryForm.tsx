import Input from '@/ui/Input'
import ActionButton from '@/ui/ActionButton'
import { type CharacterInventory } from '@/queries/characterInventoryQueries'

type Props = {
  item: CharacterInventory
  onChange: (field: keyof CharacterInventory, value: any) => void
  onSave: () => void
  onCancel: () => void
  onDelete?: () => void
}

const InventoryForm = ({ item, onChange, onSave, onCancel, onDelete }: Props) => {
  return (
    <div className="flex flex-col gap-2">
      <Input
        label="Название предмета"
        value={item.item_name}
        onChange={(e) => onChange('item_name', e.target.value)}
      />
      <Input
        type="number"
        label="Количество"
        value={item.quantity ?? ''}
        onChange={(e) =>
          onChange('quantity', e.target.value === '' ? null : Number(e.target.value))
        }
      />
      <Input
        type="number"
        label="Стоимость (Gold)"
        value={item.gold ?? ''}
        onChange={(e) =>
          onChange('gold', e.target.value === '' ? null : Number(e.target.value))
        }
      />
      <Input
        label="Описание"
        value={item.description || ''}
        onChange={(e) => onChange('description', e.target.value)}
      />
      <div className="flex gap-2">
        <ActionButton type="save" onClick={onSave} />
        {onDelete && <ActionButton type="delete" onClick={onDelete} />}
        <ActionButton type="cancel" onClick={onCancel} />
      </div>
    </div>
  )
}

export default InventoryForm
