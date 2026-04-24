import { useCallback, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import SEO from '../../components/common/SEO'
import Loader from '../../components/common/Loader'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'
import Textarea from '../../components/ui/Textarea'
import { fetchHomeContent, patchHomeContent } from '../../services/api'
import { DEFAULT_HERO_CAROUSEL, DEFAULT_HOME_GALLERY } from '../../constants/homeContentDefaults'

function newSlideId() {
  return `slide-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function newGalleryId() {
  return `img-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

const emptySlide = () => ({
  id: newSlideId(),
  image: '',
  kicker: '',
  title: '',
  titleHighlight: '',
  subtitle: '',
  primaryLabel: 'View suites',
  primaryTo: '/rooms',
  secondaryLabel: '',
  secondaryTo: '',
})

const emptyGalleryRow = () => ({
  id: newGalleryId(),
  src: '',
  caption: '',
})

export default function HomeContentManage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [slides, setSlides] = useState([])
  const [gallery, setGallery] = useState([])
  const [updatedAt, setUpdatedAt] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchHomeContent()
      const hc = Array.isArray(data.hero_carousel) && data.hero_carousel.length > 0
        ? data.hero_carousel
        : [...DEFAULT_HERO_CAROUSEL]
      const hg = Array.isArray(data.home_gallery) && data.home_gallery.length > 0
        ? data.home_gallery
        : [...DEFAULT_HOME_GALLERY]
      setSlides(hc.map((s) => ({ ...s })))
      setGallery(hg.map((g) => ({ ...g })))
      setUpdatedAt(data.updated_at || null)
    } catch {
      toast.error('Could not load home content.')
      setSlides(DEFAULT_HERO_CAROUSEL.map((s) => ({ ...s })))
      setGallery(DEFAULT_HOME_GALLERY.map((g) => ({ ...g })))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  async function save() {
    const invalidSlide = slides.find((s) => !String(s.image || '').trim() || !String(s.title || '').trim())
    if (invalidSlide) {
      toast.error('Each carousel slide needs an image URL and a title.')
      return
    }
    const invalidG = gallery.find((g) => !String(g.src || '').trim())
    if (invalidG) {
      toast.error('Each gallery row needs an image URL.')
      return
    }
    setSaving(true)
    try {
      const payload = {
        hero_carousel: slides.map((s) => ({
          id: String(s.id || newSlideId()),
          image: String(s.image).trim(),
          kicker: String(s.kicker || '').trim(),
          title: String(s.title).trim(),
          titleHighlight: String(s.titleHighlight || '').trim(),
          subtitle: String(s.subtitle || '').trim(),
          primaryLabel: String(s.primaryLabel || '').trim(),
          primaryTo: String(s.primaryTo || '/rooms').trim(),
          secondaryLabel: String(s.secondaryLabel || '').trim(),
          secondaryTo: String(s.secondaryTo || '').trim(),
        })),
        home_gallery: gallery.map((g) => ({
          id: String(g.id || newGalleryId()),
          src: String(g.src).trim(),
          caption: String(g.caption || '').trim(),
        })),
      }
      const data = await patchHomeContent(payload)
      setUpdatedAt(data.updated_at || null)
      toast.success('Home page carousel & gallery saved.')
    } catch (e) {
      const msg = e.response?.data ? JSON.stringify(e.response.data) : 'Save failed.'
      toast.error(typeof msg === 'string' ? msg : 'Save failed.')
    } finally {
      setSaving(false)
    }
  }

  function moveSlide(i, dir) {
    const j = i + dir
    if (j < 0 || j >= slides.length) return
    setSlides((prev) => {
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  function moveGallery(i, dir) {
    const j = i + dir
    if (j < 0 || j >= gallery.length) return
    setGallery((prev) => {
      const next = [...prev]
      ;[next[i], next[j]] = [next[j], next[i]]
      return next
    })
  }

  if (loading) return <Loader label="Loading home content…" variant="section" />

  return (
    <>
      <SEO title="Home content" description="Hero carousel & gallery" path="/dashboard/home-content" noindex />
      <div className="mx-auto max-w-4xl space-y-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl text-porcelain">Home page media</h1>
            <p className="mt-1 max-w-xl text-sm text-porcelain-muted">
              Edit the hero carousel and the “Glimpses” gallery on the public home page. Use full image URLs (e.g.
              Unsplash). Bento layout applies when the gallery has exactly eight images.
            </p>
            {updatedAt && (
              <p className="mt-2 text-xs text-porcelain-muted">Last saved: {new Date(updatedAt).toLocaleString()}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              className="!text-xs"
              onClick={() => {
                setSlides(DEFAULT_HERO_CAROUSEL.map((s) => ({ ...s })))
                setGallery(DEFAULT_HOME_GALLERY.map((g) => ({ ...g })))
                toast.success('Editor reset to built-in defaults (save to publish).')
              }}
            >
              Reset editor to defaults
            </Button>
            <Button type="button" variant="outlineGold" className="!text-xs" onClick={load} disabled={saving}>
              Reload from server
            </Button>
            <Button type="button" onClick={save} disabled={saving}>
              {saving ? 'Saving…' : 'Save to site'}
            </Button>
          </div>
        </div>

        <section className="rounded-2xl border border-porcelain/15 bg-porcelain/[0.03] p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg text-porcelain">Hero carousel</h2>
            <Button
              type="button"
              variant="ghost"
              className="!text-xs"
              onClick={() => setSlides((s) => [...s, emptySlide()])}
              disabled={slides.length >= 12}
            >
              Add slide
            </Button>
          </div>
          <div className="mt-6 space-y-8">
            {slides.map((slide, i) => (
              <div key={slide.id} className="rounded-xl border border-porcelain/10 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs uppercase tracking-widest text-gold-500/90">Slide {i + 1}</p>
                  <div className="flex flex-wrap gap-1">
                    <Button type="button" variant="ghost" className="!px-2 !py-1 !text-xs" onClick={() => moveSlide(i, -1)} disabled={i === 0}>
                      Up
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      className="!px-2 !py-1 !text-xs"
                      onClick={() => moveSlide(i, 1)}
                      disabled={i === slides.length - 1}
                    >
                      Down
                    </Button>
                    <Button
                      type="button"
                      variant="danger"
                      className="!px-2 !py-1 !text-xs"
                      onClick={() => setSlides((s) => s.filter((_, j) => j !== i))}
                      disabled={slides.length <= 1}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input label="Background image URL" value={slide.image} onChange={(e) => setSlides((s) => s.map((x, j) => (j === i ? { ...x, image: e.target.value } : x)))} />
                  <Input label="Slide id (stable key)" value={slide.id} onChange={(e) => setSlides((s) => s.map((x, j) => (j === i ? { ...x, id: e.target.value } : x)))} />
                  <Input label="Kicker" value={slide.kicker} onChange={(e) => setSlides((s) => s.map((x, j) => (j === i ? { ...x, kicker: e.target.value } : x)))} />
                  <Input label="Title" value={slide.title} onChange={(e) => setSlides((s) => s.map((x, j) => (j === i ? { ...x, title: e.target.value } : x)))} />
                  <Input
                    label="Title highlight (word styled in gold)"
                    value={slide.titleHighlight}
                    onChange={(e) => setSlides((s) => s.map((x, j) => (j === i ? { ...x, titleHighlight: e.target.value } : x)))}
                  />
                  <Input label="Primary button label" value={slide.primaryLabel} onChange={(e) => setSlides((s) => s.map((x, j) => (j === i ? { ...x, primaryLabel: e.target.value } : x)))} />
                  <Input label="Primary link (path)" value={slide.primaryTo} onChange={(e) => setSlides((s) => s.map((x, j) => (j === i ? { ...x, primaryTo: e.target.value } : x)))} />
                  <Input label="Secondary button label" value={slide.secondaryLabel} onChange={(e) => setSlides((s) => s.map((x, j) => (j === i ? { ...x, secondaryLabel: e.target.value } : x)))} />
                  <Input label="Secondary link (path)" value={slide.secondaryTo} onChange={(e) => setSlides((s) => s.map((x, j) => (j === i ? { ...x, secondaryTo: e.target.value } : x)))} />
                </div>
                <Textarea
                  className="mt-3"
                  label="Subtitle"
                  rows={3}
                  value={slide.subtitle}
                  onChange={(e) => setSlides((s) => s.map((x, j) => (j === i ? { ...x, subtitle: e.target.value } : x)))}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-porcelain/15 bg-porcelain/[0.03] p-5 md:p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-lg text-porcelain">Home gallery</h2>
            <Button
              type="button"
              variant="ghost"
              className="!text-xs"
              onClick={() => setGallery((g) => [...g, emptyGalleryRow()])}
              disabled={gallery.length >= 12}
            >
              Add image
            </Button>
          </div>
          <p className="mt-2 text-xs text-porcelain-muted">Exactly 8 images keep the original bento layout; otherwise a responsive grid is used.</p>
          <div className="mt-6 space-y-4">
            {gallery.map((row, i) => (
              <div key={row.id} className="flex flex-col gap-3 rounded-xl border border-porcelain/10 p-4 md:flex-row md:items-end">
                <div className="grid flex-1 gap-3 md:grid-cols-3">
                  <Input label="Image URL" value={row.src} onChange={(e) => setGallery((g) => g.map((x, j) => (j === i ? { ...x, src: e.target.value } : x)))} />
                  <Input label="Caption" value={row.caption} onChange={(e) => setGallery((g) => g.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))} />
                  <Input label="Id (optional)" value={row.id} onChange={(e) => setGallery((g) => g.map((x, j) => (j === i ? { ...x, id: e.target.value } : x)))} />
                </div>
                <div className="flex shrink-0 gap-1 md:pb-1">
                  <Button type="button" variant="ghost" className="!px-2 !py-1 !text-xs" onClick={() => moveGallery(i, -1)} disabled={i === 0}>
                    Up
                  </Button>
                  <Button type="button" variant="ghost" className="!px-2 !py-1 !text-xs" onClick={() => moveGallery(i, 1)} disabled={i === gallery.length - 1}>
                    Down
                  </Button>
                  <Button type="button" variant="danger" className="!px-2 !py-1 !text-xs" onClick={() => setGallery((g) => g.filter((_, j) => j !== i))}>
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
