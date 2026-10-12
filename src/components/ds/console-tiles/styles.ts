// Shared class strings. Each state is written twice, as the real pseudo-class
// and as the forced `data-force` variant, so frozen specimens match live controls
// (see src/lib/design-system.ts). Tailwind only sees literal class names, so
// these are spelled out rather than generated.

// The selection ring: white gap, cyan band, dark outer edge. The dark edge
// carries the 3:1 contrast; the cyan makes it read as "selected tile".
export const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-(--ct-text) focus-visible:ring-[3px] focus-visible:ring-(--ct-select) focus-visible:ring-offset-2 focus-visible:ring-offset-(--ct-surface) data-[force=focus]:outline-2 data-[force=focus]:outline-offset-[5px] data-[force=focus]:outline-(--ct-text) data-[force=focus]:ring-[3px] data-[force=focus]:ring-(--ct-select) data-[force=focus]:ring-offset-2 data-[force=focus]:ring-offset-(--ct-surface)";

// Same ring for a peer input whose visible box is a sibling span.
export const peerFocusRing =
  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[5px] peer-focus-visible:outline-(--ct-text) peer-focus-visible:ring-[3px] peer-focus-visible:ring-(--ct-select) peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-(--ct-surface) peer-data-[force=focus]:outline-2 peer-data-[force=focus]:outline-offset-[5px] peer-data-[force=focus]:outline-(--ct-text) peer-data-[force=focus]:ring-[3px] peer-data-[force=focus]:ring-(--ct-select) peer-data-[force=focus]:ring-offset-2 peer-data-[force=focus]:ring-offset-(--ct-surface)";

// Press: a small squeeze (motion-safe) plus a color step that works without motion.
export const pressScale =
  "motion-safe:transition motion-safe:active:scale-[0.96] motion-safe:data-[force=pressed]:scale-[0.96]";

// Tiles lift on hover.
export const tileLift =
  "shadow-[0_1px_3px_rgb(0_0_0/0.08)] hover:shadow-[0_10px_24px_rgb(0_0_0/0.14)] data-[force=hover]:shadow-[0_10px_24px_rgb(0_0_0/0.14)] motion-safe:transition motion-safe:hover:-translate-y-1 motion-safe:data-[force=hover]:-translate-y-1 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97] motion-safe:data-[force=pressed]:scale-[0.97]";

export const fonts = {
  display: { fontFamily: "var(--ct-display)" },
  body: { fontFamily: "var(--ct-body)" },
} as const;
