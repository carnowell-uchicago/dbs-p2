import type { Metadata } from "next";
import Link from "next/link";
import { Lora, Pixelify_Sans, Silkscreen } from "next/font/google";
import { cssVars } from "@/components/ds/cozy-pixel/tokens";
import { font, type } from "@/components/ds/cozy-pixel/styles";
import { ColorSection } from "./sections/color";
import { ComponentsSection } from "./sections/components";
import { SpacingSection } from "./sections/spacing";
import { TypeSection } from "./sections/type";
import { UiStatesSection } from "./sections/ui-states";

const display = Pixelify_Sans({ subsets: ["latin"], variable: "--cp-display" });
const label = Silkscreen({ subsets: ["latin"], weight: "400", variable: "--cp-label" });
const body = Lora({ subsets: ["latin"], variable: "--cp-body" });

export const metadata: Metadata = {
  title: "Cozy Pixel design system · LazyDonkeyGames",
};

const sections = [
  { id: "color", label: "Color" },
  { id: "type", label: "Type" },
  { id: "spacing", label: "Spacing" },
  { id: "components", label: "Components" },
  { id: "ui-states", label: "UI states" },
];

const navLink = `${font.body} self-start text-base font-semibold text-(--cp-text) underline decoration-2 underline-offset-4 decoration-(--cp-wood) hover:text-(--cp-wood) hover:decoration-4 outline-hidden focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-(--cp-text)`;

export default function CozyPixelDesignSystem() {
  return (
    <div
      style={cssVars}
      className={`${display.variable} ${label.variable} ${body.variable} flex-1 bg-(--cp-bg) text-(--cp-text)`}
    >
      <main className={`${font.body} mx-auto flex w-full max-w-6xl flex-col gap-14 px-5 py-10 sm:px-8 sm:py-14`}>
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/" className={navLink}>
              ← Hub
            </Link>
            <Link href="/mood-boards/cozy-pixel" className={navLink}>
              Cozy Pixel mood board
            </Link>
          </div>
          <p className={`${type.label} mt-4 text-(--cp-muted)`}>Design system 03</p>
          <h1 className={type.display} style={{ textShadow: "3px 3px 0 var(--cp-bevel)" }}>
            Cozy Pixel
          </h1>
          <p className={`${type.body} max-w-2xl text-(--cp-muted)`}>
            Parchment, wood frames, and crisp pixels for LazyDonkeyGames. Warm enough for a slow evening, clear
            enough to find a game in seconds.
          </p>
          <nav aria-label="Sections" className="mt-2">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={navLink}>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>

        <ColorSection />
        <TypeSection />
        <SpacingSection />
        <ComponentsSection />
        <UiStatesSection />
      </main>
    </div>
  );
}
