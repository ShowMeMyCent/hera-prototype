import { CheckCircle2, Info, X } from 'lucide-react'
import { createContext, use, useCallback, useState } from 'react'

interface ToastItem {
  id: number
  message: string
  variant: 'success' | 'info'
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastItem['variant']) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 1

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const showToast = useCallback(
    (message: string, variant: ToastItem['variant'] = 'success') => {
      const id = nextId++
      setToasts((prev) => [...prev, { id, message, variant }])
      setTimeout(() => dismiss(id), 3500)
    },
    [dismiss],
  )

  return (
    <ToastContext value={{ showToast }}>
      {children}
      <div className="pointer-events-none fixed bottom-5 right-5 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="animate-toast-in pointer-events-auto flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3 shadow-card-hover"
          >
            {toast.variant === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green" />
            ) : (
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            )}
            <p className="flex-1 text-sm text-text">{toast.message}</p>
            <button
              type="button"
              onClick={() => dismiss(toast.id)}
              className="text-text-secondary hover:text-text"
              aria-label="Tutup notifikasi"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  )
}

export function useToast(): ToastContextValue {
  const ctx = use(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
