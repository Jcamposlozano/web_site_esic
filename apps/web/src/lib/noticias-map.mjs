/**
 * noticias-map.mjs — Lógica COMPARTIDA de transformación de noticias.
 *
 * Una única fuente de verdad para convertir el JSON crudo del bucket
 * ({ "noticias": [ ... ] }) en la lista de posts que consume el sitio.
 *
 * Se usa en dos lados (por eso es .mjs sin APIs de Node):
 *   - Build:     scripts/sync-bucket.mjs  → genera src/data/posts.json
 *   - Navegador: src/lib/noticias-client.ts → refresca el contenido en vivo
 *
 * El sitio depende SIEMPRE de S3 (sin fallback local).
 */

/** URL pública del JSON de noticias en S3 (sobrescribible por NOTICIAS_URL en build). */
export const NOTICIAS_URL =
  'https://prisma-fai-admin.s3.us-east-2.amazonaws.com/src/esic-website/noticias.json'

/**
 * Transforma el JSON crudo del bucket en la lista de posts publicados,
 * ordenados por fecha desc. Devuelve null si la forma no es la esperada.
 * @param {{ noticias?: unknown }} json
 * @returns {Array<object> | null}
 */
export function mapNoticias(json) {
  const noticias = Array.isArray(json && json.noticias) ? json.noticias : null
  if (!noticias) return null

  return noticias
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
}

/** Formatea una fecha ISO a es-CO (igual que la versión de build). */
export function formatDate(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return ''
  }
}

/** Destino de la tarjeta: enlace externo (podcast) o página propia. */
export function postHref(p) {
  return p.externalUrl ?? `/blog/${p.slug}/`
}
