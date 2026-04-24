import { cn } from '../../utils/cn'

export default function Textarea({ label, error, className, id, ...props }) {
  const inputId = id || props.name
  return (
    <label className="block w-full space-y-1.5 text-sm text-porcelain-muted" htmlFor={inputId}>
      {label && <span className="text-xs uppercase tracking-[0.2em] text-gold-500/90">{label}</span>}
      <textarea
        id={inputId}
        className={cn(
          'min-h-[120px] w-full rounded-xl border border-porcelain/15 bg-porcelain/5 px-4 py-3 text-porcelain outline-none transition focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/40',
          error && 'border-red-400/50',
          className,
        )}
        {...props}
      />
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  )
}
