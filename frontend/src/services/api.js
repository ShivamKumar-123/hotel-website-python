import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL || '/api'

/**
 * Axios instance for the Django API. JWT is attached per request; refresh on 401.
 */
const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})

const ACCESS = 'aurum_access'
const REFRESH = 'aurum_refresh'

export function getStoredTokens() {
  return {
    access: localStorage.getItem(ACCESS),
    refresh: localStorage.getItem(REFRESH),
  }
}

export function setStoredTokens(access, refresh) {
  if (access) localStorage.setItem(ACCESS, access)
  if (refresh) localStorage.setItem(REFRESH, refresh)
}

export function clearStoredTokens() {
  localStorage.removeItem(ACCESS)
  localStorage.removeItem(REFRESH)
}

api.interceptors.request.use((config) => {
  const { access } = getStoredTokens()
  if (access) {
    config.headers.Authorization = `Bearer ${access}`
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type']
  }
  return config
})

let refreshing = null

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    const status = error.response?.status
    if (status !== 401 || original._retry) {
      return Promise.reject(error)
    }
    const { refresh } = getStoredTokens()
    if (!refresh) {
      clearStoredTokens()
      return Promise.reject(error)
    }
    original._retry = true
    try {
      refreshing =
        refreshing ||
        axios.post(`${baseURL}/auth/token/refresh/`, { refresh }).then((r) => r.data)
      const data = await refreshing
      refreshing = null
      setStoredTokens(data.access, refresh)
      original.headers.Authorization = `Bearer ${data.access}`
      return api(original)
    } catch (e) {
      refreshing = null
      clearStoredTokens()
      return Promise.reject(e)
    }
  },
)

/** Auth */
export async function loginRequest(email, password) {
  const { data } = await api.post('/auth/token/', { email, password })
  setStoredTokens(data.access, data.refresh)
  return data
}

export async function registerRequest(payload) {
  const { data } = await api.post('/auth/register/', payload)
  return data
}

export async function fetchMe() {
  const { data } = await api.get('/auth/me/')
  return data
}

export async function requestPasswordReset(email) {
  const { data } = await api.post('/auth/password-reset/', { email })
  return data
}

export async function confirmPasswordReset(payload) {
  const { data } = await api.post('/auth/password-reset/confirm/', payload)
  return data
}

/** Rooms */
export async function fetchRooms(params = {}) {
  const { data } = await api.get('/rooms/', { params })
  return data
}

export async function fetchRoom(slug) {
  const { data } = await api.get(`/rooms/${slug}/`)
  return data
}

export async function createRoom(body) {
  const { data } = await api.post('/rooms/', body)
  return data
}

export async function updateRoom(slug, body) {
  const { data } = await api.patch(`/rooms/${slug}/`, body)
  return data
}

export async function deleteRoom(slug) {
  await api.delete(`/rooms/${slug}/`)
}

/** Bookings */
export async function fetchBookings(params = {}) {
  const { data } = await api.get('/bookings/', { params })
  return data
}

export async function createBooking(body) {
  const { data } = await api.post('/bookings/', body)
  return data
}

/** Razorpay: JSON body — same draft fields as booking (room, dates, guests, guest_details). */
export async function createRazorpayOrder(body) {
  const { data } = await api.post('/bookings/razorpay/create-order/', body)
  return data
}

export async function confirmRazorpayBooking(body) {
  const { data } = await api.post('/bookings/razorpay/confirm/', body)
  return data
}

export async function updateBooking(id, body) {
  const { data } = await api.patch(`/bookings/${id}/`, body)
  return data
}

/** Reviews */
export async function fetchReviews(params = {}) {
  const { data } = await api.get('/reviews/', { params })
  return data
}

export async function createReview(body) {
  const { data } = await api.post('/reviews/', body)
  return data
}

export async function updateReview(id, body) {
  const { data } = await api.patch(`/reviews/${id}/`, body)
  return data
}

/** Users (staff/admin) */
export async function fetchUsers(params = {}) {
  const { data } = await api.get('/users/', { params })
  return data
}

export async function updateUser(id, body) {
  const { data } = await api.patch(`/users/${id}/`, body)
  return data
}

/** Dashboard */
export async function fetchDashboardStats() {
  const { data } = await api.get('/dashboard/stats/')
  return data
}

/** Public home page JSON (carousel + gallery); PATCH is staff-only. */
export async function fetchHomeContent() {
  const { data } = await api.get('/home-content/')
  return data
}

export async function patchHomeContent(body) {
  const { data } = await api.patch('/home-content/', body)
  return data
}

export default api
