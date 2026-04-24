import { Outlet } from 'react-router-dom'
import SiteScrollScope from '../animations/SiteScrollScope'
import SiteJsonLd from '../common/SiteJsonLd'
import AmbientBackground from './AmbientBackground'
import Navbar from './Navbar'
import Footer from './Footer'

/**
 * Marketing site shell — ambient animated backdrop + fixed nav offset for content.
 */
export default function PublicLayout() {
  return (
    <div className="relative min-h-screen text-porcelain">
      <SiteJsonLd />
      <AmbientBackground />
      <div className="relative z-10 min-h-screen">
        <Navbar />
        <SiteScrollScope>
          <main className="min-w-0 overflow-x-hidden pt-20 sm:pt-24">
            <Outlet />
          </main>
          <Footer />
        </SiteScrollScope>
      </div>
    </div>
  )
}
