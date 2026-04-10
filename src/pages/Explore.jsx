import { useState } from 'react'
import { Search, Compass, Feather, PenLine } from 'lucide-react'
import Layout from '../components/Layout'
import PostCard from '../components/PostCard'
import EmptyState from '../components/EmptyState'
import { useData } from '../context/DataContext'

export default function Explore() {
  const { posts } = useData()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPosts = searchQuery.trim()
    ? posts.filter(p =>
        p.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : posts

  return (
    <Layout>
      <div className="page-container max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="section-title mb-2">Explorar</h1>
          <p className="text-warm-500">Descubre murmullos que abrazan el alma</p>
        </div>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por frases, autores o categorías..."
              className="w-full bg-white/70 border border-warm-200/60 rounded-2xl pl-12 pr-4 py-4 text-warm-900
                       placeholder:text-warm-400 text-base shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-rose-300/40 focus:border-rose-300
                       transition-all duration-200"
            />
          </div>
        </div>

        {/* Content */}
        {filteredPosts.length > 0 ? (
          <div className="space-y-5">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : searchQuery.trim() ? (
          <EmptyState
            icon={Search}
            title="Sin resultados"
            description={`No encontramos murmullos que coincidan con "${searchQuery}". Intenta con otras palabras.`}
          />
        ) : (
          <EmptyState
            icon={Compass}
            title="El mundo está en silencio... por ahora"
            description="Aún no hay murmullos para explorar. Sé la primera voz en este espacio y escribe algo que inspire."
            actionLabel="Escribir el primer murmullo"
            actionTo="/create"
          />
        )}
      </div>
    </Layout>
  )
}
