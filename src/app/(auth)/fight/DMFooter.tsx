'use client'
import React from 'react'
import ActionButton from '@/ui/ActionButtonFight'

interface Props {
  enemies: any[]
  onEnemyClick: (e: any) => void
}

export default function DMFooter({ enemies, onEnemyClick }: Props) {
  if (!enemies || enemies.length === 0) return null

  return (
    <footer
      className="fixed bottom-0 left-0 right-0 flex gap-2 px-6 py-4
        overflow-x-auto z-50
        bg-gradient-to-br from-red-950/90 via-black/80 to-stone-900/80
        border-t-4 border-red-600/40
        shadow-[0_-0_25px_rgba(255,0,0,0.5)]
        rounded-t-2xl
        backdrop-blur-md
        transition-all duration-300"
    >
      {enemies.map(enemy => (
        <button
          key={enemy.id}
          onClick={() => onEnemyClick(enemy)}
          className="flex-shrink-0 px-6 py-3
            bg-gradient-to-br from-red-900 via-red-800 to-red-950
            text-light font-extrabold uppercase tracking-widest
            rounded-2xl border border-red-600/30
            shadow-[0_0_15px_rgba(255,0,0,0.5)]
            hover:shadow-[0_0_25px_rgba(255,50,50,0.7)]
            transition-all duration-300 cursor-pointer hover:scale-105"
        >
          {enemy.name}
        </button>
      ))}
    </footer>
  )
}
