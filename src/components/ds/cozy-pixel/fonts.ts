import { Lora, Pixelify_Sans } from "next/font/google";

// Loaded once here so the mood board, the design system page, and the site share
// them. Pixelify Sans for names, titles, and short labels; Lora for sentences.
const display = Pixelify_Sans({ subsets: ["latin"], variable: "--cp-display" });
const body = Lora({ subsets: ["latin"], variable: "--cp-body" });

export const fontVars = `${display.variable} ${body.variable}`;
