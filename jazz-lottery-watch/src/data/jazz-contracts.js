// Jazz 2026-27 salary data (post-JJJ trade)
// Sources: Spotrac, Basketball-Reference, SalarySwish

export const CAP_NUMBERS = {
  salaryCap: 165_000_000,
  luxuryTax: 201_000_000,
  firstApron: 209_000_000,
  secondApron: 222_000_000,
  mle: 15_048_000,
  mleHardCapThreshold: 6_065_000,
  minRosterSize: 12,
  // Trade matching thresholds (2026-27, indexed to cap)
  tradeTier1: 8_874_000,    // outgoing ≤ this → 200% + $250K
  tradeTier2: 35_496_000,   // outgoing ≤ this → outgoing + tier1 + $250K
}

// Vet minimum salary by years of experience (2026-27)
export const VET_MIN_SCALE = [
  1_366_314,  // 0
  2_198_879,  // 1
  2_464_849,  // 2
  2_553_508,  // 3
  2_642_165,  // 4
  2_863_807,  // 5
  3_085_455,  // 6
  3_307_099,  // 7
  3_528_745,  // 8
  3_546_312,  // 9
  3_900_945,  // 10+
]

export function getVetMin(yearsExp) {
  const idx = Math.min(Math.max(yearsExp || 0, 0), 10)
  return VET_MIN_SCALE[idx]
}

export const GUARANTEED = [
  { name: 'Jaren Jackson Jr.', espnId: '4277961', position: 'PF/C', salary: 49_000_000, note: 'Guaranteed (extension)' },
  { name: 'Lauri Markkanen',   espnId: '4066336', position: 'PF',   salary: 46_113_154, note: 'Guaranteed' },
  { name: 'Ace Bailey',        espnId: '4873138', position: 'SF/SG',salary: 9_473_080,  note: 'Rookie scale (2025 pick)' },
  { name: 'John Konchar',      espnId: '3134932', position: 'SG/SF',salary: 6_165_000,  note: 'Guaranteed' },
  { name: 'Cody Williams',     espnId: '4895758', position: 'SF',   salary: 6_015_600,  note: 'Guaranteed (rookie scale)' },
  { name: 'Brice Sensabaugh',  espnId: '5105839', position: 'SF',   salary: 4_862_237,  note: 'Guaranteed (rookie scale)' },
  { name: 'Isaiah Collier',    espnId: '4683766', position: 'PG',   salary: 2_763_960,  note: 'Guaranteed (rookie scale)' },
  { name: 'Keyonte George',    espnId: '4433627', position: 'PG/SG',salary: 6_600_000,  note: 'Guaranteed (team option exercised)' },
]

export const NON_GUARANTEED = [
  { name: 'Svi Mykhailiuk',    espnId: '3133602', position: 'SG',  salary: 3_850_000,  faType: 'UFA', note: 'Non-guaranteed, becomes UFA if waived', deadline: 'Jun 30' },
  { name: 'Kyle Filipowski',   espnId: '4684793', position: 'C/PF',salary: 3_000_000,  faType: 'RFA', note: 'Non-guaranteed, becomes RFA if waived', deadline: 'Jun 30' },
]

export const CAP_HOLDS = [
  { name: 'Jusuf Nurkic',    espnId: '3102530', position: 'C',  age: 32, capHold: 29_062_500, qo: null,      rights: 'Bird',            maxSalary: 58_100_000 },
  { name: 'Walker Kessler',  espnId: '4433136', position: 'C',  age: 25, capHold: 14_636_814, qo: 7_064_702, rights: 'Restricted Bird',  maxSalary: 41_500_000 },
  { name: 'Kevin Love',      espnId: '3449',    position: 'C',  age: 38, capHold: 7_885_000,  qo: null,      rights: 'Bird',            maxSalary: 58_100_000 },
  { name: 'Oscar Tshiebwe',  espnId: '4433218', position: 'PF', age: 27, capHold: 2_198_879,  qo: 2_198_879, rights: 'Two-Way',         maxSalary: 14_000_000 },
  { name: 'Elijah Harkless', espnId: '4397449', position: 'PG', age: 26, capHold: 2_198_879,  qo: 2_198_879, rights: 'Two-Way',         maxSalary: 14_000_000 },
]

export const RFA_DECISIONS = []

export const TEAM_OPTIONS = []

export const EXPIRING = [
  { name: 'Jusuf Nurkic',    espnId: '3102530', position: 'C',    faType: 'UFA', note: 'Contract expires', yearsExp: 12 },
  { name: 'Kevin Love',      espnId: '3449', position: 'PF',   faType: 'UFA', note: 'Contract expires', yearsExp: 18 },
  { name: 'Collin Sexton',   espnId: '4277811', position: 'PG/SG',faType: 'UFA', note: 'No longer on roster', yearsExp: 8 },
  { name: 'Jordan Clarkson', espnId: '2528426', position: 'SG/PG',faType: 'UFA', note: 'No longer on roster', yearsExp: 12 },
  { name: 'Mo Bamba',        espnId: '4277919', position: 'C',    faType: 'UFA', note: 'Expiring', yearsExp: 8 },
]
