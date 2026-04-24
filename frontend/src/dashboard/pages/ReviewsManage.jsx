import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AppPagination from '../../components/common/AppPagination'
import SEO from '../../components/common/SEO'
import Button from '../../components/ui/Button'
import { fetchReviews, updateReview } from '../../services/api'
import { formatDate } from '../../utils/format'

const PAGE_SIZE = 6

export default function ReviewsManage() {
  const [rows, setRows] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, page_size: PAGE_SIZE }
      if (filter === 'pending') params.approved = false
      if (filter === 'approved') params.approved = true
      const data = await fetchReviews(params)
      const list = data.results || data
      setRows(Array.isArray(list) ? list : [])
      setTotalCount(typeof data.count === 'number' ? data.count : list.length)
    } catch {
      toast.error('Failed to load reviews.')
    } finally {
      setLoading(false)
    }
  }, [filter, page])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [filter])

  async function approve(id, flag) {
    try {
      await updateReview(id, { is_approved: flag })
      toast.success(flag ? 'Review approved.' : 'Review hidden.')
      await load()
    } catch {
      toast.error('Update failed.')
    }
  }

  return (
    <>
      <SEO
        title="Reviews · Dashboard"
        description="Moderate guest reviews for Aurum Grand."
        path="/dashboard/reviews"
        noindex
      />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-2xl text-porcelain">Reviews</h2>
          <p className="text-sm text-porcelain-muted">Moderate guest stories before they appear on-site.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'pending', label: 'Pending' },
            { id: 'approved', label: 'Approved' },
            { id: 'all', label: 'All' },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition ${
                filter === t.id
                  ? 'border-gold-500 text-gold-300'
                  : 'border-porcelain/15 text-porcelain-muted hover:border-gold-500/40'
              }`}
              onClick={() => setFilter(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="scrollbar-themed mt-6 max-h-[min(70vh,720px)] space-y-4 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-sm text-porcelain-muted">Loading…</p>
        ) : (
          rows.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-porcelain/15 bg-porcelain/5 p-5 text-sm text-porcelain-muted"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-porcelain">{r.user_name}</p>
                  <p className="text-xs text-porcelain-muted/80">{formatDate(r.created_at)}</p>
                </div>
                <p className="text-gold-400">{'★'.repeat(r.rating)}</p>
              </div>
              <p className="mt-3 leading-relaxed">{r.comment}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {!r.is_approved && (
                  <Button type="button" className="!text-xs" onClick={() => approve(r.id, true)}>
                    Approve
                  </Button>
                )}
                {r.is_approved && (
                  <Button type="button" variant="ghost" className="!text-xs" onClick={() => approve(r.id, false)}>
                    Hide
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <AppPagination
        compact
        className="mt-6"
        page={page}
        totalCount={totalCount}
        pageSize={PAGE_SIZE}
        loading={loading}
        onPageChange={setPage}
      />
    </>
  )
}
