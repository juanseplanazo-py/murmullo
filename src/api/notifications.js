import { supabase } from '../lib/supabase'

export async function getNotifications(userId) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) return []
  return (data || []).map(mapNotification)
}

export async function createNotification({ userId, fromUserId, postId, type }) {
  // Don't notify yourself
  if (userId === fromUserId) return

  // Check if target user has notifications enabled
  const { data: targetUser } = await supabase
    .from('users')
    .select('notifications_enabled')
    .eq('id', userId)
    .single()

  if (targetUser && targetUser.notifications_enabled === false) return

  await supabase.from('notifications').insert({
    user_id: userId,
    from_user_id: fromUserId,
    post_id: postId,
    type,
  })
}

export async function markAllRead(userId) {
  await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
}

export async function getUnreadCount(userId) {
  const { count } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('read', false)

  return count || 0
}

function mapNotification(row) {
  return {
    id: row.id,
    userId: row.user_id,
    fromUserId: row.from_user_id,
    postId: row.post_id,
    type: row.type,
    read: row.read,
    createdAt: row.created_at,
  }
}
