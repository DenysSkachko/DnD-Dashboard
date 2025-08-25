'use client'

import type { ButtonHTMLAttributes, JSX } from "react"
import { FaCheck, FaBan, FaPlus, FaArrowLeft, FaPencilAlt } from "react-icons/fa"

type ActionButtonType = "edit" | "delete" | "add" | "save" | "cancel"

type ActionButtonProps = {
  type: ActionButtonType
  onClick?: ButtonHTMLAttributes<HTMLButtonElement>["onClick"]
  className?: string
}

const ActionButton = ({ type, onClick, className = "" }: ActionButtonProps) => {
  const icons: Record<ActionButtonType, JSX.Element> = {
    edit: <FaPencilAlt />,
    delete: <FaBan />,
    add: <FaPlus />,
    save: <FaCheck />,
    cancel: <FaArrowLeft />,
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-12 h-12 flex items-center justify-center rounded-md
        bg-gradient-to-br from-red-950 via-black/80 to-stone-900/90
        border-none
        shadow-[0_0_20px_rgba(255,0,0,0.5)]
        text-red-400 hover:text-red-200
        text-2xl
        transition-all duration-300 ease-in-out
        backdrop-blur-sm
        cursor-pointer
        ${className}
      `}
    >
      {icons[type]}
    </button>
  )
}

export default ActionButton
