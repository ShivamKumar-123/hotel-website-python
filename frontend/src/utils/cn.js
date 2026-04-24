/**
 * Tiny className helper (no extra dependency).
 */
export function cn(...parts) {
  return parts.filter(Boolean).join(' ')
}
