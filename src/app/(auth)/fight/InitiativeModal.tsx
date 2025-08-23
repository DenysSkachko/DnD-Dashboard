'use client'
import React from 'react'
import Input from '@/ui/Input'
import ActionButton from '@/ui/ActionButton'

interface Props {
  open: boolean
  value: number | ''
  onChange: (v: number | '') => void
  onClose: () => void
  onSave: () => void
}

export default function InitiativeModal({ open, value, onChange, onClose, onSave }: Props) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6"
      onClick={onClose}
    >
      <div className="p-6 rounded-xl shadow-xl bg-dark" onClick={e => e.stopPropagation()}>
        <Input
          label="Инициатива"
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
