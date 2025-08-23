'use client'
import React from 'react'

interface Props {
  enemies: any[]
  onEnemyClick: (e: any) => void
}

export default function DMFooter({ enemies, onEnemyClick }: Props) {
  if (!enemies || enemies.length === 0) return null
  return (
    <footer className="fixed bottom-0 left-0 right-0 p-2 bg-dark-hover flex gap-2 overflow-x-auto z-50">
      {enemies.map(enemy => (
        <button
          key={enemy.id}
          onClick={() => onEnemyClick(enemy)}
          className="px-3 py-1 rounded hover:bg-accent-hover cursor-pointer"
        >
          {enemy.name}
        </button>
      ))}
    </footer>
  )
}
