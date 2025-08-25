'use client'

import { useState } from 'react'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useRouter, usePathname } from 'next/navigation'
import { useAccount } from '@/context/AccountContext'
import ActionButton from '@/ui/ActionButton'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Package, Edit, Sword } from 'lucide-react'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const { account, logout } = useAccount()

  const isDM = account?.character_name === 'DM'

  const navLinks = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/inventory', label: 'Inventory', icon: Package },
    { href: '/edit', label: 'Edit', icon: Edit },
    { href: '/fight', label: 'Fight', icon: Sword },
    { href: '/spell', label: 'Spell', icon: Home },
  ].filter(link => (isDM ? ['/', '/fight'].includes(link.href) : true)) 

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // --- разные стили для боевой страницы ---
  const isFightPage = pathname === '/fight'

  const headerClasses = isFightPage
    ? 'bg-gradient-to-r from-red-900 via-red-700 to-black px-5 py-2 relative z-50 shadow-lg shadow-red-900/50'
    : 'bg-gradient-to-l from-dark via-dark-hover to-dark px-5 py-2 relative z-50'

  const menuButtonClasses = isFightPage
    ? 'w-11 h-11 bg-red-800 text-3xl text-white rounded-md flex items-center justify-center cursor-pointer hover:bg-red-700'
    : 'w-11 h-11 bg-dark-hover text-3xl text-accent rounded-md flex items-center justify-center cursor-pointer'

  return (
    <motion.header
      className={headerClasses}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 70 }}
    >
      <div className="container mx-auto flex justify-end items-center z-50">
        <button
          className={menuButtonClasses}
          onClick={() => setMenuOpen(true)}
        >
          <FaBars />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              key="overlay"
              className="fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.nav
              key="menu"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className={`fixed top-0 left-0 w-full ${
                isFightPage ? 'bg-red-900' : 'bg-dark'
              } pt-2 px-5 pb-10 rounded-b-[40px] z-50 shadow-lg`}
            >
              <div className="container mx-auto flex justify-end items-center gap-2 mb-6">
                <ActionButton
                  type="delete"
                  className={menuButtonClasses}
                  onClick={() => {
                    handleLogout()
                    setMenuOpen(false)
                  }}
                />
                <button
                  className={menuButtonClasses}
                  onClick={() => setMenuOpen(false)}
                >
                  <FaTimes />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl transition-all hover:scale-105 shadow-md ${
                      isFightPage
                        ? 'bg-red-800 hover:bg-red-700'
                        : 'bg-dark-hover hover:bg-dark-hover'
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isFightPage ? 'text-white' : 'text-accent'
                      }`}
                    />
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
