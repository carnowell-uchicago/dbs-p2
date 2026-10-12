import { Exo_2, Orbitron, Share_Tech_Mono, Tektur } from "next/font/google";

// Loaded once here so the design system page and the site share them.
const display = Orbitron({ subsets: ["latin"], variable: "--na-display" });
const heading = Tektur({ subsets: ["latin"], variable: "--na-display-alt" });
const body = Exo_2({ subsets: ["latin"], variable: "--na-body" });
const mono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--na-mono",
});

export const fontVars = `${display.variable} ${heading.variable} ${body.variable} ${mono.variable}`;
