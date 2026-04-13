import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, RefreshCw, EyeOff } from 'lucide-react'
import Layout from '../components/Layout'
import Avatar from '../components/Avatar'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/Toast'
import { createPost } from '../api/posts'

const tagOptions = ['Poesía', 'Reflexión', 'Pensamientos', 'Motivación', 'Amor', 'Desamor', 'Vida']

const prompts = [
  '¿Qué pensaste hoy que no dijiste?',
  'Algo que te gustaría decirle a alguien...',
  'Una idea que no podés sacarte de la cabeza',
  'Escribe como si nadie estuviera leyendo...',
  '¿Qué sientes que necesita ser dicho?',
  'Algo que aprendiste de la forma difícil',
  'Un recuerdo que vuelve sin avisar',
  'Lo que no cabe en una conversación...',
  'Si pudieras dejar un mensaje al mundo, ¿cuál sería?',
  'Eso que pensás en el colectivo y nunca decís...',
]

function getRandomPrompt(exclude) {
  const options = prompts.filter(p => p !== exclude)
  return options[Math.floor(Math.random() * options.length)]
}

export default function Create() {
  const { user } = useAuth()
  const { addToast } = useToast()
  const [text, setText] = useState('')
  const [tags, setTags] = useState([])
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [prompt, setPrompt] = useState(() => getRandomPrompt())
  const [isPublishing, setIsPublishing] = useState(false)
  const navigate = useNavigate()

  const charCount = text.length
  const maxChars = 2000

  const toggleTag = (tag) => {
    setTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const handlePublish = async () => {
    if (!text.trim() || !user || isPublishing) return
    setIsPublishing(true)

    try {
      await createPost(text.trim(), user.id, { tags, isAnonymous })
      addToast('Tu murmullo fue enviado al mundo')
      navigate('/feed')
    } catch (err) {
      addToast('No se pudo publicar. Intenta de nuevo.', 'error')
      setIsPublishing(false)
    }
  }

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 rounded-xl text-warm-400 hover:text-warm-700 active:bg-warm-100 transition-colors"
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

        {/* Prompt */}
        <div className="flex items-start gap-2 mb-6">
          <p className="text-sm text-warm-400 italic font-serif leading-relaxed flex-1">
            {prompt}
          </p>
          <button
            onClick={() => setPrompt(getRandomPrompt(prompt))}
            className="p-2 rounded-xl text-warm-300 hover:text-warm-500 active:bg-warm-100 transition-all shrink-0"
            title="Otro prompt"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Writing area */}
        <div className="mb-8">
          {/* Author line */}
          <div className="flex items-center gap-2.5 mb-4">
            {isAnonymous ? (
              <>
                <div className="w-7 h-7 rounded-full bg-warm-200 flex items-center justify-center">
                  <EyeOff className="w-3.5 h-3.5 text-warm-400" />
                </div>
                <span className="text-sm text-warm-400 italic">Anónimo</span>
              </>
            ) : (
              <>
                <Avatar name={user?.name || '?'} size="xs" />
                <span className="text-sm text-warm-500">{user?.name}</span>
              </>
            )}
          </div>

          {/* Textarea */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, maxChars))}
            placeholder="Escribe lo que necesites decir..."
            className="w-full min-h-[40vh] sm:min-h-[320px] bg-transparent font-serif text-lg sm:text-xl text-warm-800
                     placeholder:text-warm-300 leading-[1.8] focus:outline-none"
            autoFocus
          />

          {/* Char count */}
          <div className="flex justify-end pt-2 border-t border-warm-100">
            <span className={`text-xs tabular-nums ${charCount > maxChars * 0.9 ? 'text-rose-400' : 'text-warm-300'}`}>
              {charCount} / {maxChars}
            </span>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-5 pb-8">
          {/* Anonymous */}
          <button
            onClick={() => setIsAnonymous(!isAnonymous)}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border transition-all duration-200 w-full sm:w-auto
              ${isAnonymous
                ? 'border-warm-700 bg-warm-800 text-white'
                : 'border-warm-200 text-warm-500 active:bg-warm-50'
              }`}
          >
            <EyeOff className="w-4 h-4" />
            <span className="text-sm font-medium">Publicar como anónimo</span>
          </button>

          {/* Tags */}
          <div>
            <p className="text-xs font-medium text-warm-400 mb-2.5 uppercase tracking-wider">
              Etiquetas {tags.length > 0 && <span className="text-lavender-400 normal-case">({tags.length})</span>}
            </p>
            <div className="flex flex-wrap gap-2">
              {tagOptions.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 active:scale-95
                    ${tags.includes(tag)
                      ? 'bg-lavender-300 text-white shadow-sm'
                      : 'bg-warm-100 text-warm-500 active:bg-warm-200'
                    }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
