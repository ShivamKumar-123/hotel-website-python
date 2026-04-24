import { useId } from 'react'
import { cn } from '../../utils/cn'

/**
 * Decorative wave between sections. Use `overlapIntoNext` before a photo/dark block so the
 * curved edge cuts into the next section (no flat horizontal seam).
 * @param {'default' | 'gentle' | 'ripple' | 'aurum' | 'crest' | 'photoBridge'} variant
 * @param {'ink' | 'ink-soft' | 'ink-soft/40' | 'ink-soft/35' | 'porcelain' | 'transparent'} fill — colour of the section *above* the wave (wave body)
 */
export default function WaveSeparator({
  variant = 'default',
  fill = 'ink',
  flip = false,
  showAccent = true,
  /** Pull the next section up under this wave so the visible seam is curved, not a straight line */
  overlapIntoNext = false,
  className,
}) {
  const rid = useId().replace(/:/g, '')
  const gradId = `wave-gold-${rid}`
  const gradSoftId = `wave-gold-soft-${rid}`

  const fillMap = {
    ink: 'text-ink',
    'ink-soft': 'text-ink-soft',
    'ink-soft/40': 'text-ink-soft/40',
    'ink-soft/35': 'text-ink-soft/35',
    porcelain: 'text-porcelain',
    transparent: 'text-transparent',
  }

  /* Top = straight (flush with section above); bottom edge = pronounced wave; lower part of viewBox stays transparent */
  const bridgePaths = {
    default: (
      <path
        fill="currentColor"
        d="M0,0 L1440,0 L1440,18 C1200,92 360,28 0,72 L0,0 Z"
      />
    ),
    gentle: (
      <path
        fill="currentColor"
        d="M0,0 L1440,0 L1440,22 C960,88 480,36 0,64 L0,0 Z"
      />
    ),
    ripple: (
      <path
        fill="currentColor"
        d="M0,0 L1440,0 L1440,14 C1080,78 720,32 360,70 C240,84 120,72 0,58 L0,0 Z"
      />
    ),
    aurum: (
      <>
        <defs>
          <linearGradient id={gradSoftId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c9a962" stopOpacity="0" />
            <stop offset="50%" stopColor="#e8d5a3" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#c9a962" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          fill="currentColor"
          fillOpacity={0.92}
          d="M0,0 L1440,0 L1440,20 C1180,96 260,24 0,68 L0,0 Z"
        />
        <path
          fill={`url(#${gradSoftId})`}
          fillOpacity={0.35}
          d="M0,0 L1440,0 L1440,20 C1180,96 260,24 0,68 L0,0 Z"
        />
      </>
    ),
    crest: (
      <path
        fill="currentColor"
        d="M0,0 L1440,0 L1440,12 C720,96 360,20 0,76 L0,0 Z"
      />
    ),
    photoBridge: (
      <path
        fill="currentColor"
        d="M0,0 L1440,0 L1440,16 C1320,88 480,22 0,62 L0,0 Z"
      />
    ),
    default: (
      <path
        fill="currentColor"
        d="M0,0 L1440,0 L1440,18 C1200,92 360,28 0,72 L0,0 Z"
      />
    ),
  }

  const paths = {
    default: (
      <>
        <path
          fill="currentColor"
          fillOpacity={0.08}
          d="M0,52 C240,92 480,12 720,45 C960,79 1200,19 1440,55 L1440,128 L0,128 Z"
        />
        <path
          fill="currentColor"
          d="M0,68 C320,24 620,104 960,58 C1180,31 1320,44 1440,51 L1440,128 L0,128 Z"
        />
      </>
    ),
    gentle: (
      <>
        <path
          fill="currentColor"
          fillOpacity={0.06}
          d="M0,78 C360,38 720,98 1080,53 C1260,36 1380,48 1440,56 L1440,128 L0,128 Z"
        />
        <path
          fill="currentColor"
          d="M0,86 C400,46 800,100 1200,66 C1320,56 1380,60 1440,63 L1440,128 L0,128 Z"
        />
      </>
    ),
    ripple: (
      <>
        <path
          fill="currentColor"
          fillOpacity={0.05}
          d="M0,42 C200,72 400,22 600,47 C800,72 1000,32 1200,52 C1320,65 1380,57 1440,55 L1440,128 L0,128 Z"
        />
        <path
          fill="currentColor"
          fillOpacity={0.12}
          d="M0,59 C280,29 560,89 840,55 C1020,39 1180,69 1440,49 L1440,128 L0,128 Z"
        />
        <path
          fill="currentColor"
          d="M0,75 C360,47 720,92 1080,62 C1260,49 1380,55 1440,59 L1440,128 L0,128 Z"
        />
      </>
    ),
    aurum: (
      <>
        <defs>
          <linearGradient id={`${gradSoftId}-legacy`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#c9a962" stopOpacity="0" />
            <stop offset="45%" stopColor="#e8d5a3" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#c9a962" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          fill="currentColor"
          fillOpacity={0.04}
          d="M0,36 C320,88 620,18 960,52 C1140,72 1280,38 1440,48 L1440,128 L0,128 Z"
        />
        <path
          fill="currentColor"
          fillOpacity={0.09}
          d="M0,54 C400,22 760,96 1120,58 C1240,46 1360,54 1440,58 L1440,128 L0,128 Z"
        />
        <path
          fill="currentColor"
          d="M0,72 C360,40 720,88 1080,60 C1260,48 1360,54 1440,56 L1440,128 L0,128 Z"
        />
        <path
          fill={`url(#${gradSoftId}-legacy)`}
          fillOpacity={0.25}
          d="M0,78 C420,52 780,92 1200,64 C1300,58 1380,60 1440,62 L1440,128 L0,128 Z"
        />
      </>
    ),
    crest: (
      <>
        <path
          fill="currentColor"
          fillOpacity={0.05}
          d="M0,38 C480,102 720,12 1080,58 C1200,72 1320,44 1440,50 L1440,128 L0,128 Z"
        />
        <path
          fill="currentColor"
          fillOpacity={0.11}
          d="M0,56 C520,18 880,98 1280,52 C1340,46 1400,50 1440,52 L1440,128 L0,128 Z"
        />
        <path
          fill="currentColor"
          d="M0,70 C380,34 640,90 1040,58 C1180,46 1320,56 1440,54 L1440,128 L0,128 Z"
        />
      </>
    ),
  }

  const useBridge = overlapIntoNext
  const bridgeBody = useBridge ? bridgePaths[variant] || bridgePaths.default : null

  return (
    <div
      className={cn(
        'relative w-full overflow-visible leading-[0]',
        fillMap[fill] || fillMap.ink,
        flip && '-scale-y-100',
        overlapIntoNext && 'z-[2] -mb-[4.75rem] drop-shadow-[0_8px_24px_rgba(0,0,0,0.12)]',
        className,
      )}
      aria-hidden
    >
      {showAccent && (
        <svg
          className={cn(
            'pointer-events-none absolute inset-x-0 w-full text-gold-500/50',
            useBridge ? '-top-1 h-10' : '-top-px h-8',
          )}
          viewBox="0 0 1440 40"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a88b4a" stopOpacity="0" />
              <stop offset="35%" stopColor="#d4b978" stopOpacity="0.9" />
              <stop offset="65%" stopColor="#e8d5a3" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#a88b4a" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            fill="none"
            stroke={`url(#${gradId})`}
            strokeWidth={useBridge ? '1.5' : '1.25'}
            d={
              useBridge
                ? 'M0,24 C320,8 640,36 960,18 C1140,6 1280,14 1440,12'
                : 'M0,14 C320,26 640,4 960,18 C1140,26 1280,22 1440,18'
            }
          />
          <path
            fill="none"
            stroke="currentColor"
            className="text-gold-500/30"
            strokeWidth="0.75"
            d={
              useBridge
                ? 'M0,32 C400,18 800,38 1200,22 C1280,18 1360,20 1440,18'
                : 'M0,22 C400,10 800,30 1200,16 C1280,13 1360,15 1440,14'
            }
          />
        </svg>
      )}
      <svg
        className={cn(
          'relative block w-full',
          useBridge ? 'h-[4.75rem] md:h-[5.25rem]' : 'h-16 md:h-[5.75rem] lg:h-24',
        )}
        viewBox={useBridge ? '0 0 1440 96' : '0 0 1440 128'}
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {useBridge ? bridgeBody : paths[variant] || paths.default}
      </svg>
    </div>
  )
}
