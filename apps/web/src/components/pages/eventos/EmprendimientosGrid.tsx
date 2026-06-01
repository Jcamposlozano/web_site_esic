import { useState } from "react";

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

interface Filter {
  key: string;
  label: string;
}

interface Project {
  initials: string;
  category: string;
  /** Etiqueta visible (categoría legible) */
  tag: string;
  name: string;
  desc: string;
  /** Enlace al sitio del emprendimiento (TODO: links reales). */
  url: string;
}

const FILTERS: Filter[] = [
  { key: "all", label: "Todos" },
  { key: "tech", label: "Tech" },
  { key: "retail", label: "Retail" },
  { key: "servicios", label: "Servicios" },
  { key: "marketing", label: "Marketing" },
  { key: "sostenibilidad", label: "Sostenibilidad" },
  { key: "food", label: "Food" },
];

const PROJECTS: Project[] = [
  {
    initials: "VA",
    category: "sostenibilidad",
    tag: "Sostenibilidad",
    name: "Verde Andino",
    desc: "Productos de cuidado personal con ingredientes andinos, formulados para reducir el impacto ambiental sin perder eficacia.",
    url: "#",
  },
  {
    initials: "PS",
    category: "food",
    tag: "Food",
    name: "Pachamama Snacks",
    desc: "Snacks saludables a base de superalimentos colombianos, pensados para deportistas y oficinas conscientes.",
    url: "#",
  },
  {
    initials: "BC",
    category: "tech",
    tag: "Tech",
    name: "ByteCo Studio",
    desc: "Estudio de desarrollo de producto digital para startups en etapa temprana. Desde idea hasta MVP en 6 semanas.",
    url: "#",
  },
  {
    initials: "PT",
    category: "retail",
    tag: "Retail",
    name: "Paisa Threads",
    desc: "Marca de moda urbana inspirada en la cultura paisa, con producción local y ediciones limitadas en alianza con artistas.",
    url: "#",
  },
  {
    initials: "BD",
    category: "marketing",
    tag: "Marketing",
    name: "Brújula Digital",
    desc: "Agencia de marketing de performance enfocada en negocios B2B. Estrategia, ads y analítica con foco en ROI.",
    url: "#",
  },
  {
    initials: "TL",
    category: "servicios",
    tag: "Servicios",
    name: "Tinto Lab",
    desc: "Cafetería de especialidad con experiencias formativas en cata y barismo. Tercer espacio para creativos y profesionales.",
    url: "#",
  },
];

export default function EmprendimientosGrid() {
  const [active, setActive] = useState("all");

  return (
    <>
      {/* Filtros */}
      <div className="mb-12 flex flex-wrap justify-center gap-2.5 max-md:flex-nowrap max-md:justify-start max-md:overflow-x-auto max-md:pb-2">
        {FILTERS.map((f) => {
          const isActive = active === f.key;
          return (
            <button
              key={f.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActive(f.key)}
              className={`inline-flex flex-none items-center rounded-full border px-[1.3rem] py-[0.6rem] text-[0.85rem] font-semibold uppercase tracking-[0.06em] transition-all cursor-pointer ${
                isActive
                  ? "border-brand-blue-dark bg-brand-blue-dark text-white"
                  : "border-[rgba(0,19,63,0.15)] bg-white text-brand-blue-dark hover:border-brand-blue hover:text-brand-blue"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.filter((p) => active === "all" || p.category === active).map((p) => (
          <article
            key={p.name}
            className="flex flex-col rounded-[24px] border border-[rgba(0,19,63,0.06)] bg-white p-7 transition-all hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,19,63,0.12)]"
          >
            <div className="mb-6 grid h-24 w-24 place-items-center rounded-[20px] bg-bg font-display text-[2rem] font-extrabold tracking-[0.02em] text-brand-blue">
              {p.initials}
            </div>
            <span className="mb-[0.8rem] inline-block self-start rounded-full bg-[rgba(10,228,195,0.18)] px-3 py-[0.3rem] text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[#007E6A]">
              {p.tag}
            </span>
            <h3 className="mb-[0.7rem] font-display text-[1.8rem] font-bold uppercase leading-none text-brand-blue-dark">
              {p.name}
            </h3>
            <p className="mb-6 flex-grow text-[0.98rem] leading-[1.55] text-ink-muted">{p.desc}</p>
            <a
              href={p.url}
              target="_blank"
              rel="noopener"
              className="emp-arrow inline-flex items-center gap-2 self-start text-[0.85rem] font-bold uppercase tracking-[0.06em] text-brand-blue transition-all hover:gap-3 hover:text-brand-blue-dark"
            >
              Visitar sitio
              <ArrowRight />
            </a>
          </article>
        ))}
      </div>
    </>
  );
}
