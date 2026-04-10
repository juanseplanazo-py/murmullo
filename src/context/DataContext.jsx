import { createContext, useContext, useState, useEffect } from 'react'

const DataContext = createContext(null)

const POSTS_KEY = 'murmullo_posts'

export function DataProvider({ children }) {
  const [posts, setPosts] = useState([])

  // Load posts from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(POSTS_KEY)
    if (stored) {
      try {
        setPosts(JSON.parse(stored))
      } catch {
        localStorage.removeItem(POSTS_KEY)
      }
    }
  }, [])

  // Persist posts
  useEffect(() => {
    localStorage.setItem(POSTS_KEY, JSON.stringify(posts))
  }, [posts])

  const createPost = (post) => {
    const newPost = {
      id: crypto.randomUUID(),
      ...post,
      likes: 0,
      comments: 0,
      saves: 0,
      isLiked: false,
      isSaved: false,
      createdAt: new Date().toISOString(),
    }
    setPosts(prev => [newPost, ...prev])
    return newPost
  }

  const deletePost = (postId) => {
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  const toggleLike = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return {
        ...p,
        isLiked: !p.isLiked,
        likes: p.isLiked ? p.likes - 1 : p.likes + 1,
      }
    }))
  }

  const toggleSave = (postId) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      return { ...p, isSaved: !p.isSaved }
    }))
  }

  const getUserPosts = (userId) => {
    return posts.filter(p => p.authorId === userId)
  }

  const getLikedPosts = () => {
    return posts.filter(p => p.isLiked)
  }

  const getSavedPosts = () => {
    return posts.filter(p => p.isSaved)
  }

  return (
    <DataContext.Provider value={{
      posts,
      createPost,
      deletePost,
      toggleLike,
      toggleSave,
      getUserPosts,
      getLikedPosts,
      getSavedPosts,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within DataProvider')
  return context
}
