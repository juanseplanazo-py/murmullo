import { useState } from 'react'
import { X, Sparkles } from 'lucide-react'
import { useStore } from '../context/StoreContext'
import { useToast } from './Toast'

const categories = ['Poesía', 'Reflexión', 'Pensamientos', 'Motivación', 'Amor', 'Desamor', 'Vida']

export default function EditPostModal({ post, onClose }) {
  const store = useStore()
  const { addToast } = useToast()
  const [text, setText] = useState(post.text)
  const [category, setCategory] = useState(post.category || '')

  const maxChars = 500
  const charCount = text.length

  const handleSave = () => {
    if (!text.trim()) return
    store.updatePost(post.id, { text: text.trim(), category: category || null })
    store.refresh()
    addToast('Murmullo actualizado')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-warm-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl border border-warm-200/60 animate-slide-up overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-warm-200/40">
          <h2 className="font-serif text-lg font-semibold text-warm-900">Editar murmullo</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-warm-100 text-warm-400 hover:text-warm-600 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, maxChars))}
            className="w-full min-h-[160px] bg-transparent font-serif text-lg text-warm-800 placeholder:text-warm-300 leading-relaxed focus:outline-none"
            autoFocus
          />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-lavender-300" />
              <span className="text-xs text-warm-400">Reescribe con calma</span>
            </div>
            <span className={`text-xs font-medium ${charCount > maxChars * 0.9 ? 'text-rose-400' : 'text-warm-400'}`}>
              {charCount}/{maxChars}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat === category ? '' : cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                  ${category === cat ? 'bg-lavender-300 text-white' : 'bg-warm-100 text-warm-600 hover:bg-warm-200'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="p-5 border-t border-warm-200/40 flex justify-end gap-3">
          <button onClick={onClose} className="btn-secondary text-sm py-2.5 px-6">Cancelar</button>
          <button
            onClick={handleSave}
            disabled={!text.trim() || text === post.text}
            className="btn-primary text-sm py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  )
}
