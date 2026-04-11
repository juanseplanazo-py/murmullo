import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Home, Compass, PenLine, User, Feather, Bell } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useStore } from '../context/StoreContext'

export default function Navbar() {
  const location = useLocation()
  const { user } = useAuth()
  const store = useStore()
  const isActive = (path) => location.pathname === path
  const unreadCount = user ? store.getUnreadCount(user.id) : 0

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 glass border-b border-warm-200/40">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            <Link to="/feed" className="flex items-center gap-2 group">
              <Feather className="w-6 h-6 text-rose-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-serif text-xl font-semibold text-warm-900">Murmullo</span>
            </Link>

            <div className="flex items-center gap-1">
              <NavItem to="/feed" icon={Home} label="Inicio" active={isActive('/feed')} />
              <NavItem to="/descubrir" icon={Compass} label="Descubrir" active={isActive('/descubrir')} />
              <NavItem to="/escribir" icon={PenLine} label="Escribir" active={isActive('/escribir')} highlight />
              <NavItem to="/ecos" icon={Bell} label="Ecos" active={isActive('/ecos')} badge={unreadCount} />
              <NavItem to="/perfil" icon={User} label="Mi espacio" active={isActive('/perfil')} />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-warm-200/40 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          <MobileNavItem to="/feed" icon={Home} label="Inicio" active={isActive('/feed')} />
          <MobileNavItem to="/descubrir" icon={Compass} label="Descubrir" active={isActive('/descubrir')} />
          <MobileNavItem to="/escribir" icon={PenLine} label="Escribir" active={isActive('/escribir')} highlight />
          <MobileNavItem to="/ecos" icon={Bell} label="Ecos" active={isActive('/ecos')} badge={unreadCount} />
          <MobileNavItem to="/perfil" icon={User} label="Yo" active={isActive('/perfil')} />
        </div>
      </nav>
    </>
  )
}

function NavItem({ to, icon: Icon, label, active, highlight, badge }) {
  return (
    <Link
      to={to}
      className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
        ${highlight
          ? 'bg-rose-300 text-white hover:bg-rose-400 shadow-sm'
          : active
            ? 'text-rose-400 bg-rose-100/50'
            : 'text-warm-600 hover:text-rose-400 hover:bg-rose-100/30'
        }`}
      title={label}
    >
      <Icon className="w-5 h-5" />
      <span className={highlight ? '' : 'sr-only lg:not-sr-only'}>{label}</span>
      {badge > 0 && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-400 text-white text-[10px] font-bold
                       rounded-full flex items-center justify-center shadow-sm">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  )
}

function MobileNavItem({ to, icon: Icon, label, active, highlight, badge }) {
  return (
    <Link
      to={to}
      className={`relative flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200
        ${highlight ? 'text-rose-400' : active ? 'text-rose-400' : 'text-warm-500'}`}
    >
      <div className={`p-1.5 rounded-xl ${highlight ? 'bg-rose-300 text-white shadow-sm' : ''}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-medium">{label}</span>
      {badge > 0 && (
        <span className="absolute top-0 right-1 w-4 h-4 bg-rose-400 text-white text-[9px] font-bold
                       rounded-full flex items-center justify-center">
          {badge > 9 ? '9+' : badge}
        </span>
      )}
    </Link>
  )
}
