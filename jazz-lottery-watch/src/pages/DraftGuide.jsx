import { useState, useMemo, useEffect } from 'react'
import { LayoutConfig } from '../components/Layout'
import DRAFT_GUIDE_PROSPECTS from '../data/draft-guide-prospects'
import ProspectCard3D from '../components/ProspectCard3D'
import BinderView from '../components/BinderView'
import CardLightbox from '../components/CardLightbox'

const POSITION_COLORS = {
  PG: { color: '#1d4ed8', bg: '#dbeafe' },
  SG: { color: '#7c3aed', bg: '#ede9fe' },
  SF: { color: '#15803d', bg: '#dcfce7' },
  PF: { color: '#b45309', bg: '#fef3c7' },
  C:  { color: '#dc2626', bg: '#fee2e2' },
}

const POSITIONS = ['All', 'PG', 'SG', 'SF', 'PF', 'C']

const PHOTO_BG_COLORS = ['#000000', '#2E157D']

const SCHOOL_LOGO_IDS = {
  'BYU': 252,
  'Kansas': 2305,
  'Duke': 150,
  'N. Carolina': 153,
  'Houston': 248,
  'Arkansas': 8,
  'Louisville': 97,
  'Illinois': 356,
  'Tennessee': 2633,
  'UConn': 41,
  'Washington': 264,
  'Alabama': 333,
}

/* ── FilterGroup ─────────────────────────────────────────── */

function FilterGroup({ label, options, value, onChange }) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {label && <span className="text-[10px] font-bold uppercase tracking-wider mr-1" style={{ color: 'var(--text-muted)' }}>{label}</span>}
      {options.map(o => {
        const active = value === o
        return (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${active ? '' : 'btn-secondary'}`}
            style={{
              background: active ? 'var(--sch-black)' : 'var(--bg-raised)',
              color: active ? 'white' : 'var(--text-muted)',
              border: `1px solid ${active ? 'var(--sch-black)' : 'var(--border)'}`,
              cursor: 'pointer',
            }}
          >
            {o}
          </button>
        )
      })}
    </div>
  )
}

/* ── PlayerPhoto ─────────────────────────────────────────── */

function PlayerPhoto({ photo, name, height = 280, bgColor = '#000000' }) {
  const [failed, setFailed] = useState(false)
  if (photo && !failed) {
    return (
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{ width: '100%', height, background: bgColor, borderBottom: '2px solid #000000' }}
      >
        <img
          src={photo}
          alt=""
          style={{ height: '100%', width: 'auto', objectFit: 'contain' }}
          onError={() => setFailed(true)}
        />
      </div>
    )
  }
  const initials = (name || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div
      className="flex items-center justify-center"
      style={{ width: '100%', height, background: bgColor, borderBottom: '2px solid #000000', color: bgColor === '#ffffff' ? '#999' : '#fff', fontSize: 64, fontWeight: 700 }}
    >
      {initials}
    </div>
  )
}

/* ── StatCell ────────────────────────────────────────────── */

function StatCell({ label, value }) {
  return (
    <div
      className="text-center px-1.5 py-2 rounded-lg"
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

/* ── ProspectCard ─────────────────────────────────────────── */

function ProspectCard({ prospect, index }) {
  const posColor = POSITION_COLORS[prospect.pos] || { color: '#666', bg: '#eee' }
  const bgColor = PHOTO_BG_COLORS[index % PHOTO_BG_COLORS.length]

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center lg:items-start mx-auto" style={{ width: 'fit-content', maxWidth: '100%' }}>
      {/* 3D Card column */}
      <div className="flex-shrink-0 self-center lg:self-start lg:sticky" style={{ top: 24 }}>
        <ProspectCard3D prospect={prospect} bgColor={bgColor} holo={prospect.rank <= 4} showHint={index === 0} />
      </div>

      {/* Content box column */}
      <div className="relative min-w-0 w-full lg:w-[480px]">
      {/* Rank circle overlapping right edge */}
      <div
        className="rounded-full flex items-center justify-center absolute"
        style={{ width: 48, height: 48, background: 'var(--sch-teal-bright)', top: 24, right: -12, zIndex: 1 }}
      >
        <span
          className="text-base"
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
  )
}

/* ── DraftGuide (page) ───────────────────────────────────── */

/* ── View Toggle Icons ──────────────────────────────────── */

function ListIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <line x1="1" y1="3" x2="15" y2="3" />
      <line x1="1" y1="8" x2="15" y2="8" />
      <line x1="1" y1="13" x2="15" y2="13" />
    </svg>
  )
}

function GridIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" stroke="none">
      <rect x="1.5" y="1.5" width="3" height="3" rx="0.5" />
      <rect x="6.5" y="1.5" width="3" height="3" rx="0.5" />
      <rect x="11.5" y="1.5" width="3" height="3" rx="0.5" />
      <rect x="1.5" y="6.5" width="3" height="3" rx="0.5" />
      <rect x="6.5" y="6.5" width="3" height="3" rx="0.5" />
      <rect x="11.5" y="6.5" width="3" height="3" rx="0.5" />
      <rect x="1.5" y="11.5" width="3" height="3" rx="0.5" />
      <rect x="6.5" y="11.5" width="3" height="3" rx="0.5" />
      <rect x="11.5" y="11.5" width="3" height="3" rx="0.5" />
    </svg>
  )
}

/* ── DraftGuide (page) ───────────────────────────────────── */

export default function DraftGuide() {
  const [posFilter, setPosFilter] = useState('All')
  const [viewMode, setViewMode] = useState('binder')
  const [selectedProspect, setSelectedProspect] = useState(null)
  const [sourceRect, setSourceRect] = useState(null)

  useEffect(() => {
    document.title = '2026 Draft Guide | Salt City Hoops'
  }, [])

  const filtered = useMemo(
    () => posFilter === 'All'
      ? DRAFT_GUIDE_PROSPECTS
      : DRAFT_GUIDE_PROSPECTS.filter(p => p.pos === posFilter),
    [posFilter],
  )

  return (
    <>
      <LayoutConfig title="2026 Draft Guide" />
      <div style={{ background: '#ffffff', minHeight: '100vh', overflowX: 'clip' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Toggle bar */}
        <div className="flex justify-center" style={{ marginBottom: viewMode === 'binder' ? 28 : 12 }}>
          <div className="flex items-center" style={{ border: '1px solid var(--border)', borderRadius: 6, padding: 2, position: 'relative' }}>
            {/* Sliding pill */}
            <div style={{
              position: 'absolute',
              width: 32, height: 28, borderRadius: 4,
              background: 'var(--sch-black)',
              transform: `translateX(${viewMode === 'binder' ? 0 : 36}px)`,
              transition: 'transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
            {[
              { mode: 'binder', Icon: GridIcon, label: 'Binder view' },
              { mode: 'list', Icon: ListIcon, label: 'List view' },
            ].map(({ mode, Icon, label }) => (
              <button
                key={mode}
                title={label}
                onClick={() => setViewMode(mode)}
                style={{
                  position: 'relative', zIndex: 1,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  width: 32, height: 28, borderRadius: 4, border: 'none', cursor: 'pointer',
                  background: 'transparent',
                  color: viewMode === mode ? '#fff' : 'var(--text-muted)',
                  transition: 'color 0.2s',
                  marginRight: mode === 'binder' ? 4 : 0,
                }}
              >
                <Icon />
              </button>
            ))}
          </div>
        </div>

        {/* Position filter — only in list view */}
        <div style={{
          overflow: 'hidden',
          maxHeight: viewMode === 'list' ? 60 : 0,
          opacity: viewMode === 'list' ? 1 : 0,
          marginBottom: viewMode === 'list' ? 44 : 0,
          transition: 'max-height 0.35s ease, opacity 0.3s ease, margin-bottom 0.35s ease',
        }} className="flex justify-center">
          <FilterGroup label="" options={POSITIONS} value={posFilter} onChange={setPosFilter} />
        </div>

        {/* Views */}
        <div style={{ position: 'relative' }}>
          <div style={{
            opacity: viewMode === 'list' ? 1 : 0,
            transition: 'opacity 0.35s ease',
            pointerEvents: viewMode === 'list' ? 'auto' : 'none',
            position: viewMode === 'list' ? 'relative' : 'absolute',
            top: 0, left: 0, width: '100%',
          }}>
            {(viewMode === 'list') && (
              <div className="flex flex-col gap-10">
                {filtered.map((p, i) => (
                  <div key={p.rank}>
                    <ProspectCard prospect={p} index={i} />
                    {i < filtered.length - 1 && (
                      <img
                        src="/squiggle-divider.svg"
                        alt=""
                        className="squiggle-divider"
                        style={{ width: '40%', margin: '72px auto 32px' }}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div style={{
            opacity: viewMode === 'binder' ? 1 : 0,
            transition: 'opacity 0.35s ease',
            pointerEvents: viewMode === 'binder' ? 'auto' : 'none',
            position: viewMode === 'binder' ? 'relative' : 'absolute',
            top: 0, left: 0, width: '100%',
          }}>
            <BinderView
              prospects={DRAFT_GUIDE_PROSPECTS}
              onCardClick={(prospect, rect) => {
                setSourceRect(rect || null)
                setSelectedProspect(prospect)
              }}
            />
          </div>
        </div>
      </div>
      </div>

      {/* Lightbox */}
      {selectedProspect && (
        <CardLightbox
          prospect={selectedProspect}
          prospects={DRAFT_GUIDE_PROSPECTS}
          onClose={() => { setSelectedProspect(null); setSourceRect(null) }}
          onNavigate={setSelectedProspect}
          sourceRect={sourceRect}
        />
      )}
    </>
  )
}
