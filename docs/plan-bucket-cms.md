# Plan: Noticias ESIC vía Bucket S3 (reemplazo de Payload)

> Estado: esquema aprobado. Pendiente de implementar.
> Última actualización: 2026-06-16

## Idea en simple

El **bucket S3 es la bodega central**: ahí viven las noticias y sus imágenes.

1. **Admin** (`admin_prisma`): alguien crea una noticia en un formulario. El admin arma el
   objeto JSON de esa noticia y *por ahora solo lo muestra en consola*. **La subida al
   bucket la hará Jonathan** (fuera de este alcance).
2. **Bodega (S3)**: todas las noticias viven en un **único archivo** `noticias.json`. Las
   imágenes van sueltas en el bucket.
3. **Site** (`apps/web`, Astro): al construirse, **lee `noticias.json` desde S3**, filtra las
   publicadas y arma el blog. Las portadas salen directo de la URL pública de S3.

En una frase: **el admin escribe en la bodega, el site lee de la bodega.** La bodega
reemplaza al CMS viejo (Payload).

## Infra confirmada

- **Bucket:** `prisma-fai-admin` · región `us-east-2` · prefijo base `src/`
- **GET de objetos:** público ✅ · **LIST:** denegado ❌
- **Admin:** `admin_prisma` (Angular 21 + Material + Cognito OIDC), branch `develop`
- **Site:** `apps/web` (Astro). **Reemplaza a Payload.** Todo depende de S3, **nada self-contained**.

## Estructura en el bucket

```
src/esic-website/
 ├── noticias.json          ← ÚNICO archivo con todas las noticias
 └── imagenes/
      └── <slug>-<archivo>   ← portadas (servidas por URL pública directa)
```

## Contrato JSON

`src/esic-website/noticias.json`:

```json
{
  "noticias": [
    {
      "id": "uuid",
      "slug": "aprender-a-decidir",
      "title": "…",
      "category": "blog",
      "status": "published",
      "author": "ESIC Medellín",
      "excerpt": "…",
      "publishedAt": "2026-05-19T15:00:00.000Z",
      "externalUrl": null,
      "coverUrl": "https://prisma-fai-admin.s3.us-east-2.amazonaws.com/src/esic-website/imagenes/…",
      "coverAlt": "…",
      "bodyHtml": "<p>…</p>",
      "seo": { "metaTitle": "…", "metaDescription": "…" }
    }
  ]
}
```

Mismo contrato lo produce el formulario del admin → un solo contrato de punta a punta.
El cuerpo (`bodyHtml`) se mapea 1:1 a lo que el site ya renderiza (`set:html`), por lo que
`/blog` y `/blog/[slug]` **no cambian**.

## ① SITE — lee de S3 (sin self-contained)

Cambios en `apps/web`:

1. `scripts/sync-bucket.mjs` (reemplaza la lógica de `sync-cms.mjs`):
   - GET `…/src/esic-website/noticias.json`.
   - Filtra `status === "published"`, ordena por `publishedAt` desc → escribe `src/data/posts.json`.
   - **Sin fallback**: si S3 falla, el build falla (son builds reales).
   - **Portadas NO se descargan**: se usa `coverUrl` (URL pública S3 directa).
2. `package.json`: `predev`/`prebuild` → `sync-bucket.mjs`. Se quita la dependencia de Payload.
3. `/blog` y `/blog/[slug]`: **sin cambios**.
4. Payload (`apps/cms`): se desconecta del build; se elimina en commit de limpieza tras validar.
5. Demo: subir a mano `noticias.json` (1-2 noticias) + imágenes al bucket y verificar `/blog`.

## ② PORTAL ADMIN — componente "ESIC CMS" (solo genera JSON)

Cambios en `admin_prisma` (Angular):

1. Nueva página/ruta `cms/noticias` + ítem en sidebar.
2. Componente standalone `EsicCmsNoticia` con formulario reactivo:
   - Campos: `título`, `slug` (auto, editable), `categoría`, `autor`, `excerpt`,
     `publishedAt`, `externalUrl` (opcional), **portada** (file input + preview),
     **cuerpo (editor rich text → `bodyHtml`)**, `seo.metaTitle`, `seo.metaDescription`.
   - `onSubmit`: arma el objeto del contrato y `console.log(JSON.stringify(noticia, null, 2))`.
   - **Sin subida**: nada de S3/backend. La portada solo se previsualiza.
3. **La subida la hará Jonathan** (insertar el objeto en el array de `noticias.json`).

## Decisiones tomadas

- Noticias en **un único** `noticias.json` (no una ficha por noticia).
- Cuerpo: **editor rich text → HTML**.
- Site **siempre depende de S3** (sin copia local, sin fallback). Portadas por URL pública S3.
- La escritura al bucket NO está en este alcance (la hace Jonathan).

## Siguiente fase (después)

Remapear **todos los assets del sitio** (imágenes, logos, etc.) para que se consuman desde S3
y no desde el build. Se hará un inventario de `public/` y un mapa de assets en el bucket.
