'use client'
import React from 'react'
import Input from '@/ui/Input'
import ActionButton from '@/ui/ActionButton'

interface Props {
  open: boolean
  value: number | ''
  initiativeBonus?: number
  onChange: (v: number | '') => void
  onClose: () => void
  onSave: () => void
}

export default function InitiativeModal({
  open,
  value,
  initiativeBonus,
  onChange,
  onClose,
  onSave,
}: Props) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6"
      onClick={onClose}
    >
      <div
        className="p-6 rounded-xl shadow-xl bg-dark w-full max-w-sm"
        onClick={e => e.stopPropagation()}
      >
        <Input
          label="Инициатива"
          type="number"
          value={value}
          onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        />

        {/* Сноска с бонусом */}
        {initiativeBonus !== undefined && (
          <div className="mt-2 text-sm text-text-alt flex justify-between">
            <span>Твой бонус к инициативе:</span>
            <span className="font-bold text-accent">{initiativeBonus}</span>
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <ActionButton type="save" onClick={onSave} />
          <ActionButton type="cancel" onClick={onClose} />
        </div>
      </div>
    </div>
  )
}
