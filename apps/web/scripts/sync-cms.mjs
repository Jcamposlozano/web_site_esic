/**
 * sync-cms.mjs — trae los posts publicados de Payload a un JSON local + descarga
 * las portadas a public/cms-media/. Corre en `prebuild` (y manual con `pnpm sync:cms`).
 *
 * Hace el sitio estático self-contained: si Payload está caído, conserva el JSON
 * existente (el build no se rompe).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const WEB_ROOT = path.resolve(__dirname, '..')
const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:3000'
const OUT_JSON = path.join(WEB_ROOT, 'src/data/posts.json')
const MEDIA_DIR = path.join(WEB_ROOT, 'public/cms-media')

async function main() {
  const endpoint = `${PAYLOAD_URL}/api/posts?where[status][equals]=published&limit=200&depth=1&sort=-publishedAt`
  let json
  try {
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(8000) })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    json = await res.json()
  } catch (err) {
    console.warn(`[sync-cms] Payload no disponible (${PAYLOAD_URL}): ${err.message}`)
    try {
      await fs.access(OUT_JSON)
      console.warn('[sync-cms] Uso el posts.json existente. Build continúa.')
      return
    } catch {
      console.warn('[sync-cms] No hay posts.json previo → genero lista vacía.')
      await fs.mkdir(path.dirname(OUT_JSON), { recursive: true })
      await fs.writeFile(OUT_JSON, '[]\n')
      return
    }
  }

  await fs.mkdir(MEDIA_DIR, { recursive: true })
  await fs.mkdir(path.dirname(OUT_JSON), { recursive: true })

  const posts = []
  for (const p of json.docs) {
    let coverUrl = null
    const cover = p.coverImage
    if (cover && cover.url) {
      const filename = cover.filename || path.basename(cover.url)
      const localName = `${p.slug}-${filename}`.replace(/[^a-zA-Z0-9._-]/g, '-')
      try {
        const imgRes = await fetch(`${PAYLOAD_URL}${cover.url}`, { signal: AbortSignal.timeout(8000) })
        if (imgRes.ok) {
          const buf = Buffer.from(await imgRes.arrayBuffer())
          await fs.writeFile(path.join(MEDIA_DIR, localName), buf)
          coverUrl = `/cms-media/${localName}`
        }
      } catch (e) {
        console.warn(`[sync-cms] No pude bajar portada de ${p.slug}: ${e.message}`)
      }
    }

    posts.push({
      id: p.id,
      title: p.title,
      slug: p.slug,
      category: p.category,
      author: p.author || 'ESIC Medellín',
      excerpt: p.excerpt || '',
      publishedAt: p.publishedAt || null,
      externalUrl: p.externalUrl || null,
      coverUrl,
      coverAlt: (cover && cover.alt) || p.title,
      bodyHtml: p.bodyHtml || '',
      seo: {
        metaTitle: (p.seo && p.seo.metaTitle) || p.title,
        metaDescription: (p.seo && p.seo.metaDescription) || p.excerpt || '',
      },
    })
  }

  await fs.writeFile(OUT_JSON, JSON.stringify(posts, null, 2) + '\n')
  console.log(`[sync-cms] ${posts.length} posts → ${path.relative(WEB_ROOT, OUT_JSON)} (portadas en public/cms-media/)`)
}

main()
