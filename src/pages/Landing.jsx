import { Link } from 'react-router-dom'
import { Feather, Heart, Users, ArrowRight, PenLine, Quote } from 'lucide-react'

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
            <Link to="/login" className="btn-ghost text-sm">Entrar</Link>
            <Link to="/register" className="btn-primary text-sm py-2.5 px-6">Comenzar a escribir</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-20 md:pt-44 md:pb-32 relative overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-rose-200/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-lavender-200/15 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-warm-200/20 rounded-full blur-2xl animate-float" />

        <div className="page-container relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-warm-900 leading-tight mb-6 text-balance">
              Un refugio para
              <span className="block text-rose-400 italic">lo que sientes</span>
            </h1>

            <p className="text-lg md:text-xl text-warm-500 leading-relaxed max-w-xl mx-auto mb-10">
              Murmullo es un espacio íntimo donde las palabras importan.
              Escribe, descubre y conecta con voces que resuenan contigo.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register" className="btn-primary text-base py-4 px-10 flex items-center gap-2">
                <PenLine className="w-5 h-5" />
                Dejar mi primer murmullo
              </Link>
              <Link to="/login" className="btn-secondary text-base py-4 px-10 flex items-center gap-2">
                Ya tengo cuenta
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Preview Quote */}
          <div className="mt-20 max-w-xl mx-auto">
            <div className="rounded-3xl border border-warm-200/40 bg-gradient-to-br from-rose-100/20 via-white to-lavender-100/10 p-10 text-center">
              <Quote className="w-7 h-7 text-rose-300/60 mx-auto mb-5 rotate-180" />
              <p className="font-serif text-xl md:text-2xl text-warm-800 leading-relaxed italic">
                "A veces basta con una frase para que alguien sienta que no está solo."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white/40">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="section-title mb-3">No es otra red social</h2>
            <p className="text-warm-400 max-w-md mx-auto text-sm">
              Es un espacio donde cada palabra tiene su propio escenario.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <FeatureCard
              icon={PenLine}
              title="Escribe sin prisa"
              description="Cada murmullo es un momento. No es un post rápido — es algo que dejas al mundo con intención."
              color="rose"
            />
            <FeatureCard
              icon={Heart}
              title="Resuena, no compitas"
              description="Aquí no hay métricas que perseguir. Solo conexiones genuinas entre personas que sienten."
              color="lavender"
            />
            <FeatureCard
              icon={Users}
              title="Descubre voces"
              description="Encuentra personas que escriben como tú sientes. Escúchalas, atesora lo que te mueve."
              color="warm"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="page-container text-center">
          <h2 className="section-title mb-4">Tu primer murmullo te está esperando</h2>
          <p className="text-warm-400 mb-8 text-sm">
            No tiene que ser perfecto. Solo tiene que ser tuyo.
          </p>
          <Link to="/register" className="btn-primary text-base py-4 px-10 inline-flex items-center gap-2">
            Comenzar a escribir
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-warm-200/40">
        <div className="page-container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Feather className="w-5 h-5 text-rose-400" />
            <span className="font-serif text-lg font-semibold text-warm-900">Murmullo</span>
          </div>
          <p className="text-xs text-warm-300">
            Hecho con amor para quienes escriben con el corazón.
          </p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description, color }) {
  const colors = {
    rose: 'bg-rose-100/40 text-rose-400',
    lavender: 'bg-lavender-100/40 text-lavender-400',
    warm: 'bg-warm-200/40 text-warm-600',
  }

  return (
    <div className="card p-8 text-center hover:-translate-y-0.5 transition-all duration-300">
      <div className={`w-14 h-14 ${colors[color]} rounded-2xl flex items-center justify-center mx-auto mb-5`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-lg font-semibold text-warm-900 mb-3">{title}</h3>
      <p className="text-sm text-warm-400 leading-relaxed">{description}</p>
    </div>
  )
}
