import { CAP_NUMBERS } from './jazz-contracts'

/**
 * NBA CBA trade salary-matching rules (2023 CBA, 2024-25 onward).
 *
 * Tier thresholds are indexed to the salary cap (stored in CAP_NUMBERS).
 * The $250,000 flat add is NOT indexed — it stays $250K every year.
 *
 * Tiers (over cap, below first apron):
 *   Outgoing ≤ $8,874,000  → incoming ≤ 200% + $250K
 *   $8,874,001–$35,496,000 → incoming ≤ outgoing + $9,124,000
 *   Over $35,496,000       → incoming ≤ 125% + $250K
 *
 * Above first apron: incoming ≤ 100% of outgoing (dollar-for-dollar)
 * Above second apron: same + cannot aggregate salaries
 */

const FLAT_ADD = 250_000 // $250K — never indexed

/**
 * @param {number} totalPayroll  Jazz current total payroll (before this trade)
 * @param {number} jazzOutTotal  Total salary Jazz sends out in this trade
 * @param {number} otherOutTotal Total salary Jazz receives (other team sends out)
 * @param {number} [jazzOutCount] Number of players Jazz sends out (for aggregation check)
 * @returns {{ valid: boolean, maxIncoming: number, ruleLabel: string, ruleDetail: string }}
 */
export function evaluateTrade(totalPayroll, jazzOutTotal, otherOutTotal, jazzOutCount = 1) {
  const { salaryCap, firstApron, secondApron, tradeTier1, tradeTier2 } = CAP_NUMBERS
  const idx = { tier1: tradeTier1, tier2: tradeTier2, flatAdd: FLAT_ADD }

  // Nothing happening — no validation needed
  if (jazzOutTotal === 0 && otherOutTotal === 0) {
    return { valid: true, maxIncoming: 0, ruleLabel: '', ruleDetail: '' }
  }

  // Jazz sends salary out but receives nothing — always valid
  if (otherOutTotal === 0) {
    return { valid: true, maxIncoming: 0, ruleLabel: 'No incoming salary', ruleDetail: 'Salary dump — always valid.' }
  }

  const capSpace = salaryCap - totalPayroll

  // Under the salary cap — can absorb into available cap space
  if (capSpace > 0) {
    if (jazzOutTotal === 0) {
      // Pure absorption into cap space (+ $250K room TPE)
      const maxIncoming = capSpace + FLAT_ADD
      return {
        valid: otherOutTotal <= maxIncoming,
        maxIncoming,
        ruleLabel: 'Cap space absorption',
        ruleDetail: `Can absorb up to available cap space + $250K.`,
      }
    }
    // Under cap + sending salary: cap space + standard matching on the outgoing
    const standardMax = computeMatchingMax(jazzOutTotal, idx)
    const maxIncoming = capSpace + standardMax
    return {
      valid: otherOutTotal <= maxIncoming,
      maxIncoming,
      ruleLabel: 'Cap space + matching',
      ruleDetail: 'Cap space plus standard matching on outgoing salary.',
    }
  }

  // Over the cap — salary matching rules apply
  if (jazzOutTotal === 0) {
    return {
      valid: false,
      maxIncoming: 0,
      ruleLabel: 'No cap space',
      ruleDetail: 'Over the cap with no outgoing salary — cannot take on salary.',
    }
  }

  const aboveSecondApron = totalPayroll > secondApron
  const aboveFirstApron = totalPayroll > firstApron

  if (aboveSecondApron) {
    const maxIncoming = jazzOutTotal
    const aggregationWarning = jazzOutCount > 1
      ? ' Cannot aggregate multiple player salaries above the second apron.'
      : ''
    return {
      valid: otherOutTotal <= maxIncoming && !(jazzOutCount > 1),
      maxIncoming: jazzOutCount > 1 ? 0 : maxIncoming,
      ruleLabel: '100% match (above 2nd apron)',
      ruleDetail: `Above the second apron — dollar-for-dollar matching, no aggregation allowed.${aggregationWarning}`,
    }
  }

  if (aboveFirstApron) {
    const maxIncoming = jazzOutTotal
    return {
      valid: otherOutTotal <= maxIncoming,
      maxIncoming,
      ruleLabel: '100% match (above 1st apron)',
      ruleDetail: 'Above the first apron — dollar-for-dollar matching.',
    }
  }

  // Over cap, below first apron — tiered matching (indexed thresholds)
  const maxIncoming = computeMatchingMax(jazzOutTotal, idx)
  const ruleLabel = getTierLabel(jazzOutTotal, idx)
  return {
    valid: otherOutTotal <= maxIncoming,
    maxIncoming,
    ruleLabel,
    ruleDetail: 'Over the cap, below first apron — tiered matching based on outgoing salary.',
  }
}

function computeMatchingMax(outgoing, { tier1, tier2, flatAdd }) {
  if (outgoing <= tier1) return outgoing * 2.0 + flatAdd
  if (outgoing <= tier2) return outgoing + tier1 + flatAdd
  return outgoing * 1.25 + flatAdd
}

function getTierLabel(outgoing, { tier1, tier2, flatAdd }) {
  const add = fmtM(tier1 + flatAdd)
  if (outgoing <= tier1) return `200% + $250K rule`
  if (outgoing <= tier2) return `Outgoing + ${add} rule`
  return `125% + $250K rule`
}

function fmtM(n) { return `$${(n / 1_000_000).toFixed(1)}M` }
function fmtK(n) { return n >= 1_000_000 ? fmtM(n) : `$${(n / 1_000).toFixed(0)}K` }
