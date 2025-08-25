'use client'
import React from 'react'
import { Shield, HeartPulse, Zap } from 'lucide-react'
import ActionButton from '@/ui/ActionButtonFight'

interface Props {
  participant: any
  isDM: boolean
  onEditEnemy?: () => void
  onDeleteEnemy?: () => void
}

export default function ParticipantItem({ participant, isDM, onEditEnemy, onDeleteEnemy }: Props) {
  const p = participant
  return (
    <div className="flex items-center gap-4">
      <div
        className="flex flex-col px-6 py-4 
          bg-gradient-to-br from-red-950/90 via-black/80 to-stone-900/80
          rounded-2xl border border-red-600/30 
          shadow-[0_0_25px_rgba(255,0,0,0.3)] 
          hover:shadow-[0_0_35px_rgba(255,50,50,0.5)] 
          hover:border-red-500/50
          transition-all duration-300 ease-in-out 
          items-center max-w-md flex-1
          backdrop-blur-md animate-pulse-slow"
      >
        {/* Имя и инициатива */}
        <div className="flex w-full justify-between items-center">
          <span className="text-xl font-extrabold text-light tracking-widest uppercase drop-shadow-[0_0_6px_rgba(239,68,68,0.8)]">
            {p.name}
          </span>
          <div className="flex items-center gap-2 text-yellow-300 font-semibold">
            <Zap className="w-5 h-5 animate-flicker" />
            <span className="text-lg">{p.initiative}</span>
          </div>
        </div>

        {/* HP + AC */}
        {!p.is_enemy || isDM ? (
          <div className="flex justify-between items-center gap-4 mt-3 w-full">
            <div className="flex items-center gap-2 text-red-500 font-bold text-2xl 
              drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse-fast">
              <HeartPulse className="w-6 h-6" />
              <span>
                {p.current_hp}/{p.max_hp}
              </span>
            </div>
            <div className="flex items-center gap-2 text-blue-400 font-bold 
              drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">
              <Shield className="w-6 h-6" />
              <span className="text-xl">{p.armor_class}</span>
            </div>
          </div>
        ) : ('')}
      </div>

      {/* Кнопки управления для ДМа */}
      {isDM && p.is_enemy && (
        <div className="flex gap-2 mt-2">
          <ActionButton type="edit" onClick={onEditEnemy} />
          <ActionButton type="delete" onClick={onDeleteEnemy} />
        </div>
      )}
    </div>
  )
}
