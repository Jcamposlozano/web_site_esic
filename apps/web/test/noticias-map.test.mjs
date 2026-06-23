/**
 * Test del contrato de transformación de noticias (build + navegador comparten
 * esta lógica). Corre con: pnpm test  (node --test, sin dependencias extra).
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { mapNoticias } from '../src/lib/noticias-map.mjs'

const sample = {
  noticias: [
    { id: '1', title: 'Vieja', slug: 'vieja', category: 'blog', status: 'published', publishedAt: '2026-01-01T00:00:00.000Z' },
    { id: '2', title: 'Nueva', slug: 'nueva', category: 'blog', status: 'published', publishedAt: '2026-06-01T00:00:00.000Z' },
    { id: '3', title: 'Borrador', slug: 'borrador', category: 'blog', status: 'draft', publishedAt: '2026-12-01T00:00:00.000Z' },
  ],
}

test('solo incluye noticias publicadas', () => {
  const posts = mapNoticias(sample)
  assert.equal(posts.length, 2)
  assert.ok(!posts.some((p) => p.slug === 'borrador'))
})

test('ordena por publishedAt descendente (más nueva primero)', () => {
  const posts = mapNoticias(sample)
  assert.deepEqual(posts.map((p) => p.slug), ['nueva', 'vieja'])
})

test('aplica defaults de author/coverAlt/seo', () => {
  const [post] = mapNoticias({
    noticias: [{ id: 'x', title: 'T', slug: 's', category: 'blog', status: 'published' }],
  })
  assert.equal(post.author, 'ESIC Medellín')
  assert.equal(post.coverAlt, 'T') // cae al título
  assert.equal(post.seo.metaTitle, 'T')
})

test('devuelve null si la forma no es { noticias: [...] }', () => {
  assert.equal(mapNoticias({}), null)
  assert.equal(mapNoticias({ noticias: 'nope' }), null)
})
