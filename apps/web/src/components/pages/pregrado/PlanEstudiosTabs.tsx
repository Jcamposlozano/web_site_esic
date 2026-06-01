import { useState } from "react";

const ArrowRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);
const ArrowDown = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
    <path d="M12 5v14M5 12l7 7 7-7" />
  </svg>
);

export interface PlanItem {
  label: string;
  detail: string;
}

export interface PlanYear {
  /** Label de la pestaña, ej. "Año 1" */
  tab: string;
  /** Título del bloque de contenido */
  title: string;
  items: PlanItem[];
  /** Nota destacada opcional al pie (Summer Camp / Opción / Doble Titulación) */
  note?: { label: string; text: string };
}

export interface Institution {
  /** Título del título (puede traer <br/>) */
  title: string;
  /** Subtítulo pequeño */
  subtitle?: string;
  logo: string;
  logoAlt: string;
}

interface Props {
  years: PlanYear[];
  institutions: Institution[];
  brochureHref: string;
  /** href para "explora otros programas" / "ver todos los programas" */
  programsHref: string;
  /** ancla del formulario, ej. "#formulario" */
  formHref?: string;
}

export default function PlanEstudiosTabs({
  years,
  institutions,
  brochureHref,
  programsHref,
  formHref = "#formulario",
}: Props) {
  const [activeSection, setActiveSection] = useState<"estudios" | "programas">("estudios");
  const [activeYear, setActiveYear] = useState(0);

  const mainTab = (id: "estudios" | "programas", label: string) => (
    <button
      type="button"
      onClick={() => setActiveSection(id)}
      className={`font-body text-[0.9rem] font-medium uppercase tracking-[0.05em] pb-4 -mb-px border-b-[3px] transition-colors cursor-pointer bg-transparent ${
        activeSection === id
          ? "text-ink border-brand-blue"
          : "text-ink-light border-transparent hover:text-ink"
      }`}
    >
      {label}
    </button>
  );

  return (
    <div>
      {/* Main tabs */}
      <div className="flex gap-6 md:gap-12 border-b border-[rgba(0,19,63,0.12)] mb-8 flex-wrap">
        {mainTab("estudios", "Plan de estudios")}
        {mainTab("programas", "Ver programas")}
      </div>

      {activeSection === "estudios" ? (
        <>
          {/* Year tabs */}
          <div className="flex gap-3 md:gap-6 mb-3 flex-wrap">
            {years.map((y, i) => (
              <button
                key={y.tab}
                type="button"
                onClick={() => setActiveYear(i)}
                className={`flex-1 min-w-[calc(50%-0.5rem)] md:min-w-0 px-4 py-3 md:px-6 rounded-xl border text-center font-body text-[0.9rem] md:text-[0.95rem] font-medium transition-all cursor-pointer ${
                  activeYear === i
                    ? "bg-brand-blue border-brand-blue text-white"
                    : "bg-white border-[rgba(0,19,63,0.12)] text-ink-muted hover:border-brand-blue hover:text-brand-blue"
                }`}
              >
                {y.tab}
              </button>
            ))}
          </div>

          {/* Content card */}
          <div className="bg-white rounded-b-[20px] overflow-hidden shadow-[0_10px_40px_rgba(0,19,63,0.08)]">
            <div className="h-3 bg-brand-orange" />
            <div className="p-6 md:p-8">
              <h4 className="font-display uppercase text-brand-blue mb-3 text-lg md:text-xl">
                {years[activeYear].title}
              </h4>
              <div className="flex flex-col gap-1">
                {years[activeYear].items.map((it) => (
                  <div
                    key={it.label}
                    className="grid grid-cols-[16px_1fr] md:grid-cols-[12px_minmax(0,200px)_1fr] items-start gap-2 md:gap-4 py-3 text-[0.9rem] md:text-[0.95rem] text-ink border-b border-black/5 last:border-0 min-w-0"
                  >
                    <span className="w-3 h-3 rounded-full bg-brand-orange shrink-0 mt-1.5" />
                    <strong className="col-start-2 font-semibold text-brand-blue-dark leading-snug break-words pr-2 text-[0.9rem] md:text-base">
                      {it.label}
                    </strong>
                    <span className="col-start-2 md:col-start-3 text-ink-muted md:text-ink text-[0.85rem] md:text-[0.95rem] break-words">
                      {it.detail}
                    </span>
                  </div>
                ))}
              </div>
              {years[activeYear].note && (
                <p className="mt-6 p-4 rounded-xl text-[0.9rem] bg-[rgba(255,135,1,0.12)] border-l-4 border-brand-orange">
                  <strong>{years[activeYear].note!.label}</strong> {years[activeYear].note!.text}
                </p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 md:gap-4 mt-8 mb-12 flex-wrap">
            <a
              href={brochureHref}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-[0.95rem] no-underline transition-all hover:-translate-y-0.5 bg-brand-blue text-white hover:bg-brand-blue-dark"
            >
              Brochure del programa <ArrowRight />
            </a>
            <a
              href={programsHref}
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-[0.95rem] no-underline transition-all hover:-translate-y-0.5 bg-transparent border-2 border-brand-orange text-brand-orange hover:bg-[rgba(255,150,0,0.1)]"
            >
              Explora otros programas <ArrowRight />
            </a>
            <a
              href={formHref}
              className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-[0.95rem] no-underline transition-all hover:-translate-y-0.5 bg-transparent border-2 border-brand-orange text-brand-orange hover:bg-[rgba(255,150,0,0.1)]"
            >
              Solicitar información <ArrowDown />
            </a>
          </div>

          {/* Institutions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 max-w-[700px]">
            {institutions.map((inst) => (
              <div
                key={inst.title}
                className="rounded-[20px] overflow-hidden shadow-[0_10px_40px_rgba(0,19,63,0.08)] grid grid-rows-[1fr_auto]"
              >
                <div className="bg-brand-orange p-6">
                  <h4
                    className="font-display text-2xl uppercase leading-tight text-white"
                    dangerouslySetInnerHTML={{ __html: inst.title }}
                  />
                  {inst.subtitle && (
                    <small className="block mt-2 font-body text-xs font-normal opacity-85 text-white">
                      {inst.subtitle}
                    </small>
                  )}
                </div>
                <div className="bg-white p-6 flex items-center justify-center min-h-[80px]">
                  <img src={inst.logo} alt={inst.logoAlt} className="max-h-[45px] max-w-[140px]" />
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="flex gap-4 mt-2 flex-wrap">
          <a
            href={programsHref}
            className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold text-[0.95rem] no-underline transition-all hover:-translate-y-0.5 bg-brand-blue text-white hover:bg-brand-blue-dark"
          >
            Ver todos los programas <ArrowRight />
          </a>
        </div>
      )}
    </div>
  );
}
