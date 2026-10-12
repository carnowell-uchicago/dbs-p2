import type { CSSProperties } from "react";

// Pixel edge with stepped corners: four offset box-shadows draw the border
// outside the box and leave each corner pixel empty; a fifth draws the hard
// drop shadow. Components tune it per state with three variables:
//   --w edge width, --e edge color, --d drop depth (0px = flat).
// Always set all three on the element itself (custom properties inherit).
export const edge: CSSProperties = {
  boxShadow: [
    "0 calc(-1 * var(--w)) 0 0 var(--e)",
    "0 var(--w) 0 0 var(--e)",
    "calc(-1 * var(--w)) 0 0 0 var(--e)",
    "var(--w) 0 0 0 var(--e)",
    "0 calc(var(--w) + var(--d)) 0 0 var(--cp-text)",
  ].join(", "),
};

export const font = {
  display: "font-(family-name:--cp-display)",
  label: "font-(family-name:--cp-label)",
  body: "font-(family-name:--cp-body)",
};

// Square cocoa outline, held clear of the pixel edge and drop shadow.
export const focusRing =
  "outline-hidden focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-[7px] focus-visible:outline-(--cp-text) data-[force=focus]:outline-3 data-[force=focus]:outline-solid data-[force=focus]:outline-offset-[7px] data-[force=focus]:outline-(--cp-text)";

// Same ring for small controls with a 2px edge.
export const focusRingTight =
  "outline-hidden focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-[6px] focus-visible:outline-(--cp-text) data-[force=focus]:outline-3 data-[force=focus]:outline-solid data-[force=focus]:outline-offset-[6px] data-[force=focus]:outline-(--cp-text)";

// Text roles (see the Type section).
export const type = {
  display: `${font.display} text-4xl leading-none font-bold sm:text-5xl`,
  heading: `${font.display} text-2xl leading-tight font-bold`,
  title: `${font.display} text-lg leading-snug font-semibold`,
  body: `${font.body} text-base leading-relaxed`,
  label: `${font.label} text-sm leading-5 font-normal uppercase`,
};
