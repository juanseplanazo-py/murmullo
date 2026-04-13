import { useState, useEffect, useCallback, useMemo } from 'react'
import { Feather, PenLine, BookOpen, Loader2, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import MurmulloCard from '../components/MurmulloCard'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'
import EditPostModal from '../components/EditPostModal'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { getPosts } from '../api/posts'

const tags = ['Todo', 'Poesía', 'Reflexión', 'Pensamientos', 'Motivación', 'Amor', 'Desamor', 'Vida']

const writingPrompts = [
  '¿Qué pensaste hoy que no dijiste?',
  'Algo que te gustaría decirle a alguien',
  'Una idea que no podés sacarte de la cabeza',
  '¿Qué te hubiera gustado escuchar hoy?',
  'Escribí algo que todavía no sabés cómo explicar',
  '¿Qué parte de vos estuvo en silencio hoy?',
]

export default function Feed() {
  const { user } = useAuth()
  const store = useStore()

  const [activeTag, setActiveTag] = useState('Todo')
  const [editingPost, setEditingPost] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [promptIndex, setPromptIndex] = useState(() => Math.floor(Math.random() * writingPrompts.length))

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getPosts()
      setPosts(Array.isArray(data) ? data : [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  const filteredPosts = useMemo(() => {
    if (activeTag === 'Todo') return posts
    return posts.filter((p) => Array.isArray(p.tags) && p.tags.includes(activeTag))
  }, [posts, activeTag])

  const firstName = user?.name?.split(' ')[0] || ''
  const myPostsCount = posts.filter((p) => p.authorId === user?.id).length
  const currentPrompt = writingPrompts[promptIndex]

  const feedItems = useMemo(() => {
    if (!filteredPosts.length) return []

    const items = []

    filteredPosts.forEach((post, index) => {
      items.push({
        type: index === 0 && activeTag === 'Todo' ? 'featured-post' : 'post',
        post,
        key: `post-${post.id}`,
      })

      if (index === 1) {
        items.push({
          type: 'prompt',
          key: 'prompt-block-main',
        })
      }

      if (index === 4 && filteredPosts.length > 6) {
        items.push({
          type: 'quote-break',
          key: 'quote-break-1',
        })
      }
    })

    return items
  }, [filteredPosts, activeTag])

  const changePrompt = () => {
    setPromptIndex((prev) => (prev + 1) % writingPrompts.length)
  }

  return (
    <Layout>
      <div className="page-container">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Main Feed */}
          <div className="flex-1 max-w-3xl mx-auto w-full lg:mx-0">
            {/* Greeting + Write prompt */}
            <div className="mb-6 sm:mb-8">
              <h1 className="font-serif text-2xl sm:text-3xl text-warm-800 mb-4">
                {getGreeting()}, {firstName}
              </h1>

              <Link
                to="/escribir"
                className="flex items-center gap-3 bg-white border border-warm-200/50 rounded-3xl px-4 py-4 sm:px-5 sm:py-5 hover:shadow-sm transition-all group"
              >
                <Avatar name={user?.name || '?'} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-warm-400 text-sm sm:text-base font-serif italic group-hover:text-warm-500 transition-colors">
                    ¿Qué quieres dejarle al mundo hoy?
                  </p>
                </div>
                <div className="p-2.5 bg-rose-300 group-hover:bg-rose-400 text-white rounded-2xl transition-colors shrink-0">
                  <PenLine className="w-4 h-4" />
                </div>
              </Link>
            </div>

            {/* Tag filters */}
            {posts.length > 0 && (
              <div className="flex gap-2 mb-6 sm:mb-8 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setActiveTag(tag)}
                    className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95
                      ${
                        activeTag === tag
                          ? 'bg-warm-900 text-white shadow-sm'
                          : 'text-warm-500 hover:text-warm-700 hover:bg-warm-100'
                      }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}

            {/* Posts */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-6 h-6 text-rose-300 animate-spin" />
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-5 sm:space-y-7">
                {feedItems.map((item) => {
                  if (item.type === 'featured-post') {
                    return (
                      <section
                        key={item.key}
                        className="rounded-[28px] bg-white border border-warm-200/50 p-3 sm:p-4 shadow-sm"
                      >
                        <div className="mb-3 px-2 pt-1">
                          <p className="text-[11px] uppercase tracking-[0.18em] text-rose-400 font-medium">
                            Murmullo destacado
                          </p>
                        </div>

                        <MurmulloCard
                          post={item.post}
                          featured
                          onEdit={item.post.authorId === user?.id ? setEditingPost : undefined}
                          onRefresh={loadPosts}
                        />
                      </section>
                    )
                  }

                  if (item.type === 'prompt') {
                    return (
                      <PromptCard
                        key={item.key}
                        prompt={currentPrompt}
                        onChangePrompt={changePrompt}
                      />
                    )
                  }

                  if (item.type === 'quote-break') {
                    return <FeedBreak key={item.key} />
                  }

                  return (
                    <div key={item.key} className="transition-all">
                      <MurmulloCard
                        post={item.post}
                        onEdit={item.post.authorId === user?.id ? setEditingPost : undefined}
                        onRefresh={loadPosts}
                      />
                    </div>
                  )
                })}
              </div>
            ) : (
              <EmptyState
                icon={activeTag === 'Todo' ? Feather : BookOpen}
                title={
                  activeTag === 'Todo'
                    ? 'El silencio también es hermoso'
                    : `Nada en "${activeTag}" todavía`
                }
                description={
                  activeTag === 'Todo'
                    ? 'Tu río de murmullos está esperando. Escribe algo o descubre voces que te inspiren.'
                    : 'Sé quien deje el primer murmullo en esta etiqueta.'
                }
                actionLabel="Dejar mi primer murmullo"
                actionTo="/escribir"
              />
            )}
          </div>

          {/* Right Sidebar — desktop only */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20 space-y-6">
              {/* Profile summary */}
              <div className="card p-5 rounded-[28px]">
                <Link to="/perfil" className="flex items-center gap-3 mb-3 group">
                  <Avatar name={user?.name || '?'} size="md" />
                  <div>
                    <p className="text-sm font-medium text-warm-900 group-hover:text-rose-400 transition-colors">
                      {user?.name}
                    </p>
                    <p className="text-xs text-warm-400">@{user?.username}</p>
                  </div>
                </Link>

                <div className="flex items-center gap-4 text-xs pt-3 border-t border-warm-200/30">
                  <div>
                    <span className="font-semibold text-warm-800">{myPostsCount}</span>
                    <span className="text-warm-400 ml-1">murmullos</span>
                  </div>
                  <div>
                    <span className="font-semibold text-warm-800">
                      {store.getFollowerCount(user?.id)}
                    </span>
                    <span className="text-warm-400 ml-1">oyentes</span>
                  </div>
                </div>
              </div>

              {/* First steps */}
              {myPostsCount < 3 && (
                <div className="card p-5 rounded-[28px]">
                  <h3 className="font-serif text-sm font-semibold text-warm-800 mb-3">
                    Primeros pasos
                  </h3>
                  <ul className="space-y-2.5">
                    <StepItem done={posts.some((p) => p.authorId === user?.id)} text="Deja tu primer murmullo" />
                    <StepItem done={!!user?.bio} text="Escribe tu bio" />
                    <StepItem done={store.getFollowingCount(user?.id) > 0} text="Escucha a alguien" />
                  </ul>
                </div>
              )}

              <div className="rounded-[28px] border border-warm-200/40 bg-white p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-2xl bg-rose-100 text-rose-400">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-serif text-sm text-warm-800 mb-1">
                      Escribe sin apuro
                    </p>
                    <p className="text-xs leading-5 text-warm-400">
                      Murmullo no se trata de hacer ruido, sino de dejar algo verdadero.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-2 text-[11px] text-warm-300 space-x-3">
                <a href="#" className="hover:text-rose-400 transition-colors">
                  Acerca de
                </a>
                <a href="#" className="hover:text-rose-400 transition-colors">
                  Privacidad
                </a>
                <span className="block mt-2">Murmullo 2026</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => {
            setEditingPost(null)
            loadPosts()
          }}
        />
      )}
    </Layout>
  )
}

function PromptCard({ prompt, onChangePrompt }) {
  return (
    <div className="rounded-[28px] border border-rose-200/60 bg-gradient-to-br from-rose-50 to-white p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <div className="p-2.5 rounded-2xl bg-white text-rose-400 shadow-sm shrink-0">
          <PenLine className="w-4 h-4" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-[0.16em] text-rose-400 font-medium mb-2">
            Prompt para escribir
          </p>

          <h3 className="font-serif text-lg sm:text-xl text-warm-800 leading-8 mb-4">
            {prompt}
          </h3>

          <div className="flex flex-wrap gap-2">
            <Link
              to="/escribir"
              className="inline-flex items-center justify-center rounded-2xl bg-warm-900 text-white px-4 py-2.5 text-sm font-medium hover:opacity-95 transition"
            >
              Escribir ahora
            </Link>

            <button
              onClick={onChangePrompt}
              className="inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium text-warm-600 bg-white border border-warm-200 hover:bg-warm-50 transition"
            >
              Ver otro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeedBreak() {
  return (
    <div className="py-2 sm:py-4">
      <div className="rounded-[28px] bg-warm-50/80 border border-warm-200/40 px-5 py-6 sm:px-7 sm:py-7 text-center">
        <p className="font-serif text-lg sm:text-xl text-warm-700 leading-8">
          A veces un solo texto basta para quedarse pensando el resto del día.
        </p>
      </div>
    </div>
  )
}

function StepItem({ done, text }) {
  return (
    <li className="flex items-center gap-2.5 text-xs">
      <div
        className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0
        ${done ? 'bg-rose-300 border-rose-300' : 'border-warm-300'}`}
      >
        {done && (
          <svg
            className="w-2.5 h-2.5 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={done ? 'text-warm-300 line-through' : 'text-warm-600'}>
        {text}
      </span>
    </li>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 6) return 'Buenas noches'
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}
