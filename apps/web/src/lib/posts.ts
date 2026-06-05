/**
 * Capa de datos del blog. Lee el JSON generado por scripts/sync-cms.mjs
 * (que trae los posts publicados de Payload). Sin red en build.
 */
import data from "../data/posts.json";

export interface Post {
  id: string | number;
  title: string;
  slug: string;
  category: "blog" | "podcast";
  author: string;
  excerpt: string;
  publishedAt: string | null;
  externalUrl: string | null;
  coverUrl: string | null;
  coverAlt: string;
  bodyHtml: string;
  seo: { metaTitle: string; metaDescription: string };
}

export const allPosts: Post[] = (data as Post[]) ?? [];

/** Posts con página de detalle propia (los que no son enlace externo). */
export const detailPosts: Post[] = allPosts.filter((p) => !p.externalUrl);

export function getPost(slug: string): Post | undefined {
  return allPosts.find((p) => p.slug === slug);
}

/** Destino de la tarjeta: página propia o enlace externo. */
export function postHref(p: Post): string {
  return p.externalUrl ?? `/blog/${p.slug}/`;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
