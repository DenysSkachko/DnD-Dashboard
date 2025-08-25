import { FaCoins } from 'react-icons/fa6'
type Props = {
  name: string
  quantity?: number
  gold?: number
  description?: string
  onEdit?: () => void
}

const InventoryCard = ({ name, quantity = 1, gold = 0, description, onEdit }: Props) => {
  return (
    <div
      className="flex flex-col px-5 py-3 rounded-lg bg-dark-hover w-full cursor-pointer"
      onClick={onEdit}
    >
      <div className="flex justify-between items-center w-full">
        <span className="font-semibold text-white">
          {name} {quantity > 0 && <span className="text-text-alt text-[10px]">{quantity} шт.</span>}{' '}
        </span>

        {gold > 0 && (
          <div className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-lg flex items-center gap-1 font-bold text-sm shadow-inner">
            {gold}
            <FaCoins className="text-base" />
          </div>
        )}
      </div>

      {description && (
        <div className=" flex gap-3 items-end text-text-alt text-[10px] relative">
          <p className="pr-12 break-words max-w-70">{description}</p>
        </div>
      )}
    </div>
  )
}

export default InventoryCard
