import type { Metadata } from "next";
import Link from "next/link";
import { fontVars } from "@/components/ds/cozy-pixel/fonts";
import { cssVars } from "@/components/ds/cozy-pixel/tokens";
import { font, type } from "@/components/ds/cozy-pixel/styles";
import { ColorSection } from "./sections/color";
import { ComponentsSection } from "./sections/components";
import { SpacingSection } from "./sections/spacing";
import { StatesSection } from "./sections/states";
import { TypeSection } from "./sections/type";
import { UiStatesSection } from "./sections/ui-states";

export const metadata: Metadata = {
  title: "Cozy Pixel design system · LazyDonkeyGames",
};

const navLink = `${font.body} self-start text-sm font-semibold text-(--cp-text) underline decoration-2 underline-offset-4 decoration-(--cp-wood) hover:text-(--cp-wood) hover:decoration-4 outline-hidden focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-(--cp-text)`;

// A one-sheet spec, after the brief's example: color, type, and shape on the
// left; components, their states, and UI states on the right.
export default function CozyPixelDesignSystem() {
  return (
    <div
      style={cssVars}
      className={`${fontVars} flex-1 bg-(--cp-bg) text-(--cp-text)`}
    >
      <main className={`${font.body} mx-auto flex w-full max-w-7xl flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10`}>
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/" className={navLink}>
              ← Hub
            </Link>
            <Link href="/mood-boards/cozy-pixel" className={navLink}>
              Mood board
            </Link>
          </div>
          <h1 className={type.display} style={{ textShadow: "3px 3px 0 var(--cp-bevel)" }}>
            Cozy Pixel · Design System
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-x-14 gap-y-8 xl:grid-cols-[22rem_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-col gap-8">
            <ColorSection />
            <TypeSection />
            <SpacingSection />
          </div>
          <div className="flex min-w-0 flex-col gap-8">
            <ComponentsSection />
            <StatesSection />
            <UiStatesSection />
          </div>
        </div>
      </main>
    </div>
  );
}
