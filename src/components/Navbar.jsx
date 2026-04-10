import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  Compass,
  PenLine,
  User,
  Search,
  Feather,
} from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const isActive = (path) => location.pathname === path

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/explore?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <>
      {/* Desktop Navbar */}
      <nav className="hidden md:block fixed top-0 left-0 right-0 z-50 glass border-b border-warm-200/40">
        <div className="page-container">
          <div className="flex items-center justify-between h-16">
            <Link to="/feed" className="flex items-center gap-2 group">
              <Feather className="w-6 h-6 text-rose-400 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-serif text-xl font-semibold text-warm-900">
                Murmullo
              </span>
            </Link>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar frases, autores, temas..."
                  className="w-full bg-warm-100/60 border border-warm-200/60 rounded-full pl-10 pr-4 py-2 text-sm
                           text-warm-900 placeholder:text-warm-400
                           focus:outline-none focus:ring-2 focus:ring-rose-300/40 focus:border-rose-300
                           transition-all duration-200"
                />
              </div>
            </form>

            <div className="flex items-center gap-1">
              <NavItem to="/feed" icon={Home} label="Inicio" active={isActive('/feed')} />
              <NavItem to="/explore" icon={Compass} label="Explorar" active={isActive('/explore')} />
              <NavItem to="/create" icon={PenLine} label="Escribir" active={isActive('/create')} highlight />
              <NavItem to="/profile" icon={User} label="Perfil" active={isActive('/profile')} />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-warm-200/40 pb-safe">
        <div className="flex items-center justify-around h-16 px-2">
          <MobileNavItem to="/feed" icon={Home} label="Inicio" active={isActive('/feed')} />
          <MobileNavItem to="/explore" icon={Compass} label="Explorar" active={isActive('/explore')} />
          <MobileNavItem to="/create" icon={PenLine} label="Escribir" active={isActive('/create')} highlight />
          <MobileNavItem to="/profile" icon={User} label="Perfil" active={isActive('/profile')} />
        </div>
      </nav>
    </>
  )
}

function NavItem({ to, icon: Icon, label, active, highlight }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200
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
    </Link>
  )
}

function MobileNavItem({ to, icon: Icon, label, active, highlight }) {
  return (
    <Link
      to={to}
      className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all duration-200
        ${highlight
          ? 'text-rose-400'
          : active
            ? 'text-rose-400'
            : 'text-warm-500'
        }`}
    >
      <div className={`p-1.5 rounded-xl ${highlight ? 'bg-rose-300 text-white shadow-sm' : ''}`}>
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-[10px] font-medium">{label}</span>
    </Link>
  )
}
