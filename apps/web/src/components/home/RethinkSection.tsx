import { useEffect, useState } from "react";
import { fetchLivePosts } from "../../lib/noticias-client";
import { postHref } from "../../lib/noticias-map.mjs";
import type { Post } from "../../lib/posts";

type Category = "todo" | "blog" | "podcast";

export type RethinkCard = {
  category: "blog" | "podcast";
  image: string | null;
  tag: string;
  title: string;
  href: string;
  external: boolean;
  ctaLabel: string;
};

/** Misma transformación Post -> RethinkCard que usa index.astro en el build. */
function toCard(p: Post): RethinkCard {
  return {
    category: p.category,
    image: p.coverUrl,
    tag: p.category === "podcast" ? "Podcast" : "Blog",
    title: p.title,
    href: postHref(p),
    external: Boolean(p.externalUrl),
    ctaLabel: p.category === "podcast" ? "Escuchar" : "Leer",
  };
}

const filters: { key: Category; label: string }[] = [
  { key: "todo", label: "Todo" },
  { key: "blog", label: "Blog" },
  { key: "podcast", label: "Podcast" },
];

export default function RethinkSection({ cards = [] }: { cards?: RethinkCard[] }) {
  const [active, setActive] = useState<Category>("todo");
  // Arranca con las cards del build (SEO) y, al cargar, refresca con el JSON
  // vivo del bucket. Si el fetch falla, conserva las del build como fallback.
  const [liveCards, setLiveCards] = useState<RethinkCard[]>(cards);

  useEffect(() => {
    fetchLivePosts().then((posts) => {
      if (posts && posts.length) setLiveCards(posts.map(toCard));
    });
  }, []);

  const visible =
    active === "todo" ? liveCards : liveCards.filter((c) => c.category === active);

  return (
    <>
      <div className="text-center mb-10">
        <h2 className="font-display text-5xl md:text-7xl font-extrabold uppercase leading-[0.9] text-white">
          Rethink
        </h2>
        <p className="text-base md:text-lg text-white/80 mt-4 font-normal">
          Ideas, historias y conversaciones que transforman
        </p>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap justify-center md:justify-start">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setActive(f.key)}
            className={`font-display text-[0.9rem] font-bold uppercase tracking-[0.05em] px-5 py-2 rounded-full border transition-all ${
              active === f.key
                ? "bg-brand-teal border-brand-teal text-brand-blue-dark"
                : "bg-transparent border-white/20 text-white/60 hover:border-white/50 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory pb-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]">
        {visible.map((c) => (
          <article
            key={c.href}
            className="rethink-card flex-shrink-0 w-[85%] sm:w-[45%] lg:w-[calc(25%-1rem)] min-w-[280px] bg-white/5 rounded-3xl overflow-hidden snap-start transition-transform duration-300 hover:-translate-y-1"
          >
            <div className="aspect-[16/9] overflow-hidden bg-[#1a1a2e] flex items-center justify-center">
              {c.image && (
                <img src={c.image} alt={c.title} loading="lazy" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="p-6">
              <span
                className={`block text-[0.78rem] uppercase tracking-[0.1em] mb-2 font-semibold ${
                  c.category === "blog" ? "text-brand-teal" : "text-[#A78BFA]"
                }`}
              >
                {c.tag}
              </span>
              <h3 className="font-display text-xl font-bold uppercase leading-tight mb-4 text-white">
                {c.title}
              </h3>
              <a
                href={c.href}
                target={c.external ? "_blank" : undefined}
                rel={c.external ? "noopener" : undefined}
                className="inline-flex items-center rounded-full border border-white/40 text-white text-[0.75rem] font-bold uppercase tracking-[0.06em] px-4 py-2 hover:bg-white hover:text-brand-blue-dark transition-colors no-underline"
              >
                {c.ctaLabel}
              </a>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
