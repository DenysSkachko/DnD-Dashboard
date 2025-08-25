import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'
import { useAccount } from '@/context/AccountContext'

export type CharacterSpell = {
  id: number
  character_id: number
  name: string
  level: number
  action: string | null
  range: string | null
  duration: string | null
  concentration: boolean | null
  description: string | null
}

export const useCharacterSpells = () => {
  const { account } = useAccount()
  const queryClient = useQueryClient()

  // ---- react-query загрузка ----
  const { data: spells = [], isLoading } = useQuery({
    queryKey: ['character_spells', account?.id],
    queryFn: async (): Promise<CharacterSpell[]> => {
      if (!account) throw new Error('Нет аккаунта')
      const { data, error } = await supabase
        .from('character_spells')
        .select('*')
        .eq('character_id', account.id)
      if (error) throw error
      return data
    },
    enabled: !!account,
  })

  // ---- локальные состояния ----
  const [newItem, setNewItem] = useState<Partial<CharacterSpell> | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null)

  // ---- CRUD ----
  const createMutation = useMutation({
    mutationFn: async (spell: Omit<CharacterSpell, 'id' | 'character_id'>) => {
      if (!account) throw new Error('Нет аккаунта')
      const { data, error } = await supabase
        .from('character_spells')
        .insert([{ ...spell, character_id: account.id }])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character_spells', account?.id] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (spell: Partial<CharacterSpell> & { id: number }) => {
      const { data, error } = await supabase
        .from('character_spells')
        .update(spell)
        .eq('id', spell.id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character_spells', account?.id] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from('character_spells').delete().eq('id', id)
      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['character_spells', account?.id] })
    },
  })

  // ---- функции управления ----
  const startAddItem = () =>
    setNewItem({
      name: '',
      level: 0,
      action: 'main',
      range: '',
      duration: '',
      concentration: false,
      description: '',
    })

  const cancelAddItem = () => setNewItem(null)

  const saveNewItem = async () => {
    if (!newItem) return
    await createMutation.mutateAsync(newItem as Omit<CharacterSpell, 'id' | 'character_id'>)
    setNewItem(null)
  }

  const startEditItem = (id: number) => setEditingId(id)
  const cancelEditItem = () => setEditingId(null)

  const saveEditItem = async (id: number, updated: Partial<CharacterSpell>) => {
    await updateMutation.mutateAsync({ id, ...updated })
    setEditingId(null)
  }

  const deleteItem = async (id: number) => {
    await deleteMutation.mutateAsync(id)
    setEditingId(null)
  }

  const toggleLevelFilter = (level: number | null) => setSelectedLevel(level)

  // ---- уровни ----
  const levelsFromSpells = Array.from(new Set(spells.map(s => s.level ?? 0)))
  const availableLevels = [null, ...levelsFromSpells.sort((a, b) => a - b)] // null = "Все"

  // ---- фильтрация ----
  const filteredList = spells
    .filter(s => (selectedLevel === null ? true : s.level === selectedLevel))
    .sort((a, b) => (a.level ?? 0) - (b.level ?? 0))

  return {
    isLoading,
    list: filteredList,
    newItem,
    editingId,
    selectedLevel,
    availableLevels,

    // методы
    setNewItem,
    startAddItem,
    cancelAddItem,
    saveNewItem,
    startEditItem,
    cancelEditItem,
    saveEditItem,
    deleteItem,
    toggleLevelFilter,
  }
}
