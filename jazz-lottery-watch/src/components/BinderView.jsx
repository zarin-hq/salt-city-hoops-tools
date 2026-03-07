import { useRef, useState, useLayoutEffect } from 'react'
import ProspectCard3D from './ProspectCard3D'

const PHOTO_BG_COLORS = ['#000000', '#2E157D']
const BASE_W = 300
const BASE_H = 420

// Background card/ticket images scattered behind binder pages
const BG_CARDS = [
  '/bg-cards/bg-card-01.png',
  '/bg-cards/bg-card-02.png',
  '/bg-cards/bg-card-03.png',
  '/bg-cards/bg-card-04.png',
  '/bg-cards/bg-card-05.png',
]
const BG_TICKETS = [
  '/bg-cards/ticket-1.png',
  '/bg-cards/ticket-2.png',
]

// Placement configs for background elements per page
// Positions are % based, relative to the binder page wrapper
// Each card should overlap behind the binder at least a little
const BG_PLACEMENTS = [
  // Page 1 background elements
  [
    { src: BG_CARDS[0], top: 8, left: -18, rotate: -12, width: 28 },
    { src: BG_CARDS[1], top: 22, right: -20, rotate: 8, width: 26 },
    { src: BG_CARDS[2], bottom: -4, right: -16, rotate: 15, width: 27 },
    { src: BG_TICKETS[0], bottom: 8, left: -14, rotate: -5, width: 22, ticket: true },
  ],
  // Page 2 background elements
  [
    { src: BG_CARDS[3], top: -5, right: -17, rotate: 10, width: 27 },
    { src: BG_CARDS[4], top: 30, left: -19, rotate: -14, width: 26 },
    { src: '/bg-cards/bg-card-06.png', bottom: 2, left: -15, rotate: 18, width: 28 },
    { src: BG_TICKETS[1], bottom: 12, right: -11, rotate: -8, width: 24, ticket: true },
  ],
]

export default function BinderView({ prospects, onCardClick }) {
  const pages = []
  for (let i = 0; i < prospects.length; i += 9) {
    pages.push(prospects.slice(i, i + 9))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '0 8px', overflow: 'hidden' }}>
      {pages.map((pageProspects, pageIdx) => (
        <BinderPage key={pageIdx} prospects={pageProspects} startIndex={pageIdx * 9} onCardClick={onCardClick} pageIdx={pageIdx} />
      ))}
    </div>
  )
}

function BinderPage({ prospects, startIndex, onCardClick, pageIdx }) {
  const placements = BG_PLACEMENTS[pageIdx % BG_PLACEMENTS.length]

  return (
    <div
      style={{
        width: '100%',
        maxWidth: 560,
        position: 'relative',
      }}
    >
      {/* Background scattered cards/tickets */}
      {placements.map((p, i) => {
        const pos = {}
        if (p.top != null) pos.top = `${p.top}%`
        if (p.bottom != null) pos.bottom = `${p.bottom}%`
        if (p.left != null) pos.left = `${p.left}%`
        if (p.right != null) pos.right = `${p.right}%`
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...pos,
              width: `${p.width}%`,
              transform: `rotate(${p.rotate}deg)`,
              pointerEvents: 'none',
              zIndex: 0,
              filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.15))',
              background: p.ticket ? 'transparent' : '#fff',
              borderRadius: 4,
            }}
          >
            <img
              src={p.src}
              alt=""
              style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.15, borderRadius: 4 }}
            />
          </div>
        )
      })}

      {/* Binder page */}
      <div
        style={{
          width: '100%',
          aspectRatio: '1185 / 1500',
          position: 'relative',
          overflow: 'hidden',
          zIndex: 1,
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.12))',
        }}
      >
      <img
        src="/binder-page.png"
        alt=""
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '1.2%',
          left: '7.8%',
          right: '1.8%',
          bottom: '1.2%',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateRows: 'repeat(3, 1fr)',
          gap: '1.2% 1.4%',
          zIndex: 1,
        }}
      >
        {Array.from({ length: 9 }).map((_, i) => {
          const prospect = prospects[i]
          if (!prospect) return <div key={i} />
          return (
            <PocketSlot
              key={prospect.rank}
              prospect={prospect}
              index={startIndex + i}
              onCardClick={onCardClick}
            />
          )
        })}
      </div>
      </div>
    </div>
  )
}

const STICKER_COLORS = ['#00CD00', '#FF2100', '#DEF400', '#FF0078', '#FF9000']

// Sticker positions — all bottom-left with slight variation
const BADGE_PLACEMENTS = [
  { bottom: 2, left: 3, rotate: -9 },
  { bottom: 7, left: 7, rotate: 13 },
  { bottom: 1, left: 9, rotate: -4 },
  { bottom: 8, left: 2, rotate: 11 },
  { bottom: 3, left: 6, rotate: -15 },
  { bottom: 9, left: 4, rotate: 7 },
  { bottom: 1, left: 1, rotate: -12 },
  { bottom: 5, left: 8, rotate: 9 },
  { bottom: 7, left: 3, rotate: -7 },
]

function PocketSlot({ prospect, index, onCardClick }) {
  const bgColor = PHOTO_BG_COLORS[index % PHOTO_BG_COLORS.length]
  const containerRef = useRef(null)
  const [scale, setScale] = useState(0.4)

  useLayoutEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const { width, height } = el.getBoundingClientRect()
      const s = Math.min(width / BASE_W, height / BASE_H) * 0.97
      setScale(s)
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const p = BADGE_PLACEMENTS[index % BADGE_PLACEMENTS.length]
  const badgePos = {}
  if (p.top != null) badgePos.top = p.top
  if (p.bottom != null) badgePos.bottom = p.bottom
  if (p.left != null) badgePos.left = p.left
  if (p.right != null) badgePos.right = p.right

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        cursor: 'pointer',
      }}
      onClick={() => onCardClick(prospect)}
    >
      {/* Card — translates on hover */}
      <div
        className="binder-pocket"
        style={{
          position: 'absolute', inset: 0,
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{
            width: BASE_W, height: BASE_H,
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
          }}>
            <ProspectCard3D
              prospect={prospect}
              bgColor={bgColor}
              holo={prospect.rank <= 4}
              holoIntensity={1.15}
              flat
              width={BASE_W}
              height={BASE_H}
            />
          </div>
        </div>
      </div>

      {/* Rank badge — stays in place on hover */}
      <div style={{
        position: 'absolute', ...badgePos,
        width: 36, height: 36, borderRadius: '50%',
        background: STICKER_COLORS[index % STICKER_COLORS.length],
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 2,
        transform: `rotate(${p.rotate}deg) scale(${Math.min(scale / 0.4, 1)})`,
        pointerEvents: 'none',
      }}>
        <span style={{
          fontFamily: "'Permanent Marker', cursive",
          fontSize: 17, color: '#000', lineHeight: 1,
        }}>
          {prospect.rank}
        </span>
      </div>
    </div>
  )
}
