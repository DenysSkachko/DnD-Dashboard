'use client'

import { useSupabaseQuery } from '@/hooks/useSupabaseQuery'
import FormTitle from '@/ui/FormTitle'

type Character = {
  id: number
  account_id: number
  character_name: string
  race: string
  class: string
  avatar: string
}

export default function DMHomePage() {
  const { data, isLoading, error } = useSupabaseQuery<Character[]>({
    key: ['characters'],
    table: 'characters',
    single: false,
  })

  if (isLoading) return <p>Loading characters...</p>
  if (error) return <p className="text-red-500">Error: {error.message}</p>

  const characters: Character[] = Array.isArray(data) ? data.flat() : []

  console.log(characters)

  return (
    <div className="space-y-4 p-6 max-w-lg">
      <FormTitle>Список игроков</FormTitle>
      {characters.length > 0 ? (
        <ul className="space-y-2 ">
          {characters.map((char: Character) => (
            <li key={char.id} className="p-2 border border-alt rounded flex items-center gap-4">
              <img src={char.avatar} alt="" className="w-15 h-15 rounded-full" />
              <div>
                <strong>{char.character_name}</strong> —{' '}
                <span className="text-xs">{char.race}</span>,
                <span className="text-xs">{char.class}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No characters found.</p>
      )}
    </div>
  )
}
