'use client'
import React from 'react'
import Input from '@/ui/Input'
import ActionButton from '@/ui/ActionButton'

interface Props {
  open: boolean
  onClose: () => void
  value: number | ''
  onChange: (v: number | '') => void
  onSave: () => void
  enemy: any
}

export default function EnemyHpModal({ open, onClose, value, onChange, onSave, enemy }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-dark text-light p-6 rounded-xl shadow-xl w-80">
        <h3 className="mb-4">{enemy.name}</h3>
        <Input
          label="Текущие HP"
          type="number"
          value={value}
          onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />
        <div className="flex gap-2 mt-4">
          <ActionButton type="save" onClick={onSave} />
          <ActionButton type="cancel" onClick={onClose} />
        </div>
      </div>
    </div>
  )
}
