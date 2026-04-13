import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Bookmark, Share2, MoreHorizontal, Trash2, Pencil, EyeOff } from 'lucide-react'
import Avatar from './Avatar'
import CommentPanel from './CommentPanel'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { useToast } from './Toast'
import { useUser } from '../hooks/useUser'
import { deletePostApi, toggleLikeApi, toggleSaveApi } from '../api/posts'
import { createNotification } from '../api/notifications'
import { timeAgo } from '../utils/time'

export default function MurmulloCard({ post, onEdit, onRefresh }) {
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

  const author = useUser(post.isAnonymous ? null : post.authorId)
  const isOwn = user && post.authorId === user.id
  const commentCount = store.getCommentCount(post.id)
  const tags = Array.isArray(post.tags) ? post.tags : []
  const postText = post.text || ''
  const isLong = postText.length > 280

  const handleLike = async () => {
    if (!user) return
    const wasLiked = localLiked
    setLocalLiked(prev => !prev)
    setLocalLikeCount(prev => wasLiked ? prev - 1 : prev + 1)
    await toggleLikeApi(post.id, user.id)
    if (!wasLiked && post.authorId !== user.id) {
      createNotification({ userId: post.authorId, fromUserId: user.id, postId: post.id, type: 'like' })
    }
  }

  const handleSave = async () => {
    if (!user) return
    const wasSaved = localSaved
    setLocalSaved(prev => !prev)
    await toggleSaveApi(post.id, user.id)
    if (!wasSaved) addToast('Atesorado')
  }

  const handleShare = () => {
    const url = `${window.location.origin}/murmullo/${post.id}`
    navigator.clipboard.writeText(url).then(() => addToast('Enlace copiado', 'copied'))
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

  return (
    <>
      <article className="bg-white rounded-2xl sm:rounded-3xl border border-warm-200/40
                         px-5 py-6 sm:px-8 sm:py-8 transition-shadow duration-300
                         hover:shadow-sm">

        {/* Author */}
        <div className="flex items-center justify-between mb-5">
          {post.isAnonymous ? (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-warm-100 flex items-center justify-center">
                <EyeOff className="w-4 h-4 text-warm-400" />
              </div>
              <div>
                <span className="text-sm font-medium text-warm-500 italic">Anónimo</span>
                <span className="text-xs text-warm-300 ml-2">· {timeAgo(post.createdAt)}</span>
              </div>
            </div>
          ) : (
            <Link
              to={isOwn ? '/perfil' : `/u/${author?.username || post.authorId}`}
              className="flex items-center gap-2.5 group min-w-0"
            >
              <Avatar name={author?.name || '?'} size="sm" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-warm-800 group-hover:text-rose-400 transition-colors truncate">
                  {author?.name || 'Cargando...'}
                </p>
                <p className="text-xs text-warm-400">
                  {timeAgo(post.createdAt)}
                  {post.editedAt && <span className="italic ml-1">· editado</span>}
                </p>
              </div>
            </Link>
          )}

          {isOwn && (
            <div className="relative shrink-0">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 rounded-xl hover:bg-warm-50 text-warm-300 hover:text-warm-500 transition-all"
              >
                <MoreHorizontal className="w-5 h-5" />
              </button>
              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-lg border border-warm-200/60 py-2 z-20 min-w-[160px]">
                    {onEdit && (
                      <button
                        onClick={() => { onEdit(post); setShowMenu(false) }}
                        className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-warm-700 hover:bg-warm-50 transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                        Editar
                      </button>
                    )}
                    <button
                      onClick={handleDelete}
                      className="flex items-center gap-2.5 w-full px-4 py-3 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
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

        {/* Text — note format */}
        <div
          className="mb-5 cursor-pointer"
          onClick={() => navigate(`/murmullo/${post.id}`)}
        >
          <p className={`font-serif text-warm-800 whitespace-pre-line leading-[1.8]
            ${isLong ? 'text-base sm:text-lg' : 'text-lg sm:text-xl'}
            ${postText.length < 80 ? 'text-center py-4' : ''}`}>
            {postText}
          </p>
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="mb-5 flex flex-wrap gap-1.5">
            {tags.map(tag => (
              <span key={tag} className="text-[11px] font-medium text-lavender-400 bg-lavender-50 px-2.5 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions — minimal, text-priority */}
        <div className="flex items-center justify-between pt-3 border-t border-warm-100">
          <div className="flex items-center -ml-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 py-2.5 px-3 rounded-xl transition-all duration-200 active:scale-90
                ${localLiked ? 'text-rose-400' : 'text-warm-300 hover:text-rose-300'}`}
            >
              <Heart className={`w-5 h-5 transition-all ${localLiked ? 'fill-rose-400' : ''}`} />
              {localLikeCount > 0 && <span className="text-xs font-medium">{localLikeCount}</span>}
            </button>

            <button
              onClick={() => setShowComments(true)}
              className="flex items-center gap-1.5 py-2.5 px-3 rounded-xl text-warm-300 hover:text-lavender-400 transition-all active:scale-95"
            >
              <MessageCircle className="w-5 h-5" />
              {commentCount > 0 && <span className="text-xs font-medium">{commentCount}</span>}
            </button>

            <button
              onClick={handleSave}
              className={`flex items-center gap-1.5 py-2.5 px-3 rounded-xl transition-all duration-200 active:scale-90
                ${localSaved ? 'text-warm-700' : 'text-warm-300 hover:text-warm-500'}`}
            >
              <Bookmark className={`w-5 h-5 transition-all ${localSaved ? 'fill-warm-700' : ''}`} />
            </button>
          </div>

          <button
            onClick={handleShare}
            className="py-2.5 px-3 rounded-xl text-warm-300 hover:text-rose-300 transition-all active:scale-95"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </article>

      <CommentPanel postId={post.id} isOpen={showComments} onClose={() => setShowComments(false)} />
    </>
  )
}
