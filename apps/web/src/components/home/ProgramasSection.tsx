import { useState } from "react";
import { asset } from "../../lib/assets";

type Programa = {
  href: string;
  title: string;
  duration: string;
  image: string;
  imageMobile?: string;
  titleColor: string;
  flags?: boolean;
};

type TabKey = "pregrados" | "master" | "executive";

const data: Record<TabKey, Programa[]> = {
  pregrados: [
    {
      href: "/pregrado-marketing-global",
      title: "Dirección de Marketing Global",
      duration: "4 años · Doble titulación",
      image: asset("home/programas/marketing-global.webp"),
      imageMobile: asset("home/programas/marketing-global-mobile.webp"),
      titleColor: "#FF9600",
      flags: true,
    },
    {
      href: "/pregrado-digital-business/",
      title: "Digital Business",
      duration: "4 años · Doble titulación",
      image: asset("home/programas/digital-business.webp"),
      imageMobile: asset("home/programas/digital-business-mobile.webp"),
      titleColor: "#FF9600",
      flags: true,
    },
  ],
  master: [
    {
      href: "/master-digital-business",
      title: "Máster en Digital Business",
      duration: "11 meses · Modalidad híbrida",
      image: asset("home/programas/master-digital-business.webp"),
      imageMobile: asset("home/programas/master-digital-business-mobile.webp"),
      titleColor: "#09CF90",
    },
    {
      href: "/master-customer-experience",
      title: "Máster en Customer Experience Management",
      duration: "11 meses · Modalidad híbrida",
      image: asset("home/programas/master-cx.webp"),
      imageMobile: asset("home/programas/master-cx-mobile.webp"),
      titleColor: "#09CF90",
    },
    {
      href: "/master-digital-marketing",
      title: "Máster en Digital Marketing",
      duration: "11 meses · Modalidad híbrida",
      image: asset("home/programas/master-digital-marketing.webp"),
      imageMobile: asset("home/programas/master-digital-marketing-mobile.webp"),
      titleColor: "#09CF90",
    },
  ],
  executive: [
    {
      href: "/digital-business-transformation",
      title: "Executive Program",
      duration: "4 meses · Liderazgo y transformación digital",
      image: asset("home/programas/executive-program.webp"),
      imageMobile: asset("home/programas/executive-program-mobile.webp"),
      titleColor: "#C09C2E",
    },
  ],
};

const tabs: { key: TabKey; label: string }[] = [
  { key: "pregrados", label: "Pregrados" },
  { key: "master", label: "Máster" },
  { key: "executive", label: "Executive Programs" },
];

const FlagColombia = () => (
  <svg viewBox="0 0 30 20" width="24" height="16" style={{ borderRadius: 2 }} aria-label="Colombia">
    <rect width="30" height="6.67" fill="#FCD116" />
    <rect y="6.67" width="30" height="6.67" fill="#003893" />
    <rect y="13.33" width="30" height="6.67" fill="#CE1126" />
  </svg>
);

const FlagSpain = () => (
  <svg viewBox="0 0 30 20" width="24" height="16" style={{ borderRadius: 2 }} aria-label="España">
    <rect width="30" height="20" fill="#AA151B" />
    <rect y="5" width="30" height="10" fill="#F1BF00" />
  </svg>
);

export default function ProgramasSection() {
  const [active, setActive] = useState<TabKey>("pregrados");

  return (
    <>
      <div className="flex flex-wrap justify-between items-start gap-8 mb-12">
        <h2 className="font-display text-5xl md:text-7xl font-extrabold uppercase leading-[0.95] text-brand-blue-dark">
          Explora<br />nuestros<br />programas
        </h2>
        <div className="text-left md:text-right max-w-[320px]">
          <p className="text-ink-muted text-sm mb-3">
            Escuela de Negocios Española con +60 años, líder en Marketing y Economía Digital.
          </p>
          <a
            href="/programas"
            className="inline-flex items-center rounded-full bg-brand-blue text-white text-[0.75rem] font-bold uppercase tracking-[0.06em] px-4 py-2.5 hover:bg-brand-blue-dark transition-colors no-underline"
          >
            Ver todos los programas
          </a>
        </div>
      </div>

      <div className="border-b border-[#E0E0E0] mb-8">
        <div className="flex gap-12 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActive(tab.key)}
              className={`relative font-body text-[0.9rem] font-semibold uppercase tracking-[0.08em] py-4 whitespace-nowrap transition-colors ${
                active === tab.key ? "text-brand-blue-dark" : "text-ink-light hover:text-ink"
              }`}
            >
              {tab.label}
              <span
                className={`absolute bottom-[-1px] left-0 right-0 h-[3px] bg-brand-blue-dark origin-left transition-transform ${
                  active === tab.key ? "scale-x-100" : "scale-x-0"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {data[active].map((p) => (
          <a
            key={p.href}
            href={p.href}
            className="programa-card relative block rounded-2xl overflow-hidden aspect-[16/9] no-underline transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,19,63,0.2)]"
            style={{
              backgroundImage: `url(${p.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center top",
            }}
          >
            <div className="absolute inset-0 z-[1] rounded-2xl bg-[linear-gradient(90deg,rgba(0,0,0,0.98)_0%,rgba(0,0,0,0.9)_30%,rgba(0,0,0,0.7)_50%,rgba(0,0,0,0.4)_70%,rgba(0,0,0,0.2)_100%)]" />
            <div className="absolute top-0 bottom-0 left-0 w-[70%] p-6 md:p-8 flex flex-col justify-center text-white z-[2]">
              <h3
                className="font-display text-2xl md:text-4xl font-extrabold uppercase leading-[1.05] mb-2"
                style={{ color: p.titleColor }}
              >
                {p.title}
              </h3>
              <span className="text-[1rem] md:text-[1.1rem] opacity-95 mt-1">{p.duration}</span>
              {p.flags && (
                <span className="inline-flex gap-1.5 items-center mt-2">
                  <FlagColombia />
                  <FlagSpain />
                </span>
              )}
              <span className="inline-flex items-center gap-2 mt-5 px-4 py-2 border border-white/50 rounded-lg text-[0.8rem] font-semibold uppercase tracking-[0.04em] w-fit hover:bg-white/20 transition-colors">
                Ver programa
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </span>
            </div>
          </a>
        ))}
      </div>
    </>
  );
}
