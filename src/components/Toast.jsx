import { createContext, useContext, useState, useCallback } from 'react'
import { Check, X, AlertCircle, Link as LinkIcon } from 'lucide-react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now().toString(36)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed bottom-20 md:bottom-8 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-slide-up flex items-center gap-3 px-5 py-3 rounded-2xl shadow-lg border
                     bg-white/90 backdrop-blur-md border-warm-200/60 min-w-[220px] max-w-[360px]"
          >
            <ToastIcon type={toast.type} />
            <p className="text-sm text-warm-800 font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-warm-400 hover:text-warm-600 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastIcon({ type }) {
  if (type === 'success') return <Check className="w-4 h-4 text-rose-400 shrink-0" />
  if (type === 'error') return <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
  if (type === 'copied') return <LinkIcon className="w-4 h-4 text-lavender-400 shrink-0" />
  return <Check className="w-4 h-4 text-rose-400 shrink-0" />
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
