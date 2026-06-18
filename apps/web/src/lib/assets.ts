/**
 * Base única de assets estáticos en S3.
 *
 * Todos los assets estáticos del sitio (banners, campus, programas, logos,
 * PDFs, videos, favicons, og) se sirven por URL pública directa de S3 bajo
 * este prefijo. El sitio depende SIEMPRE de S3: no hay fallback local.
 *
 * Nota: las portadas del blog (coverUrl en noticias.json) NO usan esta base;
 * viven bajo el prefijo de imágenes de noticias según el contrato.
 */
export const ASSETS_BASE =
  "https://prisma-fai-admin.s3.us-east-2.amazonaws.com/src/esic-website/assets";

/**
 * Resuelve una key relativa a la URL pública absoluta en S3.
 * @example asset("home/banner/01.webp")
 *   -> "https://.../src/esic-website/assets/home/banner/01.webp"
 */
export const asset = (key: string): string =>
  `${ASSETS_BASE}/${key.replace(/^\/+/, "")}`;
