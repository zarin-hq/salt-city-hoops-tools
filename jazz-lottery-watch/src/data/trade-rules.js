import { CAP_NUMBERS } from './jazz-contracts'

/**
 * Evaluate whether a trade satisfies NBA CBA salary-matching rules (2023 CBA).
 *
 * @param {number} totalPayroll  Jazz current total payroll (before this trade)
 * @param {number} jazzOutTotal  Total salary Jazz sends out in this trade
 * @param {number} otherOutTotal Total salary Jazz receives (other team sends out)
 * @returns {{ valid: boolean, maxIncoming: number, ruleLabel: string, ruleDetail: string }}
 */
export function evaluateTrade(totalPayroll, jazzOutTotal, otherOutTotal) {
  const { salaryCap, firstApron } = CAP_NUMBERS

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
      // Pure absorption into cap space
      const maxIncoming = capSpace
      return {
        valid: otherOutTotal <= maxIncoming,
        maxIncoming,
        ruleLabel: 'Cap space absorption',
        ruleDetail: `Can absorb up to available cap space.`,
      }
    }
    // Under cap + sending salary: cap space + standard matching on the overage
    const standardMax = computeMatchingMax(jazzOutTotal)
    const maxIncoming = capSpace + standardMax
    return {
      valid: otherOutTotal <= maxIncoming,
      maxIncoming,
      ruleLabel: 'Cap space + matching',
      ruleDetail: `Cap space plus standard matching on outgoing salary.`,
    }
  }

  // Over the cap — salary matching tiers apply
  if (jazzOutTotal === 0) {
    // Over the cap with no outgoing salary — cannot absorb
    return {
      valid: false,
      maxIncoming: 0,
      ruleLabel: 'No cap space',
      ruleDetail: 'Over the cap with no outgoing salary — cannot take on salary.',
    }
  }

  const aboveFirstApron = totalPayroll > firstApron

  if (aboveFirstApron) {
    // Above first apron: flat 110% + $100K
    const maxIncoming = jazzOutTotal * 1.10 + 100_000
    return {
      valid: otherOutTotal <= maxIncoming,
      maxIncoming,
      ruleLabel: '110% + $100K (above apron)',
      ruleDetail: 'Above the first apron — flat 110% + $100K rule applies.',
    }
  }

  // Over cap, below first apron — tiered matching
  const maxIncoming = computeMatchingMax(jazzOutTotal)
  const ruleLabel = getTierLabel(jazzOutTotal)
  return {
    valid: otherOutTotal <= maxIncoming,
    maxIncoming,
    ruleLabel,
    ruleDetail: `Over the cap, below first apron — tiered matching based on outgoing salary.`,
  }
}

function computeMatchingMax(outgoing) {
  if (outgoing <= 7_500_000) return outgoing * 1.75 + 100_000
  if (outgoing <= 29_000_000) return outgoing * 1.25 + 100_000
  return outgoing * 1.10 + 100_000
}

function getTierLabel(outgoing) {
  if (outgoing <= 7_500_000) return '175% + $100K rule'
  if (outgoing <= 29_000_000) return '125% + $100K rule'
  return '110% + $100K rule'
}
