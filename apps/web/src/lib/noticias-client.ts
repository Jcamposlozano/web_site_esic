/**
 * noticias-client.ts — Capa de datos del blog EN EL NAVEGADOR.
 *
 * Mejora progresiva: las páginas del blog se renderizan estáticas en el build
 * (primer paint + SEO base) y, al cargar, llaman aquí para traer el JSON vivo
 * desde S3 y refrescar el contenido sin necesidad de re-deploy. Igual que las
 * portadas, que ya se sirven en vivo por URL pública de S3.
 *
 * Reusa la MISMA transformación que el build (noticias-map.mjs).
 */
import { NOTICIAS_URL, mapNoticias } from "./noticias-map.mjs";
import type { Post } from "./posts";

/**
 * Trae la lista de posts publicados desde el bucket. Devuelve null ante
 * cualquier fallo (red, formato) para que la página conserve el render del
 * build como fallback silencioso.
 */
export async function fetchLivePosts(): Promise<Post[] | null> {
  try {
    const res = await fetch(NOTICIAS_URL, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return mapNoticias(json) as Post[] | null;
  } catch {
    return null;
  }
}
