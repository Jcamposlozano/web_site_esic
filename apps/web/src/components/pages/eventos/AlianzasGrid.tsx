import { useEffect, useMemo, useState, type ReactNode } from "react";

/* ─────────────────────────────────────────────
   DATA — réplica verbatim del HTML de WordPress.
   Las cadenas usan caracteres reales (no entidades).
───────────────────────────────────────────── */

type Detail = { label: string; value: string };

interface Alianza {
  key: string;
  cat: string;
  catKey: string;
  /** Clase de fondo (gradiente por categoría). */
  bg: string;
  logo: string;
  logoRound?: boolean;
  logoInvert?: boolean;
  name: string;
  /** Perk corto mostrado en la card. */
  cardPerk: string;
  /** Meta corta de la card. */
  cardMeta: string;
  /** Perk largo del modal. */
  perk: string;
  desc: string;
  details: Detail[];
  url?: string;
  urlLabel?: string;
  urlType?: "ig" | "wpp" | "web";
}

const BG: Record<string, string> = {
  "ali-bg-bienestar": "linear-gradient(135deg, #0E1418 0%, #2A1F2D 100%)",
  "ali-bg-gastro": "linear-gradient(135deg, #1F1206 0%, #4A1E0A 100%)",
  "ali-bg-cultura": "linear-gradient(135deg, #061730 0%, #0A2A55 100%)",
  "ali-bg-servicios": "linear-gradient(135deg, #00133F 0%, #0047E9 100%)",
};

const WP = "/images/wp/2026/05";

const ALIANZAS: Alianza[] = [
  {
    key: "action-black",
    cat: "Bienestar y deporte",
    catKey: "bienestar",
    bg: "ali-bg-bienestar",
    logo: `${WP}/action-black-1.webp`,
    logoRound: true,
    name: "Action Black",
    cardPerk: "$219.900 / mes",
    cardMeta: "Plan Prime Corporativo · sin inscripción",
    perk: "Tarifa especial Plan Prime Corporativo",
    desc: "Beneficio exclusivo para estudiantes, profesores y administrativos de ESIC. Incluye $0 de inscripción, $0 de administración y tarifa especial de $219.900 mensual en el Plan Prime Corporativo. Acceso a entrenamiento semipersonalizado, múltiples modalidades de clase y beneficios adicionales del club. Aplica con débito automático (tarjeta débito o crédito). El usuario deberá presentar carné institucional vigente para la activación. Beneficio válido en sedes activas de Action Black a nivel nacional.",
    details: [
      { label: "Vigencia", value: "Hasta 31 dic 2026" },
      { label: "Forma de pago", value: "Débito automático (débito o crédito)" },
      { label: "Cobertura", value: "Sedes activas a nivel nacional" },
      { label: "Activación", value: "Presentando carné institucional vigente" },
    ],
  },
  {
    key: "shibuya",
    cat: "Gastronomía",
    catKey: "gastronomia",
    bg: "ali-bg-gastro",
    logo: `${WP}/shibuya.webp`,
    logoRound: true,
    name: "Restaurante Shibuya",
    cardPerk: "20% OFF",
    cardMeta: "Robata & Sushi · Mall Indiana, Local 174",
    perk: "20% de descuento",
    desc: "Descuento del 20% sobre la factura final. Aplica en toda la carta de comidas y bebidas SIN ALCOHOL. Válido de MARTES A VIERNES de 12PM A 8PM, fin de semana no aplica el descuento. El descuento es válido para los estudiantes, profesores o directivos de la institución, presentando su carné. Ubicación: Mall Indiana, Local 174",
    details: [
      { label: "Vigencia", value: "Hasta 31 dic 2026" },
      { label: "Días", value: "Martes a viernes · 12:00 pm a 8:00 pm" },
      { label: "Aplica", value: "Carta sin alcohol" },
      { label: "Ubicación", value: "Mall Indiana, Local 174" },
    ],
    url: "https://shibuyarestaurante.com",
    urlLabel: "Visitar sitio",
  },
  {
    key: "kcao",
    cat: "Cultura y libros",
    catKey: "cultura",
    bg: "ali-bg-cultura",
    logo: `${WP}/kcao.webp`,
    logoRound: true,
    name: "Kcao Coworking & Café",
    cardPerk: "15% OFF",
    cardMeta: "Libros Editorial Planeta · Mall Indiana 175",
    perk: "15% OFF en libros Editorial Planeta",
    desc: "Con el apoyo de la Editorial Planeta y sus sellos, la Planta Administrativa, Docentes y Estudiantes, tendrán un beneficio del -15% en la adquisición de libros. Aplica para sellos de la Editorial y no es acumulable con otras ofertas. Ubicación: Mall Indiana Local 175.",
    details: [
      { label: "Vigencia", value: "Hasta 31 dic 2026" },
      { label: "Aplica a", value: "Libros sellos Editorial Planeta" },
      { label: "Restricción", value: "No acumulable con otras ofertas" },
      { label: "Ubicación", value: "Mall Indiana Local 175" },
    ],
    url: "https://kcaocompany.com.co",
    urlLabel: "Visitar sitio",
  },
  {
    key: "ammazza",
    cat: "Gastronomía",
    catKey: "gastronomia",
    bg: "ali-bg-gastro",
    logo: `${WP}/ammazza.webp`,
    name: "Ammazza",
    cardPerk: "20% OFF",
    cardMeta: "Todas las sedes · postre gratis en tu cumpleaños",
    perk: "20% OFF + postre de cumpleaños",
    desc: "Disfruta de un 20% OFF en todas las sedes de Amazza. Válido hasta el 31 de diciembre de 2026. Además, en tu cumpleaños recibe un postre GRATIS. Promo válida para consumo en sitio. No acumulable con otras promociones.",
    details: [
      { label: "Vigencia", value: "Hasta 31 dic 2026" },
      { label: "Modalidad", value: "Consumo en sitio" },
      { label: "Cobertura", value: "Todas las sedes Ammazza" },
      { label: "Restricción", value: "No acumulable con otras promos" },
    ],
    url: "https://ammazza.com.co",
    urlLabel: "Visitar sitio",
  },
  {
    key: "barbaro",
    cat: "Gastronomía",
    catKey: "gastronomia",
    bg: "ali-bg-gastro",
    logo: `${WP}/barbaro.webp`,
    name: "Bárbaro Cocina Primitiva",
    cardPerk: "20% OFF",
    cardMeta: "Laureles · Poblado · Túnel · Viva Envigado",
    perk: "20% OFF + postre de cumpleaños",
    desc: "Disfruta de un 20% OFF en todas las sedes de Bárbaro. Válido hasta 31 Dic 2026. Laureles | Poblado | Túnel de Oriente | Viva Envigado. En tu cumple: ¡postre GRATIS!",
    details: [
      { label: "Vigencia", value: "Hasta 31 dic 2026" },
      { label: "Sedes", value: "Laureles · Poblado · Túnel de Oriente · Viva Envigado" },
      { label: "Modalidad", value: "Consumo en sitio" },
      { label: "Restricción", value: "No acumulable con otras promos" },
    ],
    url: "https://barbarococinaprimitiva.com",
    urlLabel: "Visitar sitio",
  },
  {
    key: "volver",
    cat: "Gastronomía",
    catKey: "gastronomia",
    bg: "ali-bg-gastro",
    logo: `${WP}/volver-1.webp`,
    logoInvert: true,
    name: "Restaurante Volver",
    cardPerk: "20% OFF",
    cardMeta: "L-V · 12:00 m a 9:00 pm",
    perk: "20% de descuento",
    desc: "Beneficio exclusivo para la comunidad ESIC. Estudiantes y colaboradores disfrutan de un 20% de descuento en toda la carta de Volver. Válido de LUNES A VIERNES de 12:00 m a 9:00 pm. Presentando tu carné ESIC. IG: @volver.siempre.volver",
    details: [
      { label: "Vigencia", value: "Hasta 31 dic 2026" },
      { label: "Días", value: "Lunes a viernes · 12:00 m a 9:00 pm" },
      { label: "Aplica", value: "Toda la carta" },
      { label: "Activación", value: "Presentando carné ESIC" },
    ],
    url: "https://instagram.com/volver.siempre.volver",
    urlLabel: "Ver en Instagram",
    urlType: "ig",
  },
  {
    key: "bukz",
    cat: "Cultura y libros",
    catKey: "cultura",
    bg: "ali-bg-cultura",
    logo: `${WP}/bukz.webp`,
    logoInvert: true,
    name: "Bukz",
    cardPerk: "10% OFF",
    cardMeta: "Catálogo completo · tienda física y bukz.co",
    perk: "10% de descuento",
    desc: "Disfruta de 10% de descuento, válido en tiendas físicas y en bukz.co. Aplica para todo el catálogo, no es canjeable por dinero ni reembolsable y su uso es personal. Puede combinarse con otras promociones, salvo indicación contraria. Bukz no se hace responsable por pérdida o uso no autorizado del código. Valores en COP. Libros exentos de IVA según la legislación vigente.",
    details: [
      { label: "Vigencia", value: "Hasta 31 dic 2026" },
      { label: "Canal", value: "Tiendas físicas y bukz.co" },
      { label: "Aplica a", value: "Todo el catálogo" },
      { label: "Restricción", value: "Uso personal, no canjeable por dinero" },
    ],
    url: "https://bukz.co",
    urlLabel: "Visitar sitio",
  },
  {
    key: "conecty",
    cat: "Servicios y viaje",
    catKey: "servicios",
    bg: "ali-bg-servicios",
    logo: `${WP}/conecty.webp`,
    name: "Conecty",
    cardPerk: "10% OFF",
    cardMeta: "SIM internacional · 190 destinos · código ESIC10",
    perk: "10% OFF · código ESIC10",
    desc: "Beneficio para la comunidad ESIC un 10% de descuento en la compra de SIM internacional de Connecty usando el código ESIC10, el cual deberá indicarse al momento de la compra a través del equipo comercial o en la página web. El descuento aplica sobre los planes disponibles con cobertura en más de 190 países, incluyendo Europa y España, no es acumulable con otras promociones y puede estar sujeto a cambios sin previo aviso. Para más información, comunicarse al +57 305 255 5249.",
    details: [
      { label: "Vigencia", value: "Hasta 31 dic 2026" },
      { label: "Código", value: "ESIC10" },
      { label: "Cobertura", value: "Más de 190 países" },
      { label: "Contacto", value: "+57 305 255 5249" },
    ],
    url: "https://wa.me/573052555249?text=Hola%2C%20soy%20de%20la%20comunidad%20ESIC%20y%20quiero%20usar%20el%20c%C3%B3digo%20ESIC10",
    urlLabel: "Escribir por WhatsApp",
    urlType: "wpp",
  },
];

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "bienestar", label: "Bienestar y deporte" },
  { key: "gastronomia", label: "Gastronomía" },
  { key: "cultura", label: "Cultura y libros" },
  { key: "servicios", label: "Servicios y viaje" },
];

/* Iconos SVG por etiqueta de detalle (stroke-based, autocontenidos). */
const DETAIL_ICONS: Record<string, ReactNode> = {
  Vigencia: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  Días: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  Ubicación: (
    <>
      <path d="M12 22s-7-7.58-7-13a7 7 0 0 1 14 0c0 5.42-7 13-7 13z" />
      <circle cx="12" cy="9" r="2.5" />
    </>
  ),
  Sedes: <path d="M3 21h18M5 21V8l7-5 7 5v13M9 21v-7h6v7" />,
  Cobertura: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  "Forma de pago": (
    <>
      <rect x="2" y="6" width="20" height="13" rx="2" />
      <path d="M2 10h20" />
    </>
  ),
  Activación: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="9" cy="12" r="2.5" />
      <path d="M15 11h3M15 14h3" />
    </>
  ),
  Modalidad: (
    <>
      <path d="M3 11h18l-2 8H5l-2-8z" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    </>
  ),
  Restricción: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M5 5l14 14" />
    </>
  ),
  Aplica: <polyline points="20 6 9 17 4 12" />,
  "Aplica a": <polyline points="20 6 9 17 4 12" />,
  Canal: (
    <>
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M8 22h8M12 18v4" />
    </>
  ),
  Código: <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />,
  Contacto: (
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  ),
};

function DetailIcon({ label }: { label: string }) {
  const inner = DETAIL_ICONS[label] ?? <path d="M12 8v4M12 16h.01" />;
  const hasOwn = label in DETAIL_ICONS;
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {!hasOwn && <circle cx="12" cy="12" r="9" />}
      {inner}
    </svg>
  );
}

const ArrowCardCta = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M13 5l7 7-7 7" />
  </svg>
);

function LogoImg({ a, variant }: { a: Alianza; variant: "card" | "modal" }) {
  const base =
    variant === "card"
      ? a.logoRound
        ? "relative z-[2] h-[118px] w-[118px] rounded-full border-[3px] border-white/[0.92] object-cover shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
        : "relative z-[2] max-h-20 w-auto max-w-[60%] object-contain [filter:drop-shadow(0_4px_18px_rgba(0,0,0,0.45))]"
      : a.logoRound
        ? "relative z-[2] h-[150px] w-[150px] rounded-full border-4 border-white/95 object-cover shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
        : "relative z-[2] max-h-[130px] max-w-[280px] [filter:drop-shadow(0_8px_30px_rgba(0,0,0,0.55))]";
  const invertStyle = a.logoInvert
    ? {
        filter: `brightness(0) invert(1) drop-shadow(0 ${variant === "card" ? "4px 18px" : "8px 30px"} rgba(0,0,0,${variant === "card" ? "0.45" : "0.55"}))`,
      }
    : undefined;
  return <img src={a.logo} alt={a.name} className={base} style={invertStyle} />;
}

export default function AlianzasGrid() {
  const [filter, setFilter] = useState("all");
  const [openKey, setOpenKey] = useState<string | null>(null);

  const visible = useMemo(
    () => ALIANZAS.filter((a) => filter === "all" || a.catKey === filter),
    [filter],
  );

  const active = openKey ? ALIANZAS.find((a) => a.key === openKey) ?? null : null;

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenKey(null);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active]);

  const countLabel = `${visible.length} ${visible.length === 1 ? "alianza activa" : "alianzas activas"}`;

  return (
    <>
      {/* Head */}
      <div className="mb-10 flex flex-wrap items-end justify-between gap-8">
        <div className="max-w-[580px]">
          <h2 className="mb-2 font-display text-[clamp(2.4rem,5vw,3.6rem)] font-extrabold uppercase text-brand-blue-dark">
            Nuestras alianzas
          </h2>
          <p className="text-[1rem] text-[#5C6477]">Marcas que reconocen y premian a la comunidad ESIC.</p>
        </div>
        <div className="font-display text-[1.05rem] font-bold tracking-[0.05em] text-brand-blue">{countLabel}</div>
      </div>

      {/* Filters */}
      <div className="mb-10 flex flex-wrap gap-2.5 border-b border-[#E7E2D8] pb-[1.6rem]" role="tablist">
        {FILTERS.map((f) => {
          const isActive = filter === f.key;
          const count = f.key === "all" ? ALIANZAS.length : ALIANZAS.filter((a) => a.catKey === f.key).length;
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-5 py-[0.7rem] text-[0.82rem] font-semibold tracking-[0.04em] transition-all cursor-pointer ${
                isActive
                  ? "border-brand-blue-dark bg-brand-blue-dark text-white"
                  : "border-[#E7E2D8] bg-bg text-[#1A2547] hover:border-brand-blue-dark hover:text-brand-blue-dark"
              }`}
            >
              {f.label} <span className="ml-[0.3rem] text-[0.72rem] opacity-70">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-[1.4rem] min-[641px]:grid-cols-2 min-[981px]:grid-cols-3">
        {visible.map((a) => (
          <article
            key={a.key}
            onClick={() => setOpenKey(a.key)}
            className="ali-card group flex cursor-pointer flex-col overflow-hidden rounded-[24px] border border-[#E7E2D8] bg-bg transition-all hover:-translate-y-1.5 hover:border-[rgba(0,71,233,0.18)] hover:shadow-[0_30px_50px_-22px_rgba(0,19,63,0.22)]"
          >
            <div className="relative flex items-center justify-center overflow-hidden" style={{ aspectRatio: "16 / 11" }}>
              <div
                className="ali-card-bg absolute inset-0 bg-cover bg-center transition-transform duration-[600ms] group-hover:scale-[1.06]"
                style={{ backgroundImage: BG[a.bg] }}
              />
              <div className="ali-card-overlay absolute inset-0 bg-black/[0.32] transition-all group-hover:bg-black/[0.22]" />
              <div className="absolute left-4 top-4 z-[3] rounded-full bg-black/55 px-3 py-[0.4rem] text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-[6px]">
                {a.cat}
              </div>
              <div className="absolute inset-0 z-[2] flex items-center justify-center p-6">
                <LogoImg a={a} variant="card" />
              </div>
            </div>
            <div className="px-6 pb-7 pt-[1.6rem]">
              <div className="mb-[0.45rem] font-display text-[2rem] font-extrabold uppercase leading-none text-brand-blue">{a.cardPerk}</div>
              <div className="mb-[0.35rem] text-[1.05rem] font-bold tracking-[-0.005em] text-brand-blue-dark">{a.name}</div>
              <div className="text-[0.85rem] text-[#5C6477]">{a.cardMeta}</div>
              <span className="ali-card-cta mt-[1.1rem] inline-flex items-center gap-1.5 border-b-2 border-brand-blue-dark pb-[0.15rem] text-[0.78rem] font-bold uppercase tracking-[0.08em] text-brand-blue-dark transition-all group-hover:gap-[0.7rem]">
                Ver detalles
                <ArrowCardCta />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* Modal */}
      {active && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[rgba(0,9,30,0.72)] p-6 backdrop-blur-[10px]"
          role="dialog"
          aria-modal="true"
          aria-label={active.name}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpenKey(null);
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-[880px] overflow-y-auto rounded-[24px] bg-bg shadow-[0_30px_80px_-10px_rgba(0,9,30,0.55)]">
            <button
              type="button"
              aria-label="Cerrar"
              onClick={() => setOpenKey(null)}
              className="ali-modal-close absolute right-[1.2rem] top-[1.2rem] z-[5] grid h-[42px] w-[42px] place-items-center rounded-full bg-white/85 text-brand-blue-dark transition-all hover:rotate-90 hover:bg-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            {/* Hero */}
            <div
              className="relative flex items-center justify-center overflow-hidden rounded-t-[24px]"
              style={{ aspectRatio: "16 / 7", backgroundImage: BG[active.bg], backgroundSize: "cover", backgroundPosition: "center" }}
            >
              <div className="absolute inset-0 bg-black/40" />
              <LogoImg a={active} variant="modal" />
            </div>

            {/* Body */}
            <div className="px-6 pb-[2.4rem] pt-8 md:px-[2.5rem]">
              <div className="mb-[0.6rem] inline-block text-[0.72rem] font-bold uppercase tracking-[0.18em] text-brand-blue">{active.cat}</div>
              <h3 className="mb-[0.8rem] font-display text-[clamp(2rem,4vw,2.8rem)] font-extrabold uppercase leading-[0.95] text-brand-blue-dark">{active.name}</h3>
              <div className="mb-[1.4rem] inline-block rounded-full bg-brand-blue px-4 py-[0.55rem] text-[0.85rem] font-bold tracking-[0.05em] text-white">{active.perk}</div>
              <p className="mb-[1.8rem] text-[1rem] leading-[1.7] text-[#1A2547]">{active.desc}</p>

              <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
                {active.details.map((d) => (
                  <div key={d.label} className="flex items-start gap-[0.8rem] rounded-[16px] border border-[#E7E2D8] bg-white px-[1.1rem] py-4">
                    <div className="grid h-9 w-9 flex-none place-items-center rounded-[12px] bg-[rgba(0,71,233,0.10)] text-brand-blue">
                      <DetailIcon label={d.label} />
                    </div>
                    <div>
                      <div className="mb-[0.2rem] text-[0.7rem] font-bold uppercase tracking-[0.14em] text-[#5C6477]">{d.label}</div>
                      <div className="text-[0.92rem] font-medium leading-[1.4] text-brand-blue-dark">{d.value}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-[0.8rem] border-t border-[#E7E2D8] pt-4">
                {active.url && (
                  <a
                    href={active.url}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center justify-center gap-[0.55rem] rounded-full bg-brand-blue px-[1.9rem] py-[0.95rem] text-[0.82rem] font-bold uppercase tracking-[0.08em] text-white no-underline transition-all hover:-translate-y-0.5 hover:bg-[#0034B8] hover:shadow-[0_12px_24px_-10px_rgba(0,71,233,0.55)]"
                  >
                    {active.urlType === "wpp" ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    )}
                    <span>{active.urlLabel}</span>
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setOpenKey(null)}
                  className="inline-flex items-center justify-center gap-[0.55rem] rounded-full bg-brand-blue-dark px-[1.9rem] py-[0.95rem] text-[0.82rem] font-bold uppercase tracking-[0.08em] text-white transition-all hover:-translate-y-0.5 hover:bg-[#001A5C] cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
