import { Sword, Crosshair, Shield, BookOpen, Eye, Theater, Star } from 'lucide-react'

type PlayerStatsProps = {
  stats: {
    strength?: number
    dexterity?: number
    constitution?: number
    intelligence?: number
    wisdom?: number
    charisma?: number
    proficiency_bonus?: number
  }
}

const ATTRIBUTES = [
  { key: 'strength', label: 'Сила', icon: Sword },
  { key: 'dexterity', label: 'Ловкость', icon: Crosshair },
  { key: 'constitution', label: 'Телосложение', icon: Shield },
  { key: 'intelligence', label: 'Интеллект', icon: BookOpen },
  { key: 'wisdom', label: 'Мудрость', icon: Eye },
  { key: 'charisma', label: 'Харизма', icon: Theater },
]

export default function PlayerStats({ stats }: PlayerStatsProps) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 px-5 pb-6">
        {ATTRIBUTES.map(({ key, label, icon: Icon }) => {
          const value = (stats as any)[key] ?? 0
          return (
            <div
              key={key}
              className="relative flex flex-col items-center rounded-lg bg-dark-hover border border-alt shadow-md p-2"
            >
              <div className="absolute -top-3 bg-dark border border-alt rounded-full p-1.5 shadow-md">
                <Icon className="w-4 h-4 text-accent" />
              </div>
              <p className="text-3xl font-bold text-accent mt-3">{value}</p>
              <p className="text-[9px] text-text-alt uppercase tracking-wide text-center">
                {label}
              </p>
            </div>
          )
        })}
      </div>

      <div className="px-5 pb-6">
        <div className="flex items-center justify-center gap-2 w-full bg-dark-hover border border-alt rounded-md py-2 shadow-md">
          <Star className="w-4 h-4 text-accent" />
          <p className="text-sm uppercase tracking-wide text-text-alt">Бонус мастерства:</p>
          <span className="text-lg font-bold text-accent">{stats.proficiency_bonus ?? 0}</span>
        </div>
      </div>
    </>
  )
}
