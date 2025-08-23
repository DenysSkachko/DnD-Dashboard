'use client'

import React, { useState } from 'react'
import Input from '@/ui/Input'
import ActionButton from '@/ui/ActionButton'

interface Props {
  myParticipant: {
    current_hp: number
    max_hp: number
  }
  onSave: (v: number | '') => void
}

export default function PlayerFooter({ myParticipant, onSave }: Props) {
  const [hpInput, setHpInput] = useState<number | ''>(myParticipant.current_hp)

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-dark p-4 border-t border-stone-700 flex items-center justify-center gap-2 text-light">
      <Input
        label="HP"
        type="number"
        value={hpInput}
        onChange={e => setHpInput(e.target.value === '' ? '' : Number(e.target.value))}
        className="w-20"
      />
      <span className="text-stone-400">/ {myParticipant.max_hp}</span>
      <ActionButton
        type="save"
        onClick={() => {
          if (hpInput !== '') onSave(hpInput)
        }}
      />
    </footer>
  )
}
