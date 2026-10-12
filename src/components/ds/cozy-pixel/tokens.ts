import type { CSSProperties } from "react";

// Cozy Pixel palette: one job per color. The CSS variables and the
// design-system contrast table both read from here.
export type Token = {
  name: string;
  cssVar: `--cp-${string}`;
  hex: string;
  role: string;
  purpose: string;
};

export const core: Token[] = [
  { name: "Parchment", cssVar: "--cp-bg", hex: "#f7ecd6", role: "Background", purpose: "The page behind everything." },
  { name: "Paper", cssVar: "--cp-surface", hex: "#fff8ea", role: "Surface", purpose: "Cards, panels, dialogs, and inputs." },
  { name: "Cocoa", cssVar: "--cp-text", hex: "#3b2a20", role: "Text", purpose: "Body text, titles, and the focus outline." },
  { name: "Bark", cssVar: "--cp-muted", hex: "#6e5644", role: "Muted text", purpose: "Meta lines, hints, and captions." },
  { name: "Wood", cssVar: "--cp-wood", hex: "#8a4a24", role: "Border", purpose: "Frames and edges. Also the selected fill, with cream text." },
  { name: "Pumpkin", cssVar: "--cp-accent", hex: "#f08a24", role: "Accent", purpose: "Primary actions only, like Play." },
];

export const support: Token[] = [
  { name: "Wheat", cssVar: "--cp-sunken", hex: "#efdcb6", role: "Sunken", purpose: "Wells, tab shelves, skeletons, and switch tracks." },
  { name: "Wood light", cssVar: "--cp-bevel", hex: "#d9a066", role: "Bevel", purpose: "Inner bevel of frames and edges of disabled controls. Never text." },
  { name: "Clover", cssVar: "--cp-success", hex: "#6aa84f", role: "Success", purpose: "Success fill, with cocoa text." },
  { name: "Berry", cssVar: "--cp-error", hex: "#b3361f", role: "Error", purpose: "Error edge and error text." },
];

export const tints: Token[] = [
  { name: "Sky", cssVar: "--cp-new", hex: "#8fd3f4", role: "New", purpose: "The New badge." },
  { name: "Gold", cssVar: "--cp-popular", hex: "#f6c945", role: "Popular", purpose: "Rating stars and the Hot badge." },
  { name: "Blossom", cssVar: "--cp-favorite", hex: "#f4a7b9", role: "Favorite", purpose: "The filled favorite heart." },
];

// Hover and pressed shades, precomputed so their contrast can be checked.
export const shades: Token[] = [
  { name: "Pumpkin hover", cssVar: "--cp-accent-hover", hex: "#f5ab5f", role: "Accent hover", purpose: "Primary button under the pointer." },
  { name: "Pumpkin pressed", cssVar: "--cp-accent-pressed", hex: "#e18024", role: "Accent pressed", purpose: "Primary button pushed in." },
  { name: "Paper hover", cssVar: "--cp-hover", hex: "#f2d9bc", role: "Hover", purpose: "Secondary controls under the pointer." },
  { name: "Paper pressed", cssVar: "--cp-pressed", hex: "#e8c39b", role: "Pressed", purpose: "Secondary controls pushed in." },
];

export const allTokens = [...core, ...support, ...tints, ...shades];

export const hex = Object.fromEntries(
  allTokens.map((t) => [t.cssVar.replace("--cp-", ""), t.hex]),
) as Record<string, string>;

export const cssVars = Object.fromEntries(
  allTokens.map((t) => [t.cssVar, t.hex]),
) as CSSProperties;

// Text pairs (4.5:1) and non-text pairs (3:1) that the UI actually uses.
export type Pair = { fg: string; bg: string; use: string; kind: "text" | "ui" };

export const pairs: Pair[] = [
  { fg: "text", bg: "bg", use: "Body text on the page", kind: "text" },
  { fg: "text", bg: "surface", use: "Card and dialog text", kind: "text" },
  { fg: "muted", bg: "bg", use: "Meta text on the page", kind: "text" },
  { fg: "muted", bg: "surface", use: "Meta text on cards", kind: "text" },
  { fg: "muted", bg: "sunken", use: "Hints in wells and skeletons", kind: "text" },
  { fg: "text", bg: "accent", use: "Play button label", kind: "text" },
  { fg: "text", bg: "accent-pressed", use: "Play button, pressed", kind: "text" },
  { fg: "surface", bg: "wood", use: "Selected chip and tab label", kind: "text" },
  { fg: "text", bg: "success", use: "Success message", kind: "text" },
  { fg: "error", bg: "surface", use: "Error message", kind: "text" },
  { fg: "text", bg: "new", use: "New badge", kind: "text" },
  { fg: "text", bg: "popular", use: "Hot badge", kind: "text" },
  { fg: "wood", bg: "bg", use: "Control edges on the page", kind: "ui" },
  { fg: "wood", bg: "surface", use: "Control edges on cards", kind: "ui" },
  { fg: "text", bg: "bg", use: "Focus outline", kind: "ui" },
];
