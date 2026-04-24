import { useEffect, useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import SEO from '../components/common/SEO'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { login, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/'
  const adminWelcome = location.state?.adminWelcome === true

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [welcomeOpen, setWelcomeOpen] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(4)

  useEffect(() => {
    if (!welcomeOpen) return undefined
    setSecondsLeft(4)
    const go = setTimeout(() => {
      navigate('/dashboard', { replace: true })
    }, 4000)
    const tick = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => {
      clearTimeout(go)
      clearInterval(tick)
    }
  }, [welcomeOpen, navigate])

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      const user = await refreshProfile()

      if (adminWelcome) {
        const staff = user && (user.role === 'staff' || user.role === 'admin')
        if (!staff) {
          toast.error('This entrance is reserved for staff and administrators.')
          navigate('/', { replace: true })
          return
        }
        setWelcomeOpen(true)
        return
      }

      toast.success('Welcome back.')
      navigate(from, { replace: true })
    } catch {
      toast.error('Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  function goDashboardNow() {
    navigate('/dashboard', { replace: true })
  }

  return (
    <>
      <SEO
        title="Sign in"
        description="Access your Aurum Grand guest account, reservations, and booking history."
        path="/login"
        keywords="Aurum Grand login, guest account, hotel reservations"
        noindex
      />
      <div data-scroll="scale" className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 pb-24">
        <p className="text-xs uppercase tracking-[0.35em] text-gold-500">Members</p>
        <h1 className="mt-3 font-display text-3xl text-porcelain">Sign in</h1>
        <p className="mt-2 text-sm text-porcelain-muted">
          New to Aurum?{' '}
          <Link to="/register" className="text-gold-400 hover:underline">
            Create an account
          </Link>
        </p>
        {adminWelcome && (
          <p className="mt-3 rounded-xl border border-gold-500/25 bg-gold-500/10 px-4 py-3 text-xs leading-relaxed text-porcelain-muted">
            You are using the <span className="text-gold-400">staff &amp; admin</span> entrance. After sign-in,
            you will be taken to the operations dashboard.
          </p>
        )}
        <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-porcelain/15 bg-porcelain/5 p-6">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="text-right">
            <Link to="/forgot-password" className="text-xs text-gold-400/90 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in…' : 'Continue'}
          </Button>
        </form>
        <p className="mt-6 text-center text-xs text-porcelain-muted/70">
          Demo: guest@example.com / guest12345 · Staff: concierge@aurumgrand.com / staff12345
        </p>
      </div>

      {welcomeOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="admin-welcome-title"
        >
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-gold-500/35 bg-gradient-to-b from-slate-900/95 to-ink p-8 shadow-[0_40px_100px_rgba(0,0,0,0.55)] ring-1 ring-white/10">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle,rgba(201,169,98,0.22)_0%,transparent_70%)] blur-2xl"
              aria-hidden
            />
            <div
              className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(232,213,163,0.12)_0%,transparent_70%)] blur-2xl"
              aria-hidden
            />
            <div className="relative text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-gold-500/40 bg-gold-500/15 shadow-inner shadow-gold-500/20">
                <span className="text-2xl text-gold-300" aria-hidden>
                  ✦
                </span>
              </div>
              <h2 id="admin-welcome-title" className="mt-5 font-display text-2xl text-porcelain md:text-3xl">
                Welcome to the house
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-porcelain-muted">
                Your session is attuned. The operations floor is opening — lights low, numbers quiet, the day
                arranged before you arrive.
              </p>
              <p className="mt-6 font-display text-4xl tabular-nums text-gold-400">{secondsLeft}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.25em] text-porcelain-muted/80">
                Entering dashboard…
              </p>
              <Button type="button" className="mt-8 w-full" onClick={goDashboardNow}>
                Enter now
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
