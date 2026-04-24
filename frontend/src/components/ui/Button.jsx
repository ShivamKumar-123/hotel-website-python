import { cn } from '../../utils/cn'

const variants = {
  primary:
    'bg-gold-500 text-slate-950 hover:bg-gold-400 shadow-lg shadow-gold-500/25',
  ghost:
    'border border-porcelain/20 text-porcelain hover:border-gold-500/60 hover:text-gold-500',
  outlineGold: 'border border-gold-500/70 text-gold-500 hover:bg-gold-500/15',
  danger: 'bg-red-900/40 text-red-200 border border-red-500/30 hover:bg-red-900/60',
}

/**
 * Primary actions for the luxury UI (gold CTA, ghost secondary).
 */
export default function Button({
  children,
  className,
  variant = 'primary',
  as,
  ...props
}) {
  const Component = as || 'button'
  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium tracking-wide transition-all duration-300 disabled:opacity-40',
        variants[variant] || variants.primary,
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
