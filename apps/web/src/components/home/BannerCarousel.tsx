import { useEffect, useRef, useState } from "react";
import { asset } from "../../lib/assets";

type Slide = {
  href: string;
  target?: "_blank" | "_self";
  alt: string;
  mobile: string;
  desktop: string;
  priority?: boolean;
};

const slides: Slide[] = [
  {
    href: "/desafio-junior-empresarial/",
    alt: "Boot Camp Desafío Junior Empresarial — ESIC × Action Black, 12 de septiembre",
    mobile: asset("home/banner/bootcamp-mobile.webp"),
    desktop: asset("home/banner/bootcamp-desktop.webp"),
    priority: true,
  },
  {
    href: "/quienes-somos/",
    alt: "Aniversario ESIC Medellín — Escuela de negocios con visión global",
    mobile: asset("home/banner/aniversario-mobile.webp"),
    desktop: asset("home/banner/aniversario-desktop.webp"),
  },
  // El slide del Level Up con Claude salió del carrusel: la edición de
  // agosto/septiembre 2026 quedó SOLD OUT. Para reactivarlo cuando haya nuevas
  // fechas, volver a añadirlo aquí apuntando a /curso-claude con las imágenes
  // home/banner/level-up-claude-{mobile,desktop}.webp.
  {
    href: "/pregrado/",
    alt: "Elige una carrera con visión de futuro — Pregrados ESIC",
    mobile: asset("home/banner/pregrados-mobile.webp"),
    desktop: asset("home/banner/pregrados-desktop.webp"),
  },
  {
    href: "/quienes-somos/",
    alt: "Medellín tiene una escuela de negocios con visión global — ESIC",
    mobile: asset("home/banner/marca-mobile.webp"),
    desktop: asset("home/banner/marca-desktop.webp"),
  },
  {
    href: "/master/",
    alt: "Convierte la transformación digital en ventaja empresarial — Másters ESIC",
    mobile: asset("home/banner/master-mobile.webp"),
    desktop: asset("home/banner/master-desktop.webp"),
  },
  {
    href: "https://forms.zohopublic.com/esicmedellin/form/InscripcionesPasantas/formperma/_OGwsRPwnka1ZLXJBqSMVtl-yE_Mk7E8V14gtDRfkag",
    target: "_blank",
    alt: "Antes de elegir tu carrera, vive la experiencia — Pasantías ESIC",
    mobile: asset("home/banner/pasantias-mobile.webp"),
    desktop: asset("home/banner/pasantias-desktop.webp"),
  },
];

const AUTOPLAY_MS = 5000;

export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragStateRef = useRef({ startX: 0, dragging: false, delta: 0, wasDrag: false });

  const total = slides.length;

  const goTo = (i: number) => {
    setCurrent(((i % total) + total) % total);
  };

  const resetAuto = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, AUTOPLAY_MS);
  };

  useEffect(() => {
    resetAuto();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (!trackRef.current) return;
    trackRef.current.style.transform = `translateX(-${current * 100}vw)`;
  }, [current]);

  const startDrag = (clientX: number) => {
    dragStateRef.current.startX = clientX;
    dragStateRef.current.dragging = true;
    dragStateRef.current.delta = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);
    trackRef.current?.classList.add("is-dragging");
  };

  const moveDrag = (clientX: number) => {
    if (!dragStateRef.current.dragging || !trackRef.current) return;
    dragStateRef.current.delta = clientX - dragStateRef.current.startX;
    trackRef.current.style.transform = `translateX(calc(-${current * 100}vw + ${dragStateRef.current.delta}px))`;
  };

  const endDrag = () => {
    if (!dragStateRef.current.dragging) return;
    dragStateRef.current.dragging = false;
    trackRef.current?.classList.remove("is-dragging");
    const d = dragStateRef.current.delta;
    dragStateRef.current.wasDrag = Math.abs(d) > 10;
    if (d < -60) goTo(current + 1);
    else if (d > 60) goTo(current - 1);
    else goTo(current);
    dragStateRef.current.delta = 0;
    resetAuto();
  };

  const handleSlideClick = (slide: Slide) => {
    if (dragStateRef.current.wasDrag) {
      dragStateRef.current.wasDrag = false;
      return;
    }
    if (slide.target === "_blank") {
      window.open(slide.href, "_blank");
    } else {
      window.location.href = slide.href;
    }
  };

  return (
    <section className="eh-banner-carousel relative w-full overflow-hidden bg-black select-none">
      <div
        ref={trackRef}
        className="eh-banner-track flex transition-transform duration-500 ease-out cursor-grab will-change-transform"
        onMouseDown={(e) => {
          e.preventDefault();
          startDrag(e.clientX);
        }}
        onMouseMove={(e) => moveDrag(e.clientX)}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onTouchStart={(e) => startDrag(e.touches[0].clientX)}
        onTouchMove={(e) => moveDrag(e.touches[0].clientX)}
        onTouchEnd={endDrag}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="eh-banner-slide relative w-screen flex-shrink-0"
            onClick={() => handleSlideClick(slide)}
          >
            <picture>
              <source media="(max-width: 768px)" srcSet={slide.mobile} type="image/webp" />
              <source srcSet={slide.desktop} type="image/webp" />
              <img
                src={slide.desktop}
                alt={slide.alt}
                width={2560}
                height={1168}
                fetchPriority={slide.priority ? "high" : "auto"}
                loading={slide.priority ? "eager" : "lazy"}
                draggable={false}
                className="block w-full h-auto pointer-events-none select-none"
              />
            </picture>
          </div>
        ))}
      </div>

      {/*
        Dots: bottom-[70px] los sitúa POR ENCIMA del overlap de 50px que la
        siguiente sección (PorqueSection) hace sobre el banner, dejando ~20px
        de aire entre los dots y la curva blanca del rounded-t-[50px].
        Drop-shadow para legibilidad cuando el slide tiene fondo claro.
      */}
      <div className="eh-banner-indicators absolute left-1/2 -translate-x-1/2 bottom-[70px] z-20 flex gap-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Ir a slide ${i + 1}`}
            onClick={() => {
              goTo(i);
              resetAuto();
            }}
            className={`h-[10px] rounded-full border-0 cursor-pointer transition-all duration-200 ${
              i === current ? "w-[30px] bg-white" : "w-[10px] bg-white/60 hover:bg-white/90"
            }`}
          />
        ))}
      </div>

      <style>{`
        .eh-banner-track.is-dragging {
          cursor: grabbing;
          transition: none;
        }
        .eh-banner-slide { padding-top: 0; }

        /*
          Mobile: los banners verticales quedaban al ras. Arriba la nav (fixed,
          56px) tapaba el logo del banner; abajo el overlap de -50px de la
          siguiente seccion se comia el CTA. Se les da aire en negro — el mismo
          fondo de la seccion — para que la pieza se vea completa.
        */
        @media (max-width: 768px) {
          .eh-banner-slide { padding: 96px 0 96px; }
        }
      `}</style>
    </section>
  );
}
