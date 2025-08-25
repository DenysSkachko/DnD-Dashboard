'use client'

import React, { useState } from 'react'
import ActionButton from '@/ui/ActionButtonFight'
import { HeartPulse } from 'lucide-react'

interface Props {
  myParticipant: {
    current_hp: number
    max_hp: number
  }
  onSave: (v: number | '') => void
}

export default function PlayerFooter({ myParticipant, onSave }: Props) {
  const [hpInput, setHpInput] = useState<number | ''>(myParticipant.current_hp)
  const hpPercent = hpInput !== '' ? hpInput / myParticipant.max_hp : 1

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
      {/* HP Input + Save Button */}
      <div className="flex flex-1 max-w-md gap-4">
        {/* HP Input */}
        <div
          className="flex-1 relative flex items-center
               bg-gradient-to-br from-red-950/90 via-black/80 to-stone-900/80
               rounded-l-2xl border border-red-600/30
               shadow-[0_0_25px_rgba(255,0,0,0.3)]
               backdrop-blur-md
               transition-all duration-300 ease-in-out pl-6"
        >
          <div
            className="flex items-center gap-2 text-red-500 font-bold text-2xl 
                        drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse-fast"
          >
            <HeartPulse className="w-7 h-7" />
          </div>
          <input
            type="number"
            value={hpInput}
            onChange={e => setHpInput(e.target.value === '' ? '' : Number(e.target.value))}
            className={`w-full pl-2 rounded-l-2xl text-2xl font-extrabold outline-none
                  bg-transparent border-none text-red-200
                  placeholder:text-red-400
                  transition-all duration-300 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none`}
            placeholder="0"
          />
        </div>

        {/* Save Button */}
        <ActionButton
          type="save"
          onClick={() => {
            if (hpInput !== '') onSave(hpInput)
          }}
        />
      </div>
    </footer>
  )
}
