import { cn } from '../../utils/cn'
import { useTheme } from '../../hooks/useTheme'

export default function Select({ label, error, className, id, children, ...props }) {
  const inputId = id || props.name
  const { isLight } = useTheme()
  return (
    <label className="block w-full space-y-1.5 text-sm text-porcelain-muted" htmlFor={inputId}>
      {label ? (
        <span className="text-xs uppercase tracking-[0.2em] text-gold-500/90">{label}</span>
      ) : null}
      <select
        id={inputId}
        className={cn(
          'w-full rounded-xl border border-porcelain/15 bg-porcelain/5 px-4 py-3 text-porcelain outline-none transition focus:border-gold-500/50 focus:ring-1 focus:ring-gold-500/40',
          isLight ? '[color-scheme:light]' : '[color-scheme:dark]',
          error && 'border-red-400/50',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && <span className="text-xs text-red-300">{error}</span>}
    </label>
  )
}
