'use client'

import { useState, useRef, useEffect } from 'react'
import { ShieldCheck, Zap, Gauge, Sparkles } from 'lucide-react'
import { useUpdateCharacterCombat } from '@/queries/characterCombatQueries'

type PlayerCombatProps = {
  combat: {
    id: number
    armor_class?: number | null
    speed?: number | null
    initiative?: number | null
    inspiration?: boolean | null
  }
}

export default function PlayerCombat({ combat }: PlayerCombatProps) {
  const updateCombat = useUpdateCharacterCombat()
  const [openBox, setOpenBox] = useState<'armor' | 'speed' | 'initiative' | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleToggleInspiration = () => {
    updateCombat.mutate({
      id: combat.id,
      inspiration: !combat.inspiration,
    })
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenBox(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const boxes = [
    { key: 'armor', label: 'Броня', value: combat.armor_class },
    { key: 'speed', label: 'Скорость', value: combat.speed },
    { key: 'initiative', label: 'Инициатива', value: combat.initiative },
  ] as const

  return (
    <div className="grid grid-cols-4 gap-3 px-5 pb-6" ref={containerRef}>
      {boxes.map(({ key, label, value }) => {
        const Icon = key === 'armor' ? ShieldCheck : key === 'speed' ? Gauge : Zap
        return (
          <div
            key={key}
            className="relative flex flex-col items-center justify-center bg-dark-hover border border-alt rounded-md p-2 shadow-sm cursor-pointer"
            onClick={() => setOpenBox(openBox === key ? null : key)}
          >
            <Icon
              className={`w-5 h-5 mb-1 ${
                key === 'armor'
                  ? 'text-blue-400'
                  : key === 'speed'
                  ? 'text-green-400'
                  : 'text-amber-400'
              }`}
            />
            <span className="text-sm font-bold text-stone-200">{value ?? '-'}</span>

            {openBox === key && (
              <div className="absolute top-full mt-1 flex bg-dark border border-alt rounded-md p-2 text-center text-[10px] text-text-alt shadow-md z-10">
                {label}: <span className="font-bold text-accent">{value ?? '-'}</span>
              </div>
            )}
          </div>
        )
      })}

      <div
        className={`flex flex-col items-center justify-center border rounded-md p-2 shadow-sm cursor-pointer transition-all duration-200
          ${
            combat.inspiration
              ? 'bg-yellow-400/20 border-yellow-400 shadow-[0_0_15px_3px_rgba(250,204,21,0.7)]'
              : 'bg-dark-hover border border-alt'
          }`}
        onClick={handleToggleInspiration}
      >
        <Sparkles
          className={`w-5 h-5 mb-1 ${
            combat.inspiration
              ? 'text-yellow-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.9)]'
              : 'text-purple-400'
          }`}
        />
        <span
          className={`text-sm font-bold ${
            combat.inspiration ? 'text-yellow-200' : 'text-stone-200'
          }`}
        >
          {combat.inspiration ? '✓' : '–'}
        </span>
      </div>
    </div>
  )
}
