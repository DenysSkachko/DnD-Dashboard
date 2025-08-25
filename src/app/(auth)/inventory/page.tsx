'use client'

import { useState, useEffect } from 'react'
import {
  useCharacterInventory,
  useCreateInventoryItem,
  useUpdateInventoryItem,
  useDeleteInventoryItem,
  type CharacterInventory,
} from '@/queries/characterInventoryQueries'
import { useCharacterWeapons, type CharacterWeapon } from '@/queries/characterWeaponsQueries'
import { useCharacterStats } from '@/queries/characterStatsQueries'
import FormTitle from '@/ui/FormTitle'
import ActionButton from '@/ui/ActionButton'
import InventoryCard from '@/ui/InventoryCard'
import WeaponCard from '@/ui/WeaponCard'
import InventoryForm from './InventoryForm'
import { useEditableSection } from '@/hooks/useEditableSection'
import { FaSortAmountDown, FaSortAmountUp, FaBoxOpen } from 'react-icons/fa'
import { GiBroadsword } from 'react-icons/gi'
import { Loader } from '@/ui/Loader'

const diceOptions = ['d4', 'd6', 'd8', 'd10']

const InventoryPage = () => {
  const [tab, setTab] = useState<'inventory' | 'weapons'>('inventory')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const { data: inventory = [], isLoading: isInventoryLoading } = useCharacterInventory()
  const createItem = useCreateInventoryItem()
  const updateItem = useUpdateInventoryItem()
  const deleteItem = useDeleteInventoryItem()

  const {
    localList,
    setLocalList,
    editingIdx,
    setEditingIdx,
    newItem,
    setNewItem,
    startAdd,
    cancelAdd,
    addNew,
    saveExisting,
    deleteExisting,
  } = useEditableSection<CharacterInventory>({
    data: inventory,
    emptyItem: { item_name: '', quantity: 0, description: '', gold: 0 },
    stripKeys: ['id', 'character_id'],
    createFn: item =>
      createItem.mutateAsync(item as Omit<CharacterInventory, 'id' | 'character_id'>),
    updateFn: (id, item) =>
      updateItem.mutateAsync({ id, ...(item as Omit<CharacterInventory, 'id' | 'character_id'>) }),
    deleteFn: id => deleteItem.mutateAsync(id),
  })

  useEffect(() => {
    setLocalList(prev =>
      [...prev].sort((a, b) => {
        const goldA = a.gold ?? 0
        const goldB = b.gold ?? 0
        return sortOrder === 'asc' ? goldA - goldB : goldB - goldA
      })
    )
  }, [sortOrder, setLocalList])

  const { data: weapons = [], isLoading: isWeaponsLoading } = useCharacterWeapons()
  const { data: stats } = useCharacterStats()

  const calcDamageAndAttack = (w: CharacterWeapon) => {
    if (!w.damage_dice || !w.damage_stat || !stats) return { damage: '-', attack_bonus: 0 }
    const statValue = Number((stats as any)[w.damage_stat] ?? 0)
    const damageStr = `${w.damage_dice} + ${statValue}${
      w.extra_damage ? ` + ${w.extra_damage}` : ''
    }`
    const attackBonus =
      statValue +
      (w.use_proficiency ? Number(stats.proficiency_bonus ?? 0) : 0) +
      (w.extra_attack ?? 0)
    return { damage: damageStr, attack_bonus: attackBonus }
  }

  if (isInventoryLoading || isWeaponsLoading) return <Loader />

  const handleAddNew = async () => await addNew()
  const handleSaveExisting = async (idx: number) => await saveExisting(idx)
  const handleDeleteExisting = async (idx: number) => await deleteExisting(idx)

  return (
    <div className="flex flex-col gap-3 p-6">
      
      <div className="flex gap-4">
        <button
          className={`flex-1 w-full h-11 bg-dark-hover text-accent flex justify-center items-center rounded-md px-4 py-1.5 text-3xl font-bold uppercase ${
            tab === 'inventory' ? 'text-accent' : 'text-white'
          }`}
          onClick={() => setTab('inventory')}
        >
          <FaBoxOpen />
        </button>
        <button
          className={`flex-1 w-full h-11 bg-dark-hover text-accent flex justify-center items-center rounded-md px-4 py-1.5 text-3xl font-bold uppercase ${
            tab === 'weapons' ? 'text-accent' : 'text-white'
          }`}
          onClick={() => setTab('weapons')}
        >
          <GiBroadsword />
        </button>
      </div>

      {tab === 'inventory' && (
        <>
          <div className="flex justify-between items-center mb-2">
            <FormTitle>Инвентарь</FormTitle>
            <div className="flex items-center gap-2">
              <button
                className="w-11 h-11 bg-dark-hover text-3xl text-accent rounded-md flex items-center justify-center cursor-pointer"
                onClick={() => setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
                title="Сортировать по золоту"
              >
                {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
              </button>
              <ActionButton type="add" onClick={startAdd} />
            </div>
          </div>

          {newItem && (
            <InventoryForm
              item={newItem}
              onChange={(field, value) => setNewItem({ ...newItem, [field]: value })}
              onSave={handleAddNew}
              onCancel={cancelAdd}
            />
          )}

          <ul className="flex flex-col gap-2">
            {localList.map((item, idx) => {
              const isEditing = editingIdx === idx
              return (
                <li key={item.id ?? `temp-${idx}`} className="flex flex-col gap-2">
                  {!isEditing ? (
                    <InventoryCard
                      name={item.item_name}
                      quantity={item.quantity ?? 0}
                      gold={item.gold ?? 0}
                      description={item.description || ' '}
                      onEdit={() => setEditingIdx(idx)}
                    />
                  ) : (
                    <InventoryForm
                      item={item}
                      onChange={(field, value) => {
                        const copy = [...localList]
                        copy[idx] = { ...item, [field]: value }
                        setLocalList(copy)
                      }}
                      onSave={() => handleSaveExisting(idx)}
                      onDelete={() => handleDeleteExisting(idx)}
                      onCancel={() => setEditingIdx(null)}
                    />
                  )}
                </li>
              )
            })}
          </ul>
        </>
      )}

      {tab === 'weapons' && (
        <>
          <FormTitle>Оружие</FormTitle>
          <ul className="flex flex-col gap-2">
            {weapons.map((w, idx) => {
              const { damage, attack_bonus } = calcDamageAndAttack(w)
              return (
                <li key={w.id ?? idx}>
                  <WeaponCard name={w.name} damage={damage} attack_bonus={attack_bonus} />
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}

export default InventoryPage
