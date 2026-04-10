import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'

const StoreContext = createContext(null)

const STORE_KEY = 'murmullo_store'

function loadStore() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { users: {}, posts: {}, comments: {}, follows: {}, notifications: {} }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

export function StoreProvider({ children }) {
  const [data, setData] = useState(loadStore)
  const dataRef = useRef(data)
  dataRef.current = data

  // Persist on every change
  useEffect(() => {
    localStorage.setItem(STORE_KEY, JSON.stringify(data))
  }, [data])

  // Helper to update
  const update = useCallback((fn) => {
    setData(prev => {
      const next = fn(prev)
      return { ...next }
    })
  }, [])

  // ── USERS ──
  const createUser = useCallback(({ name, username, email, password }) => {
    const id = generateId()
    const user = {
      id, name, username, email, password,
      bio: '', location: '', link: '',
      joinedAt: new Date().toISOString(),
    }
    update(d => {
      d.users[id] = user
      return d
    })
    return user
  }, [update])

  const getUser = useCallback((id) => {
    return dataRef.current.users[id] || null
  }, [])

  const getUserByUsername = useCallback((username) => {
    return Object.values(dataRef.current.users).find(u => u.username === username) || null
  }, [])

  const getUserByEmail = useCallback((email) => {
    return Object.values(dataRef.current.users).find(u => u.email === email) || null
  }, [])

  const isUsernameTaken = useCallback((username) => {
    return Object.values(dataRef.current.users).some(u => u.username === username)
  }, [])

  const isEmailTaken = useCallback((email) => {
    return Object.values(dataRef.current.users).some(u => u.email === email)
  }, [])

  const updateUser = useCallback((id, updates) => {
    update(d => {
      if (d.users[id]) {
        d.users[id] = { ...d.users[id], ...updates }
      }
      return d
    })
  }, [update])

  const getAllUsers = useCallback(() => {
    return Object.values(dataRef.current.users)
  }, [])

  // ── POSTS ──
  const createPost = useCallback(({ authorId, text, category, bgStyle }) => {
    const id = generateId()
    const post = {
      id, authorId, text, category: category || null, bgStyle: bgStyle || 'warm',
      createdAt: new Date().toISOString(),
      likes: [],   // array of userIds
      saves: [],   // array of userIds
    }
    update(d => {
      d.posts[id] = post
      return d
    })

    // Notify the author's followers
    const followers = getFollowers(authorId)
    const author = dataRef.current.users[authorId]
    followers.forEach(followerId => {
      addNotification(followerId, {
        type: 'new_post',
        fromUserId: authorId,
        postId: id,
        message: `${author?.name || 'Alguien'} publicó un nuevo murmullo`,
      })
    })

    return post
  }, [update])

  const getPost = useCallback((id) => {
    return dataRef.current.posts[id] || null
  }, [])

  const deletePost = useCallback((postId) => {
    update(d => {
      // Also delete comments for this post
      Object.keys(d.comments).forEach(cId => {
        if (d.comments[cId].postId === postId) delete d.comments[cId]
      })
      delete d.posts[postId]
      return d
    })
  }, [update])

  const updatePost = useCallback((postId, updates) => {
    update(d => {
      if (d.posts[postId]) {
        d.posts[postId] = { ...d.posts[postId], ...updates, editedAt: new Date().toISOString() }
      }
      return d
    })
  }, [update])

  const getAllPosts = useCallback(() => {
    return Object.values(dataRef.current.posts).sort((a, b) =>
      new Date(b.createdAt) - new Date(a.createdAt)
    )
  }, [])

  const getUserPosts = useCallback((userId) => {
    return Object.values(dataRef.current.posts)
      .filter(p => p.authorId === userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [])

  const toggleLike = useCallback((postId, userId) => {
    update(d => {
      const post = d.posts[postId]
      if (!post) return d
      const idx = post.likes.indexOf(userId)
      if (idx === -1) {
        post.likes.push(userId)
        // Notify post author
        if (post.authorId !== userId) {
          const liker = d.users[userId]
          const nId = generateId()
          if (!d.notifications[post.authorId]) d.notifications[post.authorId] = []
          d.notifications[post.authorId].unshift({
            id: nId, type: 'like', fromUserId: userId, postId,
            message: `A ${liker?.name || 'alguien'} le encantó tu murmullo`,
            createdAt: new Date().toISOString(), read: false,
          })
        }
      } else {
        post.likes.splice(idx, 1)
      }
      return d
    })
  }, [update])

  const toggleSave = useCallback((postId, userId) => {
    update(d => {
      const post = d.posts[postId]
      if (!post) return d
      const idx = post.saves.indexOf(userId)
      if (idx === -1) {
        post.saves.push(userId)
      } else {
        post.saves.splice(idx, 1)
      }
      return d
    })
  }, [update])

  const getLikedPosts = useCallback((userId) => {
    return Object.values(dataRef.current.posts)
      .filter(p => p.likes.includes(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [])

  const getSavedPosts = useCallback((userId) => {
    return Object.values(dataRef.current.posts)
      .filter(p => p.saves.includes(userId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [])

  // ── COMMENTS ──
  const addComment = useCallback((postId, userId, text) => {
    const id = generateId()
    const comment = {
      id, postId, userId, text: text.trim(),
      createdAt: new Date().toISOString(),
    }
    update(d => {
      d.comments[id] = comment
      // Notify post author
      const post = d.posts[postId]
      if (post && post.authorId !== userId) {
        const commenter = d.users[userId]
        const nId = generateId()
        if (!d.notifications[post.authorId]) d.notifications[post.authorId] = []
        d.notifications[post.authorId].unshift({
          id: nId, type: 'comment', fromUserId: userId, postId,
          message: `${commenter?.name || 'Alguien'} comentó en tu murmullo`,
          createdAt: new Date().toISOString(), read: false,
        })
      }
      return d
    })
    return comment
  }, [update])

  const deleteComment = useCallback((commentId) => {
    update(d => {
      delete d.comments[commentId]
      return d
    })
  }, [update])

  const getPostComments = useCallback((postId) => {
    return Object.values(dataRef.current.comments)
      .filter(c => c.postId === postId)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
  }, [])

  const getCommentCount = useCallback((postId) => {
    return Object.values(dataRef.current.comments).filter(c => c.postId === postId).length
  }, [])

  // ── FOLLOWS ──
  const toggleFollow = useCallback((followerId, followedId) => {
    if (followerId === followedId) return
    update(d => {
      if (!d.follows[followerId]) d.follows[followerId] = []
      const idx = d.follows[followerId].indexOf(followedId)
      if (idx === -1) {
        d.follows[followerId].push(followedId)
        // Notify
        const follower = d.users[followerId]
        const nId = generateId()
        if (!d.notifications[followedId]) d.notifications[followedId] = []
        d.notifications[followedId].unshift({
          id: nId, type: 'follow', fromUserId: followerId,
          message: `${follower?.name || 'Alguien'} comenzó a seguirte`,
          createdAt: new Date().toISOString(), read: false,
        })
      } else {
        d.follows[followerId].splice(idx, 1)
      }
      return d
    })
  }, [update])

  const isFollowing = useCallback((followerId, followedId) => {
    return (dataRef.current.follows[followerId] || []).includes(followedId)
  }, [])

  const getFollowers = useCallback((userId) => {
    const all = dataRef.current.follows
    return Object.entries(all)
      .filter(([, list]) => list.includes(userId))
      .map(([fId]) => fId)
  }, [])

  const getFollowing = useCallback((userId) => {
    return dataRef.current.follows[userId] || []
  }, [])

  const getFollowerCount = useCallback((userId) => {
    return getFollowers(userId).length
  }, [getFollowers])

  const getFollowingCount = useCallback((userId) => {
    return getFollowing(userId).length
  }, [getFollowing])

  // ── NOTIFICATIONS ──
  const addNotification = useCallback((userId, notif) => {
    update(d => {
      if (!d.notifications[userId]) d.notifications[userId] = []
      d.notifications[userId].unshift({
        id: generateId(),
        ...notif,
        createdAt: new Date().toISOString(),
        read: false,
      })
      // Keep max 50
      if (d.notifications[userId].length > 50) {
        d.notifications[userId] = d.notifications[userId].slice(0, 50)
      }
      return d
    })
  }, [update])

  const getNotifications = useCallback((userId) => {
    return dataRef.current.notifications[userId] || []
  }, [])

  const getUnreadCount = useCallback((userId) => {
    return (dataRef.current.notifications[userId] || []).filter(n => !n.read).length
  }, [])

  const markAllRead = useCallback((userId) => {
    update(d => {
      if (d.notifications[userId]) {
        d.notifications[userId] = d.notifications[userId].map(n => ({ ...n, read: true }))
      }
      return d
    })
  }, [update])

  const markRead = useCallback((userId, notifId) => {
    update(d => {
      if (d.notifications[userId]) {
        const n = d.notifications[userId].find(x => x.id === notifId)
        if (n) n.read = true
      }
      return d
    })
  }, [update])

  // ── SEARCH ──
  const search = useCallback((query) => {
    const q = query.toLowerCase().trim()
    if (!q) return { users: [], posts: [] }

    const users = Object.values(dataRef.current.users).filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q)
    )

    const posts = Object.values(dataRef.current.posts).filter(p =>
      p.text.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q))
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return { users, posts }
  }, [])

  // ── FEED ──
  const getFeed = useCallback((userId) => {
    const following = dataRef.current.follows[userId] || []
    const feedAuthors = [userId, ...following]
    return Object.values(dataRef.current.posts)
      .filter(p => feedAuthors.includes(p.authorId))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [])

  // Force re-render helper
  const [, setTick] = useState(0)
  const refresh = useCallback(() => setTick(t => t + 1), [])

  const value = {
    // Users
    createUser, getUser, getUserByUsername, getUserByEmail,
    isUsernameTaken, isEmailTaken, updateUser, getAllUsers,
    // Posts
    createPost, getPost, deletePost, updatePost, getAllPosts, getUserPosts,
    toggleLike, toggleSave, getLikedPosts, getSavedPosts,
    // Comments
    addComment, deleteComment, getPostComments, getCommentCount,
    // Follows
    toggleFollow, isFollowing, getFollowers, getFollowing,
    getFollowerCount, getFollowingCount,
    // Notifications
    addNotification, getNotifications, getUnreadCount, markAllRead, markRead,
    // Search
    search,
    // Feed
    getFeed,
    // Utility
    refresh, data,
  }

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
