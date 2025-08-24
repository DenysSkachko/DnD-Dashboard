'use client'
import React from 'react'
import { Shield, HeartPulse, Zap } from 'lucide-react'
import ActionButton from '@/ui/ActionButton'

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
      <div className="flex flex-col px-6 py-3 bg-dark-hover rounded-2xl shadow-2xl items-center max-w-md flex-1">
        <div className="flex w-full justify-between">
          <span className="text-lg font-extrabold text-yellow-300 tracking-wide uppercase">
            {p.name}
          </span>
          <div className="flex items-center gap-2 text-yellow-300 font-semibold">
            <Zap className="w-5 h-5" />
            <span>{p.initiative}</span>
          </div>
        </div>

        {!p.is_enemy || isDM ? (
          <div className="flex justify-between items-center gap-2 mt-2 w-full">
            <div className="flex items-center gap-2 text-red-500 font-bold text-2xl">
              <HeartPulse className="w-5 h-5" />
              <span>
                {p.current_hp}/{p.max_hp}
              </span>
            </div>
            <div className="flex items-center gap-2 text-blue-400 font-semibold">
              <Shield className="w-5 h-5" />
              <span>{p.armor_class}</span>
            </div>
          </div>
        ) : (
          <span className="text-stone-400 italic text-sm"></span>
        )}
      </div>
      {isDM && p.is_enemy && (
        <div className="flex gap-2 mt-2">
          <ActionButton type="edit" onClick={onEditEnemy} />
          <ActionButton type="delete" onClick={onDeleteEnemy} />
        </div>
      )}
    </div>
  )
}
