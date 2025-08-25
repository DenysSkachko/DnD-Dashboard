'use client'
import React from 'react'
import InputFight from '@/ui/InputFight'
import ActionButton from '@/ui/ActionButtonFight'

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
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6"
      onClick={onClose}
    >
      <div
        className="flex flex-col gap-4 p-6 rounded-2xl
          bg-gradient-to-br from-red-900 via-red-800 to-red-950
          shadow-[0_0_25px_rgba(255,0,0,0.3)]
          max-w-md w-full"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-extrabold text-light uppercase tracking-widest
          drop-shadow-[0_0_6px_rgba(239,68,68,0.8)] text-center">
          {editingEnemy ? 'Редактировать врага' : 'Добавить врага'}
        </h3>

        <div className="flex flex-col gap-3">
          <InputFight
            label="Имя"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <InputFight
            label="AC"
            type="number"
            value={form.ac}
            onChange={e => setForm({ ...form, ac: e.target.value === '' ? '' : Number(e.target.value) })}
          />
          <InputFight
            label="Текущие HP"
            type="number"
            value={form.currentHp}
            onChange={e => setForm({ ...form, currentHp: e.target.value === '' ? '' : Number(e.target.value) })}
          />
          <InputFight
            label="Максимум HP"
            type="number"
            value={form.maxHp}
            onChange={e => setForm({ ...form, maxHp: e.target.value === '' ? '' : Number(e.target.value) })}
          />
          <InputFight
            label="Инициатива"
            type="number"
            value={form.initiative}
            onChange={e => setForm({ ...form, initiative: e.target.value === '' ? '' : Number(e.target.value) })}
          />
        </div>

        <div className="flex gap-4 justify-center mt-2">
          <ActionButton type="save" onClick={onSave} />
          <ActionButton type="cancel" onClick={onClose} />
        </div>
      </div>
    </div>
  )
}
