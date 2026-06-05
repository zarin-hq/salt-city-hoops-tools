// Multi-year Jazz salary data (2026-27 through 2029-30)
// Source: HoopsHype, Spotrac
// Notes: TO = Team Option, PO = Player Option, QO = Qualifying Offer

export const SEASONS = ['2026-27', '2027-28', '2028-29', '2029-30']

export const CAP_PROJECTIONS = {
  '2026-27': { cap: 165_000_000, tax: 201_000_000, apron1: 209_000_000, apron2: 222_000_000 },
  '2027-28': { cap: 171_000_000, tax: 208_000_000, apron1: 216_000_000, apron2: 229_000_000 },
  '2028-29': { cap: 177_000_000, tax: 215_000_000, apron1: 223_000_000, apron2: 236_000_000 },
  '2029-30': { cap: 183_000_000, tax: 222_000_000, apron1: 230_000_000, apron2: 243_000_000 },
}

export const CONTRACTS = [
  {
    name: 'Jaren Jackson Jr.',
    espnId: '4277961',
    position: 'PF/C',
    salaries: {
      '2026-27': { amount: 49_000_000 },
      '2027-28': { amount: 50_500_000 },
      '2028-29': { amount: 52_000_000, note: 'PO' },
    },
  },
  {
    name: 'Lauri Markkanen',
    espnId: '4066336',
    position: 'PF',
    salaries: {
      '2026-27': { amount: 46_113_154 },
      '2027-28': { amount: 49_824_681 },
      '2028-29': { amount: 53_536_209 },
    },
  },
  {
    name: '2026 Pick #2',
    position: '—',
    isDraftPick: true,
    salaries: {
      '2026-27': { amount: 13_200_000 },
      '2027-28': { amount: 13_860_000 },
      '2028-29': { amount: 14_553_000, note: 'TO' },
      '2029-30': { amount: 15_281_000, note: 'TO' },
    },
  },
  {
    name: 'Ace Bailey',
    espnId: '4873138',
    position: 'SF/SG',
    salaries: {
      '2026-27': { amount: 9_522_960 },
      '2027-28': { amount: 9_976_560, note: 'TO' },
      '2028-29': { amount: 12_640_302, note: 'TO' },
    },
  },
  {
    name: 'Walker Kessler',
    espnId: '4433136',
    position: 'C',
    editable: true,
    salaries: {
      '2026-27': { amount: 7_064_703, note: 'QO' },
    },
  },
  {
    name: 'Keyonte George',
    espnId: '4433627',
    position: 'PG/SG',
    salaries: {
      '2026-27': { amount: 6_563_608 },
      '2027-28': { amount: 9_878_230, note: 'QO' },
    },
  },
  {
    name: 'John Konchar',
    espnId: '3134932',
    position: 'SG/SF',
    salaries: {
      '2026-27': { amount: 6_165_000 },
    },
  },
  {
    name: 'Cody Williams',
    espnId: '4895758',
    position: 'SF',
    salaries: {
      '2026-27': { amount: 6_015_600 },
      '2027-28': { amount: 7_669_890, note: 'TO' },
      '2028-29': { amount: 11_213_379, note: 'QO' },
    },
  },
  {
    name: 'Brice Sensabaugh',
    espnId: '5105839',
    position: 'SF',
    salaries: {
      '2026-27': { amount: 4_861_695 },
      '2027-28': { amount: 7_730_095, note: 'QO' },
    },
  },
  {
    name: 'Svi Mykhailiuk',
    espnId: '3133602',
    position: 'SG',
    salaries: {
      '2026-27': { amount: 3_850_000 },
      '2027-28': { amount: 4_025_000, note: 'TO' },
    },
  },
  {
    name: 'Kyle Filipowski',
    espnId: '4684793',
    position: 'C/PF',
    salaries: {
      '2026-27': { amount: 3_000_000 },
      '2027-28': { amount: 3_000_000, note: 'TO' },
    },
  },
  {
    name: 'Isaiah Collier',
    espnId: '4683766',
    position: 'PG',
    salaries: {
      '2026-27': { amount: 2_763_960 },
      '2027-28': { amount: 4_988_948, note: 'TO' },
      '2028-29': { amount: 7_982_316, note: 'QO' },
    },
  },
  {
    name: 'Bez Mbeng',
    espnId: null,
    position: 'SF',
    salaries: {
      '2026-27': { amount: 2_150_917, note: 'TO' },
    },
  },
  {
    name: 'Hayden Gray',
    espnId: null,
    position: 'SG',
    salaries: {
      '2026-27': { amount: 2_150_917, note: 'TO' },
    },
  },
]
