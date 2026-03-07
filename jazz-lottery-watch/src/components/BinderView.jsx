import { useRef, useState, useLayoutEffect } from 'react'
import ProspectCard3D from './ProspectCard3D'

const PHOTO_BG_COLORS = ['#000000', '#2E157D']
const BASE_W = 300
const BASE_H = 420

export default function BinderView({ prospects, onCardClick }) {
  const pages = []
  for (let i = 0; i < prospects.length; i += 9) {
    pages.push(prospects.slice(i, i + 9))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, padding: '0 8px' }}>
      {pages.map((pageProspects, pageIdx) => (
        <BinderPage key={pageIdx} prospects={pageProspects} startIndex={pageIdx * 9} onCardClick={onCardClick} />
      ))}
    </div>
  )
}

function BinderPage({ prospects, startIndex, onCardClick }) {
  return (
    <div
      style={{
        width: '100%',
        maxWidth: 560,
        aspectRatio: '1185 / 1500',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <img
        src="/binder-page.jpg"
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
          top: 'calc(2.2% - 8px)',
          left: 'calc(9.2% - 5px)',
          right: '1.6%',
          bottom: 'calc(2.2% - 3px)',
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

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
      onClick={() => onCardClick(prospect)}
    >
      {/* Scaled card centered in pocket */}
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

      {/* Rank badge — sticker style */}
      {(() => {
        const p = BADGE_PLACEMENTS[index % BADGE_PLACEMENTS.length]
        const pos = {}
        if (p.top != null) pos.top = p.top
        if (p.bottom != null) pos.bottom = p.bottom
        if (p.left != null) pos.left = p.left
        if (p.right != null) pos.right = p.right
        return (
          <div style={{
            position: 'absolute', ...pos,
            width: 30, height: 30, borderRadius: '50%',
            background: STICKER_COLORS[index % STICKER_COLORS.length],
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2,
            transform: `rotate(${p.rotate}deg)`,
          }}>
            <span style={{
              fontFamily: "'Permanent Marker', cursive",
              fontSize: 14, color: '#000', lineHeight: 1,
            }}>
              {prospect.rank}
            </span>
          </div>
        )
      })()}
    </div>
  )
}
