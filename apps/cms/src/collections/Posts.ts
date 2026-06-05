import type { CollectionConfig } from 'payload'
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html'

const slugify = (str: string): string =>
  str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quita acentos
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '')

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Post',
    plural: 'Posts',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'publishedAt'],
    group: 'Contenido',
  },
  access: {
    // Lectura pública: el sitio Astro consume el REST. El filtro de "published"
    // lo aplica Astro en la query, así los borradores no entran al build de prod.
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Título',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug (URL)',
      unique: true,
      index: true,
      admin: {
        position: 'sidebar',
        description: 'Se genera del título si lo dejas vacío.',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return slugify(value)
            if (data?.title) return slugify(data.title)
            return value
          },
        ],
      },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Categoría',
      required: true,
      defaultValue: 'blog',
      options: [
        { label: 'Blog', value: 'blog' },
        { label: 'Podcast', value: 'podcast' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'status',
      type: 'select',
      label: 'Estado',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Borrador', value: 'draft' },
        { label: 'Publicado', value: 'published' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Fecha de publicación',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
    {
      name: 'author',
      type: 'text',
      label: 'Autor',
    },
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Resumen / bajada',
      admin: { description: 'Texto corto para la tarjeta y el SEO.' },
    },
    {
      name: 'coverImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Portada',
    },
    {
      name: 'externalUrl',
      type: 'text',
      label: 'URL externa (opcional)',
      admin: {
        description:
          'Para podcasts u otros enlaces externos (ej. YouTube). Si se llena, la tarjeta apunta aquí en vez de a la página de detalle.',
      },
    },
    {
      name: 'body',
      type: 'richText',
      label: 'Contenido',
    },
    {
      name: 'seo',
      type: 'group',
      label: 'SEO',
      fields: [
        { name: 'metaTitle', type: 'text', label: 'Meta título' },
        { name: 'metaDescription', type: 'textarea', label: 'Meta descripción' },
      ],
    },
  ],
  hooks: {
    afterRead: [
      ({ doc }) => {
        // Genera HTML del rich-text para que Astro lo renderice directo.
        if (doc && doc.body) {
          try {
            doc.bodyHtml = convertLexicalToHTML({ data: doc.body })
          } catch {
            doc.bodyHtml = ''
          }
        } else if (doc) {
          doc.bodyHtml = ''
        }
        return doc
      },
    ],
  },
}
