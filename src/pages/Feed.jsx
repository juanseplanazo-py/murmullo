import { useState } from 'react'
import { PenLine, Feather, BookOpen } from 'lucide-react'
import Layout from '../components/Layout'
import PostCard from '../components/PostCard'
import Avatar from '../components/Avatar'
import CreatePostModal from '../components/CreatePostModal'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'

const categories = ['Todo', 'Poesía', 'Reflexión', 'Pensamientos', 'Motivación', 'Amor', 'Desamor', 'Vida']

export default function Feed() {
  const { user } = useAuth()
  const { posts } = useData()
  const [activeCategory, setActiveCategory] = useState('Todo')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const filteredPosts = activeCategory === 'Todo'
    ? posts
    : posts.filter(p => p.category === activeCategory)

  return (
    <Layout>
      <div className="page-container">
        <div className="flex gap-8">
          {/* Main Feed */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
            {/* Compose Prompt */}
            <div className="card p-5 mb-6">
              <div className="flex items-center gap-3">
                <Avatar name={user?.name || '?'} size="md" />
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex-1 text-left bg-warm-100/60 hover:bg-warm-100 border border-warm-200/60
                           rounded-2xl px-5 py-3 text-warm-400 text-sm transition-all duration-200
                           hover:border-warm-300 cursor-text"
                >
                  ¿Qué quieres compartir hoy, {user?.name?.split(' ')[0]}?
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="p-3 bg-rose-300 hover:bg-rose-400 text-white rounded-xl
                           transition-all duration-200 shadow-sm hover:shadow-md active:scale-95"
                >
                  <PenLine className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200
                    ${activeCategory === cat
                      ? 'bg-warm-900 text-white shadow-sm'
                      : 'bg-white/70 text-warm-600 border border-warm-200/60 hover:border-warm-300 hover:text-warm-800'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Posts or Empty State */}
            {filteredPosts.length > 0 ? (
              <div className="space-y-5">
                {filteredPosts.map((post, index) => (
                  <PostCard key={post.id} post={post} featured={index === 0} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={activeCategory === 'Todo' ? Feather : BookOpen}
                title={activeCategory === 'Todo'
                  ? 'Tu feed está esperando su primer murmullo'
                  : `Aún no hay murmullos en "${activeCategory}"`
                }
                description={activeCategory === 'Todo'
                  ? 'Este es tu espacio. Escribe tu primera frase y dale vida a este lugar.'
                  : 'Sé la primera persona en compartir algo en esta categoría.'
                }
                actionLabel="Escribir mi primer murmullo"
                onAction={() => setShowCreateModal(true)}
              />
            )}
          </div>

          {/* Right Sidebar (desktop) */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-20 space-y-6">
              {/* Welcome Card */}
              <div className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={user?.name || '?'} size="md" />
                  <div>
                    <p className="text-sm font-medium text-warm-900">{user?.name}</p>
                    <p className="text-xs text-warm-500">@{user?.username}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm pt-3 border-t border-warm-200/40">
                  <div>
                    <span className="font-semibold text-warm-900">{posts.filter(p => p.authorId === user?.id).length}</span>
                    <span className="text-warm-500 ml-1">murmullos</span>
                  </div>
                  <div>
                    <span className="font-semibold text-warm-900">{user?.followers || 0}</span>
                    <span className="text-warm-500 ml-1">seguidores</span>
                  </div>
                </div>
              </div>

              {/* Tips for new users */}
              {posts.length < 3 && (
                <div className="card p-5">
                  <h3 className="font-serif text-base font-semibold text-warm-900 mb-3">Primeros pasos</h3>
                  <ul className="space-y-3">
                    <TipItem
                      done={posts.some(p => p.authorId === user?.id)}
                      text="Publica tu primer murmullo"
                    />
                    <TipItem
                      done={!!user?.bio}
                      text="Completa tu perfil con una bio"
                    />
                    <TipItem
                      done={false}
                      text="Explora y descubre frases que te inspiren"
                    />
                  </ul>
                </div>
              )}

              {/* Footer Links */}
              <div className="px-2 text-xs text-warm-400 space-x-3">
                <a href="#" className="hover:text-rose-400 transition-colors">Acerca de</a>
                <a href="#" className="hover:text-rose-400 transition-colors">Privacidad</a>
                <a href="#" className="hover:text-rose-400 transition-colors">Términos</a>
                <span className="block mt-2">Murmullo 2026</span>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <CreatePostModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </Layout>
  )
}

function TipItem({ done, text }) {
  return (
    <li className="flex items-center gap-3 text-sm">
      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors
        ${done ? 'bg-rose-300 border-rose-300' : 'border-warm-300'}`}>
        {done && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className={done ? 'text-warm-400 line-through' : 'text-warm-700'}>{text}</span>
    </li>
  )
}
