import { Routes, Route, Navigate } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './components/Toast'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import Discover from './pages/Discover'
import Create from './pages/Create'
import Profile from './pages/Profile'
import UserProfile from './pages/UserProfile'
import Notifications from './pages/Notifications'
import MurmulloView from './pages/MurmulloView'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-warm-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-rose-300 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-warm-400 font-serif italic">Un momento...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/feed" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><Landing /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
      <Route path="/descubrir" element={<ProtectedRoute><Discover /></ProtectedRoute>} />
      <Route path="/escribir" element={<ProtectedRoute><Create /></ProtectedRoute>} />
      <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/ecos" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/murmullo/:id" element={<ProtectedRoute><MurmulloView /></ProtectedRoute>} />
      <Route path="/u/:username" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
      {/* Legacy redirects */}
      <Route path="/explore" element={<Navigate to="/descubrir" replace />} />
      <Route path="/create" element={<Navigate to="/escribir" replace />} />
      <Route path="/profile" element={<Navigate to="/perfil" replace />} />
      <Route path="/notifications" element={<Navigate to="/ecos" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </StoreProvider>
  )
}
