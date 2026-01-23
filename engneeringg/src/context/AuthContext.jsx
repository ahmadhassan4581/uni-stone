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
      setAuth({
        user: {
          _id: data._id,
          name: data.name,
          email: data.email,
          isAdmin: data.isAdmin,
          wishlist: Array.isArray(data.wishlist) ? data.wishlist : [],
        },
        token: data.token,
      })
      return data
    } catch (err) {
      const msg = err?.message || 'Login failed'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async ({ email }) => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      return data
    } catch (err) {
      const msg = err?.message || 'Failed to request password reset'
      setError(msg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async ({ token: resetToken, password, confirmPassword }) => {
    setLoading(true)
    setError('')
    try {
      const data = await apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token: resetToken, password, confirmPassword }),
      })
      return data
    } catch (err) {
      const msg = err?.message || 'Failed to reset password'
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
      setAuth({
        user: {
          _id: data._id,
          name: data.name,
          email: data.email,
          isAdmin: data.isAdmin,
          wishlist: Array.isArray(data.wishlist) ? data.wishlist : [],
        },
        token: data.token,
      })
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

  const addToWishlist = async (productId) => {
    if (!token) throw new Error('Not authenticated')
    const data = await apiFetch('/api/auth/wishlist', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ productId }),
    })
    setAuth((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, wishlist: Array.isArray(data?.wishlist) ? data.wishlist : [] } : prev.user,
    }))
    return data
  }

  const getAddresses = async () => {
    if (!token) throw new Error('Not authenticated')
    const data = await apiFetch('/api/auth/addresses', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return Array.isArray(data?.addresses) ? data.addresses : []
  }

  const updateAddresses = async (addresses) => {
    if (!token) throw new Error('Not authenticated')
    const data = await apiFetch('/api/auth/addresses', {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ addresses }),
    })
    return Array.isArray(data?.addresses) ? data.addresses : []
  }

  const removeFromWishlist = async (productId) => {
    if (!token) throw new Error('Not authenticated')
    const data = await apiFetch(`/api/auth/wishlist/${encodeURIComponent(productId)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    setAuth((prev) => ({
      ...prev,
      user: prev.user ? { ...prev.user, wishlist: Array.isArray(data?.wishlist) ? data.wishlist : [] } : prev.user,
    }))
    return data
  }

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      error,
      login,
      register,
      forgotPassword,
      resetPassword,
      logout,
      refreshMe,
      addToWishlist,
      removeFromWishlist,
      getAddresses,
      updateAddresses,
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
