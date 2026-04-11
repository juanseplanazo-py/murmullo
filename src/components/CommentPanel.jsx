import { useState } from 'react'
import { X, Send, Trash2 } from 'lucide-react'
import Avatar from './Avatar'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { useToast } from './Toast'
import { timeAgo } from '../utils/time'

export default function CommentPanel({ postId, isOpen, onClose }) {
  const { user } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const [text, setText] = useState('')

  if (!isOpen) return null

  const comments = store.getPostComments(postId)
  const post = store.getPost(postId)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim() || !user) return
    store.addComment(postId, user.id, text.trim())
    setText('')
    addToast('Tu susurro fue enviado')
    store.refresh()
  }

  const handleDelete = (commentId) => {
    store.deleteComment(commentId)
    store.refresh()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-warm-900/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl md:rounded-3xl shadow-xl border border-warm-200/60
                    max-h-[80vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-warm-200/40 shrink-0">
          <h3 className="font-serif text-lg font-semibold text-warm-900">
            Susurros
            {comments.length > 0 && (
              <span className="text-warm-400 font-sans text-sm font-normal ml-2">{comments.length}</span>
            )}
          </h3>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-warm-100 text-warm-400 hover:text-warm-600 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {comments.length === 0 ? (
            <div className="text-center py-10">
              <p className="font-serif text-warm-400 italic text-lg mb-1">Silencio...</p>
              <p className="text-sm text-warm-400">Sé la primera voz en responder a este murmullo.</p>
            </div>
          ) : (
            comments.map((comment) => {
              const author = store.getUser(comment.userId)
              const isOwn = user && comment.userId === user.id
              return (
                <div key={comment.id} className="flex gap-3 group">
                  <Avatar name={author?.name || '?'} size="xs" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="text-sm font-medium text-warm-900">{author?.name || 'Anónimo'}</span>
                      <span className="text-xs text-warm-400">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-warm-700 leading-relaxed mt-0.5">{comment.text}</p>
                  </div>
                  {isOwn && (
                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-50
                               text-warm-300 hover:text-rose-400 transition-all shrink-0 self-start"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )
            })
          )}
        </div>

        {/* Compose */}
        <form onSubmit={handleSubmit} className="p-4 border-t border-warm-200/40 shrink-0">
          <div className="flex items-center gap-3">
            <Avatar name={user?.name || '?'} size="xs" />
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Deja un susurro..."
              className="flex-1 bg-warm-50 border border-warm-200/60 rounded-full px-4 py-2.5 text-sm
                       text-warm-900 placeholder:text-warm-400
                       focus:outline-none focus:ring-2 focus:ring-rose-300/40 focus:border-rose-300
                       transition-all duration-200"
              maxLength={300}
            />
            <button
              type="submit"
              disabled={!text.trim()}
              className="p-2.5 rounded-full bg-rose-300 hover:bg-rose-400 text-white
                       disabled:opacity-30 disabled:cursor-not-allowed
                       transition-all duration-200 active:scale-95 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
