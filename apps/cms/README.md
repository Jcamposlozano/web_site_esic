# ESIC CMS — Payload 3 (demo local)

Gestor de contenido del blog/Rethink. **Demo 100% local**: SQLite + media en disco.
Sin Docker ni servicios externos. Diseñado para ser portable a AWS sin reescribir
(solo se cambia el adapter de DB y el storage de media).

## Stack
- **Payload 3** sobre **Next 16** (admin en `/admin`, REST en `/api`).
- **SQLite** (`apps/cms/cms.db`) vía `@payloadcms/db-sqlite`.
- **Media en disco** (`apps/cms/media/`).

## Colecciones
- `users` — admins (auth).
- `media` — uploads (con tamaños `card`/`thumbnail`).
- `posts` — `title`, `slug` (auto), `excerpt`, `coverImage`, `body` (rich-text),
  `category` (blog|podcast), `author`, `publishedAt`, `status` (draft|published),
  `externalUrl` (para podcasts), `seo`. Un hook `afterRead` expone `bodyHtml`.

## Correr en local

```bash
# 1) Instalar (desde la raíz del monorepo)
pnpm install

# 2) Sembrar datos demo (admin + 7 posts + 1 borrador)
pnpm --filter cms seed

# 3) Levantar el CMS  → http://localhost:3000/admin
pnpm --filter cms dev
```

**Credenciales del admin (seed):** definidas en `apps/cms/.env`
(`admin@esic.co` / `esic12345`). Cámbialas en producción.

## Conectar con el sitio (Astro)

El sitio `apps/web` no consume Payload en runtime: en el **build** corre
`scripts/sync-cms.mjs`, que trae los posts **publicados** vía REST y descarga las
portadas a `apps/web/public/cms-media/`, escribiendo `apps/web/src/data/posts.json`.
Así el sitio queda **estático y self-contained**.

```bash
# Con el CMS corriendo (puerto 3000):
pnpm --filter web sync:cms   # refresca posts.json + portadas
pnpm --filter web build      # 'prebuild' ya corre sync:cms automáticamente
```

Si el CMS está apagado, `sync-cms` conserva el `posts.json` ya commiteado y el
build no se rompe.

## Flujo de publicación (demo)
1. Editor crea/edita un post en `/admin` y lo marca **Publicado**.
2. Se vuelve a generar el sitio: `pnpm --filter web build` (corre el sync).
3. En producción esto sería un **webhook** Payload → rebuild (Vercel/AWS).

## Migración a AWS (cuando se valide)
- **DB:** cambiar `@payloadcms/db-sqlite` por `@payloadcms/db-postgres` apuntando a RDS (`DATABASE_URI`).
- **Media:** añadir `@payloadcms/storage-s3` (bucket S3) en `payload.config.ts`.
- **Hosting CMS:** Dockerizar y desplegar en App Runner/ECS.
- El sitio `apps/web` no cambia: solo el `PAYLOAD_URL` del sync.

## Notas
- `cms.db` y `media/*` están en `.gitignore` (se regeneran con el seed).
- `apps/web/src/data/posts.json` y `apps/web/public/cms-media/` **sí** se commitean
  como snapshot, para que el sitio compile aunque el CMS no esté corriendo.
