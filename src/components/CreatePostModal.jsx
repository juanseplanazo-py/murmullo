import { useState } from 'react'
import { X, Feather, Sparkles } from 'lucide-react'
import Avatar from './Avatar'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

const categories = ['Poesía', 'Reflexión', 'Pensamientos', 'Motivación', 'Amor', 'Desamor', 'Vida']

const bgOptions = [
  { id: 'warm', label: 'Cálido', class: 'bg-warm-100' },
  { id: 'rose', label: 'Rosa', class: 'bg-rose-100' },
  { id: 'lavender', label: 'Lavanda', class: 'bg-lavender-100' },
]

export default function CreatePostModal({ isOpen, onClose }) {
  const { user } = useAuth()
  const { createPost } = useData()
  const [text, setText] = useState('')
  const [category, setCategory] = useState('')
  const [bgStyle, setBgStyle] = useState('warm')

  if (!isOpen || !user) return null

  const charCount = text.length
  const maxChars = 500

  const handleSubmit = () => {
    if (!text.trim()) return

    createPost({
      text: text.trim(),
      category: category || null,
      bgStyle,
      authorId: user.id,
      authorName: user.name,
      authorUsername: user.username,
    })

    setText('')
    setCategory('')
    setBgStyle('warm')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-warm-900/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl border border-warm-200/60 animate-slide-up overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-warm-200/40">
          <div className="flex items-center gap-2">
            <Feather className="w-5 h-5 text-rose-400" />
            <h2 className="font-serif text-lg font-semibold text-warm-900">Nuevo murmullo</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-warm-100 text-warm-400 hover:text-warm-600 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <Avatar name={user.name} size="sm" />
            <div>
              <p className="text-sm font-medium text-warm-900">{user.name}</p>
              <p className="text-xs text-warm-500">@{user.username}</p>
            </div>
          </div>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, maxChars))}
            placeholder="Escribe algo que haga suspirar al mundo..."
            className="w-full min-h-[160px] bg-transparent font-serif text-lg text-warm-800 placeholder:text-warm-300
                     leading-relaxed focus:outline-none"
            autoFocus
          />

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-lavender-300" />
              <span className="text-xs text-warm-400">Deja que fluya</span>
            </div>
            <span className={`text-xs font-medium ${charCount > maxChars * 0.9 ? 'text-rose-400' : 'text-warm-400'}`}>
              {charCount}/{maxChars}
            </span>
          </div>

          {/* Category */}
          <div className="mb-4">
            <p className="text-xs font-medium text-warm-500 mb-2">Categoría</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat === category ? '' : cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                    ${category === cat
                      ? 'bg-lavender-300 text-white'
                      : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Background */}
          <div className="mb-2">
            <p className="text-xs font-medium text-warm-500 mb-2">Fondo</p>
            <div className="flex gap-2">
              {bgOptions.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setBgStyle(bg.id)}
                  className={`w-8 h-8 rounded-full ${bg.class} border-2 transition-all duration-200
                    ${bgStyle === bg.id ? 'border-rose-400 scale-110' : 'border-warm-200 hover:border-warm-300'}`}
                  title={bg.label}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-warm-200/40 flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary text-sm py-2.5 px-6">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={!text.trim()}
            className="btn-primary text-sm py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Publicar
          </button>
        </div>
      </div>
    </div>
  )
}
