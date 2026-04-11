import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Palette } from 'lucide-react'
import Layout from '../components/Layout'
import Avatar from '../components/Avatar'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import { createPost } from '../api/posts'

const categories = ['Poesía', 'Reflexión', 'Pensamientos', 'Motivación', 'Amor', 'Desamor', 'Vida']

const bgOptions = [
  { id: 'warm', label: 'Cálido', gradient: 'bg-gradient-to-br from-warm-50 via-white to-warm-100/50', dot: 'bg-warm-300' },
  { id: 'rose', label: 'Rosa', gradient: 'bg-gradient-to-br from-rose-100/30 via-white to-rose-100/20', dot: 'bg-rose-300' },
  { id: 'lavender', label: 'Lavanda', gradient: 'bg-gradient-to-br from-lavender-100/30 via-white to-lavender-100/20', dot: 'bg-lavender-300' },
]

const prompts = [
  '¿Qué quieres dejarle al mundo hoy?',
  'Escribe como si nadie estuviera leyendo...',
  'Deja que las palabras encuentren su camino...',
  '¿Qué sientes que necesita ser dicho?',
  'A veces basta con una frase...',
]

export default function Create() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [text, setText] = useState('')
  const [category, setCategory] = useState('')
  const [bgStyle, setBgStyle] = useState('warm')
  const [prompt] = useState(() => prompts[Math.floor(Math.random() * prompts.length)])
  const [isPublishing, setIsPublishing] = useState(false)
  const navigate = useNavigate()

  const charCount = text.length
  const maxChars = 500
  const selectedBg = bgOptions.find(b => b.id === bgStyle)

  const handlePublish = async () => {
    if (!text.trim() || !user || isPublishing) return
    setIsPublishing(true)

    try {
      await createPost(text.trim(), user.id)
      addToast('Tu murmullo fue enviado al mundo')
      navigate('/feed')
    } catch (err) {
      addToast('No se pudo publicar. Intenta de nuevo.', 'error')
      setIsPublishing(false)
    }
  }

  return (
    <Layout>
      <div className="page-container max-w-2xl mx-auto">
        {/* Header — minimal */}
        <div className="flex items-center justify-between mb-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-warm-400 hover:text-warm-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handlePublish}
            disabled={!text.trim() || isPublishing}
            className="btn-primary text-sm py-2.5 px-6 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Enviando...
              </span>
            ) : (
              'Publicar'
            )}
          </button>
        </div>

        {/* Writing Space — the ritual */}
        <div className={`rounded-3xl border border-warm-200/40 ${selectedBg.gradient} p-8 sm:p-12 mb-8 transition-all duration-500`}>
          {/* Author */}
          <div className="flex items-center gap-3 mb-8 opacity-60">
            <Avatar name={user?.name || '?'} size="sm" />
            <span className="text-sm text-warm-500">{user?.name}</span>
          </div>

          {/* The Writing Area — generous, focused */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, maxChars))}
            placeholder={prompt}
            className="w-full min-h-[280px] bg-transparent font-serif text-xl sm:text-2xl text-warm-800
                     placeholder:text-warm-300/80 placeholder:italic leading-relaxed focus:outline-none"
            autoFocus
          />

          {/* Subtle counter */}
          <div className="flex items-center justify-between mt-6 pt-5 border-t border-warm-200/20">
            <div className="flex items-center gap-2 opacity-50">
              <Sparkles className="w-4 h-4 text-lavender-300" />
              <span className="text-xs text-warm-400 italic">Sin prisa</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-7 h-7 -rotate-90 opacity-40" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15" fill="none" stroke="#E8D5C4" strokeWidth="1.5" />
                <circle
                  cx="18" cy="18" r="15" fill="none"
                  stroke={charCount > maxChars * 0.9 ? '#D4A9A9' : '#C4B1D4'}
                  strokeWidth="1.5"
                  strokeDasharray={`${(charCount / maxChars) * 94.2} 94.2`}
                  strokeLinecap="round"
                />
              </svg>
              <span className={`text-xs ${charCount > maxChars * 0.9 ? 'text-rose-400' : 'text-warm-300'}`}>
                {maxChars - charCount}
              </span>
            </div>
          </div>
        </div>

        {/* Options — collapsed, secondary */}
        <div className="space-y-5 opacity-80 hover:opacity-100 transition-opacity duration-300">
          {/* Category */}
          <div>
            <label className="text-xs font-medium text-warm-400 mb-2.5 block uppercase tracking-wider">Categoría</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat === category ? '' : cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200
                    ${category === cat
                      ? 'bg-lavender-300 text-white shadow-sm'
                      : 'bg-warm-100/60 text-warm-500 hover:bg-warm-200/60 hover:text-warm-700'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Background */}
          <div>
            <label className="text-xs font-medium text-warm-400 mb-2.5 flex items-center gap-2 uppercase tracking-wider">
              <Palette className="w-3.5 h-3.5" />
              Atmósfera
            </label>
            <div className="flex gap-3">
              {bgOptions.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setBgStyle(bg.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-200
                    ${bgStyle === bg.id ? 'border-rose-300 shadow-sm' : 'border-warm-200/40 hover:border-warm-300/60'}`}
                >
                  <div className={`w-4 h-4 rounded-full ${bg.dot}`} />
                  <span className="text-xs font-medium text-warm-600">{bg.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
