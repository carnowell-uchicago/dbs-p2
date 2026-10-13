// Shared class strings. Each state is written twice, as the real pseudo-class
// and as the forced `data-force` variant, so frozen specimens match live controls
// (see src/lib/design-system.ts). Tailwind only sees literal class names, so
// these are spelled out rather than generated.

// The selection ring: a cyan band with a gap, like the console's dark theme.
// Cyan passes 3:1 on every surface, so it needs no extra edge.
export const focusRing =
  "focus-visible:outline-[3px] focus-visible:outline-solid focus-visible:outline-offset-[3px] focus-visible:outline-(--ct-select) data-[force=focus]:outline-[3px] data-[force=focus]:outline-solid data-[force=focus]:outline-offset-[3px] data-[force=focus]:outline-(--ct-select)";

// Same ring for a peer input whose visible box is a sibling span.
export const peerFocusRing =
  "peer-focus-visible:outline-[3px] peer-focus-visible:outline-solid peer-focus-visible:outline-offset-[3px] peer-focus-visible:outline-(--ct-select) peer-data-[force=focus]:outline-[3px] peer-data-[force=focus]:outline-solid peer-data-[force=focus]:outline-offset-[3px] peer-data-[force=focus]:outline-(--ct-select)";

// Press: a small squeeze (motion-safe) plus a color step that works without motion.
export const pressScale =
  "motion-safe:transition motion-safe:active:scale-[0.96] motion-safe:data-[force=pressed]:scale-[0.96]";

// Tiles lift on hover. Shadows are strong because the page is already dark.
export const tileLift =
  "shadow-[0_1px_3px_rgb(0_0_0/0.3)] hover:shadow-[0_10px_24px_rgb(0_0_0/0.5)] data-[force=hover]:shadow-[0_10px_24px_rgb(0_0_0/0.5)] motion-safe:transition motion-safe:hover:-translate-y-1 motion-safe:data-[force=hover]:-translate-y-1 motion-safe:active:translate-y-0 motion-safe:active:scale-[0.97] motion-safe:data-[force=pressed]:scale-[0.97]";

export const fonts = {
  display: { fontFamily: "var(--ct-display)" },
  body: { fontFamily: "var(--ct-body)" },
} as const;
