export const BOOKING_SESSION_KEY = 'aurum_booking_wizard_v1'

export function emptyDraft(roomId = '') {
  return {
    room: roomId || '',
    check_in: '',
    check_out: '',
    guests: '2',
    special_requests: '',
    guestDetails: [],
  }
}

export function loadDraft() {
  try {
    const raw = sessionStorage.getItem(BOOKING_SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveDraft(draft) {
  sessionStorage.setItem(BOOKING_SESSION_KEY, JSON.stringify(draft))
}

export function clearDraftStorage() {
  sessionStorage.removeItem(BOOKING_SESSION_KEY)
}
