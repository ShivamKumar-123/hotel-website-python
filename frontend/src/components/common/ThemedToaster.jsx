import { Toaster } from 'react-hot-toast'
import { useTheme } from '../../hooks/useTheme'

export default function ThemedToaster() {
  const { isLight } = useTheme()
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        className: isLight
          ? 'bg-[#fffdf9]/95 text-stone-900 border border-stone-300/60 shadow-lg shadow-amber-900/10'
          : 'bg-ink-soft text-porcelain border border-porcelain/15',
        duration: 4000,
      }}
    />
  )
}
