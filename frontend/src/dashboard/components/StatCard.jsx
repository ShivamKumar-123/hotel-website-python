import { cn } from '../../utils/cn'

export default function StatCard({ label, value, hint, className }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-porcelain/15 bg-porcelain/5 p-5 shadow-[0_16px_60px_rgba(0,0,0,0.35)]',
        className,
      )}
    >
      <p className="text-xs uppercase tracking-[0.25em] text-gold-500/90">{label}</p>
      <p className="mt-3 font-display text-3xl text-porcelain">{value}</p>
      {hint && <p className="mt-2 text-xs text-porcelain-muted">{hint}</p>}
    </div>
  )
}
