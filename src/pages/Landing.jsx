import { Link } from 'react-router-dom'
import { Feather, Heart, BookOpen, Users, ArrowRight, Sparkles, PenLine, Quote } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-warm-50">
      {/* Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-warm-200/40">
        <div className="page-container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Feather className="w-6 h-6 text-rose-400" />
            <span className="font-serif text-xl font-semibold text-warm-900">Murmullo</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm">Iniciar sesión</Link>
            <Link to="/register" className="btn-primary text-sm py-2.5 px-6">Comenzar a escribir</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-lavender-200/20 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-warm-200/30 rounded-full blur-2xl animate-float" />

        <div className="page-container relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100/60 border border-rose-200/60 mb-8">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span className="text-sm font-medium text-rose-500">Tu refugio de escritura creativa</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-warm-900 leading-tight mb-6 text-balance">
              Donde las palabras
              <span className="block text-rose-400 italic"> se convierten en abrazos</span>
            </h1>

            <p className="text-lg md:text-xl text-warm-600 leading-relaxed max-w-xl mx-auto mb-10">
              Un espacio íntimo para compartir tus frases, pensamientos y poemas.
              Escribe, descubre y conecta con almas afines.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-base py-4 px-10 flex items-center gap-2">
                <PenLine className="w-5 h-5" />
                Comenzar a escribir
              </Link>
              <Link to="/explore" className="btn-secondary text-base py-4 px-10 flex items-center gap-2">
                Explorar frases
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Featured Quote Preview */}
          <div className="mt-20 max-w-2xl mx-auto">
            <div className="card p-8 md:p-10 bg-gradient-to-br from-rose-100/30 to-lavender-100/20 text-center">
              <Quote className="w-8 h-8 text-rose-300 mx-auto mb-4 rotate-180" />
              <p className="font-serif text-xl md:text-2xl text-warm-800 leading-relaxed italic mb-6">
                "A veces el silencio dice más que mil palabras, pero hay silencios
                que gritan tanto que el alma no puede ignorarlos."
              </p>
              <div className="flex items-center justify-center gap-2">
                <div className="w-8 h-8 rounded-full bg-rose-200 flex items-center justify-center text-rose-600 font-serif text-sm font-semibold">
                  C
                </div>
                <span className="text-sm text-warm-600 font-medium">Camila Estrella</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="section-title mb-4">Un lugar para cada emoción</h2>
            <p className="text-warm-500 max-w-md mx-auto">
              Murmullo no es otra red social. Es un diario compartido entre almas que sienten profundo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <FeatureCard
              icon={PenLine}
              title="Escribe sin filtros"
              description="Publica frases, poemas y pensamientos en un espacio que celebra la vulnerabilidad y la creatividad."
              color="rose"
            />
            <FeatureCard
              icon={Heart}
              title="Conecta con corazones"
              description="Descubre autores que escriben como tú sientes. Dale like, comenta y guarda lo que te mueve el alma."
              color="lavender"
            />
            <FeatureCard
              icon={Users}
              title="Crece en comunidad"
              description="Forma parte de una comunidad que se inspira mutuamente. Aquí cada palabra importa."
              color="warm"
            />
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-20">
        <div className="page-container text-center">
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mb-16">
            <StatCard number="12K+" label="Escritores" />
            <StatCard number="89K+" label="Frases" />
            <StatCard number="340K+" label="Conexiones" />
          </div>

          <div className="max-w-2xl mx-auto">
            <h2 className="section-title mb-4">Empieza a escribir hoy</h2>
            <p className="text-warm-500 mb-8">
              Tu próxima frase favorita podría ser la que aún no has escrito.
            </p>
            <Link to="/register" className="btn-primary text-base py-4 px-10 inline-flex items-center gap-2">
              Unirme a Murmullo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-warm-200/60">
        <div className="page-container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Feather className="w-5 h-5 text-rose-400" />
            <span className="font-serif text-lg font-semibold text-warm-900">Murmullo</span>
          </div>
          <p className="text-sm text-warm-400">
            Hecho con amor para quienes escriben con el corazón.
          </p>
          <div className="flex items-center gap-6 text-sm text-warm-500">
            <a href="#" className="hover:text-rose-400 transition-colors">Acerca de</a>
            <a href="#" className="hover:text-rose-400 transition-colors">Privacidad</a>
            <a href="#" className="hover:text-rose-400 transition-colors">Términos</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, color }) {
  const colors = {
    rose: 'bg-rose-100/50 text-rose-400',
    lavender: 'bg-lavender-100/50 text-lavender-400',
    warm: 'bg-warm-200/50 text-warm-600',
  }

  return (
    <div className="card p-8 text-center hover:-translate-y-1">
      <div className={`w-14 h-14 ${colors[color]} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-lg font-semibold text-warm-900 mb-3">{title}</h3>
      <p className="text-sm text-warm-500 leading-relaxed">{description}</p>
    </div>
  )
}

function StatCard({ number, label }) {
  return (
    <div>
      <p className="font-serif text-3xl md:text-4xl font-bold text-rose-400">{number}</p>
      <p className="text-sm text-warm-500 mt-1">{label}</p>
    </div>
  )
}
