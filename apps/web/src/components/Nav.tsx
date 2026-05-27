import { useEffect, useState } from "react";

type MenuItem =
  | { type: "link"; label: string; href: string; external?: boolean }
  | { type: "dropdown"; label: string; children: { label: string; href: string; external?: boolean }[] };

const items: MenuItem[] = [
  { type: "link", label: "Inicio", href: "/" },
  { type: "link", label: "Programas", href: "/programas/" },
  {
    type: "dropdown",
    label: "Nosotros",
    children: [
      { label: "Quiénes Somos", href: "/quienes-somos/" },
      { label: "Nuestro Campus", href: "/campus/" },
    ],
  },
  {
    type: "dropdown",
    label: "Level Up",
    children: [{ label: "Conoce Level Up", href: "/level-up/" }],
  },
  {
    type: "dropdown",
    label: "Estudiantes",
    children: [
      { label: "Alianzas", href: "/alianzas/" },
      { label: "Zona de Pagos", href: "https://esic.moonflow.ai/", external: true },
      { label: "Ubflex", href: "https://ceipaeduco.sharepoint.com/sites/ubflex-esic", external: true },
    ],
  },
];

const socials = [
  {
    label: "Instagram",
    href: "https://www.instagram.com/esicmedellin/",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/esic-medell%C3%ADn/",
    svg: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@esicmedellin",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1 0-5.78 2.92 2.92 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 3 15.57 6.33 6.33 0 0 0 9.37 22a6.33 6.33 0 0 0 6.33-6.33V9.18a8.16 8.16 0 0 0 3.89.98V6.69z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@ESICmedellin",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<Set<string>>(new Set());

  // Lock body scroll when overlay open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const closeOverlay = () => {
    setOpen(false);
    setOpenSubmenus(new Set());
  };

  return (
    <>
      {/* Pill nav — fixed top */}
      <nav
        className="esic-nav fixed top-4 left-1/2 -translate-x-1/2 z-[1000] flex items-center justify-between bg-white border-[1.5px] border-brand-blue rounded-full backdrop-blur-[14px] h-16 pl-6 pr-2 max-md:h-14 max-md:pl-4"
        style={{ width: "min(1240px, 94%)" }}
        aria-label="Navegación principal"
      >
        <a href="/" className="flex items-center shrink-0" aria-label="ESIC Medellín — Inicio">
          <img
            src="/images/brand/logo-esic.png"
            alt="ESIC Business & Marketing School"
            className="h-10 max-md:h-[34px] w-auto mix-blend-multiply"
          />
        </a>

        <div className="flex gap-3 items-center h-full">
          <a
            href="/programas/"
            className="inline-flex items-center justify-center h-full min-h-12 px-8 max-md:px-5 bg-brand-blue hover:bg-brand-blue-dark text-white text-[0.8rem] max-md:text-[0.75rem] font-semibold tracking-[0.12em] uppercase rounded-full transition-colors no-underline"
          >
            Programas
          </a>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="w-12 h-12 flex flex-col items-center justify-center gap-1.5 bg-transparent border-0 cursor-pointer"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
          >
            <span
              className={`block w-[26px] h-[2.5px] bg-brand-blue rounded-full transition-transform duration-300 ${
                open ? "translate-y-[8.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`block w-[26px] h-[2.5px] bg-brand-blue rounded-full transition-opacity duration-300 ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-[26px] h-[2.5px] bg-brand-blue rounded-full transition-transform duration-300 ${
                open ? "-translate-y-[8.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Full-screen overlay */}
      <div
        className={`fixed inset-0 z-[999] bg-[rgba(0,12,42,0.97)] backdrop-blur-sm flex flex-col items-center justify-center px-8 pt-24 pb-12 overflow-y-auto transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        aria-hidden={!open}
      >
        <ul className="list-none w-full max-w-[600px] text-center m-0 p-0">
          {items.map((item) => {
            if (item.type === "link") {
              return (
                <li key={item.label}>
                  <a
                    href={item.href}
                    onClick={closeOverlay}
                    className="block font-display font-bold uppercase text-[clamp(2rem,5vw,3.2rem)] text-white hover:text-brand-blue py-2 tracking-[0.02em] no-underline transition-colors"
                    style={{
                      textShadow: undefined,
                    }}
                  >
                    {item.label}
                  </a>
                </li>
              );
            }
            const isOpen = openSubmenus.has(item.label);
            return (
              <li key={item.label} className="block">
                <button
                  type="button"
                  onClick={() => toggleSubmenu(item.label)}
                  className="inline-flex items-center gap-2 font-display font-bold uppercase text-[clamp(2rem,5vw,3.2rem)] text-white hover:text-brand-blue py-2 tracking-[0.02em] bg-transparent border-0 cursor-pointer transition-colors"
                  aria-expanded={isOpen}
                >
                  {item.label}
                  <svg
                    viewBox="0 0 12 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    className={`w-[0.5em] h-[0.5em] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  >
                    <path d="M1 1l5 5 5-5" />
                  </svg>
                </button>
                <ul
                  className="list-none m-0 p-0 overflow-hidden transition-[max-height] duration-400 ease-out"
                  style={{ maxHeight: isOpen ? `${item.children.length * 48}px` : 0 }}
                >
                  {item.children.map((child) => (
                    <li key={child.href}>
                      <a
                        href={child.href}
                        target={child.external ? "_blank" : undefined}
                        rel={child.external ? "noopener" : undefined}
                        onClick={closeOverlay}
                        className="block text-[1.1rem] text-white/60 hover:text-brand-blue py-2 font-body transition-colors no-underline"
                      >
                        {child.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>

        <div className="flex gap-6 mt-12">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener"
              aria-label={s.label}
              className="text-white/50 hover:text-white transition-colors flex items-center justify-center"
            >
              <span className="block w-[22px] h-[22px]">{s.svg}</span>
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
