// --- FeatureCard.tsx ---
import { useState, useRef, useEffect } from 'react'
import { Star, Book, Award } from 'lucide-react'
import ActionButton from './ActionButton'

type FeatureCardProps = {
  name: string
  description?: string
  level?: number
  onEdit?: () => void
}

type Param = {
  label: string
  value: string
  colorClass: string
  Icon: React.FC<{ size?: number; className?: string }>
  key: string
}

const FeatureCard = ({ name, description, level, onEdit }: FeatureCardProps) => {
  const [openDesc, setOpenDesc] = useState(false)
  const [openBox, setOpenBox] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

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
    ...(level !== undefined
      ? [{ label: 'Уровень', value: String(level), colorClass: 'bg-pink-700/20 text-pink-400', Icon: Star, key: 'level' }]
      : []),
  ]

  const handleCardClick = (e: React.MouseEvent) => {
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
      <div className="flex justify-between items-center">
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

      {/* Description */}
      {description && (
        <div
          className={`mt-3 text-gray-300 text-sm overflow-hidden transition-all duration-300 ${
            openDesc ? 'max-h-auto opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <span>{description}</span>
        </div>
      )}
    </div>
  )
}

export default FeatureCard
