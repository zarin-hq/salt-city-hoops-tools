import { useState, useEffect, useRef } from 'react'
import { LayoutConfig } from '../components/Layout'
import { SEASONS, CONTRACTS, CAP_PROJECTIONS } from '../data/multiyear-salaries'

const STORAGE_KEY = 'jazz-cap-table'
const FA_STORAGE_KEY = 'jazz-cap-table-fa'
const headshotUrl = id => `https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${id}.png&w=48&h=35`

const fmtFull = n => {
  if (!n) return ''
  const m = n / 1_000_000
  return `$${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}M`
}

function loadEdits() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return {}
}

// Free agents: [{ id, name, salaries: { '2026-27': number, ... } }]
function loadFAs() {
  try {
    const raw = localStorage.getItem(FA_STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch { /* ignore */ }
  return []
}

export default function CapTable() {
  const [edits, setEdits] = useState(loadEdits)
  const [freeAgents, setFreeAgents] = useState(loadFAs)

  useEffect(() => {
    document.title = 'Cap Table | Salt City Hoops'
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(edits))
  }, [edits])

  useEffect(() => {
    localStorage.setItem(FA_STORAGE_KEY, JSON.stringify(freeAgents))
  }, [freeAgents])

  function addFA(name) {
    if (!name.trim()) return
    setFreeAgents(prev => [...prev, { id: Date.now(), name: name.trim(), salaries: {} }])
  }

  function removeFA(id) {
    setFreeAgents(prev => prev.filter(fa => fa.id !== id))
  }

  function setFASalary(id, season, value) {
    setFreeAgents(prev => prev.map(fa => {
      if (fa.id !== id) return fa
      const salaries = { ...fa.salaries }
      if (!value && value !== 0) delete salaries[season]
      else salaries[season] = value
      return { ...fa, salaries }
    }))
  }

  function renameFА(id, name) {
    setFreeAgents(prev => prev.map(fa => fa.id === id ? { ...fa, name } : fa))
  }

  function setEdit(playerName, season, value) {
    setEdits(prev => {
      const key = `${playerName}::${season}`
      if (value === null || value === undefined) {
        const next = { ...prev }
        delete next[key]
        return next
      }
      return { ...prev, [key]: value }
    })
  }

  function getEdit(playerName, season) {
    return edits[`${playerName}::${season}`] ?? null
  }

  // Toggle a TO: decline it and cascade to all future seasons for that player
  function toggleTO(player, season) {
    setEdits(prev => {
      const key = `${player.name}::${season}`
      const isDeclined = prev[key] === 'declined'
      const next = { ...prev }

      if (isDeclined) {
        // Re-exercise: remove declined flags for this and future TO/known seasons
        SEASONS.forEach(s => {
          if (s >= season) delete next[`${player.name}::${s}`]
        })
      } else {
        // Decline: mark this and all future seasons as declined
        const seasonIdx = SEASONS.indexOf(season)
        for (let i = seasonIdx; i < SEASONS.length; i++) {
          const s = SEASONS[i]
          const known = player.salaries[s]
          if (known) {
            next[`${player.name}::${s}`] = 'declined'
          } else {
            // Also clear any custom values in future empty cells
            delete next[`${player.name}::${s}`]
          }
        }
      }
      return next
    })
  }

  // Build row data sorted by 2026-27 salary descending
  const rows = [...CONTRACTS].sort((a, b) => {
    const aS = a.salaries['2026-27']?.amount || 0
    const bS = b.salaries['2026-27']?.amount || 0
    return bS - aS
  })

  // Compute totals per season (custom edits override QO amounts, declined TOs excluded)
  const totals = {}
  SEASONS.forEach(season => {
    let total = 0
    rows.forEach(player => {
      const known = player.salaries[season]
      const edit = getEdit(player.name, season)
      if (edit === 'declined') return
      if (typeof edit === 'number') total += edit
      else if (known) total += known.amount
    })
    freeAgents.forEach(fa => {
      if (fa.salaries[season]) total += fa.salaries[season]
    })
    totals[season] = total
  })

  return (
    <>
      <LayoutConfig title="Jazz Cap Table" />

      <main className="max-w-[1600px] mx-auto px-4 py-8">
        <div className="mb-4 flex items-baseline gap-3">
          <h2 className="font-display text-sm uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
            Multi-Year Salary Projections
          </h2>
          <span className="text-xs" style={{ color: 'var(--text-faint)' }}>
            Click empty cells to add projected salaries
          </span>
        </div>

        <div
          className="rounded-xl overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
        >
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
              <thead>
                <tr style={{ background: 'var(--sch-black)' }}>
                  <th
                    className="text-left text-[10px] font-bold uppercase tracking-wider px-3 py-2.5 sticky left-0 z-10"
                    style={{ color: 'rgba(255,255,255,0.6)', background: 'var(--sch-black)', minWidth: 180 }}
                  >
                    Player
                  </th>
                  {SEASONS.map(season => (
                    <th
                      key={season}
                      className="text-right text-[10px] font-bold uppercase tracking-wider px-3 py-2.5"
                      style={{ color: 'rgba(255,255,255,0.6)', minWidth: 130 }}
                    >
                      {season}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((player, i) => (
                  <PlayerRow
                    key={player.name}
                    player={player}
                    getEdit={getEdit}
                    setEdit={setEdit}
                    toggleTO={toggleTO}
                    isOdd={i % 2 === 1}
                  />
                ))}
                {freeAgents.length > 0 && (
                  <tr>
                    <td
                      colSpan={1 + SEASONS.length}
                      className="px-3 py-1.5 sticky left-0"
                      style={{ background: 'var(--bg-raised)', borderBottom: '1px solid var(--border)' }}
                    >
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--text-faint)' }}>
                        Free Agent Signings
                      </span>
                    </td>
                  </tr>
                )}
                {freeAgents.map((fa, i) => (
                  <FreeAgentRow
                    key={fa.id}
                    fa={fa}
                    onSetSalary={(season, val) => setFASalary(fa.id, season, val)}
                    onRename={name => renameFА(fa.id, name)}
                    onRemove={() => removeFA(fa.id)}
                    isOdd={(rows.length + i) % 2 === 1}
                  />
                ))}
                <AddFARow onAdd={addFA} isOdd={(rows.length + freeAgents.length) % 2 === 1} />
              </tbody>
              <tfoot>
                {/* Totals row */}
                <tr style={{ background: 'var(--sch-black)' }}>
                  <td
                    className="px-3 py-2.5 text-xs font-bold uppercase tracking-wider sticky left-0 z-10"
                    style={{ color: 'white', background: 'var(--sch-black)' }}
                  >
                    Total
                  </td>
                  {SEASONS.map(season => (
                    <td key={season} className="px-3 py-2.5 text-right">
                      <span className="text-sm font-bold tabular-nums" style={{ color: 'var(--sch-teal-bright)' }}>
                        {fmtFull(totals[season])}
                      </span>
                    </td>
                  ))}
                </tr>
                {/* Cap line */}
                <tr style={{ background: '#111' }}>
                  <td
                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider sticky left-0 z-10"
                    style={{ color: 'rgba(255,255,255,0.5)', background: '#111' }}
                  >
                    Salary Cap
                  </td>
                  {SEASONS.map(season => {
                    const proj = CAP_PROJECTIONS[season]
                    const over = totals[season] > proj.cap
                    return (
                      <td key={season} className="px-3 py-1.5 text-right">
                        <span className="text-[11px] font-bold tabular-nums" style={{ color: over ? '#f87171' : 'rgba(255,255,255,0.5)' }}>
                          {fmtFull(proj.cap)}
                        </span>
                      </td>
                    )
                  })}
                </tr>
                {/* Tax line */}
                <tr style={{ background: '#111' }}>
                  <td
                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider sticky left-0 z-10"
                    style={{ color: 'rgba(255,255,255,0.5)', background: '#111' }}
                  >
                    Luxury Tax
                  </td>
                  {SEASONS.map(season => {
                    const proj = CAP_PROJECTIONS[season]
                    const over = totals[season] > proj.tax
                    return (
                      <td key={season} className="px-3 py-1.5 text-right">
                        <span className="text-[11px] font-bold tabular-nums" style={{ color: over ? '#f87171' : 'rgba(255,255,255,0.5)' }}>
                          {fmtFull(proj.tax)}
                        </span>
                      </td>
                    )
                  })}
                </tr>
                {/* 1st Apron */}
                <tr style={{ background: '#111' }}>
                  <td
                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider sticky left-0 z-10"
                    style={{ color: 'rgba(255,255,255,0.5)', background: '#111' }}
                  >
                    1st Apron
                  </td>
                  {SEASONS.map(season => {
                    const proj = CAP_PROJECTIONS[season]
                    const over = totals[season] > proj.apron1
                    return (
                      <td key={season} className="px-3 py-1.5 text-right">
                        <span className="text-[11px] font-bold tabular-nums" style={{ color: over ? '#f87171' : 'rgba(255,255,255,0.5)' }}>
                          {fmtFull(proj.apron1)}
                        </span>
                      </td>
                    )
                  })}
                </tr>
                {/* 2nd Apron */}
                <tr style={{ background: '#111' }}>
                  <td
                    className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider sticky left-0 z-10"
                    style={{ color: 'rgba(255,255,255,0.5)', background: '#111' }}
                  >
                    2nd Apron
                  </td>
                  {SEASONS.map(season => {
                    const proj = CAP_PROJECTIONS[season]
                    const over = totals[season] > proj.apron2
                    return (
                      <td key={season} className="px-3 py-1.5 text-right">
                        <span className="text-[11px] font-bold tabular-nums" style={{ color: over ? '#f87171' : 'rgba(255,255,255,0.5)' }}>
                          {fmtFull(proj.apron2)}
                        </span>
                      </td>
                    )
                  })}
                </tr>
                {/* Cap space */}
                <tr style={{ background: '#111', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <td
                    className="px-3 py-1.5 pb-2.5 text-[10px] font-bold uppercase tracking-wider sticky left-0 z-10"
                    style={{ color: 'rgba(255,255,255,0.5)', background: '#111' }}
                  >
                    Cap Space
                  </td>
                  {SEASONS.map(season => {
                    const space = CAP_PROJECTIONS[season].cap - totals[season]
                    return (
                      <td key={season} className="px-3 py-1.5 pb-2.5 text-right">
                        <span className="text-[11px] font-bold tabular-nums" style={{ color: space >= 0 ? 'var(--sch-teal-bright)' : '#f87171' }}>
                          {space >= 0 ? '+' : ''}{fmtFull(space)}
                        </span>
                      </td>
                    )
                  })}
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[10px]" style={{ color: 'var(--text-faint)' }}>
          <span><strong>TO</strong> = Team Option</span>
          <span><strong>PO</strong> = Player Option</span>
          <span><strong>QO</strong> = Qualifying Offer</span>
          <span style={{ color: 'var(--sch-teal)' }}>Green cells</span> = your projections
          <span>Future cap projections are estimates</span>
        </div>
      </main>
    </>
  )
}

function PlayerRow({ player, getEdit, setEdit, toggleTO, isOdd }) {
  const bg = isOdd ? 'var(--bg-raised)' : 'var(--bg-card)'
  const initials = player.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <tr style={{ borderBottom: '1px solid var(--border)' }}>
      {/* Player name — sticky */}
      <td
        className="px-3 py-2 sticky left-0 z-10"
        style={{ background: bg, borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          {player.espnId ? (
            <img
              src={headshotUrl(player.espnId)}
              alt=""
              className="rounded-full flex-shrink-0"
              style={{ width: 24, height: 24, objectFit: 'cover' }}
            />
          ) : (
            <div
              className="rounded-full flex items-center justify-center flex-shrink-0"
              style={{ width: 24, height: 24, background: 'var(--bg-raised)', color: 'var(--text-faint)', fontSize: 9, fontWeight: 700, border: '1px solid var(--border)' }}
            >
              {initials}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-xs font-semibold truncate" style={{ color: player.editable ? 'var(--sch-teal)' : 'var(--text)' }}>
              {player.name}
            </div>
            <div className="text-[10px]" style={{ color: 'var(--text-faint)' }}>{player.position}</div>
          </div>
        </div>
      </td>

      {/* Salary cells */}
      {SEASONS.map(season => {
        const known = player.salaries[season]
        const edit = getEdit(player.name, season)
        const isQO = known?.note === 'QO'
        const isTO = known?.note === 'TO'
        const isDeclined = edit === 'declined'

        return (
          <td
            key={season}
            className="px-3 py-2 text-right"
            style={{ background: bg, borderBottom: '1px solid var(--border)' }}
          >
            {isDeclined ? (
              <DeclinedCell amount={known?.amount} note={known?.note} onRestore={() => toggleTO(player, season)} />
            ) : isTO ? (
              <OptionCell amount={known.amount} note="TO" onDecline={() => toggleTO(player, season)} />
            ) : (!known || isQO) ? (
              <EditableCell
                value={typeof edit === 'number' ? edit : null}
                fallback={isQO ? known.amount : null}
                fallbackNote={isQO ? 'QO' : null}
                onChange={val => setEdit(player.name, season, val)}
              />
            ) : (
              <KnownCell amount={known.amount} note={known.note} />
            )}
          </td>
        )
      })}
    </tr>
  )
}

function KnownCell({ amount, note }) {
  return (
    <div className="flex items-center justify-end gap-1.5">
      <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--text)' }}>
        {fmtFull(amount)}
      </span>
      {note && (
        <span
          className="text-[9px] font-bold uppercase px-1 py-0.5 rounded"
          style={{
            background: note === 'PO' ? '#fef3c7' : note === 'QO' ? '#e0e7ff' : '#f0fdf4',
            color: note === 'PO' ? '#92400e' : note === 'QO' ? '#3730a3' : '#166534',
            lineHeight: 1,
          }}
        >
          {note}
        </span>
      )}
    </div>
  )
}

function OptionCell({ amount, note, onDecline }) {
  return (
    <button
      onClick={onDecline}
      className="flex items-center justify-end gap-1.5 w-full"
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      title="Click to decline option"
    >
      <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--text)' }}>
        {fmtFull(amount)}
      </span>
      <span
        className="text-[9px] font-bold uppercase px-1 py-0.5 rounded"
        style={{ background: '#f0fdf4', color: '#166534', lineHeight: 1 }}
      >
        {note}
      </span>
    </button>
  )
}

function DeclinedCell({ amount, note, onRestore }) {
  return (
    <button
      onClick={onRestore}
      className="flex items-center justify-end gap-1.5 w-full"
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, opacity: 0.4 }}
      title="Click to exercise option"
    >
      <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--text)', textDecoration: 'line-through' }}>
        {amount ? fmtFull(amount) : '—'}
      </span>
      {note && (
        <span
          className="text-[9px] font-bold uppercase px-1 py-0.5 rounded"
          style={{ background: '#fee2e2', color: '#991b1b', lineHeight: 1, textDecoration: 'line-through' }}
        >
          {note}
        </span>
      )}
    </button>
  )
}

function EditableCell({ value, fallback, fallbackNote, onChange }) {
  const [editing, setEditing] = useState(false)
  const [inputVal, setInputVal] = useState('')
  const inputRef = useRef(null)

  const displayVal = value || fallback

  function startEdit() {
    setInputVal(displayVal ? (displayVal / 1_000_000).toString() : '')
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function commit() {
    setEditing(false)
    const num = parseFloat(inputVal)
    if (!inputVal || isNaN(num) || num <= 0) {
      onChange(null)
    } else {
      onChange(Math.round(num * 1_000_000))
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') commit()
    if (e.key === 'Escape') { setEditing(false); setInputVal('') }
  }

  if (editing) {
    return (
      <div className="flex items-center justify-end gap-1">
        <span className="text-xs" style={{ color: 'var(--text-faint)' }}>$</span>
        <input
          ref={inputRef}
          type="text"
          inputMode="decimal"
          value={inputVal}
          onChange={e => setInputVal(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKeyDown}
          placeholder="0.0"
          className="text-xs font-bold tabular-nums text-right rounded"
          style={{
            width: 60, padding: '2px 4px', height: 24,
            background: 'var(--bg-card)', color: 'var(--sch-teal)',
            border: '2px solid var(--sch-teal) !important',
            outline: 'none',
          }}
        />
        <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>M</span>
      </div>
    )
  }

  // Custom value set by user
  if (value) {
    return (
      <button
        onClick={startEdit}
        className="flex items-center justify-end gap-1.5 w-full"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--sch-teal)' }}>
          {fmtFull(value)}
        </span>
        <span
          className="text-[9px] font-bold uppercase px-1 py-0.5 rounded"
          style={{ background: 'rgba(0,213,152,0.1)', color: 'var(--sch-teal)', lineHeight: 1 }}
        >
          est
        </span>
      </button>
    )
  }

  // QO fallback — show the QO value but allow clicking to override
  if (fallback) {
    return (
      <button
        onClick={startEdit}
        className="flex items-center justify-end gap-1.5 w-full"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
      >
        <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--text)' }}>
          {fmtFull(fallback)}
        </span>
        <span
          className="text-[9px] font-bold uppercase px-1 py-0.5 rounded"
          style={{ background: '#e0e7ff', color: '#3730a3', lineHeight: 1 }}
        >
          {fallbackNote}
        </span>
      </button>
    )
  }

  // Empty — show "+ add"
  return (
    <button
      onClick={startEdit}
      className="w-full text-right"
      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
    >
      <span
        className="inline-block text-xs rounded px-2 py-0.5"
        style={{ color: 'var(--text-faint)', border: '1px dashed var(--border)', opacity: 0.5 }}
      >
        + add
      </span>
    </button>
  )
}

function FreeAgentRow({ fa, onSetSalary, onRename, onRemove, isOdd }) {
  const bg = isOdd ? 'var(--bg-raised)' : 'var(--bg-card)'
  const [editingName, setEditingName] = useState(false)
  const [nameVal, setNameVal] = useState(fa.name)
  const nameRef = useRef(null)

  function startNameEdit() {
    setNameVal(fa.name)
    setEditingName(true)
    setTimeout(() => nameRef.current?.focus(), 0)
  }

  function commitName() {
    setEditingName(false)
    if (nameVal.trim()) onRename(nameVal.trim())
    else setNameVal(fa.name)
  }

  const initials = fa.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  return (
    <tr style={{ borderBottom: '1px solid var(--border)' }}>
      <td
        className="px-3 py-2 sticky left-0 z-10"
        style={{ background: bg, borderBottom: '1px solid var(--border)' }}
      >
        <div className="flex items-center gap-2">
          <div
            className="rounded-full flex items-center justify-center flex-shrink-0"
            style={{ width: 24, height: 24, background: 'rgba(0,213,152,0.15)', color: 'var(--sch-teal)', fontSize: 9, fontWeight: 700 }}
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            {editingName ? (
              <input
                ref={nameRef}
                type="text"
                value={nameVal}
                onChange={e => setNameVal(e.target.value)}
                onBlur={commitName}
                onKeyDown={e => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') setEditingName(false) }}
                className="text-xs font-semibold rounded w-full"
                style={{
                  padding: '1px 4px', height: 22,
                  background: 'var(--bg-card)', color: 'var(--sch-teal)',
                  border: '2px solid var(--sch-teal) !important',
                  outline: 'none',
                }}
              />
            ) : (
              <button
                onClick={startNameEdit}
                className="text-xs font-semibold truncate block text-left"
                style={{ color: 'var(--sch-teal)', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                {fa.name}
              </button>
            )}
            <div className="text-[10px] flex items-center gap-1.5" style={{ color: 'var(--text-faint)' }}>
              FA
              <button
                onClick={onRemove}
                className="btn-x"
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 11, color: 'var(--text-faint)', lineHeight: 1 }}
                title="Remove"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      </td>
      {SEASONS.map(season => (
        <td
          key={season}
          className="px-3 py-2 text-right"
          style={{ background: bg, borderBottom: '1px solid var(--border)' }}
        >
          <EditableCell
            value={fa.salaries[season] || null}
            onChange={val => onSetSalary(season, val)}
          />
        </td>
      ))}
    </tr>
  )
}

function AddFARow({ onAdd, isOdd }) {
  const bg = isOdd ? 'var(--bg-raised)' : 'var(--bg-card)'
  const [adding, setAdding] = useState(false)
  const [name, setName] = useState('')
  const inputRef = useRef(null)

  function start() {
    setName('')
    setAdding(true)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  function commit() {
    setAdding(false)
    if (name.trim()) onAdd(name.trim())
    setName('')
  }

  return (
    <tr>
      <td
        className="px-3 py-2 sticky left-0 z-10"
        colSpan={1 + SEASONS.length}
        style={{ background: bg, borderBottom: '1px solid var(--border)' }}
      >
        {adding ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              onBlur={commit}
              onKeyDown={e => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') { setAdding(false); setName('') } }}
              placeholder="Player name..."
              className="text-xs font-semibold rounded"
              style={{
                padding: '2px 8px', height: 26, width: 200,
                background: 'var(--bg-card)', color: 'var(--sch-teal)',
                border: '2px solid var(--sch-teal) !important',
                outline: 'none',
              }}
            />
            <span className="text-[10px]" style={{ color: 'var(--text-faint)' }}>then set salaries per season</span>
          </div>
        ) : (
          <button
            onClick={start}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <span
              className="inline-flex items-center gap-1 text-xs font-bold rounded px-2 py-1"
              style={{ color: 'var(--sch-teal)', border: '1px dashed var(--sch-teal)', opacity: 0.7 }}
            >
              + Add Free Agent
            </span>
          </button>
        )}
      </td>
    </tr>
  )
}
