import { Link, useLocation } from 'react-router-dom'
import { Home, Compass, PenLine, User, Feather, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const location = useLocation()
  const { user } = useAuth()
  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Desktop */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 glass border-b border-warm-200/30">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            <Link to="/feed" className="flex items-center gap-2 group">
              <Feather className="w-5 h-5 text-rose-400 group-hover:rotate-12 transition-transform" />
              <span className="font-serif text-lg font-semibold text-warm-900">Murmullo</span>
            </Link>

            <div className="flex items-center gap-1">
              <DesktopItem to="/feed" icon={Home} label="Inicio" active={isActive('/feed')} />
              <DesktopItem to="/descubrir" icon={Compass} label="Descubrir" active={isActive('/descubrir')} />
              <DesktopItem to="/escribir" icon={PenLine} label="Escribir" active={isActive('/escribir')} highlight />
              <DesktopItem to="/ecos" icon={Bell} label="Ecos" active={isActive('/ecos')} />
              <DesktopItem to="/perfil" icon={User} label="Mi espacio" active={isActive('/perfil')} />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-t border-warm-200/30 pb-safe">
        <div className="flex items-stretch justify-around h-14">
          <MobileItem to="/feed" icon={Home} active={isActive('/feed')} />
          <MobileItem to="/descubrir" icon={Compass} active={isActive('/descubrir')} />
          <MobileItem to="/escribir" icon={PenLine} active={isActive('/escribir')} highlight />
          <MobileItem to="/ecos" icon={Bell} active={isActive('/ecos')} />
          <MobileItem to="/perfil" icon={User} active={isActive('/perfil')} />
        </div>
      </nav>
    </>
  )
}

function DesktopItem({ to, icon: Icon, label, active, highlight }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all
        ${highlight
          ? 'bg-rose-300 text-white hover:bg-rose-400'
          : active
            ? 'text-rose-400 bg-rose-50'
            : 'text-warm-600 hover:text-rose-400 hover:bg-warm-50'
        }`}
    >
      <Icon className="w-5 h-5" />
      <span className="sr-only lg:not-sr-only">{label}</span>
    </Link>
  )
}

function MobileItem({ to, icon: Icon, active, highlight }) {
  return (
    <Link
      to={to}
      className={`flex items-center justify-center flex-1 transition-colors
        ${highlight
          ? 'text-rose-400'
          : active ? 'text-rose-400' : 'text-warm-400'
        }`}
    >
      <div className={`p-2 rounded-xl ${highlight ? 'bg-rose-300 text-white' : ''}`}>
        <Icon className="w-6 h-6" />
      </div>
    </Link>
  )
}
