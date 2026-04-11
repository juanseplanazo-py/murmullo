import { useState, useMemo, useEffect, useCallback } from 'react'
import { Search, Compass, Feather, Users, Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import Layout from '../components/Layout'
import MurmulloCard from '../components/MurmulloCard'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { getPosts } from '../api/posts'
import { getAllUsers } from '../api/users'

const moods = [
  { id: 'all', label: 'Todo' },
  { id: 'Poesía', label: 'Poesía' },
  { id: 'Amor', label: 'Amor' },
  { id: 'Reflexión', label: 'Reflexión' },
  { id: 'Motivación', label: 'Motivación' },
  { id: 'Pensamientos', label: 'Pensamientos' },
  { id: 'Vida', label: 'Vida' },
  { id: 'Desamor', label: 'Desamor' },
]

export default function Discover() {
  const { user } = useAuth()
  const store = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeMood, setActiveMood] = useState('all')
  const [activeSection, setActiveSection] = useState('murmullos')
  const [posts, setPosts] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    const [postsData, usersData] = await Promise.all([getPosts(), getAllUsers()])
    setPosts(postsData)
    setAllUsers(usersData.filter(u => u.id !== user?.id))
    setLoading(false)
  }, [user?.id])

  useEffect(() => {
    loadData()
  }, [loadData])

  // Filter posts by search + mood
  const filteredPosts = useMemo(() => {
    let result = posts
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        (p.text || '').toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q))
      )
    }
    if (activeMood !== 'all') {
      result = result.filter(p => p.category === activeMood)
    }
    return result
  }, [posts, searchQuery, activeMood])

  const displayUsers = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return allUsers.filter(u =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q)
      )
    }
    return allUsers
  }, [allUsers, searchQuery])

  return (
    <Layout>
      <div className="page-container max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl font-bold text-warm-900 mb-2">Descubrir</h1>
          <p className="text-warm-400 text-sm">Encuentra voces que resuenen contigo</p>
        </div>

        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar voces, palabras, emociones..."
              className="w-full bg-white/70 border border-warm-200/50 rounded-2xl pl-12 pr-4 py-4 text-warm-900
                       placeholder:text-warm-300 text-sm shadow-sm
                       focus:outline-none focus:ring-2 focus:ring-rose-300/30 focus:border-rose-300
                       transition-all duration-200"
            />
          </div>
        </div>

        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setActiveSection('murmullos')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
              ${activeSection === 'murmullos' ? 'bg-warm-900 text-white' : 'text-warm-500 hover:bg-warm-100'}`}
          >
            <Feather className="w-4 h-4" />
            Murmullos
          </button>
          <button
            onClick={() => setActiveSection('voces')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200
              ${activeSection === 'voces' ? 'bg-warm-900 text-white' : 'text-warm-500 hover:bg-warm-100'}`}
          >
            <Users className="w-4 h-4" />
            Voces
          </button>
        </div>

        {activeSection === 'murmullos' && (
          <>
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide justify-center flex-wrap">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setActiveMood(mood.id)}
                  className={`px-4 py-2 rounded-full text-xs font-medium transition-all duration-200
                    ${activeMood === mood.id ? 'bg-warm-900 text-white' : 'text-warm-400 hover:text-warm-700 hover:bg-warm-100'}`}
                >
                  {mood.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-6 h-6 text-rose-300 animate-spin" />
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="space-y-6">
                {filteredPosts.map((post) => (
                  <MurmulloCard key={post.id} post={post} onRefresh={loadData} />
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <EmptyState
                icon={Search}
                title="Sin resultados"
                description={`No encontramos murmullos para "${searchQuery}". Intenta con otras palabras.`}
              />
            ) : (
              <EmptyState
                icon={Compass}
                title="El silencio espera ser roto"
                description="Aún no hay murmullos para descubrir. Sé la primera voz en este espacio."
                actionLabel="Dejar el primer murmullo"
                actionTo="/escribir"
              />
            )}
          </>
        )}

        {activeSection === 'voces' && (
          <>
            {displayUsers.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-5">
                {displayUsers.map((u) => (
                  <UserCard key={u.id} profile={u} store={store} currentUserId={user?.id} />
                ))}
              </div>
            ) : searchQuery.trim() ? (
              <EmptyState icon={Search} title="Sin resultados" description={`No encontramos voces para "${searchQuery}".`} />
            ) : (
              <EmptyState icon={Users} title="Aún no hay otras voces" description="Cuando más personas se unan, podrás descubrir nuevas voces aquí." />
            )}
          </>
        )}
      </div>
    </Layout>
  )
}

function UserCard({ profile, store, currentUserId }) {
  const following = currentUserId ? store.isFollowing(currentUserId, profile.id) : false
  const postCount = store.getUserPosts(profile.id).length
  const followerCount = store.getFollowerCount(profile.id)

  const handleToggle = () => {
    if (!currentUserId) return
    store.toggleFollow(currentUserId, profile.id)
    store.refresh()
  }

  return (
    <div className="card p-6 text-center hover:-translate-y-0.5 transition-all duration-300">
      <Link to={`/u/${profile.username}`}>
        <Avatar name={profile.name} size="lg" className="mx-auto mb-4" />
        <h3 className="font-serif text-lg font-semibold text-warm-900 mb-0.5 hover:text-rose-400 transition-colors">
          {profile.name}
        </h3>
        <p className="text-xs text-warm-400 mb-3">@{profile.username}</p>
      </Link>
      {profile.bio && <p className="text-xs text-warm-500 leading-relaxed mb-4 line-clamp-2">{profile.bio}</p>}
      <div className="flex items-center justify-center gap-5 mb-5 text-xs text-warm-400">
        <span><span className="font-semibold text-warm-700">{postCount}</span> murmullos</span>
        <span><span className="font-semibold text-warm-700">{followerCount}</span> oyentes</span>
      </div>
      <button
        onClick={handleToggle}
        className={`w-full text-xs font-medium py-2.5 rounded-full transition-all duration-200
          ${following ? 'bg-warm-100 text-warm-500 hover:bg-warm-200 border border-warm-200' : 'bg-rose-300 text-white hover:bg-rose-400 shadow-sm'}`}
      >
        {following ? 'Escuchando' : 'Escuchar'}
      </button>
    </div>
  )
}
