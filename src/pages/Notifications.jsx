import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Heart, MessageCircle, UserPlus, Feather } from 'lucide-react'
import Layout from '../components/Layout'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { timeAgo } from '../utils/time'

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

export default function Notifications() {
  const { user } = useAuth()
  const store = useStore()

  const notifications = user ? store.getNotifications(user.id) : []

  // Mark all as read when visiting
  useEffect(() => {
    if (user && notifications.some(n => !n.read)) {
      store.markAllRead(user.id)
      store.refresh()
    }
  }, [user])

  return (
    <Layout>
      <div className="page-container max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-warm-900 mb-2">Ecos</h1>
          <p className="text-warm-400 text-sm">Las resonancias de tu escritura</p>
        </div>

        {notifications.length > 0 ? (
          <div className="space-y-2">
            {notifications.map((notif) => {
              const fromUser = store.getUser(notif.fromUserId)
              const Icon = iconMap[notif.type] || Bell
              const color = colorMap[notif.type] || 'text-warm-500 bg-warm-100'

              return (
                <Link
                  key={notif.id}
                  to={notif.postId ? `/murmullo/${notif.postId}` : notif.fromUserId ? `/u/${fromUser?.username}` : '#'}
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
                        {notif.message}
                      </p>
                    </div>
                  </div>

                  <span className="text-xs text-warm-300 shrink-0">
                    {timeAgo(notif.createdAt)}
                  </span>
                </Link>
              )
            })}
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
