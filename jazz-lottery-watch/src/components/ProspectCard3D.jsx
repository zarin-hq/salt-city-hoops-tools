import { useState, useRef, useCallback } from 'react'

const CARD_W = 300
const CARD_H = 420
const EDGE = 3

const SCHOOL_LOGO_IDS = {
  'BYU': 252, 'Kansas': 2305, 'Duke': 150, 'N. Carolina': 153,
  'Houston': 248, 'Arkansas': 8, 'Louisville': 97, 'Illinois': 356,
  'Tennessee': 2633, 'UConn': 41, 'Washington': 264, 'Alabama': 333,
}

/* ── Front Face ───────────────────────────────────────────── */

function CardFront({ prospect, bgColor, holo, rot }) {
  const [imgFailed, setImgFailed] = useState(false)
  const initials = (prospect.name || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  // Holo gradient shifts angle and position based on card rotation
  const holoAngle = 135 + (rot?.y || 0) * 1.5 + (rot?.x || 0) * 0.5
  const holoPos = 50 + (rot?.y || 0) * 0.8

  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        overflow: 'hidden',
        background: '#111',
        border: 'none',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Photo area */}
      <div style={{ flex: 1, position: 'relative', background: bgColor, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {(prospect.cardPhoto || prospect.photo) && !imgFailed ? (
          <img
            src={prospect.cardPhoto || prospect.photo}
            alt=""
            style={prospect.cardPhoto
              ? { width: '100%', height: '100%', objectFit: 'cover' }
              : { height: '100%', width: 'auto', objectFit: 'contain' }}
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span style={{ color: '#fff', fontSize: 56, fontWeight: 700, fontFamily: "'Archivo Black', Arial, sans-serif" }}>{initials}</span>
        )}

        {/* Holographic overlay */}
        {holo && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `linear-gradient(${holoAngle}deg,
              rgba(255,0,0,0.28) ${holoPos - 40}%,
              rgba(255,165,0,0.25) ${holoPos - 25}%,
              rgba(255,255,0,0.28) ${holoPos - 10}%,
              rgba(0,255,0,0.25) ${holoPos}%,
              rgba(0,200,255,0.28) ${holoPos + 10}%,
              rgba(100,0,255,0.25) ${holoPos + 25}%,
              rgba(255,0,200,0.28) ${holoPos + 40}%)`,
            mixBlendMode: 'screen',
          }} />
        )}
        {holo && (
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: `linear-gradient(${holoAngle + 60}deg,
              transparent ${holoPos - 30}%,
              rgba(255,255,255,0.35) ${holoPos}%,
              transparent ${holoPos + 25}%)`,
            mixBlendMode: 'overlay',
          }} />
        )}
      </div>
    </div>
  )
}

/* ── Back Face ────────────────────────────────────────────── */

function CardBack({ prospect }) {
  const s = prospect.stats
  const [imgFailed, setImgFailed] = useState(false)
  const tbl = { fontSize: 9, color: '#222', textAlign: 'right', padding: '1px 3px', fontFamily: 'monospace' }
  const th = { ...tbl, fontWeight: 700, textAlign: 'center', borderBottom: '1px solid #444' }

  return (
    <div
      style={{
        position: 'absolute', inset: 0,
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
        transform: 'rotateY(180deg)',
        overflow: 'hidden',
        background: '#00FFB6',
        border: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
      }}
    >
      {/* Content box */}
      <div style={{
        width: '100%', height: '100%',
        background: '#fff',
        border: '2px solid #000',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Blue top section */}
        <div style={{ background: '#052065', padding: '10px 12px 8px' }}>
          {/* Top section: rank + bio + headshot */}
          <div style={{ display: 'flex', alignItems: 'flex-start', marginBottom: 6 }}>
            {/* Rank */}
            <div style={{ fontFamily: "'Archivo Black', Arial, sans-serif", fontSize: 18, color: '#fff', marginRight: 8, lineHeight: 1 }}>
              {prospect.rank}
            </div>
            {/* Bio info */}
            <div style={{ flex: 1, fontSize: 8.5, color: '#fff', lineHeight: 1.6 }}>
              <div>Height: {prospect.height}  Weight: {prospect.weight}</div>
              <div>College: {prospect.school}</div>
              <div>Class: {prospect.class} · Age: {prospect.age}</div>
              <div>Wingspan: {prospect.wingspan}</div>
            </div>
            {/* Circular headshot */}
            <div style={{
              width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
              border: '2px solid #fff', background: '#222',
            }}>
              {prospect.photo && !imgFailed ? (
                <img src={prospect.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setImgFailed(true)} />
              ) : null}
            </div>
          </div>

          {/* Player name */}
          <div style={{
            fontFamily: "'Archivo Black', Arial, sans-serif", fontSize: 14,
            color: '#fff', textAlign: 'center', paddingBottom: 4,
          }}>
            {prospect.name}
          </div>
        </div>

        {/* White bottom section */}
        <div style={{ flex: 1, padding: '8px 12px 8px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Season Stats table */}
          <div style={{ textAlign: 'center', fontSize: 8, fontWeight: 700, color: '#333', letterSpacing: 0.5, marginBottom: 3 }}>
            SEASON STATS
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 8 }}>
            <thead>
              <tr>
                {['PPG', 'RPG', 'APG', 'SPG', 'BPG', '3P%'].map(h => (
                  <td key={h} style={th}>{h}</td>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={tbl}>{s.ppg}</td>
                <td style={tbl}>{s.rpg}</td>
                <td style={tbl}>{s.apg}</td>
                <td style={tbl}>{s.spg}</td>
                <td style={tbl}>{s.bpg}</td>
                <td style={tbl}>{s.threePct}%</td>
              </tr>
            </tbody>
          </table>

          {/* Key Attributes */}
          <div style={{ textAlign: 'center', fontSize: 8, fontWeight: 700, color: '#333', letterSpacing: 0.5, marginBottom: 3 }}>
            KEY ATTRIBUTES
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, justifyContent: 'center', marginBottom: 8 }}>
            {prospect.keyAttributes.map(attr => (
              <span key={attr} style={{
                fontSize: 8, fontWeight: 700, color: '#111',
                background: '#f0f0f0', border: '1px solid #ccc',
                padding: '1px 6px',
              }}>
                {attr}
              </span>
            ))}
          </div>

          {/* Comparisons */}
          <div style={{ fontSize: 8, fontWeight: 700, color: '#333', letterSpacing: 0.5, marginBottom: 2 }}>
            COMPARISONS
          </div>
          <div style={{ fontSize: 9, color: '#222', marginBottom: 8 }}>
            {prospect.comparisons.join(' · ')}
          </div>

          {/* Scouting blurb */}
          <div style={{ fontSize: 8, color: '#222', lineHeight: 1.4, flex: 1, overflow: 'hidden' }}>
            {prospect.scoutingReport.length > 200
              ? prospect.scoutingReport.slice(0, 200) + '...'
              : prospect.scoutingReport}
          </div>

          {/* Footer */}
          <div style={{ textAlign: 'center', fontSize: 7, color: '#555', marginTop: 6, borderTop: '1px solid #ccc', paddingTop: 4 }}>
            saltcityhoops.com · 2026 Draft Guide
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Edge Strips (for thickness) ──────────────────────────── */

function CardEdges() {
  const edgeColor = '#C3CAC9'
  const half = EDGE / 2
  return (
    <>
      {/* Right edge */}
      <div style={{
        position: 'absolute', top: 0, left: CARD_W - half, width: EDGE, height: CARD_H,
        background: edgeColor,
        transform: `rotateY(90deg)`,
        transformOrigin: `${half}px center`,
      }} />
      {/* Left edge */}
      <div style={{
        position: 'absolute', top: 0, left: -half, width: EDGE, height: CARD_H,
        background: edgeColor,
        transform: `rotateY(-90deg)`,
        transformOrigin: `${half}px center`,
      }} />
      {/* Top edge */}
      <div style={{
        position: 'absolute', top: -half, left: 0, width: CARD_W, height: EDGE,
        background: edgeColor,
        transform: `rotateX(90deg)`,
        transformOrigin: `center ${half}px`,
      }} />
      {/* Bottom edge */}
      <div style={{
        position: 'absolute', top: CARD_H - half, left: 0, width: CARD_W, height: EDGE,
        background: edgeColor,
        transform: `rotateX(-90deg)`,
        transformOrigin: `center ${half}px`,
      }} />
    </>
  )
}

/* ── Main 3D Card Component ───────────────────────────────── */

export default function ProspectCard3D({ prospect, bgColor = '#000', holo = false }) {
  const [rot, setRot] = useState({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const dragRef = useRef(null)
  const cardRef = useRef(null)

  const onPointerDown = useCallback((e) => {
    e.preventDefault()
    setDragging(true)
    dragRef.current = { startX: e.clientX, startY: e.clientY, startRot: { ...rot } }
    cardRef.current?.setPointerCapture(e.pointerId)
  }, [rot])

  const onPointerMove = useCallback((e) => {
    if (!dragging || !dragRef.current) return
    const dx = e.clientX - dragRef.current.startX
    const dy = e.clientY - dragRef.current.startY
    setRot({
      x: dragRef.current.startRot.x - dy * 0.5,
      y: dragRef.current.startRot.y + dx * 0.5,
    })
  }, [dragging])

  const onPointerUp = useCallback((e) => {
    setDragging(false)
    dragRef.current = null
    cardRef.current?.releasePointerCapture(e.pointerId)
  }, [])

  const resetCard = useCallback(() => {
    setRot({ x: 0, y: 0 })
  }, [])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, userSelect: 'none' }}>
      {/* Perspective wrapper */}
      <div style={{ perspective: 1200, width: CARD_W, height: CARD_H }}>
        {/* Rotating card */}
        <div
          ref={cardRef}
          style={{
            width: CARD_W,
            height: CARD_H,
            position: 'relative',
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
            transition: dragging ? 'none' : 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            cursor: dragging ? 'grabbing' : 'grab',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onDoubleClick={resetCard}
        >
          <CardFront prospect={prospect} bgColor={bgColor} holo={holo} rot={rot} />
          <CardBack prospect={prospect} />
          <CardEdges />
        </div>
      </div>

      {/* Hint text */}
      <div style={{ fontSize: 10, color: '#999', textAlign: 'center' }}>
        Drag to rotate · Double-click to reset
      </div>
    </div>
  )
}
