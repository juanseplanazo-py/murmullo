import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Calendar, Grid3x3, Heart, Bookmark, MapPin, LinkIcon,
  PenLine, Feather, LogOut, Check, X, Pencil,
} from 'lucide-react'
import Layout from '../components/Layout'
import MurmulloCard from '../components/MurmulloCard'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'
import EditPostModal from '../components/EditPostModal'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { useToast } from '../components/Toast'
import { formatDate } from '../utils/time'

const tabs = [
  { id: 'posts', label: 'Murmullos', icon: Grid3x3 },
  { id: 'liked', label: 'Resonaron', icon: Heart },
  { id: 'saved', label: 'Atesorados', icon: Bookmark },
]

export default function Profile() {
  const { user, updateProfile, logout } = useAuth()
  const store = useStore()
  const { addToast } = useToast()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('posts')
  const [editing, setEditing] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    link: user?.link || '',
  })

  if (!user) return null

  const userPosts = store.getUserPosts(user.id)
  const likedPosts = store.getLikedPosts(user.id)
  const savedPosts = store.getSavedPosts(user.id)
  const followerCount = store.getFollowerCount(user.id)
  const followingCount = store.getFollowingCount(user.id)

  const currentPosts = activeTab === 'posts' ? userPosts
    : activeTab === 'liked' ? likedPosts
    : savedPosts

  const handleSaveProfile = () => {
    if (!form.name.trim()) return
    updateProfile({
      name: form.name.trim(),
      bio: form.bio.trim(),
      location: form.location.trim(),
      link: form.link.trim(),
    })
    setEditing(false)
    addToast('Perfil actualizado')
    store.refresh()
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <Layout>
      <div className="page-container max-w-3xl mx-auto">
        {/* Profile Header */}
        <div className="card mb-8 overflow-hidden">
          {/* Cover */}
          <div className="h-36 bg-gradient-to-r from-rose-200/50 via-lavender-200/30 to-warm-200/50 relative">
            <div className="absolute -bottom-12 left-6 sm:left-8">
              <Avatar name={user.name} size="xl" className="ring-4 ring-white shadow-lg" />
            </div>
          </div>

          <div className="pt-14 pb-6 px-6 sm:px-8">
            {/* Actions */}
            <div className="flex justify-end gap-2 mb-3">
              <button
                onClick={handleLogout}
                className="btn-ghost text-xs text-warm-400 hover:text-rose-400"
              >
                <LogOut className="w-4 h-4" />
              </button>
              {!editing && (
                <button onClick={() => setEditing(true)} className="btn-secondary text-xs py-2 px-4">
                  Editar perfil
                </button>
              )}
            </div>

            {editing ? (
              /* ── Edit Mode ── */
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-warm-500 mb-1 block">Nombre</label>
                  <input
                    value={form.name}
                    onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                    className="input-field"
                    placeholder="Tu nombre"
                    maxLength={50}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-warm-500 mb-1 block">Bio</label>
                  <textarea
                    value={form.bio}
                    onChange={(e) => setForm(f => ({ ...f, bio: e.target.value.slice(0, 160) }))}
                    className="input-field min-h-[80px]"
                    placeholder="Cuéntale al mundo quién eres en pocas palabras..."
                    maxLength={160}
                  />
                  <span className="text-xs text-warm-300 mt-1 block text-right">{form.bio.length}/160</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-warm-500 mb-1 block">Ubicación</label>
                    <input
                      value={form.location}
                      onChange={(e) => setForm(f => ({ ...f, location: e.target.value }))}
                      className="input-field"
                      placeholder="Ciudad, país"
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-warm-500 mb-1 block">Enlace</label>
                    <input
                      value={form.link}
                      onChange={(e) => setForm(f => ({ ...f, link: e.target.value }))}
                      className="input-field"
                      placeholder="tusitio.com"
                      maxLength={100}
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={handleSaveProfile} className="btn-primary text-sm py-2.5 px-6">Guardar</button>
                  <button onClick={() => setEditing(false)} className="btn-ghost text-sm">Cancelar</button>
                </div>
              </div>
            ) : (
              /* ── View Mode ── */
              <div>
                <h1 className="font-serif text-2xl font-bold text-warm-900">{user.name}</h1>
                <p className="text-sm text-warm-400 mb-3">@{user.username}</p>

                {user.bio ? (
                  <p className="text-warm-700 leading-relaxed mb-4">{user.bio}</p>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-sm text-warm-300 hover:text-rose-400 transition-colors italic mb-4 block"
                  >
                    + Añade una bio para que otros te conozcan
                  </button>
                )}

                <div className="flex flex-wrap items-center gap-4 text-xs text-warm-400 mb-5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Se unió en {formatDate(user.joinedAt)}
                  </span>
                  {user.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {user.location}
                    </span>
                  )}
                  {user.link && (
                    <a href={user.link.startsWith('http') ? user.link : `https://${user.link}`}
                       target="_blank" rel="noopener noreferrer"
                       className="flex items-center gap-1 text-rose-400 hover:underline">
                      <LinkIcon className="w-3.5 h-3.5" />
                      {user.link.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="font-semibold text-warm-900">{userPosts.length}</span>
                    <span className="text-warm-400 ml-1">murmullos</span>
                  </div>
                  <div>
                    <span className="font-semibold text-warm-900">{followerCount}</span>
                    <span className="text-warm-400 ml-1">oyentes</span>
                  </div>
                  <div>
                    <span className="font-semibold text-warm-900">{followingCount}</span>
                    <span className="text-warm-400 ml-1">escuchando</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-warm-200/40 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-all duration-200
                ${activeTab === tab.id
                  ? 'border-rose-400 text-rose-400'
                  : 'border-transparent text-warm-400 hover:text-warm-600 hover:border-warm-300'
                }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {currentPosts.length > 0 ? (
          <div className="space-y-6">
            {currentPosts.map((post) => (
              <MurmulloCard
                key={post.id}
                post={post}
                onEdit={post.authorId === user.id ? setEditingPost : undefined}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={activeTab === 'posts' ? Feather : activeTab === 'liked' ? Heart : Bookmark}
            title={
              activeTab === 'posts' ? 'Aún no has dejado ningún murmullo'
              : activeTab === 'liked' ? 'Nada ha resonado contigo aún'
              : 'No has atesorado nada todavía'
            }
            description={
              activeTab === 'posts' ? 'Tu primer murmullo está esperando. No tiene que ser perfecto, solo tiene que ser tuyo.'
              : activeTab === 'liked' ? 'Cuando algo te toque el alma, aparecerá aquí.'
              : 'Los murmullos que atesores siempre estarán esperándote aquí.'
            }
            actionLabel={activeTab === 'posts' ? 'Dejar mi primer murmullo' : undefined}
            actionTo={activeTab === 'posts' ? '/escribir' : undefined}
          />
        )}
      </div>

      {editingPost && (
        <EditPostModal post={editingPost} onClose={() => setEditingPost(null)} />
      )}
    </Layout>
  )
}
