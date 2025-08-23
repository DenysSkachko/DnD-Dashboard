import { useQuery, useMutation, useQueryClient, type UseQueryOptions } from '@tanstack/react-query'
import { supabase } from '@/lib/supabaseClient'

type QueryParams<T, S extends boolean = false> = {
  key: (string | number)[]
  table: string
  single?: S
  filters?: (q: any) => any
  options?: Omit<
    UseQueryOptions<S extends true ? T : T[], Error, S extends true ? T : T[]>,
    'queryKey' | 'queryFn'
  >
}

export function useSupabaseQuery<T, S extends boolean = false>({
  key,
  table,
  single,
  filters,
  options,
}: QueryParams<T, S>) {
  return useQuery<S extends true ? T : T[]>({
    queryKey: key,
    queryFn: async () => {
      let query: any = supabase.from(table).select('*')
      if (filters) query = filters(query)
      const { data, error } = single ? await query.single() : await query
      if (error) throw error
      return data as S extends true ? T : T[]
    },
    ...options,
  })
}

// --- универсальная мутация ---
type MutationParams<T> = {
  key: (string | number)[]
  table: string
  type: 'insert' | 'update' | 'delete'
  idKey?: string // можно указать другой ключ вместо "id"
  onSuccess?: () => void
}

export function useSupabaseMutation<T = any>({
  key,
  table,
  type,
  idKey = 'id',
  onSuccess,
}: MutationParams<T>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: any) => {
      if (type === 'insert') {
        const { data, error } = await supabase.from(table).insert(payload).select().single()
        if (error) throw error
        return data
      }
      if (type === 'update') {
        const { data, error } = await supabase
          .from(table)
          .update(payload)
          .eq(idKey, payload[idKey])
          .select()
          .single()
        if (error) throw error
        return data
      }
      if (type === 'delete') {
        const { error } = await supabase
          .from(table)
          .delete()
          .eq(idKey, payload[idKey] ?? payload)
        if (error) throw error
        return payload[idKey] ?? payload
      }
      throw new Error('Unknown mutation type')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: key })
      onSuccess?.()
    },
  })
}
