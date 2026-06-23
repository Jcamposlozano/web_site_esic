/**
 * sync-bucket.mjs — trae las noticias publicadas desde S3 (un único JSON) a
 * src/data/posts.json. Corre en `predev`/`prebuild` (y manual con `pnpm sync:bucket`).
 *
 * El site depende SIEMPRE de S3: si la fuente falla, el proceso termina con
 * error (exit 1). Sin fallback, sin descargar portadas (se sirven por URL
 * pública directa de S3).
 *
 * Fuente: NOTICIAS_URL (default S3). Soporta http(s):// y file:// (para tests).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { mapNoticias, NOTICIAS_URL as DEFAULT_NOTICIAS_URL } from '../src/lib/noticias-map.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WEB_ROOT = path.resolve(__dirname, '..')
const NOTICIAS_URL = process.env.NOTICIAS_URL || DEFAULT_NOTICIAS_URL
const OUT_JSON = path.join(WEB_ROOT, 'src/data/posts.json')

async function fetchSource(url) {
  if (url.startsWith('file://')) {
    const filePath = fileURLToPath(url)
    const raw = await fs.readFile(filePath, 'utf8')
    return JSON.parse(raw)
  }
  const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

async function main() {
  let json
  try {
    json = await fetchSource(NOTICIAS_URL)
  } catch (err) {
    console.error(`[sync-bucket] No pude leer la fuente de noticias (${NOTICIAS_URL}): ${err.message}`)
    process.exit(1)
  }

  const posts = mapNoticias(json)
  if (!posts) {
    console.error('[sync-bucket] La fuente no tiene la forma { "noticias": [ ... ] }.')
    process.exit(1)
  }

  await fs.mkdir(path.dirname(OUT_JSON), { recursive: true })
  await fs.writeFile(OUT_JSON, JSON.stringify(posts, null, 2) + '\n')
  console.log(`[sync-bucket] ${posts.length} noticias → ${path.relative(WEB_ROOT, OUT_JSON)} (portadas servidas por URL S3)`)
}

main()
