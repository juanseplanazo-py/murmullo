import { supabase } from '../lib/supabase'

export async function getPosts() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching posts:', error)
    return []
  }

  // Map Supabase columns to the shape the app expects
  return (data || []).map(mapPost)
}

export async function createPost(content, userId, { tags = [], isAnonymous = false } = {}) {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      content,
      author_id: userId,
      tags,
      is_anonymous: isAnonymous,
      likes: [],
      saves: [],
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating post:', error)
    throw error
  }

  return mapPost(data)
}

export async function deletePostApi(postId) {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', postId)

  if (error) {
    console.error('Error deleting post:', error)
    throw error
  }
}

export async function updatePostApi(postId, { text }) {
  const { data, error } = await supabase
    .from('posts')
    .update({
      content: text,
      edited_at: new Date().toISOString(),
    })
    .eq('id', postId)
    .select()
    .single()

  if (error) {
    console.error('Error updating post:', error)
    throw error
  }

  return mapPost(data)
}

// ── Toggle like ──
export async function toggleLikeApi(postId, userId) {
  const { data: post } = await supabase.from('posts').select('likes, author_id').eq('id', postId).single()
  if (!post) return

  const likes = post.likes || []
  const already = likes.includes(userId)
  const newLikes = already ? likes.filter(id => id !== userId) : [...likes, userId]

  await supabase.from('posts').update({ likes: newLikes }).eq('id', postId)
  return { liked: !already, count: newLikes.length }
}

// ── Toggle save ──
export async function toggleSaveApi(postId, userId) {
  const { data: post } = await supabase.from('posts').select('saves').eq('id', postId).single()
  if (!post) return

  const saves = post.saves || []
  const already = saves.includes(userId)
  const newSaves = already ? saves.filter(id => id !== userId) : [...saves, userId]

  await supabase.from('posts').update({ saves: newSaves }).eq('id', postId)
  return { saved: !already }
}

// Map Supabase snake_case → app camelCase
function mapPost(row) {
  return {
    id: row.id,
    authorId: row.author_id,
    text: row.content || '',
    tags: row.tags || [],
    isAnonymous: row.is_anonymous || false,
    createdAt: row.created_at,
    editedAt: row.edited_at || null,
    likes: row.likes || [],
    saves: row.saves || [],
  }
}
