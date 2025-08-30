'use client'

import React, { useState } from 'react'
import ActionButton from '@/ui/ActionButtonFight'
import { HeartPulse, ShieldPlus } from 'lucide-react'

interface Props {
  myParticipant: {
    current_hp: number
    max_hp: number
    temp_hp: number
  }
  onSave: (values: { hp: number | ''; temp: number | '' }) => void
}

export default function PlayerFooter({ myParticipant, onSave }: Props) {
  const [hpInput, setHpInput] = useState<number | ''>(myParticipant?.current_hp ?? '')
  const [tempInput, setTempInput] = useState<number | ''>(myParticipant?.temp_hp ?? '')

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 flex md:flex-row items-center justify-between gap-4
        px-6 py-4 z-50
        bg-gradient-to-br from-red-950/90 via-black/80 to-stone-900/80
        border-t-4 border-red-600/40
        shadow-[0_-0_25px_rgba(255,0,0,0.5)]
        rounded-t-2xl
        backdrop-blur-md
        transition-all duration-300"
    >
      {/* Inputs + Save Button */}
      <div className="flex flex-1 max-w-xl gap-4">
        {/* HP Input */}
        <div
          className="flex-1 relative flex items-center
               bg-gradient-to-br from-red-950/90 via-black/80 to-stone-900/80
               rounded-2xl border border-red-600/30
               shadow-[0_0_25px_rgba(255,0,0,0.3)]
               backdrop-blur-md
               transition-all duration-300 ease-in-out pl-6 "
        >
          <HeartPulse className="w-6 h-6 text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse-fast" />
          <input
            type="number"
            value={hpInput}
            onChange={e => setHpInput(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full pl-2 rounded-2xl text-2xl font-extrabold outline-none
                       bg-transparent border-none text-red-200
                       placeholder:text-red-400
                       transition-all duration-300
                       appearance-none focus:text-red-600
                       [&::-webkit-inner-spin-button]:appearance-none
                       [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="0"
          />
        </div>

        {/* Temp HP Input */}
        <div
          className="flex-1 relative flex items-center gap-2
               bg-gradient-to-br from-yellow-700/90 via-yellow-800/80 to-yellow-900/80
               rounded-2xl border-none
               shadow-[0_0_25px_rgba(255,255,150,0.3)]
               backdrop-blur-md
               transition-all duration-300 ease-in-out pl-4 pr-2"
        >
          <ShieldPlus className="w-6 h-6 text-yellow-300 drop-shadow-[0_0_6px_rgba(255,255,150,0.9)]" />
          <input
            type="number"
            value={tempInput}
            onChange={e => setTempInput(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full pl-2 rounded-2xl text-xl font-bold outline-none
                       bg-transparent border-none text-yellow-200 focus:text-yellow-400
                       placeholder:text-yellow-400
                       transition-all duration-300
                       appearance-none
                       [&::-webkit-inner-spin-button]:appearance-none
                       [&::-webkit-outer-spin-button]:appearance-none"
            placeholder="0"
          />
        </div>

        {/* Save Button */}
        <ActionButton
          type="save"
          onClick={() => onSave({ hp: hpInput, temp: tempInput })}
        />
      </div>
    </footer>
  )
}
