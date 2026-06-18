# Deploy del sitio ESIC — S3 + CDN

> Estado: **listo para desplegar, pendiente de confirmar el bucket y el CDN.**
> Los valores marcados como `PLACEHOLDER` los completa **Jonathan** con sus credenciales.

El sitio es **Astro estático**: `pnpm build` genera `dist/` (sin adaptador de hosting).
Ese `dist/` se sube a un **bucket S3** (origen) servido por un **CDN** delante.

## Arquitectura

```
Build (dist/)  ──►  S3 bucket (origen)  ──►  CDN (CloudFront o Cloudflare)  ──►  esic.co
                    público / website                 caché + TLS + DNS
```

> El admin portal y el backend usan **AWS (CloudFront)**; por coherencia, CloudFront es
> la opción primaria. Si finalmente se usa **Cloudflare**, el único cambio es el DNS y
> el comando de purga de caché (ambos contemplados en `scripts/deploy.sh`).

## Precondición OBLIGATORIA (antes del primer deploy)

Subir a S3 (bucket `prisma-fai-admin`) con **lectura pública**:
- `src/esic-website/noticias.json`
- `src/esic-website/imagenes/...` (portadas)
- `src/esic-website/assets/...` (todos los assets del sitio)

> Todo está preparado en `~/Downloads/esic-website/` (ver su `LEER.txt`).
> Verifica: `curl -o /dev/null -w "%{http_code}\n" https://prisma-fai-admin.s3.us-east-2.amazonaws.com/src/esic-website/noticias.json` → debe dar **200**.
> Si da 403, el build **falla a propósito** (el sitio depende siempre de S3, sin fallback).

## 1. Crear el bucket del sitio (PLACEHOLDER)

- Nombre: `PLACEHOLDER-esic-co-web` (por confirmar) · Región: `us-east-2`.
- **Opción A — S3 Static Website Hosting (simple):**
  - Activar *Static website hosting*. Index document: `index.html`. Error document: `404.html`.
  - Bucket policy de lectura pública (`s3:GetObject` a `*`).
- **Opción B — Bucket privado + CloudFront (recomendado AWS):**
  - Bucket privado, acceso por **OAC** (Origin Access Control) desde CloudFront.

## 2. CDN

### CloudFront (primario)
- Origen: el bucket (OAC) o el endpoint de website hosting.
- Default root object: `index.html`. Redirigir HTTP→HTTPS.
- Certificado ACM para `esic.co` (en `us-east-1`).
- Guardar el **Distribution ID** en `.env.deploy` (`CLOUDFRONT_DISTRIBUTION_ID`).

### Cloudflare (alternativa)
- DNS de `esic.co` en Cloudflare; registro **apex** con *CNAME flattening* al endpoint
  del bucket/website, modo **proxied** (naranja).
- Regla de caché para HTML corta y assets larga.
- Guardar `CLOUDFLARE_ZONE_ID` + `CLOUDFLARE_API_TOKEN` en `.env.deploy`.

## 3. DNS — esic.co (apex)

- Apuntar el apex `esic.co` al CDN (CloudFront: registro ALIAS/A en Route53, o el que
  use el DNS actual; Cloudflare: CNAME flattening del apex).
- (Opcional) redirigir `www.esic.co` → `esic.co`.

## 4. Desplegar

```bash
cd apps/web
cp .env.deploy.example .env.deploy   # completa S3_BUCKET, región y el CDN
pnpm build                            # genera dist/ (lee noticias.json de S3)
pnpm deploy                           # aws s3 sync dist/ + purga de caché del CDN
```

`scripts/deploy.sh`:
- Sube assets con hash con caché inmutable de 1 año.
- Sube HTML/sitemap sin caché (cambios visibles al instante).
- Purga CloudFront **o** Cloudflare según lo configurado (ignora placeholders).

## Notas

- `apps/web/.env.deploy` está en `.gitignore` (no commitear credenciales/infra).
- Se quitó el adaptador `@astrojs/vercel`; el sitio ya **no** depende de Vercel.
- URLs limpias: build en formato `directory` (`/pagina/index.html`), compatible con el
  index document de S3 website hosting.
