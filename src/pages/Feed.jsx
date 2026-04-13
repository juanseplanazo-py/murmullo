import { useState, useEffect, useCallback } from 'react'
import { Feather, PenLine, BookOpen, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import MurmulloCard from '../components/MurmulloCard'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'
import EditPostModal from '../components/EditPostModal'
import { useAuth } from '../context/AuthContext'
import { getPosts } from '../api/posts'

const tags = ['Todo', 'Poesía', 'Reflexión', 'Pensamientos', 'Motivación', 'Amor', 'Desamor', 'Vida']

export default function Feed() {
  const { user } = useAuth()
  const [activeTag, setActiveTag] = useState('Todo')
  const [editingPost, setEditingPost] = useState(null)
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const loadPosts = useCallback(async () => {
    const data = await getPosts()
    setPosts(data)
    setLoading(false)
  }, [])

  useEffect(() => { loadPosts() }, [loadPosts])

  const filteredPosts = activeTag === 'Todo'
    ? posts
    : posts.filter(p => Array.isArray(p.tags) && p.tags.includes(activeTag))

  const firstName = user?.name?.split(' ')[0] || ''

  return (
    <Layout>
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        {/* Greeting */}
        <div className="mb-6">
          <h1 className="font-serif text-2xl text-warm-800 mb-4">
            {getGreeting()}, {firstName}
          </h1>
          <Link
            to="/escribir"
            className="flex items-center gap-3 bg-white border border-warm-200/40 rounded-2xl p-4 hover:shadow-sm transition-all group"
          >
            <Avatar name={user?.name || '?'} size="sm" />
            <span className="flex-1 text-warm-400 text-sm font-serif italic group-hover:text-warm-500 transition-colors">
              ¿Qué quieres dejarle al mundo hoy?
            </span>
            <div className="p-2 bg-rose-300 group-hover:bg-rose-400 text-white rounded-xl transition-colors">
              <PenLine className="w-4 h-4" />
            </div>
          </Link>
        </div>

        {/* Tag filters */}
        {posts.length > 0 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95
                  ${activeTag === tag
                    ? 'bg-warm-900 text-white'
                    : 'text-warm-500 hover:bg-warm-100 active:bg-warm-200'
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
          <div className="space-y-4 sm:space-y-5">
            {filteredPosts.map((post) => (
              <MurmulloCard
                key={post.id}
                post={post}
                onEdit={post.authorId === user?.id ? setEditingPost : undefined}
                onRefresh={loadPosts}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={activeTag === 'Todo' ? Feather : BookOpen}
            title={activeTag === 'Todo'
              ? 'El silencio también es hermoso'
              : `Nada en "${activeTag}" todavía`
            }
            description={activeTag === 'Todo'
              ? 'Tu río de murmullos está esperando. Escribe algo o descubre voces que te inspiren.'
              : 'Sé quien deje el primer murmullo en esta etiqueta.'
            }
            actionLabel="Dejar mi primer murmullo"
            actionTo="/escribir"
          />
        )}
      </div>

      {editingPost && (
        <EditPostModal post={editingPost} onClose={() => { setEditingPost(null); loadPosts() }} />
      )}
    </Layout>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 6) return 'Buenas noches'
  if (h < 12) return 'Buenos días'
  if (h < 18) return 'Buenas tardes'
  return 'Buenas noches'
}
