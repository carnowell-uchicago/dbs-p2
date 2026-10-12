import type { CSSProperties } from "react";

// Neon Arcade palette: one job per color. The CSS variables and the contrast
// table on the design-system page both read from here.
export type ColorToken = {
  token: `--na-${string}`;
  name: string;
  hex: string;
  role: string;
  purpose: string;
};

export const colors = [
  {
    token: "--na-void",
    name: "Void",
    hex: "#05070d",
    role: "Background",
    purpose: "The dark the light is drawn on.",
  },
  {
    token: "--na-panel",
    name: "Panel",
    hex: "#0a1220",
    role: "Surface",
    purpose: "Cards, inputs, dialogs.",
  },
  {
    token: "--na-raised",
    name: "Raised",
    hex: "#101b2e",
    role: "Surface, hover",
    purpose: "A surface under the pointer.",
  },
  {
    token: "--na-ice",
    name: "Ice",
    hex: "#e6fbff",
    role: "Text",
    purpose: "Titles and body copy.",
  },
  {
    token: "--na-muted",
    name: "Muted",
    hex: "#7f9bb3",
    role: "Muted text",
    purpose: "Meta info: category, plays, captions.",
  },
  {
    token: "--na-line",
    name: "Line",
    hex: "#1c2f4a",
    role: "Divider",
    purpose: "Decorative grid lines and dividers only.",
  },
  {
    token: "--na-edge",
    name: "Edge",
    hex: "#4e6f96",
    role: "Border",
    purpose: "Edges of controls you can use.",
  },
  {
    token: "--na-cyan",
    name: "Cyan",
    hex: "#4df3ff",
    role: "Focus and selection",
    purpose: "Focus ring, selected items, links.",
  },
  {
    token: "--na-orange",
    name: "Orange",
    hex: "#ff9a3c",
    role: "Accent",
    purpose: "Primary action only: Play.",
  },
  {
    token: "--na-orange-hot",
    name: "Orange hot",
    hex: "#ffb36b",
    role: "Accent, hover",
    purpose: "The Play button under the pointer.",
  },
  {
    token: "--na-magenta",
    name: "Magenta",
    hex: "#ff3df2",
    role: "Hot badge",
    purpose: "Marks trending games. Nothing else.",
  },
  {
    token: "--na-green",
    name: "Green",
    hex: "#5ef2a0",
    role: "Success",
    purpose: "Confirmations.",
  },
  {
    token: "--na-red",
    name: "Red",
    hex: "#ff5c6c",
    role: "Error",
    purpose: "Failures and their fix.",
  },
] as const satisfies readonly ColorToken[];

type TokenName = (typeof colors)[number]["token"];

export function hex(token: TokenName): string {
  return colors.find((c) => c.token === token)!.hex;
}

// Hard lines, softened corners: three radii by size, never pills or circles
// (radio dots excepted). A part nested inside a frame uses the frame's radius
// minus the gap between them, so the corners stay parallel.
export const radii = [
  { token: "--na-r-sm", px: 4, use: "Chips, badges, checkboxes" },
  { token: "--na-r-md", px: 6, use: "Buttons, fields, switches, rows" },
  { token: "--na-r-lg", px: 10, use: "Cards, panels, dialogs" },
] as const;

// Spread onto the wrapper div's style, next to the font variables.
export const paletteVars = Object.fromEntries([
  ...colors.map((c) => [c.token, c.hex]),
  ...radii.map((r) => [r.token, `${r.px}px`]),
]) as CSSProperties;

export const font = {
  display: { fontFamily: "var(--na-display)" },
  heading: { fontFamily: "var(--na-display)" },
  body: { fontFamily: "var(--na-body)" },
  mono: { fontFamily: "var(--na-mono)" },
} satisfies Record<string, CSSProperties>;
