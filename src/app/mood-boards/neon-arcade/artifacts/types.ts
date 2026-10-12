import type { ReactNode } from "react";

// One code-built tile on the Neon Arcade mood board.
// The page wraps `content` in a dark bordered tile and prints `label` under it.
// Palette and fonts are CSS variables set on the page wrapper (see page.tsx):
//   --na-void   #05070d  page background, near-black blue
//   --na-panel  #0a1220  tile and panel surface
//   --na-line   #1c2f4a  dim grid line / border
//   --na-cyan   #4df3ff  primary light (the hero color)
//   --na-ice    #e6fbff  white-hot core of a light line, main text
//   --na-muted  #7f9bb3  muted text
//   --na-orange #ff9a3c  rival light (reserved, used sparingly)
//   --na-magenta #ff3df2 modern-twist light (used sparingly)
//   --na-r-sm/md/lg  4/6/10px corners (hard lines, soft corners); lines are 2px
//   --na-display Oxanium, --na-body Exo 2, --na-mono JetBrains Mono
export type Artifact = {
  id: string;
  label: string;
  content: ReactNode;
};
