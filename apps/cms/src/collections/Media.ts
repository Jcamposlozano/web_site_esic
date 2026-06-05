import type { CollectionConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Contenido',
  },
  access: {
    // Lectura pública (el sitio Astro consume las imágenes).
    read: () => true,
  },
  upload: {
    // Almacenamiento en disco local (demo). En AWS se cambia por @payloadcms/storage-s3.
    staticDir: path.resolve(dirname, '../../media'),
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'card', width: 768, height: 432, position: 'centre' },
      { name: 'thumbnail', width: 400, height: 225, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Texto alternativo',
    },
  ],
}
