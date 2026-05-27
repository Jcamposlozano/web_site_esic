/**
 * SITEMAP DATA — mapa completo de páginas del rediseño
 *
 * Fuente: esic-redesign-wordpress/ (nav-global.html, footer-global.html, index.html
 * + listado de archivos *-elementor.html oficiales según CLAUDE.md).
 *
 * Status:
 *   built    → ya existe en React (apps/web/src/pages/)
 *   pending  → existe en WordPress y falta migrar
 *   external → enlace externo (Zoho, Moonflow, redes, blog en WP-only)
 *   legal    → footer / política
 *
 * Sources (de dónde se llega):
 *   menu     → menú principal
 *   submenu  → submenu del menú
 *   cta      → CTA del nav ("Programas")
 *   banner   → carrusel de la home
 *   home     → tarjeta/sección de la home
 *   footer   → footer
 *   blog     → tarjetas Rethink (publicaciones WP)
 *   social   → iconos sociales del menú
 */

export type Status = "built" | "pending" | "external" | "legal";
export type Source = "menu" | "submenu" | "cta" | "banner" | "home" | "footer" | "blog" | "social";
export type Area =
  | "pregrado"
  | "master"
  | "executive"
  | "level-up"
  | "institucional"
  | "evento"
  | "estudiantes"
  | "legal"
  | "blog"
  | "social";

export interface SitemapNode {
  label: string;
  href?: string;
  status: Status;
  sources: Source[];
  wpFile?: string;
  area?: Area;
  note?: string;
  children?: SitemapNode[];
}

export const statusMeta: Record<Status, { label: string; class: string }> = {
  built: { label: "BUILT", class: "bg-brand-teal text-brand-blue-dark" },
  pending: { label: "PENDING", class: "bg-brand-orange text-white" },
  external: { label: "EXTERNAL", class: "bg-ink-light text-white" },
  legal: { label: "LEGAL", class: "bg-brand-blue-dark text-white" },
};

export const sourceMeta: Record<Source, string> = {
  menu: "Menú",
  submenu: "Submenú",
  cta: "CTA nav",
  banner: "Banner home",
  home: "Sección home",
  footer: "Footer",
  blog: "Rethink",
  social: "Redes",
};

export const areaColor: Record<Area, string> = {
  pregrado: "#FF8701",
  master: "#09CF90",
  executive: "#0047E9",
  "level-up": "#A78BFA",
  institucional: "#00133F",
  evento: "#FF4394",
  estudiantes: "#7BA8FF",
  legal: "#5F6B7A",
  blog: "#0AE4C3",
  social: "#97A2B1",
};

export const tree: SitemapNode[] = [
  {
    label: "Inicio",
    href: "/",
    status: "built",
    sources: ["menu"],
    area: "institucional",
    wpFile: "index.html",
    note: "Home — 8 secciones (Banner, Por Qué, Programas, Campus, Cifras, Historias, Fundadores, Rethink)",
  },
  {
    label: "Programas (página índice)",
    href: "/programas/",
    status: "built",
    sources: ["menu", "cta", "home"],
    area: "institucional",
    wpFile: "pages/programas-elementor.html",
    children: [
      {
        label: "PREGRADO",
        status: "pending",
        sources: ["home"],
        area: "pregrado",
        children: [
          {
            label: "Pregrado general",
            href: "/pregrado/",
            status: "built",
            sources: ["banner"],
            area: "pregrado",
            wpFile: "pregrado-definitiva/index.html",
            note: "La oficial es pregrado-definitiva/, NO pregrado/",
          },
          {
            label: "Dirección de Marketing Global",
            href: "/pregrado-marketing-global/",
            status: "built",
            sources: ["home"],
            area: "pregrado",
            wpFile: "pregrado/marketing-global-elementor.html",
          },
          {
            label: "Digital Business",
            href: "/pregrado-digital-business/",
            status: "built",
            sources: ["home"],
            area: "pregrado",
            wpFile: "pregrado/digital-business-elementor.html",
          },
          {
            label: "Becas de Pregrado",
            href: "/pregrado/becas/",
            status: "built",
            sources: [],
            area: "pregrado",
            wpFile: "pregrado/becas-elementor.html",
            note: "No enlazada desde menú; landing de becas",
          },
        ],
      },
      {
        label: "MÁSTER",
        status: "pending",
        sources: ["home"],
        area: "master",
        children: [
          {
            label: "Máster general",
            href: "/master/",
            status: "built",
            sources: ["banner"],
            area: "master",
            wpFile: "master/index.html",
          },
          {
            label: "Máster en Digital Business",
            href: "/master-digital-business/",
            status: "built",
            sources: ["home"],
            area: "master",
            wpFile: "master/digital-business-elementor.html",
          },
          {
            label: "Máster en Customer Experience Management",
            href: "/master-customer-experience/",
            status: "built",
            sources: ["home"],
            area: "master",
            wpFile: "master/customer-experience-elementor.html",
          },
          {
            label: "Máster en Digital Marketing",
            href: "/master-digital-marketing/",
            status: "built",
            sources: ["home"],
            area: "master",
            wpFile: "master/digital-marketing-elementor.html",
          },
          {
            label: "Becas Máster",
            href: "/master/becas/",
            status: "built",
            sources: [],
            area: "master",
            wpFile: "master/becas.html",
            note: "Existe en WP, no enlazada desde menú",
          },
        ],
      },
      {
        label: "EXECUTIVE PROGRAMS",
        status: "pending",
        sources: ["home"],
        area: "executive",
        children: [
          {
            label: "Executive Programs (índice)",
            href: "/executive-programs/",
            status: "built",
            sources: [],
            area: "executive",
            wpFile: "executive-programs/index.html",
          },
          {
            label: "Digital Business Transformation",
            href: "/digital-business-transformation/",
            status: "built",
            sources: ["home"],
            area: "executive",
            wpFile: "executive-programs/elementor-widget.html",
          },
        ],
      },
    ],
  },
  {
    label: "Nosotros",
    status: "pending",
    sources: ["menu"],
    area: "institucional",
    note: "Dropdown del menú",
    children: [
      {
        label: "Quiénes Somos",
        href: "/quienes-somos/",
        status: "built",
        sources: ["submenu", "home", "footer"],
        area: "institucional",
        wpFile: "institucional/quienes-somos-elementor.html",
        note: "Linkeada desde footer y desde sección 'Por qué ESIC' de la home",
      },
      {
        label: "Nuestro Campus",
        href: "/campus/",
        status: "built",
        sources: ["submenu", "home", "banner"],
        area: "institucional",
        wpFile: "campus.html",
        note: "Linkeada desde rompescroll de campus + banner",
      },
      {
        label: "Equipo",
        href: "/equipo/",
        status: "built",
        sources: [],
        area: "institucional",
        wpFile: "equipo/equipo-elementor.html",
        note: "No enlazada desde menú; existe la página",
      },
    ],
  },
  {
    label: "Level Up",
    status: "pending",
    sources: ["menu"],
    area: "level-up",
    note: "Dropdown del menú",
    children: [
      {
        label: "Conoce Level Up",
        href: "/level-up/",
        status: "built",
        sources: ["submenu"],
        area: "level-up",
        wpFile: "level-up/level-up-elementor.html",
      },
      {
        label: "Estrategia Marketing Digital",
        href: "/level-up/estrategia-marketing-digital/",
        status: "built",
        sources: [],
        area: "level-up",
        wpFile: "level-up/estrategia-marketing-digital-elementor.html",
        note: "Curso específico de Level Up",
      },
      {
        label: "Cursos (plantillas)",
        status: "pending",
        sources: [],
        area: "level-up",
        note: "Templates reutilizables, no son páginas finales",
        children: [
          {
            label: "Info de curso (template)",
            status: "pending",
            sources: [],
            area: "level-up",
            wpFile: "level-up/cursos/info-curso-elementor.html",
          },
          {
            label: "Mentor + precio (template)",
            status: "pending",
            sources: [],
            area: "level-up",
            wpFile: "level-up/cursos/mentor-precio-elementor.html",
          },
          {
            label: "Módulos (template)",
            status: "pending",
            sources: [],
            area: "level-up",
            wpFile: "level-up/cursos/modulos-elementor.html",
          },
        ],
      },
    ],
  },
  {
    label: "Estudiantes",
    status: "pending",
    sources: ["menu"],
    area: "estudiantes",
    note: "Dropdown del menú",
    children: [
      {
        label: "Alianzas",
        href: "/alianzas/",
        status: "built",
        sources: ["submenu"],
        area: "estudiantes",
        wpFile: "alianzas/alianzas-elementor.html",
      },
      {
        label: "Zona de Pagos",
        href: "https://esic.moonflow.ai/",
        status: "external",
        sources: ["submenu"],
        area: "estudiantes",
        note: "External: Moonflow (no se migra)",
      },
      {
        label: "Ubflex",
        href: "https://ceipaeduco.sharepoint.com/sites/ubflex-esic",
        status: "external",
        sources: ["submenu"],
        area: "estudiantes",
        note: "External: SharePoint (no se migra)",
      },
    ],
  },
  {
    label: "Eventos & Lanzamientos",
    status: "pending",
    sources: ["banner"],
    area: "evento",
    note: "No están en menú; accesibles desde banners / campañas",
    children: [
      {
        label: "Open Day",
        href: "/open-day/",
        status: "built",
        sources: ["banner"],
        area: "evento",
        wpFile: "open-day/open-day-elementor.html",
      },
      {
        label: "Open Day — Confirmación",
        href: "/open-day/confirmacion/",
        status: "built",
        sources: [],
        area: "evento",
        wpFile: "open-day/confirmacion-open-day-elementor.html",
        note: "Página post-inscripción",
      },
      {
        label: "Start-Up Day",
        href: "/start-up-day/",
        status: "built",
        sources: [],
        area: "evento",
        wpFile: "start-up-day/start-up-day-elementor.html",
      },
      {
        label: "Hatsu",
        href: "/hatsu/",
        status: "built",
        sources: [],
        area: "evento",
        wpFile: "hatsu/hatsu-elementor.html",
        note: "Landing de Hatsu (curso/programa específico)",
      },
      {
        label: "Pasantías — Inscripción",
        href: "https://forms.zohopublic.com/esicmedellin/form/InscripcionesPasantas/formperma/_OGwsRPwnka1ZLXJBqSMVtl-yE_Mk7E8V14gtDRfkag",
        status: "external",
        sources: ["banner"],
        area: "evento",
        note: "External: Zoho form",
      },
    ],
  },
  {
    label: "Emprendimientos",
    href: "/emprendimientos/",
    status: "built",
    sources: [],
    area: "institucional",
    wpFile: "emprendimientos/index.html",
    note: "Página existe, falta entrada en menú",
  },
  {
    label: "Gracias (post-form)",
    href: "/gracias/",
    status: "built",
    sources: [],
    area: "institucional",
    wpFile: "gracias.html",
    note: "Página de confirmación tras envío de formularios",
  },
  {
    label: "Rethink — Blog & Podcast",
    status: "pending",
    sources: ["home"],
    area: "blog",
    note: "Sección Rethink de la home. Posts viven hoy en WP.",
    children: [
      {
        label: "Aprender a decidir: el valor de los casos reales en el aula",
        href: "/blog/aprender-a-decidir-el-valor-de-los-casos-reales-en-el-aula/",
        status: "pending",
        sources: ["blog"],
        area: "blog",
        note: "Post de blog. Falta sistema de CMS / Markdown",
      },
      {
        label: "Formar criterio directivo",
        href: "/blog/formar-criterio-directivo/",
        status: "pending",
        sources: ["blog"],
        area: "blog",
      },
      {
        label: "Ser o no ser: el papel de la página web en 2026",
        href: "/blog/ser-o-no-ser-el-papel-de-la-pagina-web-en-2026/",
        status: "pending",
        sources: ["blog", "banner"],
        area: "blog",
        note: "También aparece en el carrusel",
      },
      {
        label: "Emprender sin fundar una startup",
        href: "/blog/emprender-sin-fundar-una-startup-el-nuevo-perfil-del-profesional-emprendedor/",
        status: "pending",
        sources: ["blog"],
        area: "blog",
      },
      {
        label: "Excelencia académica",
        href: "/blog/excelencia-academica-cuando-la-educacion-deja-de-ser-contenido-y-se-convierte-en-criterio/",
        status: "pending",
        sources: ["blog"],
        area: "blog",
      },
      {
        label: "Rethink Podcast Ep. 29 — Sebastián Chinkovsky",
        href: "https://www.youtube.com/watch?v=zS-ibHyImvI",
        status: "external",
        sources: ["blog"],
        area: "blog",
        note: "Episodios viven en YouTube",
      },
      {
        label: "Rethink Podcast Ep. 28 — Federico Hoyos",
        href: "https://www.youtube.com/watch?v=XFziCxsoUr0",
        status: "external",
        sources: ["blog"],
        area: "blog",
      },
    ],
  },
  {
    label: "Footer · Legal",
    status: "pending",
    sources: ["footer"],
    area: "legal",
    children: [
      {
        label: "Políticas de Privacidad",
        href: "/politicas-de-privacidad/",
        status: "legal",
        sources: ["footer"],
        area: "legal",
        note: "Texto legal requerido para formularios",
      },
      {
        label: "Tratamiento de Datos Personales",
        href: "/tratamiento-de-datos-personales/",
        status: "legal",
        sources: ["footer"],
        area: "legal",
      },
    ],
  },
  {
    label: "Redes sociales",
    status: "external",
    sources: ["social"],
    area: "social",
    children: [
      {
        label: "Instagram @esicmedellin",
        href: "https://www.instagram.com/esicmedellin/",
        status: "external",
        sources: ["social"],
        area: "social",
      },
      {
        label: "LinkedIn ESIC Medellín",
        href: "https://www.linkedin.com/company/esic-medell%C3%ADn/",
        status: "external",
        sources: ["social"],
        area: "social",
      },
      {
        label: "TikTok @esicmedellin",
        href: "https://www.tiktok.com/@esicmedellin",
        status: "external",
        sources: ["social"],
        area: "social",
      },
      {
        label: "YouTube @ESICmedellin",
        href: "https://www.youtube.com/@ESICmedellin",
        status: "external",
        sources: ["social"],
        area: "social",
      },
    ],
  },
];

/** Returns a flat list of all nodes (for stats / search). */
export function flatten(nodes: SitemapNode[]): SitemapNode[] {
  return nodes.flatMap((n) => [n, ...(n.children ? flatten(n.children) : [])]);
}
