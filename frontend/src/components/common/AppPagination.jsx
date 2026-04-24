import { cn } from '../../utils/cn'

/**
 * Shared pagination for rooms list, dashboard tables, and other paginated API views.
 */
export default function AppPagination({
  page,
  totalCount,
  pageSize,
  onPageChange,
  loading = false,
  className,
  /** Compact variant for dashboard footers */
  compact = false,
}) {
  const count = totalCount ?? 0
  const totalPages = Math.max(1, Math.ceil(count / pageSize) || 1)

  if (loading || totalPages <= 1) return null

  const windowSize = compact ? 5 : 5
  let start = Math.max(1, page - Math.floor(windowSize / 2))
  let end = Math.min(totalPages, start + windowSize - 1)
  if (end - start < windowSize - 1) start = Math.max(1, end - windowSize + 1)
  const pages = []
  for (let i = start; i <= end; i += 1) pages.push(i)

  return (
    <nav
      className={cn(
        'flex flex-col items-center justify-center gap-3 border-t border-porcelain/10 pt-6 sm:flex-row sm:gap-6',
        compact && 'border-t-0 pt-4',
        className,
      )}
      aria-label="Pagination"
    >
      <p className="text-center text-xs text-porcelain-muted">
        Page {page} of {totalPages}
        <span className="text-porcelain-muted/70"> · {count} total</span>
      </p>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-full border border-porcelain/20 px-3 py-1.5 text-xs uppercase tracking-widest text-porcelain transition hover:border-gold-500/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Prev
        </button>
        <div className="flex flex-wrap justify-center gap-1">
          {pages.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => onPageChange(n)}
              className={cn(
                'min-w-[2rem] rounded-lg px-2 py-1 text-sm tabular-nums transition',
                n === page
                  ? 'bg-gold-500/25 text-gold-300 ring-1 ring-gold-500/40'
                  : 'text-porcelain-muted hover:bg-porcelain/10 hover:text-porcelain',
              )}
            >
              {n}
            </button>
          ))}
        </div>
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-full border border-porcelain/20 px-3 py-1.5 text-xs uppercase tracking-widest text-porcelain transition hover:border-gold-500/50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </nav>
  )
}
