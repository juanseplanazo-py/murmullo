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

export async function createPost(content, userId) {
  const { data, error } = await supabase
    .from('posts')
    .insert({
      content,
      author_id: userId,
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

// Map Supabase snake_case → app camelCase
function mapPost(row) {
  return {
    id: row.id,
    authorId: row.author_id,
    text: row.content || '',
    category: row.category || null,
    bgStyle: row.bg_style || 'warm',
    createdAt: row.created_at,
    editedAt: row.edited_at || null,
    likes: row.likes || [],
    saves: row.saves || [],
  }
}
