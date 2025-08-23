'use client'

import { useAccount } from '@/context/AccountContext'
import DMHomePage from './dm/DMHomePage'
import PlayerHomePage from './player/PlayerHomePage'

export default function HomePage() {
  const { account, hydrated } = useAccount()

  if (!hydrated) return <p>Loading...</p>

  console.log('account:', account) // <--- проверь здесь

  const isDM = account?.character_name === 'DM'

  return isDM ? <DMHomePage /> : <PlayerHomePage />
}
