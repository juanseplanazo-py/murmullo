import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useStore } from './StoreContext'

const AuthContext = createContext(null)

const AUTH_KEY = 'murmullo_auth'

export function AuthProvider({ children }) {
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)
  const store = useStore()

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY)
    if (stored && store.getUser(stored)) {
      setUserId(stored)
    } else {
      localStorage.removeItem(AUTH_KEY)
    }
    setLoading(false)
  }, [store])

  useEffect(() => {
    if (userId) {
      localStorage.setItem(AUTH_KEY, userId)
    } else {
      localStorage.removeItem(AUTH_KEY)
    }
  }, [userId])

  const user = userId ? store.getUser(userId) : null

  const register = useCallback(({ name, username, email, password }) => {
    const clean = username.toLowerCase().replace(/[^a-z0-9_]/g, '')

    if (store.isUsernameTaken(clean)) {
      throw new Error('Ese nombre de usuario ya está en uso')
    }
    if (store.isEmailTaken(email)) {
      throw new Error('Ya existe una cuenta con ese correo')
    }

    const newUser = store.createUser({ name: name.trim(), username: clean, email: email.trim().toLowerCase(), password })
    setUserId(newUser.id)
    return newUser
  }, [store])

  const login = useCallback(({ email, password }) => {
    const found = store.getUserByEmail(email.trim().toLowerCase())
    if (!found) {
      throw new Error('No se encontró una cuenta con ese correo')
    }
    if (found.password !== password) {
      throw new Error('Contraseña incorrecta')
    }
    setUserId(found.id)
    return found
  }, [store])

  const logout = useCallback(() => {
    setUserId(null)
  }, [])

  const updateProfile = useCallback((updates) => {
    if (!userId) return
    store.updateUser(userId, updates)
    setUserId(prev => prev) // trigger re-render
  }, [userId, store])

  return (
    <AuthContext.Provider value={{ user, userId, loading, register, login, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
