import { CAP_HOLDS } from '../../data/jazz-contracts'
import useIsMobile from '../../hooks/useIsMobile'

const fmt = n => `$${(n / 1_000_000).toFixed(1)}M`
const shortName = name => { const parts = (name || '').split(' '); return parts.length < 2 ? name : `${parts[0][0]}. ${parts.slice(1).join(' ')}` }
const headshotUrl = id => `https://a.espncdn.com/combiner/i?img=/i/headshots/nba/players/full/${id}.png&w=48&h=35`

function PlayerPhoto({ espnId, name, size = 28 }) {
  if (espnId) return <img src={headshotUrl(espnId)} alt="" className="rounded-full" style={{ width: size, height: size, objectFit: 'cover' }} />
  const initials = (name || '').split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="rounded-full flex items-center justify-center flex-shrink-0" style={{ width: size, height: size, background: 'var(--bg-raised)', color: 'var(--text-faint)', fontSize: size * 0.38, fontWeight: 700 }}>
      {initials}
    </div>
  )
}

function SegmentedControl({ value, options, onChange }) {
  return (
    <div className="inline-flex rounded overflow-hidden" style={{ border: '1px solid var(--border)' }}>
      {options.map(opt => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            onClick={() => { if (!active) onChange(opt.value) }}
            className={`text-[10px] font-bold uppercase px-2 py-0.5 cursor-pointer ${active ? '' : 'btn-secondary'}`}
            style={{
              background: active ? 'var(--sch-black)' : 'var(--bg-raised)',
              color: active ? 'white' : 'var(--text-muted)',
              border: 'none',
              borderRight: '1px solid var(--border)',
              transition: 'all 0.15s',
            }}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export default function CapHolds({ state, dispatch }) {
  const isMobile = useIsMobile()

  const totalCapHolds = CAP_HOLDS.reduce((sum, p) => {
    if (state.capHoldDecisions[p.name] === 'keep') {
      // Skip if re-signed as RFA (payroll counts actual salary instead)
      const rfaD = state.rfaDecisions?.[p.name]
      if (rfaD && rfaD.decision === 'resign') return sum
      return sum + p.capHold
    }
    return sum
  }, 0)

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full" style={{ borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--sch-black)' }}>
              <Th sticky>Player</Th>
              <Th align="center">Pos</Th>
              <Th align="right">Cap Hold</Th>
              <Th align="center">Rights</Th>
              <Th align="center">Decision</Th>
            </tr>
          </thead>
          <tbody>
            {CAP_HOLDS.map(p => {
              const kept = state.capHoldDecisions[p.name] === 'keep'
              return (
                <tr
                  key={p.name}
                  style={{ borderBottom: '1px solid var(--border)' }}
                  className="transition-colors"
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--sch-smoke)'
                    const sticky = e.currentTarget.querySelector('[data-sticky]')
                    if (sticky) sticky.style.background = 'var(--sch-smoke)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = ''
                    const sticky = e.currentTarget.querySelector('[data-sticky]')
                    if (sticky) sticky.style.background = 'var(--bg-card)'
                  }}
                >
                  <td data-sticky className="px-3 py-2.5 text-sm font-semibold whitespace-nowrap" style={{ color: 'var(--text)', position: 'sticky', left: 0, zIndex: 2, background: 'var(--bg-card)', boxShadow: '2px 0 4px rgba(0,0,0,0.06)', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    <div className="flex items-center gap-2">
                      <PlayerPhoto espnId={p.espnId} name={p.name} />
                      {isMobile ? shortName(p.name) : p.name}
                    </div>
                  </td>
                  <td className="px-3 py-2.5 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                    {p.position}
                  </td>
                  <td className="px-3 py-2.5 text-sm text-right tabular-nums font-semibold" style={{ color: kept ? 'var(--text)' : 'var(--text-faint)', textDecoration: kept ? 'none' : 'line-through' }}>
                    {fmt(p.capHold)}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                    {p.rights}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    <SegmentedControl
                      value={state.capHoldDecisions[p.name]}
                      options={[
                        { value: 'keep', label: 'Keep' },
                        { value: 'renounce', label: 'Renounce' },
                      ]}
                      onChange={() => dispatch({ type: 'TOGGLE_CAP_HOLD', player: p.name })}
                    />
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Total cap holds summary bar */}
      <div className="px-3 py-2.5 flex items-center justify-between" style={{ background: 'var(--bg-raised)', borderTop: '1px solid var(--border)' }}>
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
          Total Cap Holds
        </span>
        <span className="text-sm font-bold tabular-nums" style={{ color: totalCapHolds > 0 ? 'var(--accent)' : 'var(--text-faint)' }}>
          {fmt(totalCapHolds)}
        </span>
      </div>
    </div>
  )
}

function Th({ children, align = 'left', sticky }) {
  return (
    <th
      className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest whitespace-nowrap"
      style={{ color: 'rgba(255,255,255,0.7)', textAlign: align, ...(sticky ? { position: 'sticky', left: 0, zIndex: 3, background: 'var(--sch-black)' } : {}) }}
    >
      {children}
    </th>
  )
}
