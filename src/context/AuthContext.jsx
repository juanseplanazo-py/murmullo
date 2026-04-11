import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { registerUser, loginUser, getUserById, updateUserProfile } from '../api/users'

const AuthContext = createContext(null)

const AUTH_KEY = 'murmullo_auth'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // On mount, check if there's a saved session
  useEffect(() => {
    const savedUserId = localStorage.getItem(AUTH_KEY)
    if (savedUserId) {
      getUserById(savedUserId)
        .then((u) => {
          if (u) {
            setUser(u)
          } else {
            localStorage.removeItem(AUTH_KEY)
          }
        })
        .catch(() => {
          localStorage.removeItem(AUTH_KEY)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async ({ name, username, email, password }) => {
    const clean = username.toLowerCase().replace(/[^a-z0-9_]/g, '')
    const newUser = await registerUser({
      name: name.trim(),
      username: clean,
      email: email.trim().toLowerCase(),
      password,
    })
    setUser(newUser)
    localStorage.setItem(AUTH_KEY, newUser.id)
    return newUser
  }, [])

  const login = useCallback(async ({ email, password }) => {
    const found = await loginUser({
      email: email.trim().toLowerCase(),
      password,
    })
    setUser(found)
    localStorage.setItem(AUTH_KEY, found.id)
    return found
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(AUTH_KEY)
  }, [])

  const updateProfile = useCallback(async (updates) => {
    if (!user) return
    const updated = await updateUserProfile(user.id, updates)
    setUser(updated)
  }, [user])

  return (
    <AuthContext.Provider value={{ user, userId: user?.id || null, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
