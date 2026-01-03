import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiFetch } from '../lib/api'

const AuthContext = createContext(null)

const STORAGE_KEY = 'aurum_auth_v1'
// he
function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : null
    if (!parsed || typeof parsed !== 'object') return { user: null, token: null }
    return { user: parsed.user || null, token: parsed.token || null }
  } catch {
    return { user: null, token: null }
  }
}

export function AuthProvider({ children }) {
  const [{ user, token }, setAuth] = useState(() => readStored())
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }))
  }, [user, token])

  const login = async ({ email, password }) => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      })
      setAuth({ user: { _id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin }, token: data.token })
      return data
    } catch (err) {
      const msg = err?.message || 'Login failed'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async ({ name, email, password, confirmPassword }) => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, confirmPassword }),
      })
      setAuth({ user: { _id: data._id, name: data.name, email: data.email, isAdmin: data.isAdmin }, token: data.token })
      return data
    } catch (err) {
      const msg = err?.message || 'Signup failed'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setError('')
    setAuth({ user: null, token: null })
  }

  const refreshMe = async () => {
    if (!token) return null
    try {
      const me = await apiFetch('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } })
      setAuth((prev) => ({ ...prev, user: me }))
      return me
    } catch {
      logout()
      return null
    }
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      login,
      register,
      logout,
      refreshMe,
      isAuthenticated: Boolean(token),
    }),
    [user, token, loading, error],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
