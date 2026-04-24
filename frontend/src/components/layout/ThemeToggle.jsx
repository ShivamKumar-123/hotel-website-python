import { useTheme } from '../../hooks/useTheme'
import { cn } from '../../utils/cn'

/**
 * Switches data-theme on <html> — dark (black + gold ambient) vs light (sky blue ambient).
 */
export default function ThemeToggle({ className }) {
  const { toggleTheme, isLight } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        'flex h-9 w-9 items-center justify-center rounded-full border transition',
        'border-porcelain/20 bg-porcelain/5 text-porcelain hover:border-gold-500/50 hover:text-gold-400',
        'md:h-10 md:w-10',
        className,
      )}
      title={isLight ? 'Dark mode' : 'Light mode'}
      aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
      aria-pressed={isLight}
    >
      {isLight ? <MoonIcon /> : <SunIcon />}
    </button>
  )
}

function SunIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path
        d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
