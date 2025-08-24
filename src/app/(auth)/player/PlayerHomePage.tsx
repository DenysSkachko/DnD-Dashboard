'use client'

import { useAccount } from '@/context/AccountContext'
import { useCharacter } from '@/queries/characterQueries'
import { useCharacterStats } from '@/queries/characterStatsQueries'
import { useCharacterCombat } from '@/queries/characterCombatQueries'
import { useCharacterSkills } from '@/queries/characterSkillsQueries'
import { useCharacterSavingThrows } from '@/queries/characterSavingThrowsQueries'

import PlayerMain from './components/PlayerMain'
import PlayerHP from './components/PlayerHP'
import PlayerCombat from './components/PlayerCombat'
import PlayerStats from './components/PlayerStats'
import PlayerSkills from './components/PlayerSkills'
import { Loader } from '@/ui/Loader'

export default function PlayerHomePage() {
  const { account, hydrated } = useAccount()

  if (!hydrated) return <p>Loading account...</p>
  if (!account) return <p>No account found</p>

  const { data: character, isLoading: charLoading, error: charError } = useCharacter()
  const { data: stats, isLoading: statsLoading } = useCharacterStats()
  const { data: combat, isLoading: combatLoading } = useCharacterCombat()
  const { data: skills, isLoading: skillsLoading } = useCharacterSkills()
  const { data: savingThrows, isLoading: savingLoading } = useCharacterSavingThrows()

  if (charLoading || statsLoading || combatLoading || skillsLoading || savingLoading) {
    return (
      <Loader />
    )
  }

  if (charError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Ошибка: {charError.message}</p>
      </div>
    )
  }

  if (!character || !stats || !combat || !skills) {
    return (
      <div className="max-w-md mx-auto mt-10 p-5 border border-alt bg-alt rounded-md text-center text-stone-200 shadow-md">
        <p className="mb-2">{!character && 'Персонаж не найден.'}</p>
        <p className="mb-2">{!stats && 'Характеристики персонажа не найдены.'}</p>
        <p className="mb-2">{!combat && 'Боевая информация не найдена.'}</p>
        <p className="mb-5">{!skills && 'Навыки персонажа не найдены.'}</p>
        <p className="text-sm text-stone-400">
          Зайдите на страницу редактирования персонажа и добавьте данные о персонаже.
        </p>
      </div>
    )
  }

  const safeCombat = {
    id: combat.id,
    current_hp: combat.current_hp ?? 0,
    max_hp: combat.max_hp ?? 0,
    armor_class: combat.armor_class ?? 0,
    speed: combat.speed ?? 0,
    initiative: combat.initiative ?? 0,
    inspiration: combat.inspiration ?? false,
  }

  const safeStats = {
    strength: stats.strength ?? undefined,
    dexterity: stats.dexterity ?? undefined,
    constitution: stats.constitution ?? undefined,
    intelligence: stats.intelligence ?? undefined,
    wisdom: stats.wisdom ?? undefined,
    charisma: stats.charisma ?? undefined,
    proficiency_bonus: stats.proficiency_bonus ?? undefined,
  }

  return (
    <div className="relative w-full max-w-md mx-auto overflow-hidden">
      <PlayerMain character={character} />
      <PlayerHP combat={safeCombat} />
      <PlayerCombat combat={safeCombat} />
      <PlayerStats stats={safeStats} savingThrows={savingThrows ?? null} />
      <PlayerSkills stats={safeStats} skills={skills} />
    </div>
  )
}
