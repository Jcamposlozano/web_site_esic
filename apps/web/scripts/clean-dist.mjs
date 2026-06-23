/**
 * clean-dist.mjs — corre en `postbuild`.
 *
 * Quita de dist/ las carpetas de medios pesados (images, videos): NO deben
 * subir con el sitio porque se sirven SIEMPRE desde S3 por URL pública
 * (ver src/lib/assets.ts). Astro copia todo lo de public/ a dist/, así que
 * aquí las eliminamos del artefacto final. Las copias locales en public/
 * quedan intactas (son solo de referencia / para subir al bucket).
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.resolve(__dirname, '..', 'dist')
const REMOVE = ['images', 'videos']

for (const dir of REMOVE) {
  const target = path.join(DIST, dir)
  try {
    await fs.rm(target, { recursive: true, force: true })
    console.log(`[clean-dist] eliminado dist/${dir} (se sirve desde S3)`)
  } catch (err) {
    console.warn(`[clean-dist] no pude eliminar dist/${dir}: ${err.message}`)
  }
}
