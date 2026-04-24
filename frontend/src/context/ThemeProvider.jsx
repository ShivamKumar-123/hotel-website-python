import { useCallback, useEffect, useMemo, useState } from 'react'
import { ThemeSessionContext } from './themeSessionContext'

const STORAGE_KEY = 'aurum-theme'

/**
 * Persists light/dark on <html data-theme> for CSS tokens + ambient layers.
 */
export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return 'dark'
    try {
      const s = localStorage.getItem(STORAGE_KEY)
      if (s === 'light' || s === 'dark') return s
    } catch {
      /* ignore */
    }
    return 'dark'
  })

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* ignore */
    }
  }, [theme])

  const setTheme = useCallback((next) => {
    setThemeState(next === 'light' ? 'light' : 'dark')
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
      isLight: theme === 'light',
    }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeSessionContext.Provider value={value}>{children}</ThemeSessionContext.Provider>
}
