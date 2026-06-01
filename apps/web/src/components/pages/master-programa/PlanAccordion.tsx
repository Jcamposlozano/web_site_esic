import { useState } from "react";
import type { PlanModule } from "./data";

interface Props {
  modules: PlanModule[];
  /**
   * "single" → al abrir un módulo se cierran los demás (comportamiento del
   * Máster Digital Business original).
   * "multi" → cada módulo se abre/cierra de forma independiente
   * (comportamiento de Customer Experience y Digital Marketing).
   */
  mode?: "single" | "multi";
}

const TEAL = "#09CF90";

export default function PlanAccordion({ modules, mode = "single" }: Props) {
  const [open, setOpen] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setOpen((prev) => {
      if (mode === "single") {
        // Si ya estaba abierto, lo cerramos; si no, abrimos solo ese.
        return prev.has(i) ? new Set() : new Set([i]);
      }
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <div className="mx-auto flex max-w-[900px] flex-col gap-5">
      {modules.map((mod, i) => {
        const isOpen = open.has(i);
        return (
          <div
            key={mod.num}
            className="overflow-hidden rounded-[20px] border border-[rgba(0,19,63,0.12)] bg-white transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,19,63,0.08)]"
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              className="flex w-full cursor-pointer items-start gap-5 p-7 text-left md:px-8"
            >
              <span
                className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl font-display text-[1.3rem] font-extrabold text-white max-[600px]:h-10 max-[600px]:w-10 max-[600px]:rounded-[10px] max-[600px]:text-[1.1rem]"
                style={{ background: TEAL }}
              >
                {mod.num}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="mb-1.5 font-display text-[1.25rem] font-extrabold uppercase leading-[1.15] text-ink max-[600px]:text-[1.05rem]">
                  {mod.title}
                </h3>
                {mod.description && (
                  <p className="text-[0.92rem] leading-[1.6] text-ink-muted">
                    {mod.description}
                  </p>
                )}
              </div>
              <span
                className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] transition-all duration-300 max-[600px]:h-[34px] max-[600px]:w-[34px]"
                style={{
                  borderColor: isOpen ? TEAL : "rgba(0,19,63,0.12)",
                  background: isOpen ? TEAL : "transparent",
                }}
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="h-[18px] w-[18px] transition-transform duration-300"
                  style={{
                    color: isOpen ? "#FFFFFF" : "#5F6B7A",
                    transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </span>
            </button>
            <div
              className="overflow-hidden transition-[max-height] duration-[400ms] ease-in-out"
              style={{ maxHeight: isOpen ? 600 : 0 }}
            >
              <div className="ml-[73px] border-t border-[rgba(0,19,63,0.12)] px-8 pb-7 pt-5 max-[600px]:ml-0 max-[600px]:px-5 max-[600px]:pb-5 max-[600px]:pt-4">
                {mod.topics.map((topic, t) => (
                  <div
                    key={t}
                    className="flex items-center gap-2.5 border-b border-[rgba(0,19,63,0.06)] py-[0.55rem] text-[0.92rem] leading-[1.45] text-ink-muted last:border-b-0"
                  >
                    <span
                      className="h-[7px] w-[7px] flex-shrink-0 rounded-full"
                      style={{ background: TEAL }}
                      aria-hidden="true"
                    />
                    {topic}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
