import { cn } from '../../utils/cn'

function LoaderMark({ compact = false }) {
  return (
    <div
      className={cn(
        'loader-aurum-mark relative flex shrink-0 items-center justify-center',
        compact ? 'h-[3.25rem] w-[3.25rem]' : 'h-[5.25rem] w-[5.25rem]',
      )}
      aria-hidden
    >
      <div className={cn('loader-aurum-mark__ring-outer', compact && 'loader-aurum-mark__ring-outer--sm')} />
      <div className={cn('loader-aurum-mark__glow', compact && 'loader-aurum-mark__glow--sm')} />
      <div className={cn('loader-aurum-mark__ring', compact && 'loader-aurum-mark__ring--sm')} />
      <div className={cn('loader-aurum-mark__inner', compact && 'loader-aurum-mark__inner--sm')}>
        <span className={cn('loader-aurum-mark__monogram', compact && 'loader-aurum-mark__monogram--sm')}>
          AG
        </span>
      </div>
      <div className={cn('loader-aurum-mark__spark', compact && 'loader-aurum-mark__spark--sm')} />
    </div>
  )
}

function LoaderDots() {
  return (
    <div className="loader-aurum-dots" aria-hidden>
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="loader-aurum-dots__dot" style={{ animationDelay: `${i * 0.28}s` }} />
      ))}
    </div>
  )
}

/**
 * @param {'overlay' | 'section' | 'minimal'} variant — overlay = route/auth fullscreen; section = in-page; minimal = compact.
 */
export default function Loader({ label = 'Loading', variant = 'section', className }) {
  const compact = variant === 'minimal'

  const text = (
    <div className="flex flex-col items-center gap-3">
      <p
        className={cn(
          'loader-aurum-label',
          variant === 'overlay' && 'loader-aurum-label--overlay',
          compact && 'loader-aurum-label--sm',
        )}
      >
        {label}
      </p>
      <LoaderDots />
    </div>
  )

  const inner = (
    <div className={cn('flex flex-col items-center gap-8', compact && 'gap-4', className)}>
      <LoaderMark compact={compact} />
      {text}
    </div>
  )

  if (variant === 'overlay') {
    return (
      <div
        className="loader-aurum-overlay fixed inset-0 z-[200] flex items-center justify-center"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="loader-aurum-overlay__canvas" aria-hidden />
        <div className="loader-aurum-overlay__vignette" aria-hidden />
        <div className="loader-aurum-panel relative overflow-hidden px-14 py-12 sm:px-20 sm:py-16">
          <div className="loader-aurum-panel__shine" aria-hidden />
          <div className="loader-aurum-panel__corner loader-aurum-panel__corner--tl" aria-hidden />
          <div className="loader-aurum-panel__corner loader-aurum-panel__corner--br" aria-hidden />
          <div className="relative z-10">{inner}</div>
        </div>
      </div>
    )
  }

  if (variant === 'minimal') {
    return (
      <div
        className={cn('flex min-h-[32vh] flex-col items-center justify-center gap-4', className)}
        role="status"
        aria-live="polite"
      >
        {inner}
      </div>
    )
  }

  return (
    <div
      className={cn('flex min-h-[48vh] flex-col items-center justify-center gap-4 py-12', className)}
      role="status"
      aria-live="polite"
    >
      <div className="relative">
        <div className="loader-aurum-section-glow pointer-events-none absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full" aria-hidden />
        {inner}
      </div>
    </div>
  )
}
