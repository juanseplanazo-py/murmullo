import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Calendar, MapPin, LinkIcon, Users } from 'lucide-react'
import Layout from '../components/Layout'
import MurmulloCard from '../components/MurmulloCard'
import Avatar from '../components/Avatar'
import EmptyState from '../components/EmptyState'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'
import { useToast } from '../components/Toast'
import { formatDate } from '../utils/time'

export default function UserProfile() {
  const { username } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const store = useStore()
  const { addToast } = useToast()

  const profile = store.getUserByUsername(username)

  if (!profile) {
    return (
      <Layout>
        <div className="page-container max-w-2xl mx-auto pt-10">
          <EmptyState
            icon={Users}
            title="Esta persona no existe"
            description="No encontramos a nadie con ese nombre de usuario."
            actionLabel="Volver a descubrir"
            actionTo="/descubrir"
          />
        </div>
      </Layout>
    )
  }

  // If viewing own profile, redirect is handled by the user
  const isOwn = user && profile.id === user.id
  const isFollowing = user ? store.isFollowing(user.id, profile.id) : false
  const posts = store.getUserPosts(profile.id)
  const followerCount = store.getFollowerCount(profile.id)
  const followingCount = store.getFollowingCount(profile.id)

  const handleFollow = () => {
    if (!user || isOwn) return
    store.toggleFollow(user.id, profile.id)
    store.refresh()
    if (!isFollowing) addToast(`Ahora escuchas a ${profile.name}`)
  }

  return (
    <Layout>
      <div className="page-container max-w-3xl mx-auto">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-warm-400 hover:text-warm-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Profile Header */}
        <div className="card mb-8 overflow-hidden">
          <div className="h-36 bg-gradient-to-r from-lavender-200/50 via-rose-200/30 to-warm-200/50 relative">
            <div className="absolute -bottom-12 left-6 sm:left-8">
              <Avatar name={profile.name} size="xl" className="ring-4 ring-white shadow-lg" />
            </div>
          </div>

          <div className="pt-14 pb-6 px-6 sm:px-8">
            {/* Follow button */}
            {!isOwn && (
              <div className="flex justify-end mb-3">
                <button
                  onClick={handleFollow}
                  className={`text-sm font-medium py-2.5 px-6 rounded-full transition-all duration-200
                    ${isFollowing
                      ? 'bg-warm-100 text-warm-500 hover:bg-warm-200 border border-warm-200'
                      : 'bg-rose-300 text-white hover:bg-rose-400 shadow-sm'
                    }`}
                >
                  {isFollowing ? 'Escuchando' : 'Escuchar'}
                </button>
              </div>
            )}

            <h1 className="font-serif text-2xl font-bold text-warm-900">{profile.name}</h1>
            <p className="text-sm text-warm-400 mb-3">@{profile.username}</p>

            {profile.bio && (
              <p className="text-warm-700 leading-relaxed mb-4">{profile.bio}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-warm-400 mb-5">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Se unió en {formatDate(profile.joinedAt)}
              </span>
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {profile.location}
                </span>
              )}
              {profile.link && (
                <a href={profile.link.startsWith('http') ? profile.link : `https://${profile.link}`}
                   target="_blank" rel="noopener noreferrer"
                   className="flex items-center gap-1 text-rose-400 hover:underline">
                  <LinkIcon className="w-3.5 h-3.5" />
                  {profile.link.replace(/^https?:\/\//, '')}
                </a>
              )}
            </div>

            <div className="flex items-center gap-6 text-sm">
              <div>
                <span className="font-semibold text-warm-900">{posts.length}</span>
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
        </div>

        {/* Posts */}
        <h2 className="font-serif text-lg font-semibold text-warm-800 mb-5">Murmullos</h2>

        {posts.length > 0 ? (
          <div className="space-y-6">
            {posts.map((post) => (
              <MurmulloCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="font-serif text-warm-300 italic text-lg">Aún en silencio...</p>
            <p className="text-sm text-warm-300 mt-1">{profile.name} todavía no ha dejado ningún murmullo.</p>
          </div>
        )}
      </div>
    </Layout>
  )
}
