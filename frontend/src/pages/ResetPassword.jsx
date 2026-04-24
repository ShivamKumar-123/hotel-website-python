import { useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import SEO from '../components/common/SEO'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { confirmPasswordReset } from '../services/api'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const uid = useMemo(() => params.get('uid') || '', [params])
  const token = useMemo(() => params.get('token') || '', [params])

  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const linkOk = Boolean(uid && token)

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    if (password !== password2) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 8) {
      setError('Use at least 8 characters.')
      return
    }
    setLoading(true)
    try {
      await confirmPasswordReset({
        uid,
        token,
        new_password: password,
        new_password_confirm: password2,
      })
      toast.success('Password updated. Sign in with your new password.')
      navigate('/login', { replace: true })
    } catch (err) {
      const d = err.response?.data
      const msg =
        d?.non_field_errors?.[0] ||
        (typeof d?.detail === 'string' && d.detail) ||
        (Array.isArray(d?.detail) && d.detail[0]) ||
        d?.new_password?.[0] ||
        d?.new_password_confirm?.[0] ||
        'This link is invalid or has expired. Request a new one.'
      setError(msg)
      toast.error('Could not reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="Reset password"
        description="Choose a new password for your Aurum Grand account."
        path="/reset-password"
        noindex
      />
      <div data-scroll="scale" className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 pb-24">
        <p className="text-xs uppercase tracking-[0.35em] text-gold-500">Account</p>
        <h1 className="mt-3 font-display text-3xl text-porcelain">New password</h1>
        <p className="mt-2 text-sm text-porcelain-muted">Choose a strong password you have not used here before.</p>

        {!linkOk ? (
          <div className="mt-8 space-y-4 rounded-2xl border border-porcelain/15 bg-porcelain/5 p-6 text-sm text-porcelain-muted">
            <p>This page needs a valid reset link from your email. Open the link from the message, or request a new one.</p>
            <Button as={Link} to="/forgot-password" className="w-full">
              Request reset link
            </Button>
            <Button as={Link} to="/login" variant="ghost" className="w-full">
              Sign in
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-porcelain/15 bg-porcelain/5 p-6">
            {error && (
              <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">{error}</p>
            )}
            <Input
              label="New password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            <Input
              label="Confirm new password"
              type="password"
              autoComplete="new-password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
              minLength={8}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Saving…' : 'Update password'}
            </Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-porcelain-muted">
          <Link to="/login" className="text-gold-400 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </>
  )
}
