import { useReducer, useEffect, useMemo } from 'react'
import { CAP_NUMBERS, GUARANTEED, NON_GUARANTEED, RFA_DECISIONS, TEAM_OPTIONS, CAP_HOLDS, VET_MIN_SCALE } from '../data/jazz-contracts'

// Vet minimum contracts only count ~$2.46M against the cap (2-year min)
// regardless of the player's actual experience-based minimum salary.
const VET_MIN_CAP_HIT = VET_MIN_SCALE[2] // $2,464,849
const VET_MIN_MAX = VET_MIN_SCALE[10]     // $3,900,945 (10+ years)
const vetMinCapHit = salary => (salary > 0 && salary <= VET_MIN_MAX) ? VET_MIN_CAP_HIT : salary

const STORAGE_KEY = 'jazz-fa-sim'

// Default state
function defaultState() {
  // Non-guaranteed: all kept by default
  const nonGuaranteedDecisions = {}
  NON_GUARANTEED.forEach(p => { nonGuaranteedDecisions[p.name] = 'keep' })

  // Team options: all exercised by default
  const teamOptionDecisions = {}
  TEAM_OPTIONS.forEach(p => { teamOptionDecisions[p.name] = 'exercise' })

  // RFA re-sign decisions: default to don't sign
  const rfaDecisions = {}
  RFA_DECISIONS.forEach(p => { rfaDecisions[p.name] = { decision: 'dont_sign', salary: 0 } })

  // Cap hold decisions: default to keep (retain Bird rights)
  const capHoldDecisions = {}
  CAP_HOLDS.forEach(p => { capHoldDecisions[p.name] = 'keep' })

  // Bird rights signings: default unsigned
  const birdRightsDecisions = {}
  CAP_HOLDS.forEach(p => { birdRightsDecisions[p.name] = { decision: 'unsigned', salary: 0 } })

  return {
    nonGuaranteedDecisions,   // { playerName: 'keep' | 'waive' }
    teamOptionDecisions,      // { playerName: 'exercise' | 'decline' }
    rfaDecisions,             // { playerName: { decision: 'resign' | 'dont_sign', salary: number } }
    capHoldDecisions,         // { playerName: 'keep' | 'renounce' }
    birdRightsDecisions,      // { playerName: { decision: 'sign' | 'unsigned', salary: number } }
    draftPick: null,          // { pick: number, name: string, salary: number }
    signedFAs: [],            // [{ name, position, salary, signingType: 'mle'|'vet_min'|'custom', age?, team?, type? }]
    trades: [],               // [{ id, jazzOut: [...], otherTeam: string, otherOut: [...] }]
    depthChart: {             // { PG: [name,name,name], SG: [...], SF: [...], PF: [...], C: [...] }
      PG: [null, null, null],
      SG: [null, null, null],
      SF: [null, null, null],
      PF: [null, null, null],
      C:  [null, null, null],
    },
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      // Merge with defaults to handle newly added fields
      const defaults = defaultState()
      return { ...defaults, ...parsed }
    }
  } catch { /* ignore parse errors */ }
  return defaultState()
}

function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_NON_GUARANTEED': {
      const current = state.nonGuaranteedDecisions[action.player]
      return {
        ...state,
        nonGuaranteedDecisions: {
          ...state.nonGuaranteedDecisions,
          [action.player]: current === 'keep' ? 'waive' : 'keep',
        },
      }
    }
    case 'TOGGLE_TEAM_OPTION': {
      const current = state.teamOptionDecisions[action.player]
      return {
        ...state,
        teamOptionDecisions: {
          ...state.teamOptionDecisions,
          [action.player]: current === 'exercise' ? 'decline' : 'exercise',
        },
      }
    }
    case 'TOGGLE_CAP_HOLD': {
      const current = state.capHoldDecisions[action.player]
      const next = current === 'keep' ? 'renounce' : 'keep'
      const newState = {
        ...state,
        capHoldDecisions: {
          ...state.capHoldDecisions,
          [action.player]: next,
        },
      }
      // Renouncing clears any bird rights signing
      if (next === 'renounce') {
        newState.birdRightsDecisions = {
          ...state.birdRightsDecisions,
          [action.player]: { decision: 'unsigned', salary: 0 },
        }
      }
      return newState
    }
    case 'SET_BIRD_RIGHTS': {
      const newState = {
        ...state,
        birdRightsDecisions: {
          ...state.birdRightsDecisions,
          [action.player]: { decision: action.decision, salary: action.salary || 0 },
        },
      }
      return newState
    }
    case 'SET_RFA_DECISION':
      return {
        ...state,
        rfaDecisions: {
          ...state.rfaDecisions,
          [action.player]: { decision: action.decision, salary: action.salary || 0 },
        },
      }
    case 'SET_DRAFT_PICK':
      return { ...state, draftPick: action.payload }
    case 'SIGN_FA':
      return { ...state, signedFAs: [...state.signedFAs, action.payload] }
    case 'REMOVE_FA':
      return { ...state, signedFAs: state.signedFAs.filter((_, i) => i !== action.index) }
    case 'ADD_TRADE':
      return { ...state, trades: [...state.trades, { ...action.payload, id: Date.now() }] }
    case 'REMOVE_TRADE':
      return { ...state, trades: state.trades.filter(t => t.id !== action.id) }
    case 'UPDATE_DEPTH_CHART':
      return { ...state, depthChart: action.payload }
    case 'RESET':
      return defaultState()
    default:
      return state
  }
}

export default function useSimState() {
  const [state, dispatch] = useReducer(reducer, null, loadState)

  // Persist to localStorage on every state change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  // Compute derived values
  const computed = useMemo(() => {
    // Guaranteed contracts always count
    let totalPayroll = GUARANTEED.reduce((sum, p) => sum + p.salary, 0)

    // Non-guaranteed: add if kept
    NON_GUARANTEED.forEach(p => {
      if (state.nonGuaranteedDecisions[p.name] === 'keep') {
        totalPayroll += p.salary
      }
    })

    // Team options: add if exercised
    TEAM_OPTIONS.forEach(p => {
      if (state.teamOptionDecisions[p.name] === 'exercise') {
        totalPayroll += p.salary
      }
    })

    // Cap holds: add if kept and not re-signed as RFA (avoid double-counting)
    CAP_HOLDS.forEach(p => {
      if (state.capHoldDecisions[p.name] === 'keep') {
        const rfaD = state.rfaDecisions?.[p.name]
        const reSignedAsRFA = rfaD && rfaD.decision === 'resign'
        if (!reSignedAsRFA) {
          const brD = state.birdRightsDecisions?.[p.name]
          if (brD && brD.decision === 'sign') {
            totalPayroll += vetMinCapHit(brD.salary) // Vet min contracts count at 2-year min
          } else {
            totalPayroll += p.capHold
          }
        }
      }
    })

    // RFA re-signs: add custom salary if re-signed
    RFA_DECISIONS.forEach(p => {
      const d = state.rfaDecisions?.[p.name]
      if (d && d.decision === 'resign') {
        totalPayroll += d.salary
      }
    })

    // Draft pick salary (placeholder $8M if none selected)
    totalPayroll += state.draftPick ? state.draftPick.salary : 8_000_000

    // Signed free agents (vet min contracts count at 2-year min cap hit)
    state.signedFAs.forEach(fa => {
      totalPayroll += fa.signingType === 'vet_min' ? VET_MIN_CAP_HIT : fa.salary
    })

    // Trades: subtract outgoing, add incoming
    state.trades.forEach(trade => {
      trade.jazzOut.forEach(p => { totalPayroll -= (p.salary || 0) })
      trade.otherOut.forEach(p => { totalPayroll += (p.salary || 0) })
    })

    // Count roster spots (before cap/tax so we can apply incomplete roster charges)
    let rosterCount = GUARANTEED.length
    NON_GUARANTEED.forEach(p => {
      if (state.nonGuaranteedDecisions[p.name] === 'keep') rosterCount++
    })
    TEAM_OPTIONS.forEach(p => {
      if (state.teamOptionDecisions[p.name] === 'exercise') rosterCount++
    })
    RFA_DECISIONS.forEach(p => {
      const d = state.rfaDecisions?.[p.name]
      if (d && d.decision === 'resign') rosterCount++
    })
    // Cap holds: count kept players not already counted via RFA re-sign
    CAP_HOLDS.forEach(p => {
      if (state.capHoldDecisions[p.name] === 'keep') {
        const rfaD = state.rfaDecisions?.[p.name]
        if (!rfaD || rfaD.decision !== 'resign') rosterCount++
      }
    })
    rosterCount++ // Draft pick (selected or placeholder)
    rosterCount += state.signedFAs.length
    // Adjust for trades
    state.trades.forEach(trade => {
      rosterCount -= trade.jazzOut.filter(p => p.name).length
      rosterCount += trade.otherOut.filter(p => p.name).length
    })

    // Incomplete roster charge: each empty spot below 12 = rookie minimum cap hold
    const emptyRosterHolds = Math.max(0, CAP_NUMBERS.minRosterSize - rosterCount)
    const rosterHoldTotal = emptyRosterHolds * VET_MIN_SCALE[0]
    totalPayroll += rosterHoldTotal

    const capSpace = CAP_NUMBERS.salaryCap - totalPayroll
    const taxSpace = CAP_NUMBERS.luxuryTax - totalPayroll

    // Hard cap logic
    const totalMLE = state.signedFAs
      .filter(fa => fa.signingType === 'mle')
      .reduce((sum, fa) => sum + fa.salary, 0)

    const hardCapTriggers = []

    // MLE triggers
    if (totalMLE > 0) {
      hardCapTriggers.push({ level: 'secondApron', reason: 'MLE used' })
    }
    if (totalMLE > CAP_NUMBERS.mleHardCapThreshold) {
      hardCapTriggers.push({ level: 'firstApron', reason: 'MLE exceeds $6M' })
    }

    // Trade triggers
    state.trades.forEach(trade => {
      const tradeJazzOut = trade.jazzOut.reduce((s, p) => s + (p.salary || 0), 0)
      const tradeOtherOut = trade.otherOut.reduce((s, p) => s + (p.salary || 0), 0)
      if (tradeOtherOut > tradeJazzOut) {
        hardCapTriggers.push({ level: 'firstApron', reason: 'Trade increased salary' })
      }
      if (trade.jazzOut.length > 1 && trade.otherOut.length > 0) {
        hardCapTriggers.push({ level: 'secondApron', reason: 'Salary aggregation in trade' })
      }
    })

    // Effective hard cap = lowest triggered cap
    let hardCap = null
    if (hardCapTriggers.some(t => t.level === 'firstApron')) {
      hardCap = CAP_NUMBERS.firstApron
    } else if (hardCapTriggers.some(t => t.level === 'secondApron')) {
      hardCap = CAP_NUMBERS.secondApron
    }

    return { totalPayroll, capSpace, taxSpace, rosterCount, emptyRosterHolds, rosterHoldTotal, totalMLE, hardCap, hardCapTriggers }
  }, [state])

  // Build roster list (all players currently on the team)
  const roster = useMemo(() => {
    const players = []

    GUARANTEED.forEach(p => players.push({ ...p, status: 'guaranteed' }))

    NON_GUARANTEED.forEach(p => {
      if (state.nonGuaranteedDecisions[p.name] === 'keep') {
        players.push({ ...p, status: 'non-guaranteed (kept)' })
      }
    })

    TEAM_OPTIONS.forEach(p => {
      if (state.teamOptionDecisions[p.name] === 'exercise') {
        players.push({ ...p, status: 'team option (exercised)' })
      }
    })

    RFA_DECISIONS.forEach(p => {
      const d = state.rfaDecisions?.[p.name]
      if (d && d.decision === 'resign') {
        players.push({ ...p, salary: d.salary, status: 're-signed (RFA)' })
      }
    })

    // Cap holds: add kept players not already on roster via RFA re-sign
    CAP_HOLDS.forEach(p => {
      if (state.capHoldDecisions[p.name] === 'keep') {
        const rfaD = state.rfaDecisions?.[p.name]
        if (!rfaD || rfaD.decision !== 'resign') {
          const brD = state.birdRightsDecisions?.[p.name]
          if (brD && brD.decision === 'sign') {
            players.push({ ...p, salary: vetMinCapHit(brD.salary), status: 'signed (Bird Rights)' })
          } else {
            players.push({ ...p, salary: p.capHold, status: 'cap hold' })
          }
        }
      }
    })

    if (state.draftPick) {
      players.push({
        name: state.draftPick.name || `2026 Pick #${state.draftPick.pick}`,
        position: '-',
        salary: state.draftPick.salary,
        status: 'draft pick',
        photo: state.draftPick.photo,
      })
    } else {
      players.push({
        name: '2026 1st Round Pick',
        position: '-',
        salary: 8_000_000,
        status: 'draft pick (est.)',
      })
    }

    state.signedFAs.forEach(fa => {
      players.push({
        ...fa,
        status: `signed (${fa.signingType === 'mle' ? 'MLE' : fa.signingType === 'vet_min' ? 'Vet Min' : 'Custom'})`,
      })
    })

    // Trades: remove outgoing, add incoming
    const tradedOut = new Set()
    state.trades.forEach(trade => {
      trade.jazzOut.forEach(p => { if (p.name) tradedOut.add(p.name) })
      trade.otherOut.forEach(p => {
        if (p.name) players.push({ name: p.name, position: '-', salary: p.salary || 0, status: 'traded for' })
      })
    })

    return players.filter(p => !tradedOut.has(p.name))
  }, [state])

  // Waived players that become free agents
  const waivedPlayers = useMemo(() => {
    const waived = []
    NON_GUARANTEED.forEach(p => {
      if (state.nonGuaranteedDecisions[p.name] === 'waive') {
        waived.push(p)
      }
    })
    TEAM_OPTIONS.forEach(p => {
      if (state.teamOptionDecisions[p.name] === 'decline') {
        waived.push(p)
      }
    })
    RFA_DECISIONS.forEach(p => {
      const d = state.rfaDecisions?.[p.name]
      if (!d || d.decision === 'dont_sign') {
        waived.push({ ...p, salary: p.qualifyingOffer })
      }
    })
    return waived
  }, [state])

  return { state, dispatch, computed, roster, waivedPlayers }
}
