import { useEffect, useCallback } from 'react'
import ProspectCard3D from './ProspectCard3D'

const PHOTO_BG_COLORS = ['#000000', '#2E157D']

const POSITION_COLORS = {
  PG: { color: '#1d4ed8', bg: '#dbeafe' },
  SG: { color: '#7c3aed', bg: '#ede9fe' },
  SF: { color: '#15803d', bg: '#dcfce7' },
  PF: { color: '#b45309', bg: '#fef3c7' },
  C:  { color: '#dc2626', bg: '#fee2e2' },
}

const SCHOOL_LOGO_IDS = {
  'BYU': 252, 'Kansas': 2305, 'Duke': 150, 'N. Carolina': 153,
  'Houston': 248, 'Arkansas': 8, 'Louisville': 97, 'Illinois': 356,
  'Tennessee': 2633, 'UConn': 41, 'Washington': 264, 'Alabama': 333,
}

function StatCell({ label, value }) {
  return (
    <div
      className="text-center px-3 py-2 rounded-lg"
      style={{ background: '#ffffff', border: '1px solid var(--border)' }}
    >
      <div className="font-bold text-sm" style={{ fontFamily: "'Archivo Black', Arial, sans-serif", color: 'var(--text)' }}>
        {value}
      </div>
      <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        {label}
      </div>
    </div>
  )
}

export default function CardLightbox({ prospect, onClose }) {
  const bgColor = PHOTO_BG_COLORS[(prospect.rank - 1) % PHOTO_BG_COLORS.length]

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [onKeyDown])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: 'fixed', top: 16, right: 16,
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', fontSize: 20, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s',
          zIndex: 10,
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      >
        ✕
      </button>

      {/* Centering wrapper */}
      <div className="lightbox-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%', padding: 24 }}>
      {/* Content — stop propagation so clicking inside doesn't close */}
      <div
        onClick={e => e.stopPropagation()}
        className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center lg:items-start"
        style={{ width: 'fit-content', maxWidth: '100%' }}
      >
        {/* 3D Card */}
        <div className="flex-shrink-0 lightbox-card-wrap" style={{ overflow: 'visible' }}>
          <ProspectCard3D
            prospect={prospect}
            bgColor={bgColor}
            holo={prospect.rank <= 4}
          />
        </div>

        {/* Stats content box */}
        <div className="relative min-w-0 w-full lg:w-[480px]" style={{ paddingRight: 32 }}>
          {/* Rank circle */}
          <div
            className="rounded-full flex items-center justify-center absolute"
            style={{ width: 64, height: 64, background: 'var(--sch-teal-bright)', top: 32, right: 0, zIndex: 1 }}
          >
            <span
              className="text-xl"
              style={{ fontFamily: "'Archivo Black', Arial, sans-serif", color: '#000000' }}
            >
              {prospect.rank}
            </span>
          </div>

          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: 'var(--bg-card)',
              border: '2px solid #000000',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <div className="p-4 sm:p-8">
              {/* Name / school / measurables */}
              <div className="mb-6 text-center">
                <div className="flex items-center justify-center gap-2">
                  <div className="font-bold leading-tight text-xl sm:text-[32px]" style={{ fontFamily: "'Archivo Black', Arial, sans-serif", color: 'var(--text)' }}>
                    {prospect.name}
                  </div>
                  <span
                    className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                    style={{ color: '#666', background: '#e5e7eb' }}
                  >
                    {prospect.pos}
                  </span>
                </div>
                <div className="flex items-center justify-center gap-1.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {SCHOOL_LOGO_IDS[prospect.school] && (
                    <img
                      src={`https://a.espncdn.com/i/teamlogos/ncaa/500/${SCHOOL_LOGO_IDS[prospect.school]}.png`}
                      alt={prospect.school}
                      style={{ width: 18, height: 18, objectFit: 'contain' }}
                    />
                  )}
                  <span>{prospect.school} · {prospect.class}</span>
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  {prospect.height} · {prospect.weight} lbs · {prospect.wingspan} WS
                </div>
                <div className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  Age: {prospect.age}
                </div>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-3 sm:grid-cols-6 mb-6" style={{ gap: 8 }}>
                <StatCell label="PPG" value={prospect.stats.ppg} />
                <StatCell label="RPG" value={prospect.stats.rpg} />
                <StatCell label="APG" value={prospect.stats.apg} />
                <StatCell label="SPG" value={prospect.stats.spg} />
                <StatCell label="BPG" value={prospect.stats.bpg} />
                <StatCell label="3P%" value={`${prospect.stats.threePct}%`} />
              </div>

              {/* Key attributes pills */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {prospect.keyAttributes.map(attr => (
                  <span
                    key={attr}
                    className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}
                  >
                    {attr}
                  </span>
                ))}
              </div>

              {/* Comparisons */}
              <div className="mb-6">
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                  Comparisons
                </div>
                <p style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 17, lineHeight: '160%', color: 'var(--text)' }}>
                  {prospect.comparisons.join(' · ')}
                </p>
              </div>

              {/* Scouting Report */}
              <div className="mb-6">
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                  Scouting Report
                </div>
                <p style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 17, lineHeight: '160%', color: 'var(--text)' }}>
                  {prospect.scoutingReport}
                </p>
              </div>

              {/* Jazz Fit */}
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)' }}>
                  Jazz Fit
                </div>
                <p style={{ fontFamily: "'Noto Serif', Georgia, serif", fontSize: 17, lineHeight: '160%', color: 'var(--text)' }}>
                  {prospect.jazzFit}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
