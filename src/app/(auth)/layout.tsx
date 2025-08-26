'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useAccount } from '@/context/AccountContext'
import Header from './Header'

export default function HomeLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { account, hydrated } = useAccount()

  useEffect(() => {
    if (hydrated && !account) {
      router.push('/login')
    }
  }, [hydrated, account, router])

  return (
    <div className="min-h-screen flex flex-col text-light">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  )
}
