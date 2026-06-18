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

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WEB_ROOT = path.resolve(__dirname, '..')
const NOTICIAS_URL =
  process.env.NOTICIAS_URL ||
  'https://prisma-fai-admin.s3.us-east-2.amazonaws.com/src/esic-website/noticias.json'
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

  const noticias = Array.isArray(json && json.noticias) ? json.noticias : null
  if (!noticias) {
    console.error('[sync-bucket] La fuente no tiene la forma { "noticias": [ ... ] }.')
    process.exit(1)
  }

  const posts = noticias
    .filter((n) => n.status === 'published')
    .sort((a, b) => {
      const ta = a.publishedAt ? Date.parse(a.publishedAt) : 0
      const tb = b.publishedAt ? Date.parse(b.publishedAt) : 0
      return tb - ta
    })
    .map((n) => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      category: n.category,
      author: n.author || 'ESIC Medellín',
      excerpt: n.excerpt || '',
      publishedAt: n.publishedAt || null,
      externalUrl: n.externalUrl || null,
      coverUrl: n.coverUrl || null,
      coverAlt: n.coverAlt || n.title,
      bodyHtml: n.bodyHtml || '',
      seo: {
        metaTitle: (n.seo && n.seo.metaTitle) || n.title,
        metaDescription: (n.seo && n.seo.metaDescription) || n.excerpt || '',
      },
    }))

  await fs.mkdir(path.dirname(OUT_JSON), { recursive: true })
  await fs.writeFile(OUT_JSON, JSON.stringify(posts, null, 2) + '\n')
  console.log(`[sync-bucket] ${posts.length} noticias → ${path.relative(WEB_ROOT, OUT_JSON)} (portadas servidas por URL S3)`)
}

main()
