# esic-react-app

Migration of ESIC Medellin website from WordPress + Elementor to Astro 5 + React.

## Structure

```
apps/
  web/      Astro 6 + React 19 frontend (estático)
  cms/      Payload CMS 3 — blog (demo local: SQLite + media en disco)
packages/
  shared/   Shared TypeScript types (planned)
```

## Development

```bash
pnpm install

# Sitio (apps/web)
pnpm dev                      # http://localhost:4321

# CMS (apps/cms) — blog editable
pnpm --filter cms seed        # admin + posts demo (1ª vez)
pnpm --filter cms dev         # http://localhost:3000/admin  (admin@esic.co / esic12345)
```

## Blog / CMS

El blog (`/blog`, `/blog/[slug]` y la sección Rethink del home) se gestiona en
Payload. En el **build**, `apps/web/scripts/sync-cms.mjs` trae los posts publicados
y sus portadas a `src/data/posts.json` + `public/cms-media/` (sitio estático
self-contained). Detalles en [`apps/cms/README.md`](apps/cms/README.md).

## Related directories

- `../esic-redesign-react/` — legacy HTML reference (the WordPress Elementor codebase, kept for inspection)
- `../esic-redesign-wordpress/` — frozen backup snapshot of the WordPress version (do not modify)
