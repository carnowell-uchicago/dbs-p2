// Shared class fragments. Each pairs the real pseudo-class with its forced
// `data-force` twin (see src/lib/design-system.ts). Written out in full so
// Tailwind can find them.

// 3px cyan outline, a step heavier than the 2px borders: 14.9:1 on Void, so
// focus never relies on glow alone.
export const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--na-cyan) data-[force=focus]:outline-3 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-(--na-cyan)";

// Glow levels: rest is crisp, hover gets a soft bloom, selection a stronger one.
export const glow1 = "shadow-[0_0_8px_color-mix(in_srgb,var(--na-cyan)_45%,transparent)]";
export const glow2 =
  "shadow-[0_0_4px_var(--na-cyan),0_0_16px_color-mix(in_srgb,var(--na-cyan)_50%,transparent)]";

export const disabledLook =
  "disabled:pointer-events-none disabled:border-(--na-line) disabled:text-(--na-muted) disabled:shadow-none";
