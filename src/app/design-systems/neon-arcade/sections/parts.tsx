import type { ReactNode } from "react";

export const mono = { fontFamily: "var(--na-mono)" };
export const heading = { fontFamily: "var(--na-display-alt)" };

export const labelClass = "text-xs uppercase tracking-[0.2em] text-(--na-muted)";

// Numbered section: a cyan-outlined digit and a mono label, like a cabinet panel.
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
    <section id={id} aria-labelledby={`${id}-title`} className="min-w-0 scroll-mt-6">
      <h2 id={`${id}-title`} className="flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-(--na-ice)" style={mono}>
        <span
          aria-hidden
          className="grid size-6 place-items-center border border-(--na-cyan) text-(--na-cyan) shadow-[0_0_6px_color-mix(in_srgb,var(--na-cyan)_40%,transparent)]"
        >
          {n}
        </span>
        {title}
      </h2>
      <div className="mt-4">{children}</div>
      {caption && (
        <p className="mt-4 text-xs tracking-[0.08em] text-(--na-muted)" style={mono}>
          {caption}
        </p>
      )}
    </section>
  );
}

// Small mono caption under a specimen. Pass className to replace the caps and tracking.
export function Cap({ children, className = "uppercase tracking-[0.14em]" }: { children: ReactNode; className?: string }) {
  return (
    <span className={`text-xs text-(--na-muted) ${className}`} style={mono}>
      {children}
    </span>
  );
}
