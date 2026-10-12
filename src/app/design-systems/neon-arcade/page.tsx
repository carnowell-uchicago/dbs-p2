import type { Metadata } from "next";
import { fontVars } from "@/components/ds/neon-arcade/fonts";
import { TextLink } from "@/components/ds/neon-arcade/TextLink";
import { paletteVars } from "@/components/ds/neon-arcade/tokens";
import { ColorSection } from "./sections/color";
import { ComponentsSection } from "./sections/components";
import { labelClass, mono } from "./sections/parts";
import { SpacingSection } from "./sections/spacing";
import { TypeSection } from "./sections/type";
import { UiStatesSection } from "./sections/ui-states";

export const metadata: Metadata = {
  title: "Neon Arcade design system · LazyDonkeyGames",
};

const nav = [
  { href: "#color", label: "Color" },
  { href: "#type", label: "Type" },
  { href: "#spacing", label: "Spacing" },
  { href: "#components", label: "Components" },
  { href: "#ui-states", label: "UI states" },
];

export default function NeonArcadeDesignSystem() {
  return (
    <div
      style={paletteVars}
      className={`${fontVars} flex-1 bg-(--na-void) text-(--na-ice) selection:bg-(--na-cyan) selection:text-(--na-void)`}
    >
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 sm:py-14" style={{ fontFamily: "var(--na-body)" }}>
        <header className="flex flex-col gap-4 pb-12">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-base" style={mono}>
            <TextLink href="/" className="self-start">
              ← Hub
            </TextLink>
            <TextLink href="/mood-boards/neon-arcade" className="self-start">
              Mood board
            </TextLink>
          </div>
          <p className={labelClass} style={mono}>
            Design system 01
          </p>
          <h1
            className="text-[2rem] font-bold uppercase leading-[1.05] tracking-[0.06em] sm:text-5xl"
            style={{
              fontFamily: "var(--na-display)",
              textShadow: "0 0 6px var(--na-cyan), 0 0 20px color-mix(in srgb, var(--na-cyan) 60%, transparent)",
            }}
          >
            Neon Arcade
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-(--na-ice)/90">
            Thin light on a black grid. Controls rest crisp and glow when they respond; one orange accent marks
            the way to play.
          </p>
          <nav aria-label="Sections" className="mt-2">
            <ul className="flex flex-wrap gap-x-5 gap-y-2" style={mono}>
              {nav.map((n) => (
                <li key={n.href}>
                  <TextLink href={n.href} className="text-xs uppercase tracking-[0.2em]">
                    {n.label}
                  </TextLink>
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
