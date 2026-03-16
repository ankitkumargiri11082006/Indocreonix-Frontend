import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest } from '../lib/apiClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('indocx_token')
    if (!token) {
      setLoading(false)
      return
    }

    apiRequest('/auth/me')
      .then((result) => setUser(result.user))
      .catch(() => {
        localStorage.removeItem('indocx_token')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  async function refreshUser() {
    const result = await apiRequest('/auth/me')
    setUser(result.user)
    return result.user
  }

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      async login(email, password) {
        const result = await apiRequest('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        })
        localStorage.setItem('indocx_token', result.token)
        setUser(result.user)
        return result.user
      },
      logout() {
        localStorage.removeItem('indocx_token')
        setUser(null)
      },
      setCurrentUser(nextUser) {
        setUser(nextUser)
      },
      refreshUser,
    }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
