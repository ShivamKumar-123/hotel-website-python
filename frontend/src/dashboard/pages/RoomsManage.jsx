import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import AppPagination from '../../components/common/AppPagination'
import SEO from '../../components/common/SEO'
import Modal from '../../components/common/Modal'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Select from '../../components/ui/Select'
import Textarea from '../../components/ui/Textarea'
import { createRoom, deleteRoom, fetchRoom, fetchRooms, updateRoom } from '../../services/api'
import { formatMoney } from '../../utils/format'

const PAGE_SIZE = 8

const emptyForm = {
  name: '',
  description: '',
  price_per_night: '',
  max_guests: '2',
  size_sqm: '40',
  bed_type: 'King',
  has_ac: true,
  has_balcony: false,
  garden_facing: false,
  washroom_type: 'western',
  amenities: 'Butler, Spa',
  cover_image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1200&q=80',
  gallery: '',
  is_featured: false,
  is_active: true,
}

function parseList(raw) {
  return raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export default function RoomsManage() {
  const [rows, setRows] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState({ open: false, editing: null })
  const [form, setForm] = useState(emptyForm)
  const [sort, setSort] = useState({ key: 'name', dir: 'asc' })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchRooms({ page, page_size: PAGE_SIZE })
      const list = data.results || data
      setRows(Array.isArray(list) ? list : [])
      setTotalCount(typeof data.count === 'number' ? data.count : list.length)
    } catch {
      toast.error('Failed to load rooms.')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    load()
  }, [load])

  function openCreate() {
    setForm(emptyForm)
    setModal({ open: true, editing: null })
  }

  async function openEdit(room) {
    try {
      const full = await fetchRoom(room.slug)
      setForm({
        name: full.name,
        description: full.description,
        price_per_night: String(full.price_per_night),
        max_guests: String(full.max_guests),
        size_sqm: String(full.size_sqm),
        bed_type: full.bed_type,
        has_ac: full.has_ac !== false,
        has_balcony: !!full.has_balcony,
        garden_facing: !!full.garden_facing,
        washroom_type: full.washroom_type === 'indian' ? 'indian' : 'western',
        amenities: Array.isArray(full.amenities) ? full.amenities.join(', ') : '',
        cover_image: full.cover_image,
        gallery: Array.isArray(full.gallery) ? full.gallery.join(', ') : '',
        is_featured: !!full.is_featured,
        is_active: full.is_active !== false,
      })
      setModal({ open: true, editing: full })
    } catch {
      toast.error('Could not load room details.')
    }
  }

  async function saveRoom(e) {
    e.preventDefault()
    const body = {
      name: form.name,
      description: form.description,
      price_per_night: form.price_per_night,
      max_guests: Number(form.max_guests),
      size_sqm: Number(form.size_sqm),
      bed_type: form.bed_type,
      has_ac: !!form.has_ac,
      has_balcony: !!form.has_balcony,
      garden_facing: !!form.garden_facing,
      washroom_type: form.washroom_type === 'indian' ? 'indian' : 'western',
      amenities: parseList(form.amenities),
      cover_image: form.cover_image,
      gallery: parseList(form.gallery),
      is_featured: form.is_featured,
      is_active: form.is_active,
    }
    try {
      if (modal.editing) {
        await updateRoom(modal.editing.slug, body)
        toast.success('Room updated.')
      } else {
        await createRoom(body)
        toast.success('Room created.')
      }
      setModal({ open: false, editing: null })
      await load()
    } catch (err) {
      toast.error(err.response?.data ? JSON.stringify(err.response.data) : 'Save failed.')
    }
  }

  async function remove(room) {
    if (!window.confirm(`Delete ${room.name}?`)) return
    try {
      await deleteRoom(room.slug)
      toast.success('Room removed.')
      await load()
    } catch {
      toast.error('Delete failed.')
    }
  }

  const sorted = [...rows].sort((a, b) => {
    const av = a[sort.key]
    const bv = b[sort.key]
    const m = sort.dir === 'asc' ? 1 : -1
    if (av == null || bv == null) return 0
    if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * m
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
        title="Rooms · Dashboard"
        description="Manage Aurum Grand room inventory and suite details."
        path="/dashboard/rooms"
        noindex
      />
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-2xl text-porcelain">Rooms</h2>
          <p className="text-sm text-porcelain-muted">Create, edit, and retire inventory.</p>
        </div>
        <Button type="button" onClick={openCreate}>
          New room
        </Button>
      </div>

      <div className="scrollbar-themed mt-6 overflow-x-auto rounded-2xl border border-porcelain/15">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="bg-white/5 text-xs uppercase tracking-widest text-gold-500/90">
            <tr>
              <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('name')}>
                Name
              </th>
              <th className="cursor-pointer px-4 py-3" onClick={() => toggleSort('price_per_night')}>
                Rate
              </th>
              <th className="px-4 py-3">Guests</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Active</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-porcelain-muted">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center">
                  Loading…
                </td>
              </tr>
            ) : (
              sorted.map((r) => (
                <tr key={r.id} className="hover:bg-white/5">
                  <td className="px-4 py-3 text-porcelain">{r.name}</td>
                  <td className="px-4 py-3">{formatMoney(r.price_per_night)}</td>
                  <td className="px-4 py-3">{r.max_guests}</td>
                  <td className="px-4 py-3">{r.is_featured ? 'Yes' : '—'}</td>
                  <td className="px-4 py-3">{r.is_active === false ? 'No' : 'Yes'}</td>
                  <td className="space-x-2 px-4 py-3 text-right">
                    <Button type="button" variant="ghost" className="!inline-flex !px-3 !py-1 !text-xs" onClick={() => openEdit(r)}>
                      Edit
                    </Button>
                    <Button type="button" variant="danger" className="!inline-flex !px-3 !py-1 !text-xs" onClick={() => remove(r)}>
                      Delete
                    </Button>
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

      <Modal open={modal.open} onClose={() => setModal({ open: false, editing: null })} title={modal.editing ? 'Edit room' : 'New room'}>
        <form className="space-y-4" onSubmit={saveRoom}>
          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <Textarea label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} required />
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Price / night" type="number" step="0.01" value={form.price_per_night} onChange={(e) => setForm((f) => ({ ...f, price_per_night: e.target.value }))} required />
            <Input label="Max guests" type="number" value={form.max_guests} onChange={(e) => setForm((f) => ({ ...f, max_guests: e.target.value }))} required />
            <Input label="Size (m²)" type="number" value={form.size_sqm} onChange={(e) => setForm((f) => ({ ...f, size_sqm: e.target.value }))} required />
            <Input label="Bed type" value={form.bed_type} onChange={(e) => setForm((f) => ({ ...f, bed_type: e.target.value }))} required />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-porcelain-muted">
              <input
                type="checkbox"
                checked={form.has_ac}
                onChange={(e) => setForm((f) => ({ ...f, has_ac: e.target.checked }))}
              />
              Air-conditioned (AC)
            </label>
            <label className="flex items-center gap-2 text-sm text-porcelain-muted">
              <input
                type="checkbox"
                checked={form.has_balcony}
                onChange={(e) => setForm((f) => ({ ...f, has_balcony: e.target.checked }))}
              />
              Balcony
            </label>
            <label className="flex items-center gap-2 text-sm text-porcelain-muted">
              <input
                type="checkbox"
                checked={form.garden_facing}
                onChange={(e) => setForm((f) => ({ ...f, garden_facing: e.target.checked }))}
              />
              Garden / courtyard side
            </label>
            <Select
              label="Washroom type"
              value={form.washroom_type}
              onChange={(e) => setForm((f) => ({ ...f, washroom_type: e.target.value }))}
            >
              <option value="western">Western</option>
              <option value="indian">Indian</option>
            </Select>
          </div>
          <Input label="Cover image URL" value={form.cover_image} onChange={(e) => setForm((f) => ({ ...f, cover_image: e.target.value }))} required />
          <Input label="Amenities (comma-separated)" value={form.amenities} onChange={(e) => setForm((f) => ({ ...f, amenities: e.target.value }))} />
          <Input label="Gallery URLs (comma-separated)" value={form.gallery} onChange={(e) => setForm((f) => ({ ...f, gallery: e.target.value }))} />
          <label className="flex items-center gap-2 text-sm text-porcelain-muted">
            <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))} />
            Featured on homepage
          </label>
          <label className="flex items-center gap-2 text-sm text-porcelain-muted">
            <input type="checkbox" checked={form.is_active} onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))} />
            Active / bookable
          </label>
          <Button type="submit" className="w-full">
            Save
          </Button>
        </form>
      </Modal>
    </>
  )
}
