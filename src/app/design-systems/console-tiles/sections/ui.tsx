import type { ReactNode } from "react";

// Layout pieces for the showcase page only (not part of the reusable UI).
// Each section is one surface tile with a numbered label, like the brief's spec sheet.
export function Section({
  id,
  n,
  title,
  caption,
  children,
}: {
  id: string;
  n: number;
  title: string;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6 rounded-3xl bg-(--ct-surface) p-5">
      <h2 id={`${id}-title`} className="flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
        <span
          aria-hidden
          className="grid size-6 place-items-center rounded-full bg-(--ct-text) text-xs font-bold text-(--ct-bg) tabular-nums"
        >
          {n}
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
      {caption && <p className="mt-4 text-xs text-(--ct-muted)">{caption}</p>}
    </section>
  );
}
