import {
  Dumbbell, // Атлетика
  Footprints, // Акробатика
  Hand, // Ловкость рук
  EyeOff, // Скрытность
  Landmark, // История
  Sparkles, // Магия
  Leaf, // Природа
  Search, // Анализ
  Church, // Религия
  Eye, // Внимательность
  Mountain, // Выживание
  Stethoscope, // Медицина
  Brain, // Проницательность
  PawPrint, // Уход за животными
  Music, // Выступление
  Skull, // Запугивание
  UserX, // Обман
  MessageCircle, // Убеждение
} from 'lucide-react'
import { type CharacterSkills } from '@/queries/characterSkillsQueries'

type PlayerSkillsProps = {
  stats: {
    strength?: number
    dexterity?: number
    constitution?: number
    intelligence?: number
    wisdom?: number
    charisma?: number
    proficiency_bonus?: number
  }
  skills: CharacterSkills | null
}

const skillsList = [
  { key: 'athletics', label: 'Атлетика', attr: 'strength', icon: Dumbbell },
  { key: 'acrobatics', label: 'Акробатика', attr: 'dexterity', icon: Footprints },
  { key: 'sleight_of_hand', label: 'Ловкость рук', attr: 'dexterity', icon: Hand },
  { key: 'stealth', label: 'Скрытность', attr: 'dexterity', icon: EyeOff },
  { key: 'history', label: 'История', attr: 'intelligence', icon: Landmark },
  { key: 'arcana', label: 'Магия', attr: 'intelligence', icon: Sparkles },
  { key: 'nature', label: 'Природа', attr: 'intelligence', icon: Leaf },
  { key: 'investigation', label: 'Анализ', attr: 'intelligence', icon: Search },
  { key: 'religion', label: 'Религия', attr: 'intelligence', icon: Church },
  { key: 'perception', label: 'Внимательность', attr: 'wisdom', icon: Eye },
  { key: 'survival', label: 'Выживание', attr: 'wisdom', icon: Mountain },
  { key: 'medicine', label: 'Медицина', attr: 'wisdom', icon: Stethoscope },
  { key: 'insight', label: 'Проницательность', attr: 'wisdom', icon: Brain },
  { key: 'animal_handling', label: 'Уход за животными', attr: 'wisdom', icon: PawPrint },
  { key: 'performance', label: 'Выступление', attr: 'charisma', icon: Music },
  { key: 'intimidation', label: 'Запугивание', attr: 'charisma', icon: Skull },
  { key: 'deception', label: 'Обман', attr: 'charisma', icon: UserX },
  { key: 'persuasion', label: 'Убеждение', attr: 'charisma', icon: MessageCircle },
]

export default function PlayerSkills({ stats, skills }: PlayerSkillsProps) {
  const getValue = (key: string, attr: keyof typeof stats) => {
    const base = stats[attr] ?? 0
    const bonus = stats.proficiency_bonus ?? 0
    const trained = (skills as any)?.[key]
    return trained ? base + bonus : base
  }

  return (
    <div className="px-5 pb-6">
      <div className="grid grid-cols-2 gap-3">
        {skillsList.map(({ key, label, attr, icon: Icon }) => (
          <div
            key={key}
            className="relative flex items-center gap-2 rounded-lg bg-alt border border-alt shadow-md px-3 py-2"
          >
            <div className="absolute -left-2 bg-dark border border-alt rounded-full p-1 shadow-md">
              <Icon className="w-4 h-4 text-accent" />
            </div>
            <div className="flex justify-between items-center w-full pl-3">
              <p className="text-[10px] text-light">{label}</p>
              <span className="text-sm font-bold text-accent">
                {getValue(key, attr as keyof typeof stats)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
