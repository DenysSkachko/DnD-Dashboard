'use client'

import { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import { useAccount } from '@/context/AccountContext'
import ActionButton from '@/ui/ActionButton'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Package,
  Edit,
  Sword,
} from 'lucide-react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const { logout } = useAccount()

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/inventory', label: 'Inventory', icon: Package },
    { href: '/edit', label: 'Edit', icon: Edit },
    { href: '/fight', label: 'Fight', icon: Sword },
  ]

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <motion.header
      className="bg-gradient-to-l from-dark via-dark-hover to-dark p-4 relative z-50"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 70 }}
    >
      <div className="container mx-auto flex justify-end items-center z-50">
        {/* Только бургер */}
        <button
          className="w-11 h-11 bg-dark-hover text-3xl text-accent rounded-md flex items-center justify-center cursor-pointer"
          onClick={() => setMenuOpen(true)}
        >
          <FaBars />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Оверлей */}
            <motion.div
              key="overlay"
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Выпадающее меню */}
            <motion.nav
              key="menu"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="fixed top-0 left-0 w-full bg-dark p-4 pb-6 rounded-b-[40px] z-50 shadow-lg"
            >
              {/* Шапка меню с кнопками */}
              <div className="container mx-auto flex justify-end items-center gap-2 mb-6">
                <ActionButton
                  type="delete"
                  onClick={() => {
                    handleLogout()
                    setMenuOpen(false)
                  }}
                />
                <button
                  className="w-11 h-11 bg-dark-hover text-3xl text-accent rounded-md flex items-center justify-center cursor-pointer"
                  onClick={() => setMenuOpen(false)}
                >
                  <FaTimes />
                </button>
              </div>

              {/* Линки */}
              <div className="grid grid-cols-2 gap-4 text-center">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center gap-2 bg-dark-hover py-3 rounded-xl transition-all hover:bg-dark-hover hover:scale-105 shadow-md"
                  >
                    <Icon className="w-5 h-5 text-accent" />
                    <span className="text-white">{label}</span>
                  </a>
                ))}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
