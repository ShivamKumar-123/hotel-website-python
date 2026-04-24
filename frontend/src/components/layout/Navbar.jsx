import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { cn } from '../../utils/cn'
import { useAuth } from '../../hooks/useAuth'
import Button from '../ui/Button'
import ThemeToggle from './ThemeToggle'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/rooms', label: 'Suites' },
  { to: '/booking', label: 'Reserve' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, logout, isStaff } = useAuth()

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-porcelain/10 bg-ink/80 backdrop-blur-xl pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex min-w-0 max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:px-4 sm:py-4 md:px-6">
        <Link
          to="/"
          className="min-w-0 shrink font-display text-sm tracking-[0.2em] text-porcelain sm:text-base sm:tracking-[0.25em] md:text-lg"
        >
          AURUM<span className="text-gold-500"> GRAND</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                cn(
                  'text-xs uppercase tracking-[0.25em] transition hover:text-gold-300',
                  isActive ? 'text-gold-400' : 'text-porcelain-muted',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {isStaff && (
            <Button as={Link} to="/dashboard" variant="outlineGold" className="!py-2 !text-xs">
              Concierge
            </Button>
          )}
          {user && (
            <Button as={Link} to="/my-bookings" variant="ghost" className="!py-2 !text-xs">
              My stays
            </Button>
          )}
          {user ? (
            <Button variant="ghost" className="!py-2 !text-xs" type="button" onClick={logout}>
              Sign out
            </Button>
          ) : (
            <>
              <Button as={Link} to="/login" variant="ghost" className="!py-2 !text-xs">
                Sign in
              </Button>
              <Button as={Link} to="/register" className="!py-2 !text-xs">
                Join
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg border border-porcelain/15 px-3 py-2 text-xs uppercase tracking-widest text-porcelain md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-label="Menu"
        >
          Menu
        </button>
      </div>

      {open && (
        <div className="border-t border-porcelain/10 bg-ink px-4 py-4 md:hidden">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-porcelain-muted">Theme</span>
            <ThemeToggle />
          </div>
          <div className="flex flex-col gap-3">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-porcelain-muted"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            {isStaff && (
              <Link to="/dashboard" className="text-sm text-gold-400" onClick={() => setOpen(false)}>
                Concierge dashboard
              </Link>
            )}
            {user && (
              <Link to="/my-bookings" className="text-sm text-porcelain-muted" onClick={() => setOpen(false)}>
                My stays
              </Link>
            )}
            {user ? (
              <button type="button" className="text-left text-sm text-porcelain-muted" onClick={logout}>
                Sign out
              </button>
            ) : (
              <>
                <Link to="/login" className="text-sm" onClick={() => setOpen(false)}>
                  Sign in
                </Link>
                <Link to="/register" className="text-sm text-gold-400" onClick={() => setOpen(false)}>
                  Join
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
