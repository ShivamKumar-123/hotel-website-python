import { useContext } from 'react'
import { ThemeSessionContext } from '../context/themeSessionContext'

export function useTheme() {
  const ctx = useContext(ThemeSessionContext)
  if (!ctx) {
    return {
      theme: 'dark',
      setTheme: () => {},
      toggleTheme: () => {},
      isLight: false,
    }
  }
  return ctx
}
