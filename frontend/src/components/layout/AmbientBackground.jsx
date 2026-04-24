import { cn } from '../../utils/cn'
import { useTheme } from '../../hooks/useTheme'

/**
 * Site-wide ambient motion — gold on black (dark) or warm wheat / linen (light).
 */
export default function AmbientBackground() {
  const { isLight } = useTheme()

  if (isLight) {
    return (
      <div
        className={cn(
          'ambient-light pointer-events-none fixed inset-0 z-0 overflow-hidden',
          'bg-[linear-gradient(165deg,#fdfbf7_0%,#f5ebd8_42%,#ebe3d4_100%)]',
        )}
        aria-hidden
      >
        {/* Slow rotating color mesh — modern, soft */}
        <div
          className="ambient-mesh-spin pointer-events-none absolute left-1/2 top-1/2 h-[180vmax] w-[180vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.22]"
          style={{
            background:
              'conic-gradient(from 210deg at 50% 50%, rgba(245,222,179,0.5) 0deg, transparent 80deg, rgba(255,250,235,0.45) 160deg, rgba(222,200,160,0.35) 240deg, transparent 320deg)',
            filter: 'blur(80px)',
          }}
        />

        {/* Diffused wheat blooms */}
        <div
          className="ambient-wheat-1 absolute -left-[18%] top-[8%] h-[min(88vw,680px)] w-[min(88vw,680px)] rounded-full bg-[radial-gradient(circle_at_35%_35%,rgba(255,252,245,0.95)_0%,rgba(245,230,200,0.45)_40%,transparent_72%)] blur-[100px]"
          style={{ willChange: 'transform' }}
        />
        <div
          className="ambient-wheat-2 absolute -right-[12%] top-[32%] h-[min(82vw,620px)] w-[min(82vw,620px)] rounded-full bg-[radial-gradient(circle_at_center,rgba(230,200,150,0.42)_0%,rgba(245,222,179,0.22)_45%,transparent_70%)] blur-[90px]"
          style={{ willChange: 'transform' }}
        />
        <div
          className="ambient-wheat-3 absolute bottom-[-12%] left-[20%] h-[min(95vw,760px)] w-[min(95vw,760px)] rounded-full bg-[radial-gradient(circle_at_55%_45%,rgba(255,248,230,0.55)_0%,rgba(210,185,145,0.18)_50%,transparent_74%)] blur-[110px]"
          style={{ willChange: 'transform' }}
        />

        {/* Micro dot field — editorial texture */}
        <svg
          className="ambient-dot-field absolute inset-0 h-full w-full text-stone-400/[0.09]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern id="ambient-dots-wheat" width="32" height="32" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ambient-dots-wheat)" />
        </svg>

        <div className="ambient-shimmer-wheat pointer-events-none absolute inset-0 mix-blend-soft-light" />

        <div
          className="ambient-vignette-pulse pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_50%_100%,rgba(120,90,55,0.06)_0%,transparent_55%)]"
          aria-hidden
        />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_55%_at_50%_-5%,rgba(255,255,255,0.35)_0%,transparent_50%)]" />
      </div>
    )
  }

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-ink" aria-hidden>
      <div
        className="ambient-orb ambient-orb-a absolute -left-[20%] top-[10%] h-[min(90vw,720px)] w-[min(90vw,720px)] rounded-full bg-[radial-gradient(circle_at_center,rgba(201,169,98,0.14)_0%,transparent_68%)] blur-3xl"
        style={{ willChange: 'transform' }}
      />
      <div
        className="ambient-orb ambient-orb-b absolute -right-[15%] top-[35%] h-[min(85vw,640px)] w-[min(85vw,640px)] rounded-full bg-[radial-gradient(circle_at_center,rgba(212,185,120,0.1)_0%,transparent_65%)] blur-3xl"
        style={{ willChange: 'transform' }}
      />
      <div
        className="ambient-orb ambient-orb-c absolute bottom-[-10%] left-[25%] h-[min(100vw,800px)] w-[min(100vw,800px)] rounded-full bg-[radial-gradient(circle_at_center,rgba(168,139,74,0.08)_0%,transparent_70%)] blur-3xl"
        style={{ willChange: 'transform' }}
      />

      <svg
        className="ambient-grid absolute inset-0 h-full w-full opacity-[0.07]"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          <pattern id="ambient-lines-dark" width="60" height="60" patternUnits="userSpaceOnUse">
            <path
              d="M0 60 L60 0 M-15 15 L15 -15 M45 75 L75 45"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-gold-500"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#ambient-lines-dark)" className="ambient-grid-shift text-gold-400" />
      </svg>

      <div className="ambient-sweep absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_0%,transparent_40%,rgba(7,7,7,0.85)_100%)]" />
      <div className="ambient-shimmer-dark absolute inset-0 opacity-40 mix-blend-overlay" />
    </div>
  )
}
