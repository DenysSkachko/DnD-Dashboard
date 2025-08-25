'use client'
import { type InputHTMLAttributes } from 'react'

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

const InputFight = ({ className = '', label, id, type, ...props }: Props) => {
  const numberStyles =
    type === 'number'
      ? 'appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'
      : ''

  return (
    <div className="flex flex-col relative w-full">
      {label && (
        <label
          htmlFor={id}
          className="absolute -top-2 left-4 bg-gradient-to-br from-red-900 via-red-800 to-red-950
            text-red-400 font-extrabold text-sm px-2 rounded drop-shadow-[0_0_6px_rgba(255,0,0,0.8)]"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        className={`w-full h-14 px-4 rounded-2xl text-2xl font-extrabold outline-none
          bg-gradient-to-br from-red-900 via-red-800 to-red-950
          text-red-400 shadow-[0_0_15px_rgba(255,0,0,0.6)]
          focus:border-red-400 focus:shadow-[0_0_25px_rgba(255,80,80,0.8)]
          transition-all duration-300 ${numberStyles} ${className}`}
        {...props}
      />
    </div>
  )
}

export default InputFight
