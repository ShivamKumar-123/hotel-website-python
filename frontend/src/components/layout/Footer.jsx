import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-porcelain/10 bg-ink-soft/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-3 py-12 sm:px-4 sm:py-14 md:flex-row md:items-start md:justify-between md:px-6">
        <div data-scroll="fade-up">
          <p className="font-display text-lg tracking-[0.25em] text-porcelain">
            AURUM<span className="text-gold-500"> GRAND</span>
          </p>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-porcelain-muted">
            A private address for discerning travelers. Architecture, light, and service composed as
            one quiet gesture.
          </p>
        </div>
        <div
          className="grid grid-cols-1 gap-8 text-sm text-porcelain-muted sm:grid-cols-2 md:gap-16"
          data-scroll-stagger="0.08"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-500/90">Visit</p>
            <ul className="mt-3 space-y-2">
              <li>128 Meridian Avenue</li>
              <li>New York, NY</li>
              <li>
                <a href="tel:+12125550123" className="hover:text-gold-300">
                  +1 (212) 555-0123
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold-500/90">Explore</p>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/rooms" className="hover:text-gold-300">
                  Suites
                </Link>
              </li>
              <li>
                <Link to="/booking" className="hover:text-gold-300">
                  Reservations
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-gold-300">
                  Our story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-gold-300">
                  Concierge
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-porcelain/10 px-4 py-6 md:px-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-center text-xs text-porcelain-muted/70 sm:text-left">
            © {new Date().getFullYear()} Aurum Grand. Crafted for stillness.
          </p>
          <Link
            to="/login"
            state={{ from: { pathname: '/dashboard' }, adminWelcome: true }}
            className="text-xs uppercase tracking-[0.2em] text-gold-500/90 transition hover:text-gold-400"
          >
            Staff &amp; admin login
          </Link>
        </div>
      </div>
    </footer>
  )
}
