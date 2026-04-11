import { useState, useEffect } from 'react'
import { getUserById } from '../api/users'

// Simple in-memory cache to avoid refetching the same user
const userCache = {}

export function useUser(userId) {
  const [user, setUser] = useState(userCache[userId] || null)

  useEffect(() => {
    if (!userId) return
    if (userCache[userId]) {
      setUser(userCache[userId])
      return
    }

    getUserById(userId).then((u) => {
      if (u) {
        userCache[userId] = u
        setUser(u)
      }
    })
  }, [userId])

  return user
}

// Clear cache (useful after profile updates)
export function clearUserCache(userId) {
  if (userId) {
    delete userCache[userId]
  } else {
    Object.keys(userCache).forEach(k => delete userCache[k])
  }
}
