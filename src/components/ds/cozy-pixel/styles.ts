import type { CSSProperties } from "react";

// Pixel edge with two-step rounded corners, the pixel-art way to soften a box
// without breaking the grid. Four box-shadows draw the edge bars outside the
// box, each one edge-width short at both ends (spread -w, offset 2w); four
// background squares fill the box's own corner pixels with the edge color. The
// outline then steps in twice per corner. The drop shadow is the same outline
// moved down by --d, so it steps too. Components tune it per state with:
//   --w edge width, --e edge color, --d drop depth (0px = flat).
// Always set all three on the element itself (custom properties inherit).
// The corner squares are background images, so an element with `edge` must
// not set its own background-image; its background-color is free.
const w = "var(--w)";
const bar = (x: string, y: string, color: string) => `${x} ${y} 0 calc(-1 * ${w}) ${color}`;
const two = `calc(2 * ${w})`;
const minusTwo = `calc(-2 * ${w})`;

const shadows = [
  bar("0", minusTwo, "var(--e)"),
  bar("0", two, "var(--e)"),
  bar(minusTwo, "0", "var(--e)"),
  bar(two, "0", "var(--e)"),
  bar("0", `calc(2 * ${w} + var(--d))`, "var(--cp-text)"),
  bar(minusTwo, "var(--d)", "var(--cp-text)"),
  bar(two, "var(--d)", "var(--cp-text)"),
  "0 var(--d) 0 0 var(--cp-text)",
].join(", ");

const fill = (color: string) => `linear-gradient(${color}, ${color})`;
const corners = {
  image: Array(4).fill(fill("var(--e)")),
  size: Array(4).fill(`${w} ${w}`),
  position: ["top left", "top right", "bottom left", "bottom right"],
};

export const edge: CSSProperties = {
  boxShadow: shadows,
  backgroundImage: corners.image.join(", "),
  backgroundSize: corners.size.join(", "),
  backgroundPosition: corners.position.join(", "),
  backgroundRepeat: "no-repeat",
};

// One-step corners for boxes under 32px (checkboxes): two steps would make a
// 24px box read as round, too close to the radio.
export const smallEdge: CSSProperties = {
  boxShadow: [
    `0 calc(-1 * ${w}) 0 0 var(--e)`,
    `0 ${w} 0 0 var(--e)`,
    `calc(-1 * ${w}) 0 0 0 var(--e)`,
    `${w} 0 0 0 var(--e)`,
    `0 calc(${w} + var(--d)) 0 0 var(--cp-text)`,
  ].join(", "),
};

// Edge plus a 2px light-wood bevel just inside it, for panels, cards, and
// dialogs. The corner squares sit on top, so the bevel steps with the corner.
export const bevelEdge: CSSProperties = {
  ...edge,
  backgroundImage: [...corners.image, ...Array(4).fill(fill("var(--cp-bevel)"))].join(", "),
  backgroundSize: [...corners.size, "100% 2px", "100% 2px", "2px 100%", "2px 100%"].join(", "),
  backgroundPosition: [...corners.position, "top", "bottom", "left", "right"].join(", "),
};

export const font = {
  display: "font-(family-name:--cp-display)",
  label: "font-(family-name:--cp-display)",
  body: "font-(family-name:--cp-body)",
};

// Square cocoa outline, held clear of the pixel edge and drop shadow.
export const focusRing =
  "outline-hidden focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-[7px] focus-visible:outline-(--cp-text) data-[force=focus]:outline-3 data-[force=focus]:outline-solid data-[force=focus]:outline-offset-[7px] data-[force=focus]:outline-(--cp-text)";

// Text roles (see the Type section).
export const type = {
  display: `${font.display} text-4xl leading-none font-bold sm:text-5xl`,
  heading: `${font.display} text-2xl leading-tight font-bold`,
  title: `${font.display} text-lg leading-snug font-semibold`,
  body: `${font.body} text-base leading-relaxed`,
  label: `${font.label} text-sm leading-5 font-medium tracking-[0.06em] uppercase`,
};
