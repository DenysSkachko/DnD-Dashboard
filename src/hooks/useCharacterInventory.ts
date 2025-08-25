import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"
import { useAccount } from "@/context/AccountContext"

export type CharacterInventory = {
  id: number
  character_id: number
  item_name: string
  quantity: number | null
  description: string | null
  gold: number | null
}

export const useCharacterInventory = () => {
  const { account } = useAccount()
  const queryClient = useQueryClient()

  // ---- react-query загрузка ----
  const { data: inventory = [], isLoading } = useQuery({
    queryKey: ["character_inventory", account?.id],
    queryFn: async (): Promise<CharacterInventory[]> => {
      if (!account) throw new Error("Нет аккаунта")
      const { data, error } = await supabase
        .from("character_inventory")
        .select("*")
        .eq("character_id", account.id)
      if (error) throw error
      return data
    },
    enabled: !!account,
  })

  // ---- локальные состояния ----
  const [newItem, setNewItem] = useState<Partial<CharacterInventory> | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  // ---- CRUD мутации ----
  const createMutation = useMutation({
    mutationFn: async (item: Omit<CharacterInventory, "id" | "character_id">) => {
      if (!account) throw new Error("Нет аккаунта")
      const { data, error } = await supabase
        .from("character_inventory")
        .insert([{ ...item, character_id: account.id }])
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["character_inventory", account?.id] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (item: Partial<CharacterInventory> & { id: number }) => {
      const { data, error } = await supabase
        .from("character_inventory")
        .update(item)
        .eq("id", item.id)
        .select()
        .single()
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["character_inventory", account?.id] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase.from("character_inventory").delete().eq("id", id)
      if (error) throw error
      return id
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["character_inventory", account?.id] })
    },
  })

  // ---- функции управления ----
  const startAddItem = () =>
    setNewItem({ item_name: "", quantity: null, description: "", gold: null })
  const cancelAddItem = () => setNewItem(null)

  const saveNewItem = async () => {
    if (!newItem) return
    await createMutation.mutateAsync(newItem as Omit<CharacterInventory, "id" | "character_id">)
    setNewItem(null)
  }

  const startEditItem = (id: number) => setEditingId(id)
  const cancelEditItem = () => setEditingId(null)

  const saveEditItem = async (id: number, updated: Partial<CharacterInventory>) => {
    await updateMutation.mutateAsync({ id, ...updated })
    setEditingId(null)
  }

  const deleteItem = async (id: number) => {
    await deleteMutation.mutateAsync(id)
    setEditingId(null)
  }

  const toggleSortOrder = () =>
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))

  const sortedList = [...inventory].sort((a, b) => {
    const goldA = a.gold ?? 0
    const goldB = b.gold ?? 0
    return sortOrder === "asc" ? goldA - goldB : goldB - goldA
  })

  return {
    isLoading,
    localList: sortedList,
    newItem,
    editingId,
    sortOrder,

    // методы
    setNewItem,
    startAddItem,
    cancelAddItem,
    saveNewItem,
    startEditItem,
    cancelEditItem,
    saveEditItem,
    deleteItem,
    toggleSortOrder,
  }
}
