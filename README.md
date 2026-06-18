# esic-react-app

Migration of ESIC Medellin website from WordPress + Elementor to Astro 5 + React.

## Structure

```
apps/
  web/      Astro 6 + React 19 frontend (estático)
packages/
  shared/   Shared TypeScript types (planned)
```

## Development

```bash
pnpm install

# Sitio (apps/web)
pnpm dev                      # http://localhost:4321
```

## Blog / Noticias

El blog (`/blog`, `/blog/[slug]` y la sección Rethink del home) se alimenta de un
único JSON en S3
(`https://prisma-fai-admin.s3.us-east-2.amazonaws.com/src/esic-website/noticias.json`).
En `predev`/`prebuild`, `apps/web/scripts/sync-bucket.mjs` trae las noticias
publicadas a `src/data/posts.json`. Las portadas se sirven por URL pública directa
de S3 (no se descargan al build). El site depende siempre de S3: si la fuente
falla, el build termina con error (sin fallback).

## Related directories

- `../esic-redesign-react/` — legacy HTML reference (the WordPress Elementor codebase, kept for inspection)
- `../esic-redesign-wordpress/` — frozen backup snapshot of the WordPress version (do not modify)
