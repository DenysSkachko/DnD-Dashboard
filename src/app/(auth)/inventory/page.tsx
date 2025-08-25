'use client'

import { useState } from 'react'
import CharacterInventorySection from '../edit/components/CharacterInventorySections'
import { FaBoxOpen } from 'react-icons/fa'
import { GiBroadsword } from 'react-icons/gi'
import { Loader } from '@/ui/Loader'
import CharacterWeaponsSection from '../edit/components/CharacterWeaponsSection'

const InventoryPage = () => {
  const [tab, setTab] = useState<'inventory' | 'weapons'>('inventory')

  return (
    <div className="flex flex-col gap-3 p-6">
      <div className="flex gap-4">
        <button
          className={`flex-1 h-11 bg-dark-hover flex justify-center items-center rounded-md text-3xl font-bold uppercase ${
            tab === 'inventory' ? 'text-accent' : 'text-white'
          }`}
          onClick={() => setTab('inventory')}
        >
          <FaBoxOpen />
        </button>
        <button
          className={`flex-1 h-11 bg-dark-hover flex justify-center items-center rounded-md text-3xl font-bold uppercase ${
            tab === 'weapons' ? 'text-accent' : 'text-white'
          }`}
          onClick={() => setTab('weapons')}
        >
          <GiBroadsword />
        </button>
      </div>

      {tab === 'inventory' && <CharacterInventorySection />}
      {tab === 'weapons' && <CharacterWeaponsSection />}
    </div>
  )
}

export default InventoryPage
