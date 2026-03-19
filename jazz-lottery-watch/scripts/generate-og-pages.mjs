import { readFileSync, mkdirSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const dist = resolve(__dirname, '..', 'dist')
const BASE = 'https://tools.saltcityhoops.com'

const template = readFileSync(resolve(dist, 'index.html'), 'utf-8')

const routes = {
  'lottery-watch': {
    title: 'Jazz Lottery Watch | Salt City Hoops',
    description: 'Utah Jazz lottery odds, standings, and draft pick tracker',
    image: `${BASE}/og-image.png`,
  },
  'draft-guide': {
    title: '2026 Draft Guide | Salt City Hoops',
    description: 'Scouting reports and prospect profiles for the 2026 NBA Draft',
    image: `${BASE}/og-draft-guide.png`,
  },
  'free-agency-simulator': {
    title: 'Free Agency Simulator | Salt City Hoops',
    description: 'Simulate Utah Jazz free agency moves and build your ideal roster',
    image: `${BASE}/og-free-agency.png`,
  },
  'draft-history': {
    title: 'Draft History | Salt City Hoops',
    description: 'Complete history of Utah Jazz draft picks',
    image: `${BASE}/og-image.png`,
  },
}

for (const [route, og] of Object.entries(routes)) {
  let html = template
    .replace(/<title>[^<]*<\/title>/, `<title>${og.title}</title>`)
    .replace(/content="[^"]*"(?=\s*\/>[\s\S]*?<!--\s*\/OpenGraph)/, `content="${og.title}"`)
  html = html.replace(
    /(<meta\s+property="og:title"\s+content=")[^"]*"/,
    `$1${og.title}"`
  )
  html = html.replace(
    /(<meta\s+property="og:description"\s+content=")[^"]*"/,
    `$1${og.description}"`
  )
  html = html.replace(
    /(<meta\s+property="og:image"\s+content=")[^"]*"/,
    `$1${og.image}"`
  )
  html = html.replace(
    /(<meta\s+property="og:url"\s+content=")[^"]*"/,
    `$1${BASE}/${route}"`
  )
  html = html.replace(
    /(<meta\s+name="twitter:image"\s+content=")[^"]*"/,
    `$1${og.image}"`
  )

  const dir = resolve(dist, route)
  mkdirSync(dir, { recursive: true })
  writeFileSync(resolve(dir, 'index.html'), html)
  console.log(`✓ dist/${route}/index.html`)
}
