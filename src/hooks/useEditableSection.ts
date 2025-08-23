import { useCallback, useEffect, useRef, useState } from 'react'

type StripKey = 'id' | 'character_id' | 'account_id'

export type UseEditableSectionProps<T> = {
  data?: T | T[] | null
  isLoading?: boolean
  emptyItem: Partial<T>
  stripKeys?: (StripKey | keyof T)[]
  createFn?: (item: any) => Promise<any>
  updateFn?: (id: number, item: any) => Promise<any>
  deleteFn?: (id: number) => Promise<any>
}

export function useEditableSection<T>({
  data,
  emptyItem,
  stripKeys = ['id', 'character_id', 'account_id'],
  createFn,
  updateFn,
  deleteFn,
}: UseEditableSectionProps<T>) {
  const isList = Array.isArray(data)

  // 🔥 фикс: strip теперь useCallback, не пересоздаётся каждый рендер
  const strip = useCallback(
    (obj: any) => {
      if (!obj) return null
      const copy: any = { ...obj }
      for (const k of stripKeys) {
        if (k in copy) delete copy[k]
      }
      return copy
    },
    [stripKeys.join(',')] // либо [] если stripKeys всегда одинаков
  )

  // --- single ---
  const [editMode, setEditMode] = useState(false)
  const [localItem, setLocalItem] = useState<any | null>(null)

  // --- list ---
  const [localList, setLocalList] = useState<any[]>([])
  const [editingIdx, setEditingIdx] = useState<number | null>(null)
  const [newItem, setNewItem] = useState<any | null>(null)
  const originalListRef = useRef<T[]>([])

  // 🔥 фикс: зависимость только [data], strip стабилен
  useEffect(() => {
    if (Array.isArray(data)) {
      originalListRef.current = data

      const newList = data.map(strip) as T[]

      setLocalList((prev: T[]) => {
        if (JSON.stringify(prev) === JSON.stringify(newList)) return prev
        return newList
      })
    } else if (data) {
      const newItem = strip(data) as T

      setLocalItem((prev: T | null) => {
        if (JSON.stringify(prev) === JSON.stringify(newItem)) return prev
        return newItem
      })
    } else {
      setLocalItem(null)
      setLocalList([])
    }
  }, [data, strip])

  // -------- single helpers
  const handleChange = (key: any, value: any) => {
    setLocalItem((prev: any) => ({ ...(prev ?? {}), [key]: value }))
  }

  const saveSingle = async () => {
    if (!localItem) return
    const current = data as any
    if (current && typeof current === 'object' && 'id' in current && current.id != null) {
      if (updateFn) await updateFn(Number(current.id), localItem)
    } else {
      if (createFn) await createFn(localItem)
    }
    setEditMode(false)
  }

  const cancelSingle = () => {
    const current = data as any
    if (current) setLocalItem(strip(current))
    else setLocalItem({ ...(emptyItem as any) })
    setEditMode(false)
  }

  // -------- list helpers
  const startAdd = () => setNewItem({ ...(emptyItem as any) })
  const cancelAdd = () => setNewItem(null)

  const addNew = async () => {
    if (!newItem) return
    if (createFn) await createFn(newItem)
    setNewItem(null)
  }

  const saveExisting = async (idx: number) => {
    const orig: any = originalListRef.current[idx] as any
    if (!orig) return
    if (updateFn) await updateFn(Number(orig.id), localList[idx])
    setEditingIdx(null)
  }

  const deleteExisting = async (idx: number) => {
    const orig: any = originalListRef.current[idx] as any
    if (!orig) return
    if (deleteFn) await deleteFn(Number(orig.id))
    setEditingIdx(null)
  }

  const cancelEdit = (_idx?: number) => {
    if (Array.isArray(data)) setLocalList((data as T[]).map(strip) as any[])
    setEditingIdx(null)
  }

  return {
    isList,
    editMode,
    setEditMode,
    localItem,
    setLocalItem,
    handleChange,
    saveSingle,
    cancelSingle,
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
    cancelEdit,
  }
}
