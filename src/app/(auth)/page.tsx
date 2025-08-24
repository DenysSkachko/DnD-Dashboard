'use client'

import { useAccount } from '@/context/AccountContext'
import DMHomePage from './dm/DMHomePage'
import PlayerHomePage from './player/PlayerHomePage'
import { Loader } from '@/ui/Loader'

export default function HomePage() {
  const { account, hydrated } = useAccount()

  if (!hydrated) return <Loader />

  const isDM = account?.character_name === 'DM'

  return isDM ? <DMHomePage /> : <PlayerHomePage />
}
