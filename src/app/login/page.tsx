'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { login, createAccount } from './utils/authUtils'
import Input from '@/ui/Input'
import TabButton from '@/ui/TabButton'
import { useAccount } from '@/context/AccountContext'

const AuthPage = () => {
  const [mode, setMode] = useState<'login' | 'create'>('login')
  const [characterName, setCharacterName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const { account, setAccount, hydrated } = useAccount()

  // ✅ редиректим только когда контекст загружен
  useEffect(() => {
    if (hydrated && pathname === '/login' && account) {
      router.replace('/')
    }
  }, [hydrated, account, pathname, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (mode === 'login') {
        const { data, error } = await login(characterName, password)

        if (error || !data) {
          setError('Неверное имя персонажа или пароль')
        } else {
          setAccount({ id: String(data.id), character_name: data.character_name })
          router.push('/')
        }
      } else {
        if (!characterName || !password) {
          setError('Введите имя персонажа и пароль')
          setLoading(false)
          return
        }

        const { data, error } = await createAccount(characterName, password)

        if (error) {
          setError(error.message)
        } else if (data) {
          setAccount({ id: String(data.id), character_name: data.character_name })
          router.push('/')
        }
      }
    } catch {
      setError('Ошибка при авторизации')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-dark bg-dark px-4">
      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm">
        <div className="flex mb-4">
          <TabButton active={mode === 'login'} onClick={() => setMode('login')}>
            Login
          </TabButton>
          <TabButton active={mode === 'create'} onClick={() => setMode('create')}>
            New
          </TabButton>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-light">
          <Input
            type="text"
            placeholder="Character Name"
            value={characterName}
            onChange={e => setCharacterName(e.target.value)}
            required
            autoComplete="off"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            className="bg-accent text-white hover:bg-accent-hover py-2 rounded-lg"
            disabled={loading}
          >
            {loading ? 'Processing...' : mode === 'login' ? 'Login' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthPage
