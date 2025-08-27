// src/queries/characterNotions.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/lib/supabaseClient"

export type CharacterNotion = {
  id: number
  character_id: number
  name: string
  content: string
}

export const useCharacterNotions = (characterId: number) =>
  useQuery({
    queryKey: ["character_notions", characterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("character_notions")
        .select("*")
        .eq("character_id", characterId)
        .order("id")
      if (error) throw error
      return data as CharacterNotion[]
    },
  })

export const useCreateCharacterNotion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (notion: Omit<CharacterNotion, "id">) => {
      const { data, error } = await supabase
        .from("character_notions")
        .insert([notion])
        .select()
        .single()
      if (error) throw error
      return data as CharacterNotion
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["character_notions", data.character_id] })
    },
  })
}

export const useUpdateCharacterNotion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (notion: Pick<CharacterNotion, "id"> & Partial<CharacterNotion>) => {
      const { data, error } = await supabase
        .from("character_notions")
        .update(notion)
        .eq("id", notion.id)
        .select()
        .single()
      if (error) throw error
      return data as CharacterNotion
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["character_notions", data.character_id] })
    },
  })
}

export const useDeleteCharacterNotion = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, character_id }: { id: number; character_id: number }) => {
      const { error } = await supabase.from("character_notions").delete().eq("id", id)
      if (error) throw error
      return { id, character_id }
    },
    onSuccess: ({ character_id }) => {
      queryClient.invalidateQueries({ queryKey: ["character_notions", character_id] })
    },
  })
}
