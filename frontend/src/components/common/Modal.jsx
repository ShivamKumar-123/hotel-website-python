import { useEffect } from 'react'
import { cn } from '../../utils/cn'
import Button from '../ui/Button'

/**
 * Accessible modal shell for dashboard forms.
 */
export default function Modal({ open, title, children, onClose, className }) {
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={cn(
          'max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-porcelain/15 bg-ink-soft p-6 shadow-2xl',
          className,
        )}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="modal-title" className="font-display text-xl text-porcelain">
            {title}
          </h2>
          <Button type="button" variant="ghost" className="!px-3 !py-1 text-xs" onClick={onClose}>
            Close
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
