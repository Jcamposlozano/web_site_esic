/**
 * Capa de datos del blog. Lee el JSON generado por scripts/sync-bucket.mjs
 * (que trae las noticias publicadas desde S3). Sin red en build.
 */
import data from "../data/posts.json";
import { formatDate as fmtDate, postHref as hrefOf } from "./noticias-map.mjs";

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
  return hrefOf(p);
}

export function formatDate(iso: string | null): string {
  return fmtDate(iso);
}
