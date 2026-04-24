import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AppPagination from '../../components/common/AppPagination'
import SEO from '../../components/common/SEO'
import Select from '../../components/ui/Select'
import Input from '../../components/ui/Input'
import { fetchUsers, updateUser } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { formatDate } from '../../utils/format'

const PAGE_SIZE = 8

export default function UsersManage() {
  const { isAdmin } = useAuth()
  const [rows, setRows] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [role, setRole] = useState('')
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = { page, page_size: PAGE_SIZE }
      if (role) params.role = role
      if (appliedSearch.trim()) params.search = appliedSearch.trim()
      const data = await fetchUsers(params)
      const list = data.results || data
      setRows(Array.isArray(list) ? list : [])
      setTotalCount(typeof data.count === 'number' ? data.count : list.length)
    } catch {
      toast.error('Failed to load users.')
    } finally {
      setLoading(false)
    }
  }, [role, page, appliedSearch])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [role])

  function runSearch() {
    setAppliedSearch(search.trim())
    setPage(1)
  }

  async function patchRole(id, nextRole) {
    if (!isAdmin) {
      toast.error('Only administrators may change roles.')
      return
    }
    try {
      await updateUser(id, { role: nextRole })
      toast.success('User updated.')
      await load()
    } catch {
      toast.error('Update failed — admin role required.')
    }
  }

  return (
    <>
      <SEO
        title="Users · Dashboard"
        description="Manage Aurum Grand staff and guest roles."
        path="/dashboard/users"
        noindex
      />
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="font-display text-2xl text-porcelain">Guests & team</h2>
          <p className="text-sm text-porcelain-muted">
            Inspect accounts. Role changes require an administrator session.
          </p>
        </div>
        <div className="grid w-full max-w-xl gap-3 md:grid-cols-2">
          <Select label="Role filter" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">All</option>
            <option value="guest">Guest</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </Select>
          <div className="flex items-end gap-2">
            <Input
              label="Search email"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="name@domain.com"
            />
            <button
              type="button"
              className="mb-1 rounded-full border border-gold-500/40 px-4 py-2 text-xs uppercase tracking-widest text-gold-300"
              onClick={runSearch}
            >
              Go
            </button>
          </div>
        </div>
      </div>

      <div className="scrollbar-themed mt-6 overflow-x-auto rounded-2xl border border-porcelain/15">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-widest text-gold-500/90">
            <tr>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Adjust role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-porcelain-muted">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  Loading…
                </td>
              </tr>
            ) : (
              rows.map((u) => (
                <tr key={u.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-porcelain">{u.email}</td>
                  <td className="px-4 py-3">
                    {u.first_name} {u.last_name}
                  </td>
                  <td className="px-4 py-3 uppercase tracking-wide text-gold-400">{u.role}</td>
                  <td className="px-4 py-3">{formatDate(u.date_joined)}</td>
                  <td className="px-4 py-3">
                    <Select
                      className="!py-1 !text-xs"
                      value={u.role}
                      disabled={!isAdmin}
                      onChange={(e) => patchRole(u.id, e.target.value)}
                    >
                      <option value="guest">guest</option>
                      <option value="staff">staff</option>
                      <option value="admin">admin</option>
                    </Select>
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
    </>
  )
}
