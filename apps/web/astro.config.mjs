// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
// Sitio estático: el build genera `dist/` para subir a un bucket S3 (origen)
// servido por un CDN (CloudFront/Cloudflare). Sin adaptador de hosting.
export default defineConfig({
  site: 'https://esic.co',
  output: 'static',
  // 'directory' → /pagina/index.html (compatible con el index document de
  // S3 static website hosting). 'trailingSlash: ignore' deja URLs limpias.
  build: {
    format: 'directory',
  },
  trailingSlash: 'ignore',
  // El QR impreso del DJE × Action Black apunta a la URL de la edición Hatsu;
  // ambas rutas cortas llevan a la landing vigente del desafío.
  redirects: {
    '/desafio-junior-empresarial-hatsu': '/desafio-junior-empresarial',
    '/dje': '/desafio-junior-empresarial',
    // /executive-programs era un duplicado del mismo programa (Digital Business
    // Transformation), sin enlaces internos y compitiendo en buscadores con la
    // página oficial. Se elimina y se redirige.
    '/executive-programs': '/digital-business-transformation',
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes("/dev/"),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
