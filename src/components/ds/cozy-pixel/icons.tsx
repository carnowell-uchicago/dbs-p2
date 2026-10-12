import { PixelSprite } from "./PixelSprite";

// Small pixel icons. Each is drawn in `currentColor` unless it brings its
// own colors (heart, star), so it follows the text color of its control.
const shapes = {
  search: [
    ".xxxx...",
    "x....x..",
    "x....x..",
    "x....x..",
    "x....x..",
    ".xxxxx..",
    "......xx",
    ".......x",
  ],
  chevron: ["........", "........", "x......x", ".x....x.", "..x..x..", "...xx...", "........", "........"],
  check: ["........", ".......x", "......xx", "x....xx.", "xx..xx..", ".xxxx...", "..xx....", "........"],
  close: ["x......x", ".x....x.", "..x..x..", "...xx...", "...xx...", "..x..x..", ".x....x.", "x......x"],
  arrow: ["........", "....x...", "....xx..", "xxxxxxx.", "xxxxxxx.", "....xx..", "....x...", "........"],
  bang: ["...xx...", "...xx...", "...xx...", "...xx...", "...xx...", "........", "...xx...", "...xx..."],
};

export type IconName = keyof typeof shapes;

export function Icon({ name, className = "size-4" }: { name: IconName; className?: string }) {
  return <PixelSprite rows={shapes[name]} colors={{ x: "currentColor" }} className={`shrink-0 ${className}`} />;
}

const heartRows = [
  ".ttt.ttt.",
  "thhhthhht",
  "thchhhhht",
  "thhhhhhht",
  ".thhhhht.",
  "..thhht..",
  "...tht...",
  "....t....",
];

// Outlined in cocoa; filled blossom when on, paper when off.
export function Heart({ filled, className = "size-5" }: { filled: boolean; className?: string }) {
  return (
    <PixelSprite
      rows={heartRows}
      colors={{
        t: "var(--cp-text)",
        h: filled ? "var(--cp-favorite)" : "var(--cp-surface)",
        c: "var(--cp-surface)",
      }}
      className={`shrink-0 ${className}`}
    />
  );
}

const starRows = [
  "...tt...",
  "..tyyt..",
  "ttyyyytt",
  "tyyyyyyt",
  ".tyyyyt.",
  ".tyttyt.",
  "tyt..tyt",
  "tt....tt",
];

export function Star({ filled, className = "size-4" }: { filled: boolean; className?: string }) {
  return (
    <PixelSprite
      rows={starRows}
      colors={{ t: "var(--cp-text)", y: filled ? "var(--cp-popular)" : "var(--cp-sunken)" }}
      className={`shrink-0 ${className}`}
    />
  );
}
