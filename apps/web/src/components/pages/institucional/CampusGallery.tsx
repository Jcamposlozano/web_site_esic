import { useEffect, useState, useCallback } from "react";
import { asset } from "../../../lib/assets";

const BASE = asset("wp/2026/04");

type Area = {
  key: string;
  label: string;
  title: string;
  count: string;
  cover: string;
  size: "tall" | "wide" | "default";
  subtitle: string;
  images: string[];
};

function range(prefix: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => {
    const num = String(i + 1).padStart(2, "0");
    return `${BASE}/${prefix}-${num}.webp`;
  });
}

const AREAS: Area[] = [
  {
    key: "campus",
    label: "Exterior",
    title: "Campus",
    count: "7 fotos",
    cover: `${BASE}/campus-exterior-01.webp`,
    size: "tall",
    subtitle: "Fachada, ingreso y exteriores del edificio ESIC Medellín.",
    images: range("campus-exterior", 7),
  },
  {
    key: "comunes",
    label: "Convivencia",
    title: "Áreas Comunes",
    count: "16 fotos",
    cover: `${BASE}/areas-comunes-01.webp`,
    size: "default",
    subtitle: "Recepción, biblioteca, lounges Re.think, open space y zonas de encuentro.",
    images: range("areas-comunes", 16),
  },
  {
    key: "auditorio",
    label: "Eventos",
    title: "Auditorio",
    count: "5 fotos",
    cover: `${BASE}/auditorio-01.webp`,
    size: "default",
    subtitle: "Espacio para conferencias, lanzamientos y clases magistrales.",
    images: range("auditorio", 5),
  },
  {
    key: "piso-menos1",
    label: "Aulas",
    title: "Piso -1",
    count: "7 fotos",
    cover: `${BASE}/piso-menos1-01.webp`,
    size: "default",
    subtitle: "Salones y aulas del primer subnivel.",
    images: range("piso-menos1", 7),
  },
  {
    key: "piso-menos3",
    label: "Aulas",
    title: "Piso -3",
    count: "7 fotos",
    cover: `${BASE}/piso-menos3-01.webp`,
    size: "default",
    subtitle: "Aulas amplias con paneles, pantallas y corredores con luz natural.",
    images: range("piso-menos3", 7),
  },
  {
    key: "piso2",
    label: "Aulas",
    title: "Piso 2",
    count: "7 fotos",
    cover: `${BASE}/piso-2-01.webp`,
    size: "default",
    subtitle: "Salones y aulas del segundo piso.",
    images: range("piso-2", 7),
  },
  {
    key: "piso3",
    label: "Aulas",
    title: "Piso 3",
    count: "7 fotos",
    cover: `${BASE}/piso-3-01.webp`,
    size: "wide",
    subtitle: "Salones y aulas del tercer piso.",
    images: range("piso-3", 7),
  },
  {
    key: "techlab",
    label: "Innovación",
    title: "Tech Lab",
    count: "4 fotos",
    cover: `${BASE}/techlab-01.webp`,
    size: "default",
    subtitle: "Robots, VR y tecnología aplicada al aprendizaje.",
    images: range("techlab", 4),
  },
];

const sizeClasses: Record<Area["size"], string> = {
  tall: "sm:col-span-2 sm:row-span-2 sm:aspect-auto aspect-[4/5]",
  wide: "sm:col-span-2 sm:aspect-[5/3] aspect-[4/5]",
  default: "aspect-[4/5]",
};

export default function CampusGallery() {
  const [active, setActive] = useState<Area | null>(null);

  const close = useCallback(() => setActive(null), []);

  useEffect(() => {
    if (!active) return;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [active, close]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 auto-rows-fr">
        {AREAS.map((area) => (
          <button
            key={area.key}
            type="button"
            onClick={() => setActive(area)}
            className={`group relative overflow-hidden rounded-3xl text-left cursor-pointer ${sizeClasses[area.size]}`}
            aria-label={`Ver galería ${area.title}`}
          >
            <img
              src={area.cover}
              alt={area.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
            />
            {/* Overlay negro obligatorio + gradiente de pie */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/80" />
            <div className="absolute inset-0 flex flex-col justify-end p-8 text-white">
              <span className="self-start inline-flex items-center gap-1.5 text-[0.75rem] font-bold uppercase tracking-[0.12em] bg-white/15 border border-white/40 px-3.5 py-1.5 rounded-full mb-3 backdrop-blur-sm">
                {area.label}
              </span>
              <h3 className="font-display font-extrabold uppercase leading-[1.02] text-[clamp(1.7rem,2.6vw,2.4rem)] [text-shadow:0_2px_16px_rgba(0,0,0,0.6)] max-w-[85%]">
                {area.title}
              </h3>
              <span className="font-body text-[0.8rem] font-semibold text-white/85 mt-2 tracking-[0.04em]">
                {area.count}
              </span>
            </div>
            <span className="absolute bottom-5 right-5 z-[3] bg-white text-black text-[0.8rem] font-bold tracking-[0.02em] px-5 py-2.5 rounded-full shadow-[0_8px_20px_rgba(0,0,0,0.35)] transition-transform duration-200 group-hover:translate-x-1 pointer-events-none">
              Ver galería →
            </span>
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 md:p-8 bg-[rgba(0,19,63,0.92)]"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div className="relative bg-white rounded-3xl w-full max-w-[1000px] max-h-[90vh] overflow-y-auto p-5 md:p-8">
            <button
              type="button"
              onClick={close}
              aria-label="Cerrar galería"
              className="absolute top-4 right-4 z-[2] w-10 h-10 rounded-full bg-brand-blue-dark hover:bg-brand-blue text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] fill-white">
                <path d="M18.3 5.71a1 1 0 00-1.41 0L12 10.59 7.11 5.7a1 1 0 00-1.41 1.42L10.59 12l-4.9 4.89a1 1 0 101.42 1.41L12 13.41l4.89 4.89a1 1 0 001.41-1.41L13.41 12l4.89-4.89a1 1 0 000-1.4z" />
              </svg>
            </button>
            <h3 className="font-display font-extrabold uppercase text-brand-blue-dark text-[clamp(1.5rem,3vw,2rem)] pr-12 mb-1">
              {active.title}
            </h3>
            <p className="text-[0.95rem] text-ink-muted mb-6">{active.subtitle}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {active.images.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt={`${active.title} — foto ${String(i + 1).padStart(2, "0")}`}
                  loading="lazy"
                  className={`w-full object-cover rounded-2xl ${
                    i === 0 ? "sm:col-span-2 aspect-[21/9]" : "aspect-[16/10]"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
