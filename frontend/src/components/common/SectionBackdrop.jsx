import { cn } from '../../utils/cn'

/**
 * Full-bleed background photo per section with layered scrims so copy stays readable.
 */
export default function SectionBackdrop({ image, children, className }) {
  return (
    <div className={cn('relative isolate min-h-0 overflow-hidden', className)}>
      <div
        aria-hidden
        className="absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: image ? `url(${image})` : undefined }}
      />
      {/* Strong base scrim — works in light & dark site themes */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-950/94 via-slate-950/80 to-slate-950/93"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-t from-black/55 via-black/25 to-black/50"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/15" />
      {/* Typographic contrast: light copy on photo */}
      <div className="text-on-photo relative z-0">{children}</div>
    </div>
  )
}
