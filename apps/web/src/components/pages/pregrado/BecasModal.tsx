import { useEffect, useState } from "react";

/**
 * Modal de "Aplica a una beca". El formulario Zoho real se reemplaza por un
 * placeholder (alcance actual: sin formularios reales).
 *
 * Se abre escuchando el evento global `open-becas-modal`, que los botones
 * estáticos de la página (hero + CTA) disparan vía window.dispatchEvent.
 */
export default function BecasModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener("open-becas-modal", onOpen);
    return () => window.removeEventListener("open-becas-modal", onOpen);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[rgba(0,19,63,0.65)] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Solicitar información"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className="bg-white rounded-[20px] w-full max-w-[520px] max-h-[90vh] overflow-y-auto p-8 md:p-10 relative">
        <button
          type="button"
          aria-label="Cerrar"
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full border-0 bg-black/[0.07] hover:bg-black/[0.14] text-2xl leading-none grid place-items-center text-ink transition-colors cursor-pointer"
        >
          &times;
        </button>
        <h2 className="font-display text-3xl font-extrabold uppercase text-brand-blue-dark mb-1">
          Aplica a una beca
        </h2>
        <p className="text-[0.9rem] text-ink-muted mb-7">
          Completa el formulario y un asesor te contactará para guiarte en el proceso.
        </p>

        {/* Placeholder de formulario (pendiente fase CMS / Forms) */}
        <div className="border-2 border-dashed border-ink-light/30 rounded-2xl px-6 py-12 text-center">
          <div className="text-[0.7rem] font-bold uppercase tracking-[0.18em] text-brand-orange mb-2">
            TODO · Pendiente fase CMS / Forms
          </div>
          <div className="text-ink-muted font-body text-sm">
            El formulario "Aplica a una beca" (Zoho) se integra cuando definamos el stack de formularios.
          </div>
        </div>
      </div>
    </div>
  );
}
