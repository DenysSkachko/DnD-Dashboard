import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { useAccount } from '@/context/AccountContext'

export type CharacterWeapon = {
  id: number
  character_id: number
  name: string
  damage_dice: string
  damage_stat: string
  extra_damage: number | null
  extra_attack: number | null
  use_proficiency: boolean
}

export const useCharacterWeapons = () => {
  const { account } = useAccount()
  const queryClient = useQueryClient()

  // ---- загрузка ----
  const { data: weapons = [], isLoading } = useQuery({
    queryKey: ['character_weapons', account?.id],
    queryFn: async (): Promise<CharacterWeapon[]> => {
      if (!account) throw new Error('Нет аккаунта')
      const { data, error } = await supabase
        .from('character_weapons')
        .select('*')
        .eq('character_id', account.id)
      if (error) throw error
      return data
    },
    enabled: !!account,
  })

  // ---- локальные состояния ----
  const [newItem, setNewItem] = useState<Partial<CharacterWeapon> | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)

  // ---- CRUD ----
  const createMutation = useMutation({
    mutationFn: async (weapon: Omit<CharacterWeapon, 'id' | 'character_id'>) => {
      if (!account) throw new Error('Нет аккаунта')
      const { data, error } = await supabase
        .from('character_weapons')
        .insert([{ ...weapon, character_id: account.id }])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character_weapons', account?.id] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (weapon: Partial<CharacterWeapon> & { id: number }) => {
      const { data, error } = await supabase
        .from('character_weapons')
        .update(weapon)
        .eq('id', weapon.id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character_weapons', account?.id] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('character_weapons').delete().eq('id', id)
      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character_weapons', account?.id] })
    },
  })

  // ---- функции управления ----
  const startAddItem = () =>
    setNewItem({
      name: '',
      damage_dice: '',
      damage_stat: '',
      extra_damage: null,
      extra_attack: null,
      use_proficiency: false,
    })

  const cancelAddItem = () => setNewItem(null)

  const saveNewItem = async () => {
    if (!newItem) return
    await createMutation.mutateAsync(newItem as Omit<CharacterWeapon, 'id' | 'character_id'>)
    setNewItem(null)
  }

  const startEditItem = (id: number) => setEditingId(id)
  const cancelEditItem = () => setEditingId(null)

  const saveEditItem = async (id: number, updated: Partial<CharacterWeapon>) => {
    await updateMutation.mutateAsync({ id, ...updated })
    setEditingId(null)
  }

  const deleteItem = async (id: number) => {
    await deleteMutation.mutateAsync(id)
    setEditingId(null)
  }

  return {
    isLoading,
    list: weapons,
    newItem,
    editingId,

    // методы
    setNewItem,
    startAddItem,
    cancelAddItem,
    saveNewItem,
    startEditItem,
    cancelEditItem,
    saveEditItem,
    deleteItem,
  }
}
