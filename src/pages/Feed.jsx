import { useState, useEffect, useCallback } from 'react'
import { Feather, PenLine, BookOpen, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import MurmulloCard from '../components/MurmulloCard'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'
import EditPostModal from '../components/EditPostModal'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { getPosts } from '../api/posts'

const categories = ['Todo', 'Poesía', 'Reflexión', 'Pensamientos', 'Motivación', 'Amor', 'Desamor', 'Vida']

export default function Feed() {
  const { user } = useAuth()
  const store = useStore()
  const [activeCategory, setActiveCategory] = useState('Todo')
  const [editingPost, setEditingPost] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadPosts = useCallback(async () => {
    const data = await getPosts()
    setPosts(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  // Called after creating/editing/deleting a post
  const refreshPosts = useCallback(() => {
    loadPosts()
  }, [loadPosts])

  const filteredPosts = activeCategory === 'Todo'
    ? posts
    : posts.filter(p => p.category === activeCategory)

  const firstName = user?.name?.split(' ')[0] || ''

  return (
    <Layout>
      <div className="page-container">
        <div className="flex gap-10">
          {/* Main Feed */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
            {/* Greeting + Write prompt */}
            <div className="mb-8">
              <h1 className="font-serif text-2xl text-warm-800 mb-4">
                {getGreeting()}, {firstName}
              </h1>
              <Link
                to="/escribir"
                className="block w-full card p-5 hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <Avatar name={user?.name || '?'} size="sm" />
                  <span className="flex-1 text-warm-400 text-sm font-serif italic group-hover:text-warm-500 transition-colors">
                    ¿Qué quieres dejarle al mundo hoy?
                  </span>
                  <div className="p-2.5 bg-rose-300 group-hover:bg-rose-400 text-white rounded-xl transition-all duration-200 shadow-sm">
                    <PenLine className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>

            {/* Category Filters */}
            {posts.length > 0 && (
              <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                      ${activeCategory === cat
                        ? 'bg-warm-900 text-white shadow-sm'
                        : 'text-warm-500 hover:text-warm-700 hover:bg-warm-100'
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-6 h-6 text-rose-300 animate-spin" />
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-6">
                {filteredPosts.map((post, index) => (
                  <MurmulloCard
                    key={post.id}
                    post={post}
                    featured={index === 0 && activeCategory === 'Todo'}
                    onEdit={post.authorId === user?.id ? setEditingPost : undefined}
                    onRefresh={refreshPosts}
                  />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={activeCategory === 'Todo' ? Feather : BookOpen}
                title={activeCategory === 'Todo'
                  ? 'El silencio también es hermoso'
                  : `Nada en "${activeCategory}" todavía`
                }
                description={activeCategory === 'Todo'
                  ? 'Tu río de murmullos está esperando. Escribe algo o descubre voces que te inspiren.'
                  : 'Sé quien deje el primer murmullo en esta categoría.'
                }
                actionLabel="Dejar mi primer murmullo"
                actionTo="/escribir"
              />
            )}
          </div>

          {/* Right Sidebar */}
          <aside className="hidden lg:block w-72 shrink-0">
            <div className="sticky top-20 space-y-6">
              {/* Profile summary */}
              <div className="card p-5">
                <Link to="/perfil" className="flex items-center gap-3 mb-3 group">
                  <Avatar name={user?.name || '?'} size="md" />
                  <div>
                    <p className="text-sm font-medium text-warm-900 group-hover:text-rose-400 transition-colors">{user?.name}</p>
                    <p className="text-xs text-warm-400">@{user?.username}</p>
                  </div>
                </Link>
                <div className="flex items-center gap-4 text-xs pt-3 border-t border-warm-200/30">
                  <div>
                    <span className="font-semibold text-warm-800">{posts.filter(p => p.authorId === user?.id).length}</span>
                    <span className="text-warm-400 ml-1">murmullos</span>
                  </div>
                  <div>
                    <span className="font-semibold text-warm-800">{store.getFollowerCount(user?.id)}</span>
                    <span className="text-warm-400 ml-1">oyentes</span>
                  </div>
                </div>
              </div>

              {/* First steps */}
              {posts.filter(p => p.authorId === user?.id).length < 3 && (
                <div className="card p-5">
                  <h3 className="font-serif text-sm font-semibold text-warm-800 mb-3">Primeros pasos</h3>
                  <ul className="space-y-2.5">
                    <StepItem done={posts.some(p => p.authorId === user?.id)} text="Deja tu primer murmullo" />
                    <StepItem done={!!user?.bio} text="Escribe tu bio" />
                    <StepItem done={store.getFollowingCount(user?.id) > 0} text="Escucha a alguien" />
                  </ul>
                </div>
              )}

              <div className="px-2 text-[11px] text-warm-300 space-x-3">
                <a href="#" className="hover:text-rose-400 transition-colors">Acerca de</a>
                <a href="#" className="hover:text-rose-400 transition-colors">Privacidad</a>
                <span className="block mt-2">Murmullo 2026</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {editingPost && (
        <EditPostModal post={editingPost} onClose={() => { setEditingPost(null); refreshPosts() }} />
      )}
    </Layout>
  )
}

function StepItem({ done, text }) {
  return (
    <li className="flex items-center gap-2.5 text-xs">
      <div className={`w-4 h-4 rounded-full border-[1.5px] flex items-center justify-center shrink-0
        ${done ? 'bg-rose-300 border-rose-300' : 'border-warm-300'}`}>
        {done && (
          <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={done ? 'text-warm-300 line-through' : 'text-warm-600'}>{text}</span>
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
