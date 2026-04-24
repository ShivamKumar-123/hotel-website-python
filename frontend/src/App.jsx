import { RouterProvider } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeProvider.jsx'
import ThemedToaster from './components/common/ThemedToaster.jsx'
import { router } from './routes'

/**
 * Root providers: theme (light sky / dark black), auth, SEO, router, toasts.
 */
export default function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
          <ThemedToaster />
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  )
}
