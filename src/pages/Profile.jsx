import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Settings, MapPin, Calendar, Grid3x3, Heart, Bookmark,
  PenLine, Feather, LogOut, Check, X,
} from 'lucide-react'
import Layout from '../components/Layout'
import PostCard from '../components/PostCard'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../context/AuthContext'
import { useData } from '../context/DataContext'
import { formatDate } from '../utils/time'

const tabs = [
  { id: 'posts', label: 'Publicaciones', icon: Grid3x3 },
  { id: 'liked', label: 'Favoritos', icon: Heart },
  { id: 'saved', label: 'Guardados', icon: Bookmark },
]

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const { getUserPosts, getLikedPosts, getSavedPosts } = useData()
  const [activeTab, setActiveTab] = useState('posts')
  const [editingBio, setEditingBio] = useState(false)
  const [bioValue, setBioValue] = useState(user?.bio || '')

  if (!user) return null

  const userPosts = getUserPosts(user.id)
  const likedPosts = getLikedPosts()
  const savedPosts = getSavedPosts()

  const currentPosts = activeTab === 'posts'
    ? userPosts
    : activeTab === 'liked'
      ? likedPosts
      : savedPosts

  const handleSaveBio = () => {
    updateProfile({ bio: bioValue.trim() })
    setEditingBio(false)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <Layout>
      <div className="page-container max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="card p-6 md:p-8 mb-6">
          {/* Cover gradient */}
          <div className="h-32 -mx-6 -mt-6 md:-mx-8 md:-mt-8 mb-6 rounded-t-2xl bg-gradient-to-r from-rose-200/60 via-lavender-200/40 to-warm-200/60 relative">
            <div className="absolute -bottom-10 left-6 md:left-8">
              <Avatar name={user.name} size="xl" className="ring-4 ring-white shadow-lg" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={handleLogout}
              className="btn-ghost flex items-center gap-1.5 text-sm text-warm-500 hover:text-rose-400"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Salir</span>
            </button>
          </div>

          {/* Info */}
          <div className="mt-2">
            <h1 className="font-serif text-2xl font-bold text-warm-900">{user.name}</h1>
            <p className="text-sm text-warm-500 mb-3">@{user.username}</p>

            {/* Bio - editable */}
            {editingBio ? (
              <div className="mb-4">
                <textarea
                  value={bioValue}
                  onChange={(e) => setBioValue(e.target.value.slice(0, 160))}
                  placeholder="Cuéntale al mundo quién eres en pocas palabras..."
                  className="input-field min-h-[80px] font-sans text-sm"
                  autoFocus
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-warm-400">{bioValue.length}/160</span>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingBio(false); setBioValue(user.bio || '') }} className="p-1.5 rounded-lg hover:bg-warm-100 text-warm-400">
                      <X className="w-4 h-4" />
                    </button>
                    <button onClick={handleSaveBio} className="p-1.5 rounded-lg hover:bg-rose-100 text-rose-400">
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-4">
                {user.bio ? (
                  <p
                    className="text-warm-700 leading-relaxed cursor-pointer hover:text-warm-900 transition-colors"
                    onClick={() => setEditingBio(true)}
                  >
                    {user.bio}
                  </p>
                ) : (
                  <button
                    onClick={() => setEditingBio(true)}
                    className="text-sm text-warm-400 hover:text-rose-400 transition-colors italic"
                  >
                    + Añade una bio para que otros te conozcan
                  </button>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-warm-500 mb-5">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                Se unió en {formatDate(user.joinedAt)}
              </span>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6">
              <div>
                <span className="font-semibold text-warm-900">{userPosts.length}</span>
                <span className="text-sm text-warm-500 ml-1">publicaciones</span>
              </div>
              <div>
                <span className="font-semibold text-warm-900">{user.followers}</span>
                <span className="text-sm text-warm-500 ml-1">seguidores</span>
              </div>
              <div>
                <span className="font-semibold text-warm-900">{user.following}</span>
                <span className="text-sm text-warm-500 ml-1">siguiendo</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-warm-200/60 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-all duration-200
                ${activeTab === tab.id
                  ? 'border-rose-400 text-rose-400'
                  : 'border-transparent text-warm-500 hover:text-warm-700 hover:border-warm-300'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {currentPosts.length > 0 ? (
          <div className="space-y-5">
            {currentPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={activeTab === 'posts' ? Feather : activeTab === 'liked' ? Heart : Bookmark}
            title={
              activeTab === 'posts'
                ? 'Aún no has publicado nada'
                : activeTab === 'liked'
                  ? 'Aún no tienes favoritos'
                  : 'Aún no has guardado nada'
            }
            description={
              activeTab === 'posts'
                ? 'Tu primer murmullo está esperando ser escrito. No tiene que ser perfecto, solo tiene que ser tuyo.'
                : activeTab === 'liked'
                  ? 'Cuando le des like a un murmullo, aparecerá aquí.'
                  : 'Los murmullos que guardes los encontrarás siempre aquí.'
            }
            actionLabel={activeTab === 'posts' ? 'Escribir mi primer murmullo' : undefined}
            actionTo={activeTab === 'posts' ? '/create' : undefined}
          />
        )}
      </div>
    </Layout>
  )
}
