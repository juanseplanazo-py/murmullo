import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Heart, MessageCircle, UserPlus, Feather, Loader2, Settings } from 'lucide-react'
import Layout from '../components/Layout'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../context/AuthContext'
import { useUser } from '../hooks/useUser'
import { getNotifications, markAllRead } from '../api/notifications'
import { timeAgo } from '../utils/time'
import { supabase } from '../lib/supabase'

const iconMap = {
  like: Heart,
  comment: MessageCircle,
  follow: UserPlus,
  new_post: Feather,
}

const colorMap = {
  like: 'text-rose-400 bg-rose-100/50',
  comment: 'text-lavender-400 bg-lavender-100/50',
  follow: 'text-warm-600 bg-warm-200/50',
  new_post: 'text-rose-300 bg-rose-100/30',
}

const messageMap = {
  like: 'resonó con tu murmullo',
  comment: 'te dejó un susurro',
  follow: 'empezó a escucharte',
  save: 'atesoró tu murmullo',
}

export default function Notifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const data = await getNotifications(user.id)
      setNotifications(data)
      setLoading(false)

      // Mark all as read
      if (data.some(n => !n.read)) {
        markAllRead(user.id)
      }

      // Get notification preference
      const { data: userData } = await supabase
        .from('users').select('notifications_enabled').eq('id', user.id).single()
      if (userData) setNotificationsEnabled(userData.notifications_enabled !== false)
    }
    load()
  }, [user])

  const toggleNotifications = async () => {
    const newVal = !notificationsEnabled
    setNotificationsEnabled(newVal)
    await supabase.from('users').update({ notifications_enabled: newVal }).eq('id', user.id)
  }

  return (
    <Layout>
      <div className="page-container max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif text-3xl font-bold text-warm-900 mb-2">Ecos</h1>
            <p className="text-warm-400 text-sm">Las resonancias de tu escritura</p>
          </div>
          <button
            onClick={toggleNotifications}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all
              ${notificationsEnabled
                ? 'bg-warm-100 text-warm-600 hover:bg-warm-200'
                : 'bg-rose-100 text-rose-500 hover:bg-rose-200'
              }`}
            title={notificationsEnabled ? 'Desactivar notificaciones' : 'Activar notificaciones'}
          >
            <Settings className="w-3.5 h-3.5" />
            {notificationsEnabled ? 'Activadas' : 'Desactivadas'}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-6 h-6 text-rose-300 animate-spin" />
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((notif) => (
              <NotificationItem key={notif.id} notif={notif} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Bell}
            title="Todo en silencio por ahora"
            description="Cuando alguien resuene con tus murmullos, te susurre algo o empiece a escucharte, lo verás aquí."
          />
        )}
      </div>
    </Layout>
  )
}

function NotificationItem({ notif }) {
  const fromUser = useUser(notif.fromUserId)
  const Icon = iconMap[notif.type] || Bell
  const color = colorMap[notif.type] || 'text-warm-500 bg-warm-100'
  const message = messageMap[notif.type] || 'interactuó contigo'

  return (
    <Link
      to={notif.postId ? `/murmullo/${notif.postId}` : notif.fromUserId ? `/u/${fromUser?.username || ''}` : '#'}
      className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 group
        ${notif.read ? 'hover:bg-warm-50' : 'bg-rose-50/30 hover:bg-rose-50/50'}`}
    >
      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          {fromUser && <Avatar name={fromUser.name} size="xs" />}
          <p className="text-sm text-warm-800 truncate">
            <span className="font-medium">{fromUser?.name || 'Alguien'}</span>{' '}
            {message}
          </p>
        </div>
      </div>

      <span className="text-xs text-warm-300 shrink-0">
        {timeAgo(notif.createdAt)}
      </span>
    </Link>
  )
}
