'use client'

// src/components/CharacterNotions.tsx
import { useEffect, useRef } from "react"
import {
  useCharacterNotions,
  useCreateCharacterNotion,
  useUpdateCharacterNotion,
  useDeleteCharacterNotion,
} from "@/queries/characterNotionsQueries"
import { supabase } from "@/lib/supabaseClient"
import { useQueryClient } from "@tanstack/react-query"

type Props = { characterId: number }

const CharacterNotions = ({ characterId }: Props) => {
  const { data: notions, isLoading } = useCharacterNotions(characterId)
  const createMutation = useCreateCharacterNotion()
  const updateMutation = useUpdateCharacterNotion()
  const deleteMutation = useDeleteCharacterNotion()
  const queryClient = useQueryClient()

  const nameRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLInputElement>(null)

  // Подписка на realtime
  useEffect(() => {
    const channel = supabase
      .channel("character_notions_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "character_notions" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["character_notions", characterId] })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [characterId, queryClient])

  if (isLoading) return <div>Loading...</div>

  const handleAdd = () => {
    const name = nameRef.current?.value.trim()
    const content = contentRef.current?.value.trim()
    if (!name) return
    createMutation.mutate({ character_id: characterId, name, content: content ?? "" })
    if (nameRef.current) nameRef.current.value = ""
    if (contentRef.current) contentRef.current.value = ""
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold">Заметки</h2>

      <div className="flex gap-2">
        <input ref={nameRef} className="border px-2 py-1" placeholder="Название" />
        <input ref={contentRef} className="border px-2 py-1" placeholder="Содержимое" />
        <button
          className="bg-blue-500 text-white px-3 py-1 rounded"
          onClick={handleAdd}
        >
          Добавить
        </button>
      </div>

      <ul className="flex flex-col gap-2">
        {notions?.map((notion) => (
          <li key={notion.id} className="border p-2 rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{notion.name}</div>
              <div className="text-sm text-gray-600">{notion.content}</div>
            </div>
            <div className="flex gap-2">
              <button
                className="text-blue-500"
                onClick={() =>
                  updateMutation.mutate({ id: notion.id, name: notion.name + " ✏️" })
                }
              >
                Изменить
              </button>
              <button
                className="text-red-500"
                onClick={() =>
                  deleteMutation.mutate({ id: notion.id, character_id: notion.character_id })
                }
              >
                Удалить
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CharacterNotions
