import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Feather, Eye, EyeOff, ArrowRight } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    setTimeout(() => {
      try {
        login({ email, password })
        navigate('/feed')
      } catch (err) {
        setError(err.message)
        setLoading(false)
      }
    }, 400)
  }

  return (
    <div className="min-h-screen bg-warm-50 flex">
      {/* Left - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-rose-100 via-lavender-100 to-warm-100">
        <div className="absolute inset-0 flex items-center justify-center p-16">
          <div className="max-w-md text-center relative">
            <div className="w-72 h-72 bg-white/30 rounded-full blur-3xl absolute top-20 -left-20" />
            <div className="w-48 h-48 bg-rose-200/40 rounded-full blur-2xl absolute bottom-40 right-10 animate-float" />
            <div className="relative">
              <Feather className="w-16 h-16 text-rose-400 mx-auto mb-8" />
              <h2 className="font-serif text-4xl font-bold text-warm-900 mb-4 leading-tight">
                Tu espacio
                <span className="text-rose-400 italic block">te espera</span>
              </h2>
              <p className="text-warm-600 text-lg leading-relaxed">
                Tus murmullos siguen aquí. Sigue escribiendo.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-10">
            <Link to="/" className="inline-flex items-center gap-2">
              <Feather className="w-8 h-8 text-rose-400" />
              <span className="font-serif text-2xl font-semibold text-warm-900">Murmullo</span>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="font-serif text-3xl font-bold text-warm-900 mb-2">Bienvenida de vuelta</h1>
            <p className="text-warm-400 text-sm">Regresa a tu refugio creativo</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-100/60 border border-rose-200/60 text-sm text-rose-500">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-warm-700 mb-1.5">Correo electrónico</label>
              <input
                id="email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com" className="input-field" required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-warm-700 mb-1.5">Contraseña</label>
              <div className="relative">
                <input
                  id="password" type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tu contraseña" className="input-field pr-12" required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600 transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Entrando...
                </span>
              ) : (
                <>Entrar a Murmullo <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-warm-400">
              ¿Aún no tienes cuenta?{' '}
              <Link to="/register" className="text-rose-400 hover:text-rose-500 font-medium transition-colors">
                Regístrate gratis
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
