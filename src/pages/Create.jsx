import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Sparkles, Palette } from 'lucide-react'
import Layout from '../components/Layout'
import Avatar from '../components/Avatar'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

const categories = ['Poesía', 'Reflexión', 'Pensamientos', 'Motivación', 'Amor', 'Desamor', 'Vida']

const bgOptions = [
  { id: 'warm', label: 'Cálido', gradient: 'bg-gradient-to-br from-warm-50 to-warm-100', preview: 'bg-warm-200' },
  { id: 'rose', label: 'Rosa', gradient: 'bg-gradient-to-br from-rose-100/40 to-warm-50', preview: 'bg-rose-200' },
  { id: 'lavender', label: 'Lavanda', gradient: 'bg-gradient-to-br from-lavender-100/40 to-warm-50', preview: 'bg-lavender-200' },
]

export default function Create() {
  const { user } = useAuth()
  const { createPost } = useData()
  const [text, setText] = useState('')
  const [category, setCategory] = useState('')
  const [bgStyle, setBgStyle] = useState('warm')
  const navigate = useNavigate()

  const charCount = text.length
  const maxChars = 500
  const selectedBg = bgOptions.find(b => b.id === bgStyle)

  const handlePublish = () => {
    if (!text.trim() || !user) return

    createPost({
      text: text.trim(),
      category: category || null,
      bgStyle,
      authorId: user.id,
      authorName: user.name,
      authorUsername: user.username,
    })

    navigate('/feed')
  }

  return (
    <Layout>
      <div className="page-container max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-warm-600 hover:text-warm-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Volver</span>
          </button>
          <button
            onClick={handlePublish}
            disabled={!text.trim()}
            className="btn-primary text-sm py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Publicar
          </button>
        </div>

        {/* Writing Card */}
        <div className={`card ${selectedBg.gradient} p-8 md:p-10 mb-6`}>
          {/* Author */}
          <div className="flex items-center gap-3 mb-6">
            <Avatar name={user?.name || '?'} size="md" />
            <div>
              <p className="font-medium text-warm-900">{user?.name}</p>
              <p className="text-sm text-warm-500">@{user?.username}</p>
            </div>
          </div>

          {/* Text Area */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, maxChars))}
            placeholder="Escribe algo que haga suspirar al mundo..."
            className="w-full min-h-[240px] bg-transparent font-serif text-xl md:text-2xl text-warm-800
                     placeholder:text-warm-300 leading-relaxed focus:outline-none"
            autoFocus
          />

          {/* Character Counter */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-warm-200/30">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-lavender-300" />
              <span className="text-xs text-warm-400">Deja que las palabras fluyan</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full relative">
                <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15" fill="none" stroke="#E8D5C4" strokeWidth="2" />
                  <circle
                    cx="18" cy="18" r="15" fill="none"
                    stroke={charCount > maxChars * 0.9 ? '#D4A9A9' : '#C4B1D4'}
                    strokeWidth="2"
                    strokeDasharray={`${(charCount / maxChars) * 94.2} 94.2`}
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span className={`text-xs font-medium ${charCount > maxChars * 0.9 ? 'text-rose-400' : 'text-warm-400'}`}>
                {maxChars - charCount}
              </span>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="card p-6 space-y-5">
          {/* Category */}
          <div>
            <label className="text-sm font-medium text-warm-700 mb-3 block">Categoría</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat === category ? '' : cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                    ${category === cat
                      ? 'bg-lavender-300 text-white shadow-sm'
                      : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Background */}
          <div>
            <label className="text-sm font-medium text-warm-700 mb-3 flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Estilo de fondo
            </label>
            <div className="flex gap-3">
              {bgOptions.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => setBgStyle(bg.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 transition-all duration-200
                    ${bgStyle === bg.id
                      ? 'border-rose-400 shadow-sm'
                      : 'border-warm-200/60 hover:border-warm-300'
                    }`}
                >
                  <div className={`w-5 h-5 rounded-full ${bg.preview}`} />
                  <span className="text-sm font-medium text-warm-700">{bg.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {text.trim() && (
          <div className="mt-6 text-center">
            <p className="text-xs text-warm-400">
              Tu murmullo se verá hermoso en el feed
            </p>
          </div>
        )}
      </div>
    </Layout>
  )
}
