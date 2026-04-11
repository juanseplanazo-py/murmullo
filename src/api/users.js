import { supabase } from '../lib/supabase'

// ── Register ──
export async function registerUser({ name, username, email, password }) {
  // Check if username is taken
  const { data: existingUsername } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single()

  if (existingUsername) {
    throw new Error('Ese nombre de usuario ya está en uso')
  }

  // Check if email is taken
  const { data: existingEmail } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single()

  if (existingEmail) {
    throw new Error('Ya existe una cuenta con ese correo')
  }

  const { data, error } = await supabase
    .from('users')
    .insert({ name, username, email, password })
    .select()
    .single()

  if (error) {
    console.error('Error registering user:', error)
    throw new Error('No se pudo crear la cuenta')
  }

  return mapUser(data)
}

// ── Login ──
export async function loginUser({ email, password }) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single()

  if (error || !data) {
    throw new Error('No se encontró una cuenta con ese correo')
  }

  if (data.password !== password) {
    throw new Error('Contraseña incorrecta')
  }

  return mapUser(data)
}

// ── Get user by ID ──
export async function getUserById(userId) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return mapUser(data)
}

// ── Get user by username ──
export async function getUserByUsername(username) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('username', username)
    .single()

  if (error || !data) return null
  return mapUser(data)
}

// ── Get all users ──
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }

  return (data || []).map(mapUser)
}

// ── Update profile ──
export async function updateUserProfile(userId, updates) {
  const updateData = {}
  if (updates.name !== undefined) updateData.name = updates.name
  if (updates.bio !== undefined) updateData.bio = updates.bio
  if (updates.location !== undefined) updateData.location = updates.location
  if (updates.link !== undefined) updateData.link = updates.link
  if (updates.avatarUrl !== undefined) updateData.avatar_url = updates.avatarUrl

  const { data, error } = await supabase
    .from('users')
    .update(updateData)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    throw new Error('No se pudo actualizar el perfil')
  }

  return mapUser(data)
}

// ── Map DB → frontend ──
function mapUser(row) {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    password: row.password,
    bio: row.bio || '',
    location: row.location || '',
    link: row.link || '',
    avatarUrl: row.avatar_url || '',
    createdAt: row.created_at,
  }
}
