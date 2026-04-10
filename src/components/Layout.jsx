import Navbar from './Navbar'

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-warm-50">
      <Navbar />
      {/* Desktop: top padding for fixed nav. Mobile: bottom padding for bottom nav */}
      <main className="pt-20 pb-24 md:pb-8">
        {children}
      </main>
    </div>
  )
}
