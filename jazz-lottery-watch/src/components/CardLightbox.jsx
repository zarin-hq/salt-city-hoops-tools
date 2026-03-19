import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react'
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

function NavArrow({ direction, onClick }) {
  const isLeft = direction === 'prev'
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onClick() }}
      style={{
        width: 44, height: 44, borderRadius: '50%',
        background: 'rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#fff', fontSize: 22, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'background 0.15s',
        flexShrink: 0,
      }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
    >
      {isLeft ? '‹' : '›'}
    </button>
  )
}

const CARD_W = 300
const CARD_H = 420
const ANIM_DURATION = 800
const FLIP_DURATION = 500
const FLIP_HALF = FLIP_DURATION / 2

export default function CardLightbox({ prospect, prospects = [], onClose, onNavigate, sourceRect }) {
  const bgColor = PHOTO_BG_COLORS[(prospect.rank - 1) % PHOTO_BG_COLORS.length]
  const currentIdx = prospects.findIndex(p => p.rank === prospect.rank)
  const prevProspect = currentIdx > 0 ? prospects[currentIdx - 1] : null
  const nextProspect = currentIdx < prospects.length - 1 ? prospects[currentIdx + 1] : null

  // Animation phase: 'animating' → 'open', or skip straight to 'open'
  const [phase, setPhase] = useState(sourceRect ? 'animating' : 'open')
  const flyRef = useRef(null)
  const targetRef = useRef(null)
  const consumedRect = useRef(false)

  // Card flip navigation state
  const [flipState, setFlipState] = useState(null)
  const [displayProspect, setDisplayProspect] = useState(prospect)
  const flipCardRef = useRef(null)
  const displayBgColor = PHOTO_BG_COLORS[(displayProspect.rank - 1) % PHOTO_BG_COLORS.length]

  // Sync display prospect with prop when not flipping
  useEffect(() => {
    if (!flipState) setDisplayProspect(prospect)
  }, [prospect]) // eslint-disable-line react-hooks/exhaustive-deps

  // Backdrop fades in immediately on mount (during animation, not after)
  const [backdropIn, setBackdropIn] = useState(!sourceRect)
  // Stats panel starts sliding in partway through the fly-in
  const [showStats, setShowStats] = useState(!sourceRect)
  useEffect(() => {
    if (!sourceRect) return
    requestAnimationFrame(() => setBackdropIn(true))
    const t = setTimeout(() => setShowStats(true), ANIM_DURATION * 0.45)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Hide body scrollbar before measuring positions to prevent layout shift
  useLayoutEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // Kick off the fly-in animation on first mount only
  useLayoutEffect(() => {
    if (!sourceRect || consumedRect.current) return
    consumedRect.current = true

    const el = flyRef.current
    const targetEl = targetRef.current
    if (!el || !targetEl) { setPhase('open'); return }

    // Measure the actual rendered card (accounts for mobile CSS scale)
    const cardWrap = targetEl.querySelector('.prospect-card-3d-wrap')
    const perspectiveEl = cardWrap?.firstElementChild
    const actualRect = perspectiveEl ? perspectiveEl.getBoundingClientRect() : targetEl.getBoundingClientRect()

    // End scale: match the lightbox card's visual size (0.75 on mobile, 1 on desktop)
    const endScale = actualRect.width / CARD_W
    const endCenterX = actualRect.left + actualRect.width / 2
    const endCenterY = actualRect.top + actualRect.height / 2

    // Position flying card so its center aligns with actual card center at end scale
    el.style.left = `${endCenterX - CARD_W / 2}px`
    el.style.top = `${endCenterY - CARD_H / 2}px`

    // Source scale relative to full card size
    const srcScale = sourceRect.width / CARD_W

    // Translate from end center to source center
    const dx = (sourceRect.left + sourceRect.width / 2) - endCenterX
    const dy = (sourceRect.top + sourceRect.height / 2) - endCenterY

    // Start at source position/scale, with a full Y-flip queued
    el.style.transform = `translate(${dx}px, ${dy}px) scale(${srcScale}) rotateY(-360deg)`
    el.style.transition = 'none'

    // Force reflow then animate to target — card flips as it flies
    el.getBoundingClientRect()
    requestAnimationFrame(() => {
      el.style.transition = `transform ${ANIM_DURATION}ms cubic-bezier(0.16, 1, 0.3, 1)`
      el.style.transform = `translate(0px, 0px) scale(${endScale}) rotateY(0deg)`
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Transition end → reveal full lightbox
  useEffect(() => {
    if (phase !== 'animating') return
    const timer = setTimeout(() => setPhase('open'), ANIM_DURATION + 50)
    return () => clearTimeout(timer)
  }, [phase])

  const isOpen = phase === 'open'

  const handleNavigate = useCallback((nextP) => {
    if (flipState || !isOpen) return
    const el = flipCardRef.current
    if (!el) { onNavigate(nextP); return }

    setFlipState({ next: nextP })

    // Phase 1: rotate out (0 → 90deg)
    el.style.transition = `transform ${FLIP_HALF}ms cubic-bezier(0.4, 0, 1, 1)`
    el.style.transform = 'rotateY(90deg)'

    // At midpoint: swap card, rotate in (-90 → 0)
    setTimeout(() => {
      setDisplayProspect(nextP)
      el.style.transition = 'none'
      el.style.transform = 'rotateY(-90deg)'
      el.getBoundingClientRect()
      requestAnimationFrame(() => {
        el.style.transition = `transform ${FLIP_HALF}ms cubic-bezier(0, 0, 0.2, 1)`
        el.style.transform = 'rotateY(0deg)'
      })
    }, FLIP_HALF)

    // Complete: commit navigation
    setTimeout(() => {
      onNavigate(nextP)
      setFlipState(null)
    }, FLIP_DURATION + 50)
  }, [flipState, isOpen, onNavigate])

  const onKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'ArrowLeft' && prevProspect && onNavigate) handleNavigate(prevProspect)
    if (e.key === 'ArrowRight' && nextProspect && onNavigate) handleNavigate(nextProspect)
  }, [onClose, prevProspect, nextProspect, onNavigate, handleNavigate])

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [onKeyDown])

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: backdropIn ? 'rgba(0, 0, 0, 0.75)' : 'rgba(0, 0, 0, 0)',
        backdropFilter: backdropIn ? 'blur(8px)' : 'blur(0px)',
        WebkitBackdropFilter: backdropIn ? 'blur(8px)' : 'blur(0px)',
        transition: `background ${ANIM_DURATION}ms ease, backdrop-filter ${ANIM_DURATION}ms ease, -webkit-backdrop-filter ${ANIM_DURATION}ms ease`,
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
      onClick={onClose}
    >
      {/* Flying card overlay during animation — positioned to land exactly on the lightbox card */}
      {phase === 'animating' && (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 10002 }}>
          <div
            ref={flyRef}
            style={{
              position: 'absolute',
              width: CARD_W, height: CARD_H,
              willChange: 'transform',
              transformOrigin: 'center center',
              transformStyle: 'preserve-3d',
            }}
          >
            <div className="lightbox-fly-card" style={{ transformStyle: 'preserve-3d' }}>
              <ProspectCard3D
                prospect={prospect}
                bgColor={bgColor}
                holo={prospect.rank <= 4}
                showHint={false}
              />
            </div>
          </div>
        </div>
      )}

      {/* Fixed close button — out of flow, no layout impact */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose() }}
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 10001,
          width: 40, height: 40, borderRadius: '50%',
          background: 'rgba(0,0,0,0.5)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff', fontSize: 20, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.15s, opacity 250ms ease',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
      >
        ✕
      </button>

      {/* Lightbox content — individual elements animate in independently */}
      <div style={{ pointerEvents: isOpen ? 'auto' : 'none' }}>
      {/* Centering wrapper */}
      <div className="lightbox-center" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100%', padding: 24 }}>
      {/* Nav + Content row */}
      <div
        onClick={e => e.stopPropagation()}
        style={{ display: 'flex', alignItems: 'flex-start', gap: 16, maxWidth: '100%' }}
      >
        {/* Prev arrow — desktop only, fades in */}
        <div className="hidden lg:flex" style={{
          paddingTop: 260,
          opacity: isOpen ? 1 : 0, transition: 'opacity 250ms ease 80ms',
        }}>
          {prevProspect && onNavigate ? (
            <NavArrow direction="prev" onClick={() => handleNavigate(prevProspect)} />
          ) : <div style={{ width: 44 }} />}
        </div>

        {/* Main content column */}
        <div className="flex flex-col items-center gap-6">
      <div
        className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center lg:items-start"
        style={{ width: 'fit-content', maxWidth: '100%' }}
      >
        {/* 3D Card with mobile arrows overlaid */}
        <div className="flex-shrink-0 relative" style={{
          overflow: 'visible', paddingTop: 32,
          opacity: isOpen ? 1 : 0,
        }}>
          {/* Mobile prev arrow — overlaid on left edge */}
          {onNavigate && prevProspect && (
            <div className="flex lg:hidden absolute" style={{
              left: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 2,
              opacity: isOpen ? 1 : 0, transition: 'opacity 250ms ease 80ms',
            }}>
              <NavArrow direction="prev" onClick={() => handleNavigate(prevProspect)} />
            </div>
          )}

          <div className="lightbox-card-wrap">
            <div ref={targetRef} style={{ perspective: 1200 }}>
              <div ref={flipCardRef}>
                <ProspectCard3D
                  prospect={displayProspect}
                  bgColor={displayBgColor}
                  holo={displayProspect.rank <= 4}
                />
              </div>
            </div>
          </div>

          {/* Mobile next arrow — overlaid on right edge */}
          {onNavigate && nextProspect && (
            <div className="flex lg:hidden absolute" style={{
              right: -20, top: '50%', transform: 'translateY(-50%)', zIndex: 2,
              opacity: isOpen ? 1 : 0, transition: 'opacity 250ms ease 80ms',
            }}>
              <NavArrow direction="next" onClick={() => handleNavigate(nextProspect)} />
            </div>
          )}
        </div>

        {/* Stats content box — slides up + fades in */}
        <div className="relative min-w-0 w-full lg:w-[480px]" style={{
          opacity: showStats ? (flipState ? 0 : 1) : 0,
          transform: showStats ? 'translateY(0)' : 'translateY(40px)',
          transition: flipState
            ? 'opacity 200ms ease'
            : 'opacity 350ms ease 50ms, transform 450ms cubic-bezier(0.16, 1, 0.3, 1)',
        }}>
          {/* Rank circle */}
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

      </div>

        {/* Next arrow — desktop only, fades in */}
        <div className="hidden lg:flex" style={{
          paddingTop: 260,
          opacity: isOpen ? 1 : 0, transition: 'opacity 250ms ease 80ms',
        }}>
          {nextProspect && onNavigate ? (
            <NavArrow direction="next" onClick={() => handleNavigate(nextProspect)} />
          ) : <div style={{ width: 44 }} />}
        </div>
      </div>
      </div>
      </div>
    </div>
  )
}
