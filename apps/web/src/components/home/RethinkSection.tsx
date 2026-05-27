import { useState } from "react";

type Category = "todo" | "blog" | "podcast";

type Card = {
  category: Exclude<Category, "todo">;
  image: string;
  tag: string;
  title: string;
  href: string;
  ctaLabel: string;
};

const cards: Card[] = [
  {
    category: "blog",
    image: "/images/home/rethink/aprender-a-decidir.png",
    tag: "Blog",
    title: "Aprender a decidir: el valor de los casos reales en el aula",
    href: "/blog/aprender-a-decidir-el-valor-de-los-casos-reales-en-el-aula/",
    ctaLabel: "Leer",
  },
  {
    category: "blog",
    image: "/images/home/rethink/formar-criterio-directivo.png",
    tag: "Blog",
    title: "Formar criterio directivo",
    href: "/blog/formar-criterio-directivo/",
    ctaLabel: "Leer",
  },
  {
    category: "blog",
    image: "/images/home/rethink/pagina-web-2026.png",
    tag: "Blog",
    title: "Ser o no ser: el papel de la página web en 2026",
    href: "/blog/ser-o-no-ser-el-papel-de-la-pagina-web-en-2026/",
    ctaLabel: "Leer",
  },
  {
    category: "podcast",
    image: "/images/home/rethink/ep29.jpg",
    tag: "Podcast · Ep. 29",
    title: "El Futuro de Nuestra Consciencia con IA con Sebastián Chinkovsky",
    href: "https://www.youtube.com/watch?v=zS-ibHyImvI",
    ctaLabel: "Escuchar",
  },
  {
    category: "blog",
    image: "/images/home/rethink/emprender-sin-startup.png",
    tag: "Blog",
    title: "Emprender sin fundar una startup: el nuevo perfil del profesional emprendedor",
    href: "/blog/emprender-sin-fundar-una-startup-el-nuevo-perfil-del-profesional-emprendedor/",
    ctaLabel: "Leer",
  },
  {
    category: "podcast",
    image: "/images/home/rethink/ep28.jpg",
    tag: "Podcast · Ep. 28",
    title: "El Futuro de la Política con IA con Federico Hoyos",
    href: "https://www.youtube.com/watch?v=XFziCxsoUr0&t=1s",
    ctaLabel: "Escuchar",
  },
  {
    category: "blog",
    image: "/images/home/rethink/excelencia-academica.png",
    tag: "Blog",
    title: "Excelencia académica: cuando la educación deja de ser contenido y se convierte en criterio",
    href: "/blog/excelencia-academica-cuando-la-educacion-deja-de-ser-contenido-y-se-convierte-en-criterio/",
    ctaLabel: "Leer",
  },
];

const filters: { key: Category; label: string }[] = [
  { key: "todo", label: "Todo" },
  { key: "blog", label: "Blog" },
  { key: "podcast", label: "Podcast" },
];

export default function RethinkSection() {
  const [active, setActive] = useState<Category>("todo");

  const visible = active === "todo" ? cards : cards.filter((c) => c.category === active);

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
              <img src={c.image} alt={c.title} loading="lazy" className="w-full h-full object-contain" />
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
                target="_blank"
                rel="noopener"
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
