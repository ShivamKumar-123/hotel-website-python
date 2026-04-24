import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { cn } from '../../utils/cn'
import Button from '../../components/ui/Button'
import AmbientBackground from '../../components/layout/AmbientBackground'
import ThemeToggle from '../../components/layout/ThemeToggle'
import { useAuth } from '../../hooks/useAuth'

const nav = [
  { to: '/dashboard', label: 'Overview', end: true },
  { to: '/dashboard/home-content', label: 'Home media' },
  { to: '/dashboard/rooms', label: 'Rooms' },
  { to: '/dashboard/bookings', label: 'Bookings' },
  { to: '/dashboard/users', label: 'Guests & roles' },
  { to: '/dashboard/reviews', label: 'Reviews' },
]

/**
 * Admin shell — sidebar + top bar; staff-only route guard lives in the router.
 */
export default function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen text-porcelain">
      <AmbientBackground />
      <div className="relative z-10 flex min-h-screen min-w-0">
        <aside className="scrollbar-themed hidden w-60 flex-col overflow-y-auto border-r border-porcelain/15 bg-ink-soft/80 p-6 md:flex">
          <p className="font-display text-sm tracking-[0.25em] text-porcelain">
            AURUM<span className="text-gold-500"> OS</span>
          </p>
          <nav className="mt-10 flex flex-col gap-1 text-sm">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2 transition',
                    isActive ? 'bg-porcelain/10 text-gold-300' : 'text-porcelain-muted hover:text-porcelain',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto space-y-3 border-t border-porcelain/15 pt-6 text-xs text-porcelain-muted">
            <p className="truncate">{user?.email}</p>
            <p className="uppercase tracking-widest text-gold-500/80">{user?.role}</p>
            <Button
              variant="ghost"
              className="!w-full !justify-start !px-3 !py-2 !text-xs"
              type="button"
              onClick={() => {
                logout()
                navigate('/login')
              }}
            >
              Sign out
            </Button>
          </div>
        </aside>
        <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-hidden">
          <header className="flex items-center justify-between gap-3 border-b border-porcelain/15 bg-ink/90 px-4 py-4 backdrop-blur md:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-gold-500">Concierge desk</p>
              <h1 className="font-display text-xl text-porcelain">Operations</h1>
            </div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outlineGold" className="!text-xs" type="button" onClick={() => navigate('/')}>
                View hotel site
              </Button>
            </div>
          </header>
          <div className="scrollbar-themed flex-1 overflow-auto p-4 md:p-8">
            <nav className="mb-6 flex flex-wrap gap-2 text-xs md:hidden">
              {nav.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    cn(
                      'rounded-full border px-3 py-1',
                      isActive ? 'border-gold-500 text-gold-300' : 'border-porcelain/15 text-porcelain-muted',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
