import { Geist } from "next/font/google";

// The hub's neutral face. Imported only by the hub (and the /play placeholder),
// so the style pages don't download or preload it.
const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const hubFont = `${geist.variable} font-sans`;
