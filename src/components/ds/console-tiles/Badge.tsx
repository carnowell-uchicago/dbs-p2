import type { ReactNode } from "react";

type Tone = "category" | "new" | "hot";

// Badges are labels, not controls: no hover, no focus.
const tones: Record<Tone, string> = {
  category: "bg-(--ct-bg) text-(--ct-text)",
  new: "bg-(--ct-surface) text-(--ct-text) ring-1 ring-(--ct-text) ring-inset",
  hot: "bg-(--ct-text) text-(--ct-bg)",
};

export function Badge({ tone = "category", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex h-6 items-center rounded-full px-2.5 text-xs font-bold tracking-wide uppercase ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function GameBadges({ isNew, isHot }: { isNew?: boolean; isHot?: boolean }) {
  if (!isNew && !isHot) return null;
  return (
    <span className="flex gap-1.5">
      {isHot && <Badge tone="hot">Hot</Badge>}
      {isNew && <Badge tone="new">New</Badge>}
    </span>
  );
}
