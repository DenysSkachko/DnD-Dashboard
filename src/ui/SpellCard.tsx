import { useState, useRef, useEffect } from 'react'
import { Clock, Move, Zap, Hourglass } from 'lucide-react'
import ActionButton from './ActionButton'

type SpellCardProps = {
  name: string
  level?: number
  action?: string
  range?: string
  duration?: string
  concentration?: boolean
  description?: string
  onEdit?: () => void
}

type Param = {
  label: string
  value: string
  colorClass: string
  Icon: React.FC<{ size?: number; className?: string }>
  key: string
}

const SpellCard = ({
  name,
  level,
  action,
  range,
  duration,
  concentration,
  description,
  onEdit,
}: SpellCardProps) => {
  const [openDesc, setOpenDesc] = useState(false)
  const [openBox, setOpenBox] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // закрытие openBox при клике вне карточки
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setOpenBox(null)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const params: Param[] = [
    ...(action
      ? [{ label: 'Действие', value: action, colorClass: 'bg-pink-700/20 text-pink-400', Icon: Zap, key: 'action' }]
      : []),
    ...(range
      ? [{ label: 'Дистанция', value: range, colorClass: 'bg-green-700/20 text-green-400', Icon: Move, key: 'range' }]
      : []),
    ...(duration
      ? [{ label: 'Длительность', value: duration, colorClass: 'bg-blue-700/20 text-blue-400', Icon: Clock, key: 'duration' }]
      : []),
    ...(concentration
      ? [{ label: 'Концентрация', value: 'Да', colorClass: 'bg-yellow-700/20 text-yellow-300', Icon: Hourglass, key: 'concentration' }]
      : []),
  ]

  const handleCardClick = (e: React.MouseEvent) => {
    // если клик не на параметре, открываем описание и закрываем openBox
    if (!(e.target as HTMLElement).closest('[data-param]')) {
      setOpenDesc(prev => !prev)
      setOpenBox(null)
    }
  }

  return (
    <div
      ref={cardRef}
      className="flex flex-col bg-dark-hover rounded-lg p-4 relative w-full cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        {name && (
          <h3 className="text-lg font-bold text-gray-100 flex items-center gap-4">
            {level !== undefined && (
              <span className="text-sm rounded-full bg-pink-400 w-8 h-8 flex items-center justify-center">
                {level}
              </span>
            )}
            <span className="flex-1 text-sm">{name}</span>
          </h3>
        )}
        {onEdit && (
          <ActionButton
            type="edit"
            onClick={e => {
              e.stopPropagation()
              onEdit()
            }}
          />
        )}
      </div>

      <div className="border-t border-dark my-2" />

      {/* Параметры */}
      <div className="flex flex-wrap gap-2 text-[11px] mt-1 relative">
        {params.map(param => (
          <div key={param.key} className="relative flex flex-col items-start">
            <div
              data-param
              className={`flex items-center gap-1 whitespace-nowrap px-2 py-0.5 rounded ${param.colorClass} cursor-pointer`}
              onClick={e => {
                e.stopPropagation()
                setOpenBox(openBox === param.key ? null : param.key)
              }}
            >
              <param.Icon size={14} />
              <span>{param.value}</span>
            </div>

            {/* OpenBox по центру */}
            {openBox === param.key && (
              <div className="absolute top-full left-1/2 mt-1 -translate-x-1/2 flex bg-dark border border-alt rounded-md p-2 text-center text-[10px] text-text-alt shadow-md z-10">
                {param.label}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Description */}
      {description && (
        <div
          className={`mt-3 text-gray-300 text-sm overflow-hidden transition-all duration-300 ${
            openDesc ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <span>{description}</span>
        </div>
      )}
    </div>
  )
}

export default SpellCard
