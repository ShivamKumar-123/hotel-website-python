import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import SEO from '../../components/common/SEO'
import Loader from '../../components/common/Loader'
import { fetchDashboardStats } from '../../services/api'
import StatCard from '../components/StatCard'

export default function DashboardHome() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const s = await fetchDashboardStats()
        if (!cancelled) setData(s)
      } catch {
        if (!cancelled) toast.error('Could not load dashboard metrics.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading) return <Loader label="Syncing property data…" />

  const byStatus = data?.bookings_by_status || {}
  const chartData = data?.monthly || []

  return (
    <>
      <SEO
        title="Dashboard"
        description="Aurum Grand operations overview — staff console."
        path="/dashboard"
        noindex
      />
      <div className="space-y-8">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Registered guests" value={data?.total_users ?? '—'} />
          <StatCard label="Active rooms" value={data?.total_rooms ?? '—'} />
          <StatCard
            label="Confirmed revenue"
            value={
              data?.revenue_confirmed != null
                ? new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(
                    data.revenue_confirmed,
                  )
                : '—'
            }
          />
          <StatCard
            label="Reviews awaiting approval"
            value={data?.pending_reviews ?? '—'}
            hint="Moderate from the Reviews tab"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {['pending', 'confirmed', 'cancelled'].map((k) => (
            <StatCard
              key={k}
              label={`Bookings · ${k}`}
              value={byStatus[k] ?? 0}
              hint="Live reservation pipeline"
            />
          ))}
        </div>

        <div className="rounded-2xl border border-porcelain/15 bg-porcelain/5 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-gold-500">Performance</p>
              <h2 className="font-display text-xl text-porcelain">Confirmed revenue by month</h2>
            </div>
          </div>
          <div className="mt-6 h-72 w-full min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c9a962" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#c9a962" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff14" />
                <XAxis dataKey="month" stroke="#e8e2d988" tick={{ fontSize: 11 }} />
                <YAxis stroke="#e8e2d988" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: '#121212',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 12,
                  }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#c9a962" fill="url(#rev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  )
}
