'use client'
import React from 'react'
import Input from '@/ui/Input'
import ActionButton from '@/ui/ActionButton'

interface Props {
  open: boolean
  onClose: () => void
  formState: [any, React.Dispatch<any>]
  onSave: () => void
  editingEnemy: any | null
}

export default function EnemyFormModal({ open, onClose, formState, onSave, editingEnemy }: Props) {
  const [form, setForm] = formState
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-dark text-light p-6 rounded-xl shadow-xl w-96">
        <h3 className="mb-4">{editingEnemy ? 'Редактировать врага' : 'Добавить врага'}</h3>
        <div className="space-y-2">
          <Input
            label="Имя"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="AC"
            type="number"
            value={form.ac}
            onChange={e =>
              setForm({ ...form, ac: e.target.value === '' ? '' : Number(e.target.value) })
            }
          />
          <Input
            label="Текущие HP"
            type="number"
            value={form.currentHp}
            onChange={e =>
              setForm({ ...form, currentHp: e.target.value === '' ? '' : Number(e.target.value) })
            }
          />
          <Input
            label="Максимум HP"
            type="number"
            value={form.maxHp}
            onChange={e =>
              setForm({ ...form, maxHp: e.target.value === '' ? '' : Number(e.target.value) })
            }
          />
          <Input
            label="Инициатива"
            type="number"
            value={form.initiative}
            onChange={e =>
              setForm({ ...form, initiative: e.target.value === '' ? '' : Number(e.target.value) })
            }
          />
        </div>
        <div className="flex gap-2 mt-4">
          <ActionButton type="save" onClick={onSave} />
          <ActionButton type="cancel" onClick={onClose} />
        </div>
      </div>
    </div>
  )
}
