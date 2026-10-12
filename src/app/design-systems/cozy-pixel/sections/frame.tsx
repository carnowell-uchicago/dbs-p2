import type { ReactNode } from "react";
import { edge, font, type } from "@/components/ds/cozy-pixel/styles";

// Layout pieces for the design-system page only (not used by the site).

// A numbered section: wood marker with a cream digit, a Silkscreen label, a
// thin wheat rule above, and at most one caption line.
export function Section({
  n,
  id,
  title,
  caption,
  children,
}: {
  n: number;
  id: string;
  title: string;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="flex min-w-0 scroll-mt-6 flex-col gap-5 border-t-2 border-(--cp-sunken) pt-6"
    >
      <h2 id={`${id}-title`} className="flex items-center gap-3">
        <span
          aria-hidden
          style={edge}
          className={`${font.display} grid size-7 place-items-center bg-(--cp-wood) text-base font-bold text-(--cp-surface) [--w:2px] [--e:var(--cp-text)] [--d:0px]`}
        >
          {n}
        </span>
        <span className={`${type.label} text-(--cp-text)`}>{title}</span>
      </h2>
      {children}
      {caption ? <p className={`${font.body} text-sm text-(--cp-muted)`}>{caption}</p> : null}
    </section>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  return <span className={`${type.label} text-(--cp-muted)`}>{children}</span>;
}
