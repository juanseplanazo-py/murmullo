import { Link } from 'react-router-dom'

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
  onAction,
}) {
  return (
    <div className="text-center py-16 px-6 animate-fade-in">
      {Icon && (
        <div className="w-16 h-16 rounded-2xl bg-warm-100 flex items-center justify-center mx-auto mb-5">
          <Icon className="w-7 h-7 text-warm-400" />
        </div>
      )}
      <h3 className="font-serif text-xl font-semibold text-warm-800 mb-2">{title}</h3>
      <p className="text-warm-500 text-sm leading-relaxed max-w-sm mx-auto mb-6">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary text-sm py-2.5 px-6 inline-block">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button onClick={onAction} className="btn-primary text-sm py-2.5 px-6">
          {actionLabel}
        </button>
      )}
    </div>
  )
}
