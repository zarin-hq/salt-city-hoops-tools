import { CAP_NUMBERS } from './jazz-contracts'

/**
 * NBA CBA trade salary-matching rules (2023 CBA, 2024-25 onward).
 *
 * Thresholds are indexed to the salary cap. Base amounts from 2023-24
 * ($136,021,000 cap) scale proportionally each year:
 *   Base tier 1:  $7,500,000  → ~5.51% of cap
 *   Base tier 2:  $29,000,000 → ~21.32% of cap
 *   Base flat add: $250,000   → ~0.184% of cap
 *
 * Tiers (over cap, below first apron):
 *   Outgoing ≤ tier1  → incoming ≤ 200% + flatAdd
 *   tier1 < outgoing ≤ tier2 → incoming ≤ outgoing + tier1
 *   Outgoing > tier2  → incoming ≤ 125% + flatAdd
 *
 * Above first apron: incoming ≤ 100% of outgoing (dollar-for-dollar)
 * Above second apron: same + cannot aggregate salaries
 */

const BASE_CAP = 136_021_000 // 2023-24 salary cap (CBA base year)

function indexedAmounts(currentCap) {
  const scale = currentCap / BASE_CAP
  return {
    tier1:   Math.round(7_500_000 * scale),   // ~$9.15M for 2026-27
    tier2:   Math.round(29_000_000 * scale),   // ~$35.39M for 2026-27
    flatAdd: Math.round(250_000 * scale),      // ~$305K for 2026-27
  }
}

/**
 * @param {number} totalPayroll  Jazz current total payroll (before this trade)
 * @param {number} jazzOutTotal  Total salary Jazz sends out in this trade
 * @param {number} otherOutTotal Total salary Jazz receives (other team sends out)
 * @param {number} [jazzOutCount] Number of players Jazz sends out (for aggregation check)
 * @returns {{ valid: boolean, maxIncoming: number, ruleLabel: string, ruleDetail: string }}
 */
export function evaluateTrade(totalPayroll, jazzOutTotal, otherOutTotal, jazzOutCount = 1) {
  const { salaryCap, firstApron, secondApron } = CAP_NUMBERS
  const idx = indexedAmounts(salaryCap)

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
      // Pure absorption into cap space (+ indexed room TPE)
      const maxIncoming = capSpace + idx.flatAdd
      return {
        valid: otherOutTotal <= maxIncoming,
        maxIncoming,
        ruleLabel: 'Cap space absorption',
        ruleDetail: `Can absorb up to available cap space + ${fmtK(idx.flatAdd)}.`,
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
  if (outgoing <= tier2) return outgoing + tier1
  return outgoing * 1.25 + flatAdd
}

function getTierLabel(outgoing, { tier1, tier2, flatAdd }) {
  const t1 = fmtM(tier1)
  const fa = fmtK(flatAdd)
  if (outgoing <= tier1) return `200% + ${fa} rule`
  if (outgoing <= tier2) return `Outgoing + ${t1} rule`
  return `125% + ${fa} rule`
}

function fmtM(n) { return `$${(n / 1_000_000).toFixed(1)}M` }
function fmtK(n) { return n >= 1_000_000 ? fmtM(n) : `$${(n / 1_000).toFixed(0)}K` }
