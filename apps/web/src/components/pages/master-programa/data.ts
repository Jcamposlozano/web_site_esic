/**
 * Datos por programa para las 3 páginas de Másters Específicos de ESIC.
 *
 * Las 3 páginas (Digital Business, Customer Experience, Digital Marketing)
 * comparten EXACTAMENTE el mismo patrón de secciones (hero oscuro → explora+form
 * → beneficios → ESIC sede Medellín con video → inversión/precios → plan de
 * estudios con acordeón). Lo único que cambia es el copy de cada máster.
 *
 * Copy verbatim del original WordPress (entidades HTML decodificadas a UTF-8).
 * Fuente: esic-redesign-wordpress/master/{digital-business,customer-experience,
 * digital-marketing}-elementor.html
 */

export interface PlanModule {
  /** "01", "02"... */
  num: string;
  title: string;
  /** Descripción corta del módulo (CX la tiene; DM no la trae en el original). */
  description?: string;
  topics: string[];
}

export interface PricingFeature {
  text: string;
}

export interface MasterProgramData {
  /** slug usado para ids únicos en el DOM (emdb / emcx / emdm) */
  slug: string;
  /** <title> de la página */
  metaTitle: string;
  metaDescription: string;

  /** Hero full-bleed: imagen local desktop + mobile + alt */
  hero: {
    desktop: string;
    mobile: string;
    alt: string;
  };

  /** Sección "Explora" + formulario */
  intro: {
    heading: string;
    paragraphs: string[];
  };

  /** Título del formulario (FormPlaceholder) */
  formTitle: string;

  /** Beneficios (4 items con icono SVG identificado por key) */
  benefits: { icon: "calendar" | "screen" | "pin" | "globe"; label: string }[];

  /** Sección ESIC Sede Medellín */
  sede: {
    heading: string;
    paragraphs: string[];
    /** id de YouTube embed (mismo en las 3 en el original) */
    youtubeId: string;
    videoTitle: string;
  };

  /** Inversión / precios */
  pricing: {
    heading: string;
    subtitle: string;
    cardTitle: string;
    price: string;
    priceCurrency: string;
    features: string[];
    note: {
      title: string;
      body: string;
      ctaLabel: string;
    };
  };

  /** Plan de estudios */
  plan: {
    heading: string;
    /** subtítulo opcional (DM no lo trae) */
    subtitle?: string;
    modules: PlanModule[];
    brochureUrl: string;
  };
}

/* ── Contacto compartido (idéntico en las 3 páginas) ─────────────────── */
export const CONTACT = {
  phoneDisplay: "318 086 6698",
  phoneHref: "tel:3180866698",
  email: "analistacorporate@esic.co",
};

/* ── MÁSTER EN DIGITAL BUSINESS ──────────────────────────────────────── */
export const digitalBusiness: MasterProgramData = {
  slug: "emdb",
  metaTitle: "Máster en Digital Business — ESIC Medellín",
  metaDescription:
    "Máster en Digital Business de ESIC Medellín. 11 meses, modalidad híbrida, inmersión en Madrid y título privado de ESIC España.",
  hero: {
    desktop: "/images/wp/2026/05/master-digital-business-desktop-scaled.webp",
    mobile: "/images/wp/2026/05/master-digital-business-mobile-scaled.webp",
    alt: "Master Digital Business - ESIC",
  },
  intro: {
    heading:
      "EN UN MUNDO DONDE LA TECNOLOGÍA CAMBIA CADA DÍA, LAS EMPRESAS NECESITAN LÍDERES",
    paragraphs: [
      "Las empresas y los emprendimientos necesitan líderes capaces de conectar estrategia, innovación y sentido humano. En ESIC formarás parte de una comunidad global que lleva más de 60 años transformando talento con impacto.",
    ],
  },
  formTitle: "Máster en Digital Business",
  benefits: [
    { icon: "calendar", label: "11 Meses" },
    { icon: "screen", label: "Híbrido" },
    { icon: "pin", label: "Inmersión Madrid" },
    { icon: "globe", label: "Título Español" },
  ],
  sede: {
    heading: "ESIC SEDE MEDELLÍN",
    paragraphs: [
      "Medellín quiere ser el motor de la transformación digital para Latinoamérica. Los gobiernos local y nacional y el sector privado de la ciudad han trabajado juntos en ese propósito.",
      "ESIC gestó una alianza sin precedentes con los principales empresarios del país, para hacer viable la llegada de una escuela de negocios de primer mundo. Es así como llega ESIC a Medellín, convirtiéndose en el campus número 13 de la escuela en el mundo y su puerta de entrada hacia América Latina.",
    ],
    youtubeId: "F9ulSW9vlAE",
    videoTitle: "ESIC Medellín: 4 años diseñando futuros",
  },
  pricing: {
    heading: "INVERSIÓN EN TU FUTURO",
    subtitle: "Conoce el valor de tu formación de posgrado en ESIC Medellín.",
    cardTitle: "Valor Total",
    price: "$39.700.000",
    priceCurrency: "COP",
    features: [
      "11 meses de formación",
      "Inmersión internacional en ESIC Madrid",
      "Global Management Program + Máster con Título Privado ESIC España",
      "Formación en liderazgo",
    ],
    note: {
      title: "Personaliza tu plan de pagos",
      body: "Nuestro equipo de admisiones está listo para guiarte. En ESIC puedes personalizar tus pagos de manera mensual.",
      ctaLabel: "Agenda una asesoría personalizada",
    },
  },
  plan: {
    heading: "PLAN DE ESTUDIOS",
    subtitle:
      "5 módulos diseñados para transformar tu visión estratégica en negocios digitales.",
    brochureUrl: "/images/wp/2026/05/Brochure-Master-DB-2016-Mff.pdf",
    modules: [
      {
        num: "01",
        title: "Gestión y Ecosistema Digital",
        description:
          "Entiende cómo funcionan los negocios en la era digital y aprende a gestionar estratégicamente su transformación.",
        topics: [
          "El Ecosistema Digital",
          "El Cliente Digital",
          "Modelos de Negocio Digital I",
          "Modelos de Negocio Digital II",
          "Gestión de operaciones en entornos digitales",
          "Gestión del talento en la economía digital",
          "Gestión financiera en la economía digital",
          "Aspectos jurídicos en entornos digitales",
        ],
      },
      {
        num: "02",
        title: "Tecnologías Emergentes",
        description:
          "Aplica tecnologías emergentes para impulsar la innovación y generar valor real en las organizaciones.",
        topics: [
          "Contexto global de tecnologías emergentes",
          "IA 1: Alfabetización, contexto y modelos",
          "IA 2: Herramientas, prompting avanzado e intelligent workflows",
          "IA 3: Agentes y automatización estratégica",
          "IoT, automatización y sistemas conectados",
          "Cloud & Data: arquitecturas modernas",
          "Experiencias inmersivas y nuevas interfaces",
          "Blockchain, Web3 y Ciberseguridad",
        ],
      },
      {
        num: "03",
        title: "Emprendimiento e Innovación",
        description:
          "Desarrolla una mentalidad emprendedora e innovadora para crear o transformar negocios, dentro o fuera de una organización.",
        topics: [
          "Mindset de intraemprendedores",
          "Fundamentos de innovación",
          "Generación de valor a través de la innovación",
          "Estrategia, propuesta de valor y Business Model Canvas",
          "Metodologías ágiles y prototipado",
          "Transformación a través de modelos de segmentación de negocio",
          "Crecimiento & financiación",
        ],
      },
      {
        num: "04",
        title: "Estrategias de Marketing Digital",
        description:
          "Diseña y lidera estrategias digitales que conectan marcas, plataformas, datos y resultados.",
        topics: [
          "Diseño de un plan de marketing digital",
          "SEO & SEM",
          "Inbound marketing y branded content",
          "Planificación de medios y publicidad programática",
          "Generación & cualificación de leads",
          "Email y marketing de afiliación",
          "Web y apps móviles",
          "Redes sociales y Marketing Analytics",
        ],
      },
      {
        num: "05",
        title: "Ecommerce y Omnicanalidad",
        description:
          "Integra canales y experiencias para optimizar la rentabilidad y el crecimiento del negocio digital.",
        topics: [
          "Plan estratégico de ecommerce",
          "Merchandising digital y experiencia de compra",
          "Conversión y embudos de venta",
          "Presupuesto y objetivos financieros",
          "Costos, ingresos y rentabilidad",
          "Integración presupuestal: ecommerce & negocio",
          "Omnicanalidad e internacionalización",
          "Ecommerce y digitalización de tiendas físicas",
        ],
      },
    ],
  },
};

/* ── MÁSTER EN CUSTOMER EXPERIENCE MANAGEMENT ────────────────────────── */
export const customerExperience: MasterProgramData = {
  slug: "emcx",
  metaTitle: "Máster en Customer Experience Management — ESIC Medellín",
  metaDescription:
    "Máster en Customer Experience Management de ESIC Medellín. 11 meses, modalidad híbrida, inmersión en Madrid y título privado de ESIC España.",
  hero: {
    desktop:
      "/images/wp/2026/05/master-customer-experience-management-mayo-2027-desktop-scaled.webp",
    mobile:
      "/images/wp/2026/05/master-customer-experience-management-mayo-2027-mobile-scaled.webp",
    alt: "Máster Customer Experience Management ESIC",
  },
  intro: {
    heading:
      "CUANDO LAS EXPECTATIVAS CAMBIAN, LIDERAR LA EXPERIENCIA DEL CLIENTE MARCA LA DIFERENCIA",
    paragraphs: [
      "Desarrolla una visión estratégica de la experiencia del cliente como generadora de valor. Lidera la gestión integral del Customer Experience en cualquier sector, basándote en datos, tecnología e innovación.",
    ],
  },
  formTitle: "Máster en Customer Experience Management",
  benefits: [
    { icon: "calendar", label: "11 Meses" },
    { icon: "screen", label: "Híbrido" },
    { icon: "pin", label: "Inmersión Madrid" },
    { icon: "globe", label: "Título Español" },
  ],
  sede: {
    heading: "ESIC SEDE MEDELLÍN",
    paragraphs: [
      "Medellín quiere ser el motor de la transformación digital para Latinoamérica. Los gobiernos local y nacional y el sector privado de la ciudad han trabajado juntos en ese propósito.",
      "ESIC gestó una alianza sin precedentes con los principales empresarios del país, para hacer viable la llegada de una escuela de negocios de primer mundo. Es así como llega ESIC a Medellín, convirtiéndose en el campus número 13 de la escuela en el mundo y su puerta de entrada hacia América Latina.",
    ],
    youtubeId: "F9ulSW9vlAE",
    videoTitle: "ESIC Medellín: 4 años diseñando futuros",
  },
  pricing: {
    heading: "INVERSIÓN EN TU FUTURO",
    subtitle: "Conoce el valor de tu formación de posgrado en ESIC Medellín.",
    cardTitle: "Valor Total",
    price: "$39.700.000",
    priceCurrency: "COP",
    features: [
      "11 meses de formación",
      "Inmersión internacional en ESIC Madrid",
      "Global Management Program + Máster con Título Privado ESIC España",
      "Formación en liderazgo",
    ],
    note: {
      title: "Personaliza tu plan de pagos",
      body: "Nuestro equipo de admisiones está listo para guiarte. En ESIC puedes personalizar tus pagos de manera mensual.",
      ctaLabel: "Agenda una asesoría personalizada",
    },
  },
  plan: {
    heading: "PLAN DE ESTUDIOS",
    subtitle:
      "5 módulos diseñados para transformar tu visión estratégica en experiencia del cliente.",
    brochureUrl: "/images/wp/2026/05/Brochure-CX-2026-Mff.pdf",
    modules: [
      {
        num: "01",
        title: "Estrategia Empresarial y Habilidades Directivas para CXM",
        description:
          "Fortalece tu visión estratégica y tus habilidades directivas para liderar la gestión de la experiencia del cliente con impacto en el negocio.",
        topics: [
          "Contexto actual: transformación digital y nuevos modelos de negocio",
          "Estrategia empresarial orientada al cliente",
          "Ética empresarial y sostenibilidad en la gestión de clientes",
          "Finanzas aplicadas a la experiencia y el servicio",
          "Comunicación directiva y liderazgo estratégico",
          "Pensamiento crítico y toma de decisiones directivas",
          "El servicio como ventaja competitiva",
          "Sesión integradora: formulación estratégica de CX & Service",
        ],
      },
      {
        num: "02",
        title: "Modelo Customer Centric y Fundamentos CXM",
        description:
          "Comprende los fundamentos del CXM y aprende a construir un modelo customer centric que transforme la cultura y la toma de decisiones en la organización.",
        topics: [
          "Introducción al Customer Experience Management",
          "Investigación de mercados aplicada a CX",
          "Conocimiento del consumidor y gestión de datos",
          "Toma de decisiones basadas en datos del cliente",
          "El consumidor omnicanal",
          "Generación e interpretación de insights del cliente",
          "Customer centricity como pilar del CXM",
          "Sesión integradora: diagnóstico estratégico de CX",
        ],
      },
      {
        num: "03",
        title: "Diseño y Gestión de Experiencias Omnicanales",
        description:
          "Diseña y gestiona experiencias end-to-end coherentes, integrando canales, procesos y personas para mejorar resultados y fidelización.",
        topics: [
          "Fundamentos del Diseño de Experiencias",
          "Diseño de Experiencias Digitales y Omnicanales",
          "Metodologías Ágiles aplicadas al diseño de experiencias",
          "Customer Journey Mapping",
          "Agile CX Canvas y herramientas de diseño de experiencias",
          "Lean Thinking para la optimización de la experiencia",
          "Experiencia del cliente interno y employee experience",
          "Sesión integradora: diseño de una experiencia omnicanal",
        ],
      },
      {
        num: "04",
        title: "Marketing Experiencial",
        description:
          "Conecta marca, emociones y experiencia para diseñar estrategias de marketing experiencial que fortalezcan la relación con el cliente y la diferenciación.",
        topics: [
          "Fundamentos del marketing experiencial",
          "Marketing experiencial y Customer Experience management",
          "Diseño de estrategias de marketing sensorial",
          "Activación del customer journey y del funnel de conversión",
          "Métricas y KPIs en marketing experiencial",
          "Omni-experience",
          "Servicio y operación como parte de la experiencia de marca",
          "Sesión integradora: plan de marketing experiencial",
        ],
      },
      {
        num: "05",
        title: "Tecnología, Inteligencia Artificial y Gobernanza de Datos",
        description:
          "Aplica tecnología, IA y datos para personalizar experiencias, optimizar decisiones y gestionar la experiencia del cliente de forma medible y escalable.",
        topics: [
          "Ecosistema Tecnológico para el CXM",
          "Gobernanza de datos del cliente",
          "Analítica avanzada aplicada a la experiencia del cliente",
          "Toma de decisiones basadas en datos",
          "Integración de datos para una experiencia del cliente unificada",
          "IA aplicada al customer experience",
          "IA generativa y herramientas para la mejora del CX",
          "Sesión integradora: gobierno, automatización e IA para CXM",
        ],
      },
    ],
  },
};

/* ── MÁSTER EN DIGITAL MARKETING ─────────────────────────────────────── */
export const digitalMarketing: MasterProgramData = {
  slug: "emdm",
  metaTitle: "Máster en Digital Marketing — ESIC Medellín",
  metaDescription:
    "Máster en Digital Marketing de ESIC Medellín. 11 meses, modalidad híbrida, inmersión en Madrid y título privado de ESIC España.",
  hero: {
    desktop: "/images/wp/2026/05/master-digital-marketing-desktop-scaled.webp",
    mobile: "/images/wp/2026/05/master-digital-marketing-mobile-scaled.webp",
    alt: "Máster Digital Marketing ESIC",
  },
  intro: {
    heading: "CUBRIR LAS NUEVAS DEMANDAS DE MARKETING DIGITAL DEL MERCADO",
    paragraphs: [
      "Con un enfoque práctico que permite a los alumnos dominar y aplicar todos los conocimientos adquiridos a lo largo del máster. Preparar a los alumnos para un nuevo entorno digital de intenso cambio y capacitarlos para los nuevos retos a los que se enfrentan las empresas.",
    ],
  },
  formTitle: "Máster en Digital Marketing",
  benefits: [
    { icon: "calendar", label: "11 Meses" },
    { icon: "screen", label: "Híbrido" },
    { icon: "pin", label: "Inmersión Madrid" },
    { icon: "globe", label: "Título Español" },
  ],
  sede: {
    heading: "ESIC SEDE MEDELLÍN",
    paragraphs: [
      "Medellín quiere ser el motor de la transformación digital para Latinoamérica. Los gobiernos local y nacional y el sector privado de la ciudad han trabajado juntos en ese propósito.",
      "ESIC gestó una alianza sin precedentes con los principales empresarios del país, para hacer viable la llegada de una escuela de negocios de primer mundo. Es así como llega ESIC a Medellín, convirtiéndose en el campus número 13 de la escuela en el mundo y su puerta de entrada hacia América Latina.",
    ],
    youtubeId: "F9ulSW9vlAE",
    videoTitle: "ESIC Medellín: 4 años diseñando futuros",
  },
  pricing: {
    heading: "INVERSIÓN EN TU FUTURO",
    subtitle: "Conoce el valor de tu formación de posgrado en ESIC Medellín.",
    cardTitle: "Valor Total",
    price: "$39.700.000",
    priceCurrency: "COP",
    features: [
      "11 meses de formación",
      "Inmersión internacional en ESIC Madrid",
      "Global Management Program + Máster con Título Privado ESIC España",
      "Formación en liderazgo",
    ],
    note: {
      title: "Personaliza tu plan de pagos",
      body: "Nuestro equipo de admisiones está listo para guiarte. En ESIC puedes personalizar tus pagos de manera mensual.",
      ctaLabel: "Agenda una asesoría personalizada",
    },
  },
  plan: {
    heading: "PLAN DE ESTUDIOS",
    // El original de Digital Marketing no trae subtítulo en el plan.
    brochureUrl: "/images/wp/2026/05/Folleto-MDM_FULL_2025_2ff.pdf",
    modules: [
      {
        num: "01",
        title: "Estrategia en Marketing Digital",
        topics: [
          "Diseño y creación de un plan de marketing digital (I)",
          "Diseño y creación de un plan de marketing digital (II — análisis del entorno)",
          "Diseño y creación de un plan de marketing digital (III — cliente como centro del plan de marketing digital y segmentación y definición del público objetivo)",
          "Digital customer journey: los nuevos procesos de decisión de compra y customer centric",
          "Planificación y gestión digital de la relación con los clientes",
          "Los fundamentos del análisis y la segmentación de clientes y técnicas fundamentales",
          "Métricas del marketing digital",
          "Rentabilidad económica de un plan de marketing digital",
        ],
      },
      {
        num: "02",
        title: "Web & Mobile Marketing: SEO & ASO",
        topics: [
          "Dirección y desarrollo de proyectos digitales",
          "Experiencia de usuario (UX): conceptos claves para el éxito de una página web y técnicas de investigación de usuarios",
          "Fundamentos de analítica web y Google Analytics",
          "Implementación GTM + GA + DataStudio",
          "SEO: copywriting e investigación de palabras claves",
          "SEO Off-Page: campañas de link building y KPIs",
          "Diseño y desarrollo de una App mobile",
          "Medios de pago online y atención al cliente en e-commerce",
        ],
      },
      {
        num: "03",
        title: "SEM y Medios Digitales",
        topics: [
          "Estrategia SEM",
          "Otras opciones en SEM: Google Display network, YouTube y Bing Ads",
          "Estrategia y planificación de medios",
          "E-mail marketing y affiliate marketing",
          "Display, compra programática y publicidad nativa, digital TV. Técnicas principales para la creación y optimización de landing pages",
          "Aspectos legales del ámbito de marketing, publicidad y contenido digital",
          "Google Adwords y editor de Adwords",
          "Las métricas y el análisis de resultados de la inversión en los medios digitales",
        ],
      },
      {
        num: "04",
        title: "Social Media",
        topics: [
          "Contenido, planificación y analítica en una estrategia de social media",
          "Blog marketing y creación de contenidos para redes sociales",
          "ORM y social listening",
          "Marketing de influencia",
          "Social media Ads: estrategia y planificación (Facebook, Instagram y Pinterest)",
          "Social media Ads: estrategia y planificación (Twitter y LinkedIn)",
          "Social media Ads: estrategia y planificación (YouTube Ads)",
          "Uso profesional de las redes sociales: marca personal y social selling",
        ],
      },
      {
        num: "05",
        title: "Data Governance",
        topics: [
          "Marketing automation: el nuevo ecosistema de medios y las implicaciones en datos",
          "Inbound marketing: automatización de ventas digitales en mercado B2B",
          "Big data aplicado al marketing",
          "AI, Machine Learning y Business Intelligence",
          "Soluciones tecnológicas: Data Lakes, DevOps, e-commerce, mobile, IoT, ML",
          "Robótica: RPA",
          "Omnicanalidad y digitalización de puntos de venta",
          "Del modelo On Premise al Cloud Computing",
        ],
      },
    ],
  },
};
