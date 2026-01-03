import { createContext, useContext, useMemo, useState } from 'react'
import { apiFetch } from '../lib/api'

const AuthContext = createContext(null)

const TOKEN_KEY = 'admin_token_v1'
const USER_KEY = 'admin_user_v1'

function readStoredUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(() => readStoredUser())
  const [loading, setLoading] = useState(false)

  const login = async ({ email, password }) => {
    setLoading(true)
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })

      if (!data?.token) throw new Error('Login failed')
      if (!data?.isAdmin) throw new Error('Admin access required')

      localStorage.setItem(TOKEN_KEY, data.token)
      localStorage.setItem(USER_KEY, JSON.stringify(data))
      setToken(data.token)
      setUser(data)
      return data
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken('')
    setUser(null)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      logout,
      isAuthed: Boolean(token),
      isAdmin: Boolean(user?.isAdmin),
    }),
    [token, user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
