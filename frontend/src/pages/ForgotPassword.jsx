import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import SEO from '../components/common/SEO'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { requestPasswordReset } from '../services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      await requestPasswordReset(email.trim())
      setSent(true)
      toast.success('Check your inbox for the next step.')
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="Forgot password"
        description="Request a secure link to reset your Aurum Grand account password."
        path="/forgot-password"
        noindex
      />
      <div data-scroll="scale" className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 pb-24">
        <p className="text-xs uppercase tracking-[0.35em] text-gold-500">Account</p>
        <h1 className="mt-3 font-display text-3xl text-porcelain">Forgot password</h1>
        <p className="mt-2 text-sm text-porcelain-muted">
          Enter the email you used to register. If it matches an account, we will send reset instructions.
        </p>
        {sent ? (
          <div className="mt-8 space-y-4 rounded-2xl border border-gold-500/25 bg-gold-500/10 p-6 text-sm leading-relaxed text-porcelain-muted">
            <p>
              If an account exists for <span className="text-porcelain">{email}</span>, you will receive an email
              with a link to choose a new password. The link expires after a short time for your security.
            </p>
            {import.meta.env.DEV && (
              <p className="text-xs text-porcelain-muted/80">
                Local dev: reset emails print in the Django server terminal (console backend).
              </p>
            )}
            <Button as={Link} to="/login" className="w-full">
              Back to sign in
            </Button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="mt-8 space-y-5 rounded-2xl border border-porcelain/15 bg-porcelain/5 p-6">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Sending…' : 'Send reset link'}
            </Button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-porcelain-muted">
          <Link to="/login" className="text-gold-400 hover:underline">
            Return to sign in
          </Link>
        </p>
      </div>
    </>
  )
}
