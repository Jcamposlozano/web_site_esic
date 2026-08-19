/**
 * Coherencia de la edición abierta del Level Up con Claude.
 *
 * La landing alterna entre dos modos —inscripción con pago y lista de espera
 * (SOLD OUT)— y la última vez quedó a medias: el CTA seguía diciendo "separa
 * tu cupo" con el redirect apuntando a la lista de espera. Este test cuida que
 * las fechas y el modo activo no se desincronicen. Corre con: pnpm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const landing = readFileSync(new URL('../src/pages/curso-claude.astro', import.meta.url), 'utf8')
const espera = readFileSync(new URL('../src/pages/curso-claude/lista-de-espera.astro', import.meta.url), 'utf8')

/** Fechas de la edición vigente, en el formato corto de la agenda. */
const FECHAS = ['17 OCT', '24 OCT', '31 OCT']

/** El copy que ve la gente: los comentarios del código sí pueden hablar del SOLD OUT. */
const copy = (src) => src.replace(/\/\*[\s\S]*?\*\//g, '')

test('las 3 sesiones tienen las fechas de la edición vigente', () => {
  const fechas = [...landing.matchAll(/^\s*date: "([^"]+)",$/gm)].map((m) => m[1])
  assert.deepEqual(fechas, FECHAS)
})

test('la barra de datos del hero muestra esas mismas fechas', () => {
  const stat = landing.match(/\{ label: "Fechas", a: "([^"]+)", b: "([^"]+)" \}/)
  assert.ok(stat, 'no se encontró el stat de Fechas')
  const texto = `${stat[1]} ${stat[2]}`
  for (const fecha of FECHAS) {
    const dia = fecha.split(' ')[0]
    assert.ok(texto.includes(dia), `falta el ${dia} en la barra del hero: "${texto}"`)
  }
})

test('el sello de fechas del hero dice lo mismo que la agenda', () => {
  const sello = landing.match(/cc-hero-fechas[\s\S]*?<\/div>/)
  assert.ok(sello, 'no se encontró el sello de fechas del hero')
  for (const fecha of FECHAS) {
    const [dia, mes] = fecha.split(' ')
    assert.ok(sello[0].includes(dia), `falta el ${dia} en el sello del hero`)
    assert.ok(sello[0].includes(mes), `el sello del hero no dice ${mes}`)
  }
})

test('con el pago activo no quedan restos de la lista de espera', () => {
  const pagoActivo = /zf_redirect_url" value=\{WOMPI_URL\}/.test(landing)
  assert.ok(pagoActivo, 'el formulario ya no redirige a Wompi: ¿quedó en modo lista de espera?')
  assert.ok(!/sold ?out/i.test(copy(landing)), 'quedó copy de SOLD OUT con el pago activo')
  assert.ok(!/agotad/i.test(copy(landing)), 'quedó copy de cupos agotados con el pago activo')
})

test('la página de lista de espera no contradice a la landing', () => {
  assert.ok(!/agotad/i.test(copy(espera)), 'sigue diciendo que la edición está agotada')
  assert.ok(espera.includes('/curso-claude/#inscripcion'), 'no manda a separar cupo')
})
