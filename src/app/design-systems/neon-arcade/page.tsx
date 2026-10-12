import type { Metadata } from "next";
import { fontVars } from "@/components/ds/neon-arcade/fonts";
import { TextLink } from "@/components/ds/neon-arcade/TextLink";
import { paletteVars } from "@/components/ds/neon-arcade/tokens";
import { ColorSection } from "./sections/color";
import { ComponentsSection } from "./sections/components";
import { mono } from "./sections/parts";
import { SpacingSection } from "./sections/spacing";
import { StatesSection } from "./sections/states";
import { TypeSection } from "./sections/type";
import { UiStatesSection } from "./sections/ui-states";

export const metadata: Metadata = {
  title: "Neon Arcade design system · LazyDonkeyGames",
};

// One spec sheet, laid out like the brief's example: foundations on the left,
// components and their states on the right.
export default function NeonArcadeDesignSystem() {
  return (
    <div
      style={paletteVars}
      className={`${fontVars} flex-1 bg-(--na-void) text-(--na-ice) selection:bg-(--na-cyan) selection:text-(--na-void)`}
    >
      <main className="mx-auto w-full max-w-[88rem] px-4 py-8 sm:px-8 sm:py-10" style={{ fontFamily: "var(--na-body)" }}>
        <header className="flex flex-col gap-4 border-b border-(--na-line) pb-6">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm" style={mono}>
            <TextLink href="/" className="self-start">
              ← Hub
            </TextLink>
            <TextLink href="/mood-boards/neon-arcade" className="self-start">
              Mood board
            </TextLink>
          </div>
          <h1 className="text-2xl font-bold uppercase leading-tight tracking-[0.06em] sm:text-[2rem]" style={{ fontFamily: "var(--na-display)" }}>
            <span style={{ textShadow: "0 0 6px var(--na-cyan), 0 0 20px color-mix(in srgb, var(--na-cyan) 60%, transparent)" }}>
              Neon Arcade
            </span>
            <span className="text-(--na-muted)"> · </span>
            Design System
          </h1>
        </header>
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-10">
          <div className="flex min-w-0 flex-col gap-10">
            <ColorSection />
            <TypeSection />
            <SpacingSection />
          </div>
          <div className="flex min-w-0 flex-col gap-10">
            <ComponentsSection />
            <StatesSection />
            <UiStatesSection />
          </div>
        </div>
      </main>
    </div>
  );
}
