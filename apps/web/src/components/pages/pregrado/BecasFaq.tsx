import { useState } from "react";

export interface FaqItem {
  q: string;
  a: string;
}

interface Props {
  items: FaqItem[];
}

/** Acordeón de preguntas frecuentes — uno abierto a la vez (primero por defecto). */
export default function BecasFaq({ items }: Props) {
  const [open, setOpen] = useState(0);

  return (
    <div className="max-w-[720px] mx-auto">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="border-b border-[rgba(0,19,63,0.12)]">
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="flex justify-between items-center w-full bg-transparent border-0 py-[1.4rem] font-body text-[1.05rem] font-semibold text-ink cursor-pointer text-left gap-4"
            >
              {item.q}
              <span
                className={`w-8 h-8 min-w-8 rounded-full border-2 grid place-items-center text-xl transition-all ${
                  isOpen
                    ? "bg-brand-blue border-brand-blue text-white"
                    : "border-[rgba(0,19,63,0.12)] text-ink-muted"
                }`}
                aria-hidden="true"
              >
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div
              className="overflow-hidden transition-[max-height] duration-300 ease-out"
              style={{ maxHeight: isOpen ? "300px" : "0px" }}
            >
              <p className="pb-[1.4rem] text-[0.95rem] leading-relaxed text-ink-muted">{item.a}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
