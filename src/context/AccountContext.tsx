'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Account = {
  id: string
  character_name: string
}

type AccountContextType = {
  account: Account | null
  setAccount: (acc: Account) => void
  logout: () => void
  hydrated: boolean
}

const AccountContext = createContext<AccountContextType | undefined>(undefined)

export const useAccount = () => {
  const context = useContext(AccountContext)
  if (!context) throw new Error('useAccount must be used within AccountProvider')
  return context
}

export const AccountProvider = ({ children }: { children: ReactNode }) => {
  const [account, setAccountState] = useState<Account | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('account')
    if (saved) setAccountState(JSON.parse(saved))
    setHydrated(true)
  }, [])

  const setAccount = (acc: Account) => {
    setAccountState(acc)
    localStorage.setItem('account', JSON.stringify(acc))
  }

  const logout = () => {
    setAccountState(null)
    localStorage.removeItem('account')
  }

  return (
    <AccountContext.Provider value={{ account, setAccount, logout, hydrated }}>
      {children}
    </AccountContext.Provider>
  )
}
