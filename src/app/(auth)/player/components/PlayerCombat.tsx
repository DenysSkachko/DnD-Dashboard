"use client"
import { ShieldCheck, Zap, Gauge, Sparkles } from "lucide-react"
import { useUpdateCharacterCombat } from "@/queries/characterCombatQueries"

type PlayerCombatProps = {
  combat: {
    id: number
    armor_class?: number | null
    speed?: number | null
    initiative?: number | null
    inspiration?: boolean | null
  }
}

export default function PlayerCombat({ combat }: PlayerCombatProps) {
  const updateCombat = useUpdateCharacterCombat()

  const handleToggleInspiration = () => {
    updateCombat.mutate({
      id: combat.id,
      inspiration: !combat.inspiration,
    })
  }

  return (
    <div className="grid grid-cols-4 gap-3 px-5 pb-6">
      <div className="flex flex-col items-center justify-center bg-dark-hover border border-alt rounded-md p-2 shadow-sm">
        <ShieldCheck className="w-5 h-5 text-blue-400 mb-1" />
        <span className="text-sm font-bold text-stone-200">{combat.armor_class ?? "-"}</span>
      </div>

      <div className="flex flex-col items-center justify-center bg-dark-hover border border-alt rounded-md p-2 shadow-sm">
        <Gauge className="w-5 h-5 text-green-400 mb-1" />
        <span className="text-sm font-bold text-stone-200">{combat.speed ?? "-"}</span>
      </div>

      <div className="flex flex-col items-center justify-center bg-dark-hover border border-alt rounded-md p-2 shadow-sm">
        <Zap className="w-5 h-5 text-amber-400 mb-1" />
        <span className="text-sm font-bold text-stone-200">{combat.initiative ?? "-"}</span>
      </div>

      <div
        className={`flex flex-col items-center justify-center border rounded-md p-2 shadow-sm cursor-pointer transition-all duration-200
          ${
            combat.inspiration
              ? "bg-yellow-400/20 border-yellow-400 shadow-[0_0_15px_3px_rgba(250,204,21,0.7)]"
              : "bg-dark-hover border border-alt"
          }`}
        onClick={handleToggleInspiration}
      >
        <Sparkles
          className={`w-5 h-5 mb-1 ${
            combat.inspiration
              ? "text-yellow-300 drop-shadow-[0_0_6px_rgba(250,204,21,0.9)]"
              : "text-purple-400"
          }`}
        />
        <span
          className={`text-sm font-bold ${
            combat.inspiration ? "text-yellow-200" : "text-stone-200"
          }`}
        >
          {combat.inspiration ? "✓" : "–"}
        </span>
      </div>
    </div>
  )
}
