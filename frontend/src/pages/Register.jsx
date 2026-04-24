import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import SEO from '../components/common/SEO'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { registerRequest } from '../services/api'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    password: '',
    password_confirm: '',
  })
  const [loading, setLoading] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    if (form.password !== form.password_confirm) {
      toast.error('Passwords do not match.')
      return
    }
    setLoading(true)
    try {
      await registerRequest(form)
      toast.success('Account created — please sign in.')
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      toast.error(data ? JSON.stringify(data) : 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="Join"
        description="Create an Aurum Grand guest profile to save preferences and book faster."
        path="/register"
        keywords="Aurum Grand account, hotel guest register"
        noindex
      />
      <div data-scroll="scale" className="mx-auto max-w-lg px-4 pb-24">
        <p className="text-xs uppercase tracking-[0.35em] text-gold-500">Welcome</p>
        <h1 className="mt-3 font-display text-3xl text-porcelain">Create your profile</h1>
        <p className="mt-2 text-sm text-porcelain-muted">
          Already registered?{' '}
          <Link to="/login" className="text-gold-400 hover:underline">
            Sign in
          </Link>
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-porcelain/15 bg-porcelain/5 p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Input
              label="First name"
              value={form.first_name}
              onChange={(e) => setForm((f) => ({ ...f, first_name: e.target.value }))}
            />
            <Input
              label="Last name"
              value={form.last_name}
              onChange={(e) => setForm((f) => ({ ...f, last_name: e.target.value }))}
            />
          </div>
          <Input
            label="Username"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
          />
          <Input
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
            minLength={8}
          />
          <Input
            label="Confirm password"
            type="password"
            value={form.password_confirm}
            onChange={(e) => setForm((f) => ({ ...f, password_confirm: e.target.value }))}
            required
            minLength={8}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating…' : 'Join Aurum Grand'}
          </Button>
        </form>
      </div>
    </>
  )
}
