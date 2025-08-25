'use client'
import React from 'react'
import InputFight from '@/ui/InputFight'
import ActionButton from '@/ui/ActionButtonFight'

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
        className="flex flex-col gap-4 p-6 rounded-2xl
          bg-gradient-to-br from-red-900 via-red-800 to-red-950
          shadow-[0_0_25px_rgba(255,0,0,0.3)]
          max-w-sm w-full"
        onClick={e => e.stopPropagation()}
      >
        <h2 className="text-xl font-extrabold text-light uppercase tracking-widest
          drop-shadow-[0_0_6px_rgba(239,68,68,0.8)] text-center">
          Инициатива
        </h2>

        <InputFight
          type="number"
          value={value}
          onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          label="Инициатива"
        />

        {initiativeBonus !== undefined && (
          <div className="text-sm text-stone-300 flex justify-between px-2">
            <span>Бонус к инициативе:</span>
            <span className="font-bold text-red-400 drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]">
              {initiativeBonus >= 0 ? `+${initiativeBonus}` : initiativeBonus}
            </span>
          </div>
        )}

        <div className="flex gap-4 justify-center mt-2">
          <ActionButton type="save" onClick={() => value !== '' && onSave()} />
          <ActionButton type="cancel" onClick={onClose} />
        </div>
      </div>
    </div>
  )
}
