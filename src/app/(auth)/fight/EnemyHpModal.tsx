'use client'
import React from 'react'
import InputFight from '@/ui/InputFight'
import ActionButton from '@/ui/ActionButtonFight'

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
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-6"
      onClick={onClose}
    >
      <div
        className="flex flex-col gap-4 p-6 rounded-2xl
          bg-gradient-to-br from-red-900 via-red-800 to-red-950
          shadow-[0_0_25px_rgba(255,0,0,0.3)]
          max-w-sm w-full"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-xl font-extrabold text-light uppercase tracking-widest
          drop-shadow-[0_0_6px_rgba(239,68,68,0.8)] text-center">
          {enemy.name}
        </h3>

        <InputFight
          type="number"
          value={value}
          onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          label="Текущие HP"
        />

        <div className="flex gap-4 justify-center mt-2">
          <ActionButton type="save" onClick={() => value !== '' && onSave()} />
          <ActionButton type="cancel" onClick={onClose} />
        </div>
      </div>
    </div>
  )
}
