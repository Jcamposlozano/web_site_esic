# esic-react-app

Migration of ESIC Medellin website from WordPress + Elementor to Astro 5 + React.

## Structure

```
apps/
  web/      Astro 5 + React frontend (Vercel)
  cms/      Payload CMS 3 (planned, Phase 4)
packages/
  shared/   Shared TypeScript types (planned)
```

## Development

```bash
pnpm install
pnpm dev          # starts apps/web
```

## Related directories

- `../esic-redesign-react/` — legacy HTML reference (the WordPress Elementor codebase, kept for inspection)
- `../esic-redesign-wordpress/` — frozen backup snapshot of the WordPress version (do not modify)
