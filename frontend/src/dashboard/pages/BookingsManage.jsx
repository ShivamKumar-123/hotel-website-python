import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AppPagination from '../../components/common/AppPagination'
import SEO from '../../components/common/SEO'
import Button from '../../components/ui/Button'
import Select from '../../components/ui/Select'
import { fetchBookings, updateBooking } from '../../services/api'
import { formatDate, formatMoney } from '../../utils/format'

const PAGE_SIZE = 8

export default function BookingsManage() {
  const [rows, setRows] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState('')
  const [sort, setSort] = useState({ key: 'created_at', dir: 'desc' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, page_size: PAGE_SIZE }
      if (status) params.status = status
      const data = await fetchBookings(params)
      const list = data.results || data
      setRows(Array.isArray(list) ? list : [])
      setTotalCount(typeof data.count === 'number' ? data.count : list.length)
    } catch {
      toast.error('Failed to load bookings.')
    } finally {
      setLoading(false)
    }
  }, [status, page])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [status])

  async function changeStatus(id, next) {
    try {
      await updateBooking(id, { status: next })
      toast.success('Booking updated.')
      await load()
    } catch {
      toast.error('Update failed.')
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const av = a[sort.key]
    const bv = b[sort.key]
    const m = sort.dir === 'asc' ? 1 : -1
    if (av == null || bv == null) return 0
    if (sort.key === 'total_price') return (Number(av) - Number(bv)) * m
    return String(av).localeCompare(String(bv)) * m
  })

  function toggleSort(key) {
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'asc' },
    )
  }

  return (
    <>
      <SEO
        title="Bookings · Dashboard"
        description="Manage Aurum Grand reservations and guest bookings."
        path="/dashboard/bookings"
        noindex
      />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-2xl text-porcelain">Bookings</h2>
          <p className="text-sm text-porcelain-muted">
            Review payment screenshots, then set status to <span className="text-gold-400/90">Confirmed</span> when
            verified.
          </p>
        </div>
        <div className="w-full max-w-xs">
          <Select label="Status filter" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </Select>
        </div>
      </div>

      <div className="scrollbar-themed mt-6 overflow-x-auto rounded-2xl border border-porcelain/15">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-widest text-gold-500/90">
            <tr>
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Room</th>
              <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('check_in')}>
                Arrival
              </th>
              <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('check_out')}>
                Departure
              </th>
              <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('total_price')}>
                Total
              </th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-porcelain-muted">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">
                  Loading…
                </td>
              </tr>
            ) : (
              sorted.map((b) => (
                <tr key={b.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-porcelain">{b.user_email}</td>
                  <td className="px-4 py-3">{b.room_name}</td>
                  <td className="px-4 py-3">{formatDate(b.check_in)}</td>
                  <td className="px-4 py-3">{formatDate(b.check_out)}</td>
                  <td className="px-4 py-3">{formatMoney(b.total_price)}</td>
                  <td className="px-4 py-3">
                    {b.payment_screenshot_url ? (
                      <a
                        href={b.payment_screenshot_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-gold-400 underline-offset-2 hover:underline"
                      >
                        View proof
                      </a>
                    ) : (
                      <span className="text-xs opacity-60">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full border border-porcelain/15 px-2 py-0.5 text-xs uppercase tracking-wide text-gold-400">
                        {b.status}
                      </span>
                      <Select
                        label=""
                        aria-label={`Status for booking ${b.id}`}
                        className="!py-1 !text-xs"
                        value={b.status}
                        onChange={(e) => changeStatus(b.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </Select>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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

      <div className="mt-4">
        <Button type="button" variant="ghost" className="!text-xs" onClick={load}>
          Refresh
        </Button>
      </div>
    </>
  )
}
