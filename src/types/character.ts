export type Character = {
  id: number
  account_id: number
  character_name: string
  race: string
  class: string
  avatar: string
}

export type CharacterCombat = {
  id: number
  character_id: number
  current_hp?: number | null
  max_hp?: number | null
  armor_class?: number | null
  speed?: number | null
  initiative?: number | null
  inspiration?: boolean | null
}

export type CharacterStat = {
  id: number
  character_id: number
  strength: number | null
  dexterity: number | null
  constitution: number | null
  intelligence: number | null
  wisdom: number | null
  charisma: number | null
  proficiency_bonus: number | null
}
