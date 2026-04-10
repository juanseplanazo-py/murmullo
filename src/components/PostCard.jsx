import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Trash2 } from 'lucide-react'
import { useState } from 'react'
import Avatar from './Avatar'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { timeAgo } from '../utils/time'

const bgStyles = {
  warm: 'bg-gradient-to-br from-warm-50 to-warm-100',
  rose: 'bg-gradient-to-br from-rose-100/40 to-warm-50',
  lavender: 'bg-gradient-to-br from-lavender-100/40 to-warm-50',
}

export default function PostCard({ post, featured = false }) {
  const { user } = useAuth()
  const { toggleLike, toggleSave, deletePost } = useData()
  const [showMenu, setShowMenu] = useState(false)

  const isOwn = user && post.authorId === user.id
  const displayTime = typeof post.createdAt === 'string' && post.createdAt.includes('T')
    ? timeAgo(post.createdAt)
    : post.createdAt

  return (
    <article className={`card p-6 md:p-8 cursor-pointer ${bgStyles[post.bgStyle] || bgStyles.warm} animate-fade-in`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Avatar name={post.authorName} size="sm" />
          <div>
            <p className="text-sm font-medium text-warm-900">
              {post.authorName}
            </p>
            <p className="text-xs text-warm-500">
              @{post.authorUsername} · {displayTime}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {post.category && (
            <span className="badge">{post.category}</span>
          )}
          {isOwn && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg hover:bg-warm-200/40 text-warm-400 hover:text-warm-600 transition-all"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-8 bg-white rounded-xl shadow-lg border border-warm-200/60 py-1 z-10 min-w-[140px]">
                  <button
                    onClick={() => { deletePost(post.id); setShowMenu(false) }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Text */}
      <div className={`mb-6 ${featured ? 'py-4' : 'py-2'}`}>
        <p className={`font-serif text-lg md:text-xl leading-relaxed text-warm-800 whitespace-pre-line ${featured ? 'text-xl md:text-2xl' : ''}`}>
          {post.text}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-warm-200/40">
        <div className="flex items-center gap-1">
          <ActionButton
            icon={Heart}
            count={post.likes}
            active={post.isLiked}
            onClick={() => toggleLike(post.id)}
            activeClass="text-rose-400 fill-rose-400"
            hoverClass="hover:text-rose-400"
          />
          <ActionButton
            icon={MessageCircle}
            count={post.comments}
            hoverClass="hover:text-lavender-400"
          />
          <ActionButton
            icon={Bookmark}
            count={post.saves || 0}
            active={post.isSaved}
            onClick={() => toggleSave(post.id)}
            activeClass="text-warm-700 fill-warm-700"
            hoverClass="hover:text-warm-700"
          />
        </div>

        <button className="p-2 rounded-xl text-warm-400 hover:text-rose-400 hover:bg-rose-100/30 transition-all duration-200">
          <Share2 className="w-4 h-4" />
        </button>
      </div>
    </article>
  )
}

function ActionButton({ icon: Icon, count, active, onClick, activeClass, hoverClass }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 py-2 px-3 rounded-xl transition-all duration-200
        ${active ? activeClass : `text-warm-400 ${hoverClass}`}
        hover:bg-warm-100/50 active:scale-95`}
    >
      <Icon className={`w-[18px] h-[18px] ${active ? 'scale-110' : ''} transition-transform duration-200`} />
      {count > 0 && (
        <span className="text-xs font-medium">{formatCount(count)}</span>
      )}
    </button>
  )
}

function formatCount(num) {
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}
