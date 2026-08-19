# CLAUDE.md

Guía para Claude Code (claude.ai/code) en este repositorio.

## Este repo ES esic.co

**Todo cambio que deba salir publicado se hace aquí.** El sitio es una app Astro
que se construye a `apps/web/dist` y se sube a S3.

Comprobado el 14/08/2026: las 44 páginas de esic.co se sirven desde este build
(home, pregrado, master, quienes-somos, contacto, alianzas, campus, open-day,
curso-claude, becas, executive, equipo, blog, DJE). **No queda nada en WordPress
ni en Elementor.**

### ⚠️ No confundir con `esic-redesign-react`

En `~/Downloads/Programacion/` existe otro repo, `esic-redesign-react`, con HTML
suelto para pegar en widgets de Elementor. **Es legado: sus cambios NO llegan a
esic.co.** Si te piden tocar el sitio y estás ahí, estás en el repo equivocado.

Señal rápida: si editas un `*-elementor.html`, no estás publicando nada.

## Arquitectura

- **Astro + islas de React** (`client:load` para lo interactivo)
- **Tailwind** con clases arbitrarias (`text-[clamp(...)]`)
- `apps/web/src/pages/` — una página por ruta
- `apps/web/src/components/` — `home/`, `pages/<seccion>/`, `sections/`

### Assets: S3, nunca locales

Los estáticos NO se sirven desde el repo. Van a S3 y se referencian con el helper:

```ts
import { asset } from "../lib/assets";
asset("home/banner/pregrados-desktop.webp")
// -> https://prisma-fai-admin.s3.us-east-2.amazonaws.com/src/esic-website/assets/...
```

Flujo para un asset nuevo:

1. Déjalo en `_subir-al-bucket/assets/<ruta>` (se versiona en git, videos incluidos)
2. Súbelo a S3 bajo `src/esic-website/assets/<ruta>`
3. Refiérelo con `asset("<ruta>")`

Convención de banners del home: `home/banner/<nombre>-{desktop,mobile}.webp`,
en 2560x1168 (desktop) y 1638x2560 (mobile).

## Despliegue

Son **dos destinos distintos**; subir uno sin el otro deja el sitio a medias:

| Qué | A dónde |
|---|---|
| `apps/web/dist` | bucket `esic-web-site` |
| `_subir-al-bucket/assets/` | `prisma-fai-admin/src/esic-website/assets/` |

Después hay que invalidar CloudFront.

## Verificación local

No hay dev server en el flujo habitual: se sirve una copia del build.

```bash
cd apps/web && ./node_modules/.bin/astro build
mkdir -p /tmp/esic-preview && rsync -a --delete apps/web/dist/ /tmp/esic-preview/
```

(`rsync` y no `rm -rf` + `cp`: el server hace `chdir` a `/tmp/esic-preview`, así
que borrar la carpeta lo deja sirviendo un inode muerto y todo responde vacío.)

Luego `preview_start` con la config `esic-dist` de `.claude/launch.json`
(sirve `/tmp/esic-preview` en el puerto 4321).

Los assets aún no subidos a S3 dan 403 en local. Para verificarlos, cópialos a
`/tmp/esic-preview/localassets/` y reescribe la URL de S3 en el HTML/JS del
build. En local también salen errores de CORS al pedir `noticias.json` a S3:
son esperables y no ocurren en producción.

## Formularios Zoho

- El general (`SolicitarInformacinFormulariogeneral110226`) vive en
  `components/ContactForm.astro` y lo usan 13 páginas: un error ahí afecta a
  casi todo el sitio.
- **`Dropdown2` es el campo único de "programa de interés"** para todos los tipos
  de programa. `Dropdown4` ya no existe en la automatización: si lo usas, el lead
  llega sin programa.
- Los sub-selects condicionales comparten `name="Dropdown2"` y los inactivos van
  `disabled`, para que se envíe un único valor.
- `Dropdown` (tipo de programa): `Pregrado`, `Máster`, `Programa Ejecutivo`,
  `Formaciones empresariales`, `Level Up`, `Open Day`.
- `Dropdown3` (medio de contacto): `WhatsApp`, `Correo`, `Llamada`.
- **No usar `zf_ValidateAndSubmit`**: la validación es HTML5 (`required`).
- UTM ocultos autollenados desde la URL: `utm_source`, `utm_medium`,
  `utm_campaign`, `utm_term`, `utm_content`, `utm_adset_name`, `utm_ad_name`.
- Política de privacidad: `/politicas-de-privacidad/` con `target="_blank"`.

Los formularios por programa (Beca, Corporate, Máster, Pregrado) tienen cada uno
su `formperma` propio. Antes de tocar campos, contrástalos con el ZIP oficial de
Zoho: un `formperma` cruzado manda los leads al embudo equivocado.

## Reglas de diseño

- **Solapamiento de secciones**: cada `<section>` lleva `-mt-[50px]` +
  `rounded-t-[50px]` y un `z-index` que incrementa. Al insertar una sección en
  medio hay que recorrer los `z-index` siguientes o el solapamiento se rompe.
- **Sin emojis**: solo SVG inline (lineales, con stroke).
- Imágenes sobre fondo oscuro llevan overlay negro para contraste.
- Máximo 2 CTAs por bloque.

### Tipografía y color

- Display: `Sofia Sans Extra Condensed` (800) · Texto: `DM Sans`
- `--brand-blue: #0047E9` · `--brand-blue-dark: #00133F` ·
  `--brand-teal: #0AE4C3` · `--brand-orange: #FF9600` · `--bg: #F8F6F2`
- Por área: Pregrado = naranja, Máster = teal, Executive = azul

## Contexto de negocio

ESIC es una **escuela de negocios, NO una universidad**. "Universidad" solo al
referirse a CEIPA como *universidad aliada*.

## Git

- Rama local `master`, remoto `origin/main` → `git push origin master:main`
- Commits frecuentes, uno por cambio
- Nunca incluir atribución de Claude en commits ni PRs
