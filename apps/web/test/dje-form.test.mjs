/**
 * Contrato del formulario del Desafío Junior Empresarial contra el export
 * oficial de Zoho (test/fixtures/zoho-dje-2026-2.html, el ZIP que envió
 * Wisdots para el DJE 2026-2).
 *
 * Si la landing apunta al form del desafío de HATSU, los leads entran al CRM
 * con la campaña del desafío anterior. Corre con: pnpm test
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const landing = readFileSync(new URL('../src/pages/desafio-junior-empresarial.astro', import.meta.url), 'utf8')
const oficial = readFileSync(new URL('./fixtures/zoho-dje-2026-2.html', import.meta.url), 'utf8')

const ACTION_OFICIAL = oficial.match(/<form[^>]*action=['"]([^'"]+)['"]/)[1]

/**
 * Campos que Zoho espera; los name= son el contrato con la automatización.
 * El lookbehind evita colar el compname= del export oficial.
 */
const nombresDeCampo = (html) =>
  new Set([...html.matchAll(/(?<![a-zA-Z])name=['"]([^'"]+)['"]/g)].map((m) => m[1]).filter((n) => n !== 'form'))

/** Valores de un <select> concreto, sin el placeholder. */
const opciones = (html, campo) => {
  const bloque = html.match(new RegExp(`<select[^>]*name=['"]${campo}['"][^>]*>([\\s\\S]*?)</select>`))
  assert.ok(bloque, `no se encontró el select ${campo}`)
  return [...bloque[1].matchAll(/<option[^>]*value=['"]([^'"]*)['"]/g)]
    .map((m) => m[1])
    .filter((v) => v !== '' && v !== '-Select-')
}

test('la landing envía al form de Zoho del DJE, no al de HATSU', () => {
  const action = landing.match(/const FORM_ACTION =\s*\n?\s*['"]([^'"]+)['"]/)[1]
  assert.equal(action, ACTION_OFICIAL)
  assert.ok(!/HATSU/i.test(action), 'el formperma de HATSU marca los leads con la campaña equivocada')
})

test('todos los campos del export oficial existen en la landing', () => {
  const enLanding = nombresDeCampo(landing)
  for (const campo of nombresDeCampo(oficial)) {
    assert.ok(enLanding.has(campo), `falta el campo ${campo} en la landing`)
  }
})

for (const campo of ['Dropdown', 'Dropdown1', 'Dropdown2']) {
  test(`las opciones de ${campo} coinciden con las del form de Zoho`, () => {
    assert.deepEqual(opciones(landing, campo), opciones(oficial, campo))
  })
}
