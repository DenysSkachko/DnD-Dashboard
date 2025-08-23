"use client"
import { useState } from "react"
import { Heart } from "lucide-react"
import ActionButton from "@/ui/ActionButton"
import { useUpdateCharacterCombat } from "@/queries/characterCombatQueries"

type PlayerHPProps = {
  combat: {
    id: number
    current_hp: number | null
    max_hp: number | null
  }
}

export default function PlayerHP({ combat }: PlayerHPProps) {
  const updateCombat = useUpdateCharacterCombat()
  const [editingHp, setEditingHp] = useState(false)
  const [tempHp, setTempHp] = useState<number | null>(combat.current_hp ?? 0)

  const hpPercent =
    combat.max_hp && combat.current_hp != null
      ? Math.max(0, Math.min(100, (combat.current_hp / combat.max_hp) * 100))
      : 0

  const handleSaveHp = () => {
    if (tempHp != null) {
      updateCombat.mutate({ id: combat.id, current_hp: tempHp })
    }
    setEditingHp(false)
  }

  return (
    <div className="px-5 pb-5">
      <div className="bg-dark-hover border border-alt rounded-md shadow-md p-2">
        {editingHp ? (
          <div className="flex gap-3 items-center">
            <input
              type="number"
              value={tempHp ?? 0}
              onChange={e => setTempHp(Number(e.target.value))}
              className="w-full bg-dark-hover border border-alt rounded text-light px-2 py-1 text-2xl outline-none focus:border-accent appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <div className="flex gap-2">
              <ActionButton type="save" onClick={handleSaveHp} />
              <ActionButton type="cancel" onClick={() => setEditingHp(false)} />
            </div>
          </div>
        ) : (
          <div
            className="flex flex-col gap-2 cursor-pointer p-1"
            onClick={() => {
              setTempHp(combat.current_hp ?? 0)
              setEditingHp(true)
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart
                  className={`w-5 h-5 ${
                    hpPercent === 100 ? "fill-red-500 text-red-500" : "text-red-400"
                  }`}
                />
                <span className="text-sm font-semibold text-red-400">HP</span>
              </div>
              <span className="text-sm text-text-alt">
                {combat.current_hp ?? 0} / {combat.max_hp ?? 0}
              </span>
            </div>
            <div className="w-full h-2 rounded bg-dark-hover overflow-hidden">
              <div
                className="h-2 bg-red-500 transition-all duration-300"
                style={{ width: `${hpPercent}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
