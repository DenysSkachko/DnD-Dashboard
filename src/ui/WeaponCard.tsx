import { GiCrossedSwords } from 'react-icons/gi'

type WeaponCardProps = {
  name: string
  damage: string
  attack_bonus: number
  onEdit?: () => void
}

const WeaponCard = ({ name, damage, attack_bonus, onEdit }: WeaponCardProps) => {
  return (
    <div
      onClick={onEdit}
      className="px-4 py-3 bg-dark-hover rounded-lg shadow-sm w-full"
    >

      <div className="w-full">
        <h3 className="text-white font-semibold text-base flex items-center gap-2 mb-2">
          {name} <GiCrossedSwords className="text-gray-400 text-lg" />
        </h3>
        <p className="text-red-500 font-bold text-lg flex justify-between items-center">
          <span className="text-gray-400 text-sm">Урон:</span> <span className="text-xl">{damage}</span>
        </p>
        <p className="text-green-400 font-bold text-lg flex justify-between items-center">
          <span className="text-gray-400 text-sm">Бонус к атаке:</span> <span className="text-xl">+{attack_bonus}</span>
        </p>
      </div>

    </div>
  )
}

export default WeaponCard
