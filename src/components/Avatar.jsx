const colors = [
  'bg-rose-200 text-rose-600',
  'bg-lavender-200 text-lavender-500',
  'bg-warm-300 text-warm-700',
  'bg-rose-100 text-rose-500',
  'bg-lavender-100 text-lavender-400',
]

export default function Avatar({ name, size = 'md', className = '' }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?'
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0

  const sizes = {
    xs: 'w-7 h-7 text-xs',
    sm: 'w-9 h-9 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  }

  return (
    <div
      className={`${sizes[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center font-serif font-semibold border-2 border-white/80 shadow-sm ${className}`}
    >
      {initial}
    </div>
  )
}
