import { Exo_2, JetBrains_Mono, Oxanium } from "next/font/google";

// Loaded once here so the mood board, the design system page, and the site share
// them. Oxanium: square letters with softened corners, for display, headings, and
// buttons. Exo 2 for reading. JetBrains Mono for short HUD labels and numbers.
const display = Oxanium({ subsets: ["latin"], variable: "--na-display" });
const body = Exo_2({ subsets: ["latin"], variable: "--na-body" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--na-mono" });

export const fontVars = `${display.variable} ${body.variable} ${mono.variable}`;
