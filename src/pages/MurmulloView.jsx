import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Heart, MessageCircle, Bookmark, Share2, Trash2, Pencil, Send } from 'lucide-react'
import Layout from '../components/Layout'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'
import EditPostModal from '../components/EditPostModal'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { useUser } from '../hooks/useUser'
import { useToast } from '../components/Toast'
import { timeAgo, formatDate } from '../utils/time'

const bgStyles = {
  warm: 'bg-gradient-to-br from-warm-50 via-white to-warm-100/50',
  rose: 'bg-gradient-to-br from-rose-100/30 via-white to-rose-100/20',
  lavender: 'bg-gradient-to-br from-lavender-100/30 via-white to-lavender-100/20',
}

export default function MurmulloView() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const [commentText, setCommentText] = useState('')
  const [editingPost, setEditingPost] = useState(null)

  const post = store.getPost(id)

  if (!post) {
    return (
      <Layout>
        <div className="page-container max-w-2xl mx-auto pt-10">
          <EmptyState
            icon={ArrowLeft}
            title="Este murmullo ya no existe"
            description="Quizás fue eliminado o el enlace no es correcto."
            actionLabel="Volver al inicio"
            actionTo="/feed"
          />
        </div>
      </Layout>
    )
  }

  const author = useUser(post.authorId)
  const comments = store.getPostComments(post.id)
  const isOwn = user && post.authorId === user.id
  const likes = Array.isArray(post.likes) ? post.likes : []
  const saves = Array.isArray(post.saves) ? post.saves : []
  const isLiked = user && likes.includes(user.id)
  const isSaved = user && saves.includes(user.id)

  const handleLike = () => {
    if (!user) return
    store.toggleLike(post.id, user.id)
    store.refresh()
  }

  const handleSave = () => {
    if (!user) return
    store.toggleSave(post.id, user.id)
    store.refresh()
    if (!isSaved) addToast('Atesorado')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      addToast('Enlace copiado', 'copied')
    })
  }

  const handleDelete = () => {
    store.deletePost(post.id)
    store.refresh()
    addToast('Murmullo eliminado')
    navigate('/feed')
  }

  const handleComment = (e) => {
    e.preventDefault()
    if (!commentText.trim() || !user) return
    store.addComment(post.id, user.id, commentText.trim())
    setCommentText('')
    store.refresh()
    addToast('Susurro enviado')
  }

  return (
    <Layout>
      <div className="page-container max-w-2xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-warm-400 hover:text-warm-700 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm">Volver</span>
        </button>

        {/* The Murmullo — full stage */}
        <div className={`rounded-3xl border border-warm-200/40 ${bgStyles[post.bgStyle] || bgStyles.warm} p-8 sm:p-12 mb-2`}>
          <p className={`font-serif text-2xl sm:text-3xl leading-relaxed text-warm-800 whitespace-pre-line
            ${(post.text || '').length < 100 ? 'text-center' : ''}`}>
            {post.text || ''}
          </p>
        </div>

        {/* Category */}
        {post.category && (
          <div className="px-4 mb-4">
            <span className="text-xs font-medium text-lavender-400 tracking-wide uppercase">{post.category}</span>
          </div>
        )}

        {/* Author + meta */}
        <div className="px-4 mb-6">
          <Link
            to={isOwn ? '/perfil' : `/u/${author?.username}`}
            className="flex items-center gap-3 group"
          >
            <Avatar name={author?.name || '?'} size="sm" />
            <div>
              <span className="text-sm font-medium text-warm-800 group-hover:text-rose-400 transition-colors">
                {author?.name || 'Anónimo'}
              </span>
              <p className="text-xs text-warm-400">
                @{author?.username} · {new Date(post.createdAt).toLocaleDateString('es-ES', {
                  day: 'numeric', month: 'long', year: 'numeric'
                })}
                {post.editedAt && <span className="italic ml-1">· editado</span>}
              </p>
            </div>
          </Link>
        </div>

        {/* Actions bar */}
        <div className="flex items-center justify-between px-4 py-4 border-y border-warm-200/30 mb-8">
          <div className="flex items-center gap-1">
            <button onClick={handleLike}
              className={`flex items-center gap-1.5 py-2 px-3 rounded-xl transition-all duration-300 active:scale-90
                ${isLiked ? 'text-rose-400' : 'text-warm-300 hover:text-rose-300'}`}>
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-rose-400' : ''}`} />
              {likes.length > 0 && <span className="text-sm">{likes.length}</span>}
            </button>
            <span className="text-warm-200 mx-1">·</span>
            <span className="text-sm text-warm-400">{comments.length} susurros</span>
          </div>

          <div className="flex items-center gap-1">
            <button onClick={handleSave}
              className={`p-2 rounded-xl transition-all active:scale-90
                ${isSaved ? 'text-warm-700' : 'text-warm-300 hover:text-warm-500'}`}>
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-warm-700' : ''}`} />
            </button>
            <button onClick={handleShare}
              className="p-2 rounded-xl text-warm-300 hover:text-rose-300 transition-all active:scale-95">
              <Share2 className="w-4 h-4" />
            </button>
            {isOwn && (
              <>
                <button onClick={() => setEditingPost(post)}
                  className="p-2 rounded-xl text-warm-300 hover:text-warm-600 transition-all">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={handleDelete}
                  className="p-2 rounded-xl text-warm-300 hover:text-rose-400 transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Comments / Susurros */}
        <div>
          <h3 className="font-serif text-lg font-semibold text-warm-800 mb-5 px-1">Susurros</h3>

          {/* Compose */}
          <form onSubmit={handleComment} className="flex items-center gap-3 mb-8">
            <Avatar name={user?.name || '?'} size="sm" />
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Deja un susurro..."
              className="flex-1 bg-warm-50 border border-warm-200/50 rounded-full px-5 py-3 text-sm
                       text-warm-900 placeholder:text-warm-300
                       focus:outline-none focus:ring-2 focus:ring-rose-300/30 focus:border-rose-300 transition-all"
              maxLength={300}
            />
            <button type="submit" disabled={!commentText.trim()}
              className="p-3 rounded-full bg-rose-300 hover:bg-rose-400 text-white
                       disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm">
              <Send className="w-4 h-4" />
            </button>
          </form>

          {/* Comment list */}
          {comments.length > 0 ? (
            <div className="space-y-5">
              {comments.map((comment) => {
                const cAuthor = store.getUser(comment.userId)
                const cIsOwn = user && comment.userId === user.id
                return (
                  <div key={comment.id} className="flex gap-3 group">
                    <Avatar name={cAuthor?.name || '?'} size="xs" />
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-sm font-medium text-warm-800">{cAuthor?.name || 'Anónimo'}</span>
                        <span className="text-xs text-warm-300">{timeAgo(comment.createdAt)}</span>
                      </div>
                      <p className="text-sm text-warm-600 leading-relaxed mt-0.5">{comment.text}</p>
                    </div>
                    {cIsOwn && (
                      <button
                        onClick={() => { store.deleteComment(comment.id); store.refresh() }}
                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-50 text-warm-200 hover:text-rose-400 transition-all shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="font-serif text-warm-300 italic">Silencio...</p>
              <p className="text-xs text-warm-300 mt-1">Sé la primera voz en responder.</p>
            </div>
          )}
        </div>
      </div>

      {editingPost && (
        <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} />
      )}
    </Layout>
  )
}
