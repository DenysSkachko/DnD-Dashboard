'use client'

import { useState } from 'react'
import { Sword, Crosshair, Shield, BookOpen, Eye, Theater, Star } from 'lucide-react'
import type { CharacterSavingThrow } from '@/queries/characterSavingThrowsQueries'

type PlayerStatsProps = {
  stats: {
    strength?: number
    dexterity?: number
    constitution?: number
    intelligence?: number
    wisdom?: number
    charisma?: number
    proficiency_bonus?: number
  }
  savingThrows: CharacterSavingThrow | null
}

const ATTRIBUTES = [
  { key: 'strength', label: 'Сила', icon: Sword },
  { key: 'dexterity', label: 'Ловкость', icon: Crosshair },
  { key: 'constitution', label: 'Телосложение', icon: Shield },
  { key: 'intelligence', label: 'Интеллект', icon: BookOpen },
  { key: 'wisdom', label: 'Мудрость', icon: Eye },
  { key: 'charisma', label: 'Харизма', icon: Theater },
]

export default function PlayerStats({ stats, savingThrows }: PlayerStatsProps) {
  const [flippedKey, setFlippedKey] = useState<string | null>(null)

  const computeSavingThrow = (key: string) => {
    const base = (stats as any)[key] ?? 0
    const bonus = stats.proficiency_bonus ?? 0
    const trained = (savingThrows as any)?.[key] ?? false
    return trained ? base + bonus : base
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-4 px-5 pb-6">
        {ATTRIBUTES.map(({ key, label, icon: Icon }) => {
          const statValue = (stats as any)[key] ?? 0
          const savingValue = computeSavingThrow(key)
          const isFlipped = flippedKey === key

          return (
            <div
              key={key}
              className="relative w-full cursor-pointer"
              onClick={() => setFlippedKey(isFlipped ? null : key)}
              style={{ height: '84px' }} 
            >
              <div
                className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}
              >

                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-dark-hover border border-alt shadow-md backface-hidden p-2">
                  <div className="absolute -top-3 bg-dark border border-alt rounded-full p-1.5 shadow-md">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-3xl font-bold text-light mt-3">{statValue}</p>
                  <p className="text-[9px] text-text-alt uppercase tracking-wide text-center">
                    {label}
                  </p>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-lg bg-alt border border-alt shadow-md backface-hidden [transform:rotateY(180deg)] p-2">
                  <div className="absolute -top-3 bg-dark border border-alt rounded-full p-1.5 shadow-md">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <p className="text-3xl font-bold text-light mt-3">{savingValue}</p>
                  <p className="text-[9px] text-light uppercase tracking-wide text-center">
                    Спасбросок
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="px-5 pb-6">
        <div className="flex items-center justify-center gap-2 w-full bg-accent border border-alt rounded-md py-2 shadow-md">
          <Star className="w-4 h-4 text-dark" />
          <p className="text-sm uppercase tracking-wide text-dark">Бонус мастерства:</p>
          <span className="text-lg font-bold text-dark">{stats.proficiency_bonus ?? 0}</span>
        </div>
      </div>
    </>
  )
}
