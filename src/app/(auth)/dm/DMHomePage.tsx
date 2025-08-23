'use client'

import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'

type Character = {
  id: number
  account_id: number
  character_name: string
  race: string
  class: string
}

export default function DMHomePage() {
  const { data, isLoading, error } = useSupabaseQuery<Character[]>({
    key: ['characters'],
    table: 'characters',
    single: false, // возвращаем массив
  })

  if (isLoading) return <p>Loading characters...</p>
  if (error) return <p className="text-red-500">Error: {error.message}</p>

  // безопасно приводим к массиву объектов
  const characters: Character[] = Array.isArray(data) ? data.flat() : []

  return (
    <div className="space-y-4 bg-accent-hover">
      <h2 className="text-2xl font-bold">Welcome to Home Page 🎉</h2>
      <p>This is the main dashboard after login.</p>

      <h3 className="text-xl font-semibold">Characters:</h3>
      {characters.length > 0 ? (
        <ul className="space-y-2">
          {characters.map((char: Character) => (
            <li key={char.id} className="p-2 border rounded">
              <strong>{char.character_name}</strong> — {char.race} {char.class}
            </li>
          ))}
        </ul>
      ) : (
        <p>No characters found.</p>
      )}
    </div>
  )
}
