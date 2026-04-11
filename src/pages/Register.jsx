import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Feather, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Register() {
  const [name, setName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { register } = useAuth()

  const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!name.trim() || !username.trim() || !email.trim() || !password.trim()) {
      setError('Todos los campos son obligatorios')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (cleanUsername.length < 3) {
      setError('El nombre de usuario debe tener al menos 3 caracteres')
      return
    }

    setLoading(true)
    setTimeout(() => {
      try {
        register({ name: name.trim(), username: cleanUsername, email: email.trim(), password })
        navigate('/feed')
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div className="min-h-screen bg-warm-50 flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2">
              <Feather className="w-8 h-8 text-rose-400" />
              <span className="font-serif text-2xl font-semibold text-warm-900">Murmullo</span>
            </Link>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-lavender-100/60 border border-lavender-200/60 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-lavender-400" />
              <span className="text-xs font-medium text-lavender-500">Gratis para siempre</span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-warm-900 mb-2">Crea tu espacio</h1>
            <p className="text-warm-400 text-sm">Tu refugio de escritura empieza aquí</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-100/60 border border-rose-200/60 text-sm text-rose-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-warm-700 mb-1.5">Nombre</label>
                <input id="name" type="text" value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre" className="input-field" required />
              </div>
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-warm-700 mb-1.5">Usuario</label>
                <input id="username" type="text" value={username}
                  onChange={(e) => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
                  placeholder="tu usuario aqui..." className="input-field" required />
                {username && (
                  <p className="text-xs text-warm-300 mt-1">@{cleanUsername}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="reg-email" className="block text-sm font-medium text-warm-700 mb-1.5">Correo electrónico</label>
              <input id="reg-email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com" className="input-field" required />
            </div>

            <div>
              <label htmlFor="reg-password" className="block text-sm font-medium text-warm-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <input id="reg-password" type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres" className="input-field pr-12" required minLength={8} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button type="submit" disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creando tu espacio...
                  </span>
                ) : (
                  <>Crear mi cuenta <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </form>

          <p className="mt-5 text-xs text-warm-300 text-center leading-relaxed">
            Al registrarte, aceptas nuestros{' '}
            <a href="#" className="text-rose-400 hover:underline">Términos de servicio</a> y{' '}
            <a href="#" className="text-rose-400 hover:underline">Política de privacidad</a>.
          </p>

          <div className="mt-8 text-center">
            <p className="text-sm text-warm-400">
              ¿Ya tienes cuenta?{' '}
              <Link to="/login" className="text-rose-400 hover:text-rose-500 font-medium transition-colors">
                Inicia sesión
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-bl from-lavender-100 via-rose-100 to-warm-100">
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="max-w-md text-center relative">
            <div className="w-72 h-72 bg-white/30 rounded-full blur-3xl absolute top-10 -right-20" />
            <div className="w-48 h-48 bg-lavender-200/40 rounded-full blur-2xl absolute bottom-20 left-10 animate-float" />
            <div className="relative">
              <Feather className="w-16 h-16 text-lavender-400 mx-auto mb-8" />
              <h2 className="font-serif text-4xl font-bold text-warm-900 mb-4 leading-tight">
                Tu historia
                <span className="text-lavender-400 italic block">empieza aquí</span>
              </h2>
              <p className="text-warm-500 text-lg leading-relaxed">
                Un espacio íntimo donde cada palabra importa.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
