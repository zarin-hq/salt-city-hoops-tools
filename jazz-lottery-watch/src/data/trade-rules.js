import { CAP_NUMBERS } from './jazz-contracts'

/**
 * Evaluate whether a trade satisfies NBA CBA salary-matching rules (2023 CBA, 2024-25 onward).
 *
 * Tiers (over cap, below first apron):
 *   Outgoing ≤ $7.5M  → incoming ≤ 200% + $250K
 *   $7.5M < outgoing ≤ $29M → incoming ≤ outgoing + $7.5M
 *   Outgoing > $29M   → incoming ≤ 125% + $250K
 *
 * Above first apron: incoming ≤ 100% of outgoing (dollar-for-dollar)
 * Above second apron: same as first apron + cannot aggregate salaries
 *
 * @param {number} totalPayroll  Jazz current total payroll (before this trade)
 * @param {number} jazzOutTotal  Total salary Jazz sends out in this trade
 * @param {number} otherOutTotal Total salary Jazz receives (other team sends out)
 * @param {number} [jazzOutCount] Number of players Jazz sends out (for aggregation check)
 * @returns {{ valid: boolean, maxIncoming: number, ruleLabel: string, ruleDetail: string }}
 */
export function evaluateTrade(totalPayroll, jazzOutTotal, otherOutTotal, jazzOutCount = 1) {
  const { salaryCap, firstApron, secondApron } = CAP_NUMBERS

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
      const maxIncoming = capSpace + 250_000
      return {
        valid: otherOutTotal <= maxIncoming,
        maxIncoming,
        ruleLabel: 'Cap space absorption',
        ruleDetail: 'Can absorb up to available cap space + $250K.',
      }
    }
    // Under cap + sending salary: cap space + standard matching on the outgoing
    const standardMax = computeMatchingMax(jazzOutTotal)
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
    // Over the cap with no outgoing salary — cannot absorb
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
    // Above second apron: dollar-for-dollar + cannot aggregate salaries
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
    // Above first apron: dollar-for-dollar, can still aggregate
    const maxIncoming = jazzOutTotal
    return {
      valid: otherOutTotal <= maxIncoming,
      maxIncoming,
      ruleLabel: '100% match (above 1st apron)',
      ruleDetail: 'Above the first apron — dollar-for-dollar matching.',
    }
  }

  // Over cap, below first apron — tiered matching
  const maxIncoming = computeMatchingMax(jazzOutTotal)
  const ruleLabel = getTierLabel(jazzOutTotal)
  return {
    valid: otherOutTotal <= maxIncoming,
    maxIncoming,
    ruleLabel,
    ruleDetail: 'Over the cap, below first apron — tiered matching based on outgoing salary.',
  }
}

/**
 * Tiered matching for teams over the cap, below the first apron (2023 CBA).
 */
function computeMatchingMax(outgoing) {
  if (outgoing <= 7_500_000) return outgoing * 2.0 + 250_000
  if (outgoing <= 29_000_000) return outgoing + 7_500_000
  return outgoing * 1.25 + 250_000
}

function getTierLabel(outgoing) {
  if (outgoing <= 7_500_000) return '200% + $250K rule'
  if (outgoing <= 29_000_000) return 'Outgoing + $7.5M rule'
  return '125% + $250K rule'
}
