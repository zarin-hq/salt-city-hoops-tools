import { useState } from 'react'
import { evaluateTrade } from '../../data/trade-rules'

const fmt = n => `$${(n / 1_000_000).toFixed(1)}M`
const fmtPrecise = n => {
  const m = n / 1_000_000
  if (Math.abs(m) < 0.1) return `$${(n / 1_000).toFixed(0)}K`
  return `$${m.toFixed(2)}M`
}

const EMPTY_TRADE = {
  otherTeam: '',
  jazzOut: [],   // [{ name, salary }]
  otherOut: [],  // [{ name, salary }]
}

export default function TradeBuilder({ state, dispatch, roster, computed }) {
  const [trade, setTrade] = useState({ ...EMPTY_TRADE })
  const [jazzInput, setJazzInput] = useState({ name: '', salary: '' })
  const [otherInput, setOtherInput] = useState({ name: '', salary: '' })

  function addJazzPlayer() {
    // Check if selecting from roster dropdown
    if (jazzInput.name) {
      const rosterPlayer = roster.find(p => p.name === jazzInput.name)
      const salary = rosterPlayer ? rosterPlayer.salary : (Number(jazzInput.salary) || 0) * 1_000_000
      setTrade(t => ({ ...t, jazzOut: [...t.jazzOut, { name: jazzInput.name, salary }] }))
      setJazzInput({ name: '', salary: '' })
    }
  }

  function addOtherPlayer() {
    if (otherInput.name && otherInput.salary) {
      setTrade(t => ({
        ...t,
        otherOut: [...t.otherOut, { name: otherInput.name, salary: Number(otherInput.salary) * 1_000_000 }],
      }))
      setOtherInput({ name: '', salary: '' })
    }
  }

  function removeJazzPlayer(idx) {
    setTrade(t => ({ ...t, jazzOut: t.jazzOut.filter((_, i) => i !== idx) }))
  }

  function removeOtherPlayer(idx) {
    setTrade(t => ({ ...t, otherOut: t.otherOut.filter((_, i) => i !== idx) }))
  }

  function saveTrade() {
    if (trade.jazzOut.length === 0 && trade.otherOut.length === 0) return
    dispatch({ type: 'ADD_TRADE', payload: trade })
    setTrade({ ...EMPTY_TRADE })
  }

  const jazzOutTotal = trade.jazzOut.reduce((s, p) => s + p.salary, 0)
  const otherOutTotal = trade.otherOut.reduce((s, p) => s + p.salary, 0)
  const hasTradePlayers = trade.jazzOut.length > 0 || trade.otherOut.length > 0
  const tradeResult = hasTradePlayers ? evaluateTrade(computed.totalPayroll, jazzOutTotal, otherOutTotal, trade.jazzOut.length) : null

  return (
    <div className="space-y-3">
      {/* Saved trades */}
      {state.trades.length > 0 && (
        <div className="rounded-xl px-4 py-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>
            Completed Trades
          </div>
          <div className="space-y-2">
            {state.trades.map(t => (
              <div key={t.id} className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs"
                style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)' }}>
                <div className="flex-1">
                  <span className="font-bold" style={{ color: 'var(--accent)' }}>UTA sends:</span>{' '}
                  <span style={{ color: 'var(--text)' }}>{t.jazzOut.map(p => `${p.name} (${fmt(p.salary)})`).join(', ') || 'Nothing'}</span>
                </div>
                <span style={{ color: 'var(--text-faint)' }}>↔</span>
                <div className="flex-1">
                  <span className="font-bold" style={{ color: 'var(--accent-2)' }}>Other sends:</span>{' '}
                  <span style={{ color: 'var(--text)' }}>{t.otherOut.map(p => `${p.name} (${fmt(p.salary)})`).join(', ') || 'Nothing'}</span>
                </div>
                <button
                  onClick={() => dispatch({ type: 'REMOVE_TRADE', id: t.id })}
                  className="text-xs font-bold btn-x"
                  style={{ color: '#dc2626', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trade builder */}
      <div className="rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
        <div className="grid grid-cols-1 sm:grid-cols-2" style={{ position: 'relative' }}>
          {/* Vertical divider (visible on sm+) */}
          <div className="hidden sm:block" style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', width: 1, background: 'var(--border)' }} />

          {/* Jazz side */}
          <div className="px-4 py-3">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--sch-black)' }}>
              Jazz Send Out
            </div>
            {trade.jazzOut.map((p, i) => (
              <div key={i} className="flex items-center justify-between mb-1 text-xs">
                <span style={{ color: 'var(--text)' }}>{p.name}</span>
                <span className="flex items-center gap-2">
                  <span className="tabular-nums" style={{ color: 'var(--text-muted)' }}>{fmt(p.salary)}</span>
                  <button className="btn-x" onClick={() => removeJazzPlayer(i)} style={{ color: '#dc2626', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 700 }}>×</button>
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-2">
              <select
                value={jazzInput.name}
                onChange={e => {
                  const player = roster.find(p => p.name === e.target.value)
                  setJazzInput({ name: e.target.value, salary: player ? (player.salary / 1_000_000).toFixed(1) : '' })
                }}
                className="px-2 rounded text-xs flex-1"
                style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', cursor: 'pointer', height: 32 }}
              >
                <option value="">Select player...</option>
                {roster.filter(p => !trade.jazzOut.some(o => o.name === p.name) && p.status !== 'traded for' && !p.status?.startsWith('signed')).map(p => (
                  <option key={p.name} value={p.name}>{p.name} ({fmt(p.salary)})</option>
                ))}
              </select>
              <button onClick={addJazzPlayer}
                className="text-[10px] font-bold px-4 rounded btn-teal"
                style={{ background: 'var(--sch-teal-bright)', color: 'var(--sch-black)', border: 'none', cursor: 'pointer', height: 32 }}>
                Add
              </button>
            </div>
            <div className="mt-2 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
              Total out: <span className="tabular-nums" style={{ color: 'var(--sch-black)' }}>{fmt(jazzOutTotal)}</span>
            </div>
          </div>

          {/* Other team side */}
          <div className="px-4 py-3 border-t sm:border-t-0" style={{ borderColor: 'var(--border)' }}>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--sch-black)' }}>
              Other Team/s Send Out
            </div>
            {trade.otherOut.map((p, i) => (
              <div key={i} className="flex items-center justify-between mb-1 text-xs">
                <span style={{ color: 'var(--text)' }}>{p.name}</span>
                <span className="flex items-center gap-2">
                  <span className="tabular-nums" style={{ color: 'var(--text-muted)' }}>{fmt(p.salary)}</span>
                  <button className="btn-x" onClick={() => removeOtherPlayer(i)} style={{ color: '#dc2626', cursor: 'pointer', background: 'none', border: 'none', fontWeight: 700 }}>×</button>
                </span>
              </div>
            ))}
            <div className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={otherInput.name}
                onChange={e => setOtherInput(p => ({ ...p, name: e.target.value }))}
                placeholder="Player name"
                className="px-2 rounded text-xs flex-1"
                style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', height: 32 }}
              />
              <input
                type="number"
                step="0.1"
                min="0"
                value={otherInput.salary}
                onChange={e => setOtherInput(p => ({ ...p, salary: e.target.value }))}
                placeholder="$M"
                className="px-2 rounded text-xs w-16"
                style={{ background: 'var(--bg-raised)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none', height: 32 }}
              />
              <button onClick={addOtherPlayer}
                className="text-[10px] font-bold px-4 rounded btn-teal"
                style={{ background: 'var(--sch-teal-bright)', color: 'var(--sch-black)', border: 'none', cursor: 'pointer', height: 32 }}>
                Add
              </button>
            </div>
            <div className="mt-2 text-xs font-bold" style={{ color: 'var(--text-muted)' }}>
              Total in: <span className="tabular-nums" style={{ color: 'var(--sch-black)' }}>{fmt(otherOutTotal)}</span>
            </div>
          </div>
        </div>

        {/* Save trade footer */}
        <div style={{ borderTop: '1px solid var(--border)' }} />
        <div className="px-4 py-3 space-y-2">
          {/* Row 1: Net salary + valid/invalid badge */}
          <div className="flex items-center justify-between">
            <div className="text-xs" style={{ color: 'var(--text-faint)' }}>
              Net salary: <span className="font-bold tabular-nums" style={{ color: 'var(--sch-black)' }}>
                {otherOutTotal - jazzOutTotal >= 0 ? '+' : ''}{fmt(otherOutTotal - jazzOutTotal)}
              </span>
            </div>
            {tradeResult && tradeResult.ruleLabel && (
              <span
                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                style={{
                  background: tradeResult.valid ? '#dcfce7' : '#fee2e2',
                  color: tradeResult.valid ? '#166534' : '#991b1b',
                }}
              >
                {tradeResult.valid ? 'Valid' : 'Invalid'}
              </span>
            )}
          </div>

          {/* Row 2: Rule label + max incoming */}
          {tradeResult && tradeResult.ruleLabel && (
            <div className="flex items-center justify-between text-[11px]">
              <span style={{ color: 'var(--text-muted)' }}>{tradeResult.ruleLabel}</span>
              <span className="tabular-nums" style={{ color: 'var(--text-muted)' }}>
                Max incoming: <span className="font-bold" style={{ color: 'var(--sch-black)' }}>{fmtPrecise(tradeResult.maxIncoming)}</span>
              </span>
            </div>
          )}

          {/* Invalid reason */}
          {tradeResult && !tradeResult.valid && tradeResult.ruleDetail && (
            <div className="text-[11px] px-2 py-1.5 rounded" style={{ background: '#fef2f2', color: '#991b1b' }}>
              {tradeResult.ruleDetail}
              {tradeResult.maxIncoming > 0 && otherOutTotal > tradeResult.maxIncoming && (
                <> Incoming salary exceeds max by <span className="font-bold">{fmtPrecise(otherOutTotal - tradeResult.maxIncoming)}</span>.</>
              )}
            </div>
          )}

          {/* Row 3: Progress bar — incoming vs. max capacity */}
          {tradeResult && tradeResult.maxIncoming > 0 && otherOutTotal > 0 && (
            <div>
              <div className="rounded-full overflow-hidden" style={{ height: 6, background: 'var(--bg-raised)' }}>
                <div
                  className="rounded-full"
                  style={{
                    height: '100%',
                    width: `${Math.min((otherOutTotal / tradeResult.maxIncoming) * 100, 100)}%`,
                    background: tradeResult.valid ? 'var(--sch-teal-bright)' : '#ef4444',
                    transition: 'width 0.2s, background 0.2s',
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] mt-0.5" style={{ color: 'var(--text-faint)' }}>
                <span className="tabular-nums">{fmtPrecise(otherOutTotal)} incoming</span>
                <span className="tabular-nums">{fmtPrecise(tradeResult.maxIncoming)} max</span>
              </div>
            </div>
          )}

          {/* Row 4: Save button */}
          <div className="flex justify-end">
            <button
              onClick={saveTrade}
              disabled={!hasTradePlayers}
              className={`text-xs font-bold px-4 py-2 rounded ${hasTradePlayers ? 'btn-teal' : ''}`}
              style={{
                background: hasTradePlayers ? 'var(--sch-teal-bright)' : 'var(--bg-raised)',
                color: hasTradePlayers ? 'var(--sch-black)' : 'var(--text-faint)',
                border: 'none',
                cursor: hasTradePlayers ? 'pointer' : 'default',
              }}
            >
              {hasTradePlayers && tradeResult && !tradeResult.valid && tradeResult.ruleLabel ? 'Save Trade (Invalid)' : 'Save Trade'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
