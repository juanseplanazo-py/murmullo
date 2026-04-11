import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Trash2, Pencil } from 'lucide-react'
import Avatar from './Avatar'
import CommentPanel from './CommentPanel'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { useToast } from './Toast'
import { useUser } from '../hooks/useUser'
import { deletePostApi } from '../api/posts'
import { timeAgo } from '../utils/time'

const bgStyles = {
  warm: 'bg-gradient-to-br from-warm-50 via-white to-warm-100/50',
  rose: 'bg-gradient-to-br from-rose-100/30 via-white to-rose-100/20',
  lavender: 'bg-gradient-to-br from-lavender-100/30 via-white to-lavender-100/20',
}

export default function MurmulloCard({ post, featured = false, onEdit, onRefresh }) {
  const { user } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const likes = Array.isArray(post.likes) ? post.likes : []
  const saves = Array.isArray(post.saves) ? post.saves : []
  const [localLiked, setLocalLiked] = useState(user ? likes.includes(user.id) : false)
  const [localLikeCount, setLocalLikeCount] = useState(likes.length)
  const [localSaved, setLocalSaved] = useState(user ? saves.includes(user.id) : false)

  const author = useUser(post.authorId)
  const isOwn = user && post.authorId === user.id
  const commentCount = store.getCommentCount(post.id)

  const handleLike = () => {
    if (!user) return
    setLocalLiked(prev => !prev)
    setLocalLikeCount(prev => localLiked ? prev - 1 : prev + 1)
    // Still use local store for likes (will migrate later)
    store.toggleLike(post.id, user.id)
    store.refresh()
  }

  const handleSave = () => {
    if (!user) return
    setLocalSaved(prev => !prev)
    store.toggleSave(post.id, user.id)
    store.refresh()
    if (!localSaved) addToast('Atesorado')
  }

  const handleShare = () => {
    const url = `${window.location.origin}/murmullo/${post.id}`
    navigator.clipboard.writeText(url).then(() => {
      addToast('Enlace copiado', 'copied')
    })
  }

  const handleDelete = async () => {
    try {
      await deletePostApi(post.id)
      setShowMenu(false)
      addToast('Murmullo eliminado')
      if (onRefresh) onRefresh()
    } catch {
      addToast('No se pudo eliminar', 'error')
    }
  }

  const displayTime = timeAgo(post.createdAt)

  return (
    <>
      <article className={`rounded-3xl border border-warm-200/50 ${bgStyles[post.bgStyle] || bgStyles.warm}
                         p-6 sm:p-8 transition-all duration-300 hover:shadow-md hover:shadow-warm-200/30 animate-fade-in`}>

        {/* ── Text First ── */}
        <div
          className={`mb-6 ${featured ? 'py-6' : 'py-3'} cursor-pointer`}
          onClick={() => navigate(`/murmullo/${post.id}`)}
        >
          <p className={`font-serif leading-relaxed text-warm-800 whitespace-pre-line
            ${featured ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}
            ${(post.text || '').length < 80 ? 'text-center' : ''}`}>
            {post.text || ''}
          </p>
        </div>

        {/* ── Category ── */}
        {post.category && (
          <div className="mb-5">
            <span className="text-xs font-medium text-lavender-400 tracking-wide uppercase">
              {post.category}
            </span>
          </div>
        )}

        {/* ── Author ── */}
        <div className="flex items-center justify-between mb-5">
          <Link
            to={isOwn ? '/perfil' : `/u/${author?.username || post.authorId}`}
            className="flex items-center gap-2.5 group"
          >
            <Avatar name={author?.name || '?'} size="xs" />
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-medium text-warm-700 group-hover:text-rose-400 transition-colors">
                {author?.name || 'Anónimo'}
              </span>
              <span className="text-xs text-warm-400">· {displayTime}</span>
              {post.editedAt && <span className="text-xs text-warm-300 italic">editado</span>}
            </div>
          </Link>

          {isOwn && (
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-1.5 rounded-lg hover:bg-warm-100/60 text-warm-300 hover:text-warm-500 transition-all"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-8 bg-white rounded-2xl shadow-lg border border-warm-200/60 py-2 z-20 min-w-[160px]">
                    {onEdit && (
                      <button
                        onClick={() => { onEdit(post); setShowMenu(false) }}
                        className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-warm-700 hover:bg-warm-50 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                        Editar
                      </button>
                    )}
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* ── Interactions ── */}
        <div className="flex items-center justify-between pt-4 border-t border-warm-200/30">
          <div className="flex items-center gap-0.5">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-xl transition-all duration-300 active:scale-90
                ${localLiked ? 'text-rose-400' : 'text-warm-300 hover:text-rose-300'}`}
              title="Resonar"
            >
              <Heart className={`w-[18px] h-[18px] transition-all duration-300 ${localLiked ? 'fill-rose-400 scale-110' : ''}`} />
              {localLikeCount > 0 && <span className="text-xs font-medium">{localLikeCount}</span>}
            </button>

            <button
              onClick={() => setShowComments(true)}
              className="flex items-center gap-1.5 py-2 px-3 rounded-xl text-warm-300 hover:text-lavender-400 transition-all duration-200 active:scale-95"
              title="Susurros"
            >
              <MessageCircle className="w-[18px] h-[18px]" />
              {commentCount > 0 && <span className="text-xs font-medium">{commentCount}</span>}
            </button>

            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-xl transition-all duration-300 active:scale-90
                ${localSaved ? 'text-warm-700' : 'text-warm-300 hover:text-warm-500'}`}
              title="Atesorar"
            >
              <Bookmark className={`w-[18px] h-[18px] transition-all duration-300 ${localSaved ? 'fill-warm-700' : ''}`} />
            </button>
          </div>

          <button
            onClick={handleShare}
            className="py-2 px-3 rounded-xl text-warm-300 hover:text-rose-300 transition-all duration-200 active:scale-95"
            title="Compartir"
          >
            <Share2 className="w-[16px] h-[16px]" />
          </button>
        </div>
      </article>

      <CommentPanel postId={post.id} isOpen={showComments} onClose={() => setShowComments(false)} />
    </>
  )
}
