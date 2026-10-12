import type { Metadata } from "next";
import Link from "next/link";
import { Figtree, Rubik } from "next/font/google";
import { palette } from "@/components/ds/console-tiles/tokens";
import { linkClass } from "@/components/ds/console-tiles/TextLink";
import { ColorSection } from "./sections/color";
import { ComponentsSection } from "./sections/components";
import { SpacingSection } from "./sections/spacing";
import { StatesSection } from "./sections/states";
import { TypeSection } from "./sections/type";
import { UiStatesSection } from "./sections/ui-states";

const display = Rubik({ subsets: ["latin"], variable: "--ct-display" });
const body = Figtree({ subsets: ["latin"], variable: "--ct-body" });

export const metadata: Metadata = {
  title: "Console Tiles design system · LazyDonkeyGames",
};

// A one-sheet spec like the brief's example: foundations on the left,
// components and states on the right. One column below 1400px.
export default function ConsoleTilesDesignSystem() {
  return (
    <div
      style={palette}
      className={`${display.variable} ${body.variable} flex-1 bg-(--ct-bg) text-(--ct-text)`}
    >
      <main
        className="mx-auto w-full max-w-[90rem] px-4 py-8 sm:px-8 sm:py-10"
        style={{ fontFamily: "var(--ct-body)" }}
      >
        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/" className={`self-start ${linkClass}`}>
              ← Hub
            </Link>
            <Link href="/mood-boards/console-tiles" className={`self-start ${linkClass}`}>
              Mood board
            </Link>
          </div>
          <h1
            className="text-[2rem] leading-[1.1] font-bold sm:text-[2.5rem]"
            style={{ fontFamily: "var(--ct-display)" }}
          >
            Console Tiles · Design System
          </h1>
        </header>

        <div className="mt-6 grid grid-cols-1 gap-5 min-[1400px]:grid-cols-[25rem_minmax(0,1fr)] min-[1400px]:items-start min-[1400px]:gap-x-8">
          <div className="flex min-w-0 flex-col gap-5">
            <ColorSection />
            <TypeSection />
            <SpacingSection />
          </div>
          <div className="flex min-w-0 flex-col gap-5">
            <ComponentsSection />
            <StatesSection />
            <UiStatesSection />
          </div>
        </div>
      </main>
    </div>
  );
}
