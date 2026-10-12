import type { Metadata } from "next";
import Link from "next/link";
import { Figtree, Rubik } from "next/font/google";
import { palette } from "@/components/ds/console-tiles/tokens";
import { linkClass } from "@/components/ds/console-tiles/TextLink";
import { ColorSection } from "./sections/color";
import { ComponentsSection } from "./sections/components";
import { SpacingSection } from "./sections/spacing";
import { TypeSection } from "./sections/type";
import { UiStatesSection } from "./sections/ui-states";

const display = Rubik({ subsets: ["latin"], variable: "--ct-display" });
const body = Figtree({ subsets: ["latin"], variable: "--ct-body" });

export const metadata: Metadata = {
  title: "Console Tiles design system · LazyDonkeyGames",
};

const sections = [
  { id: "color", label: "Color" },
  { id: "type", label: "Type" },
  { id: "spacing", label: "Spacing" },
  { id: "components", label: "Components" },
  { id: "ui-states", label: "UI states" },
];

export default function ConsoleTilesDesignSystem() {
  return (
    <div
      style={palette}
      className={`${display.variable} ${body.variable} flex-1 bg-(--ct-bg) text-(--ct-text)`}
    >
      <main
        className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-8 sm:py-14"
        style={{ fontFamily: "var(--ct-body)" }}
      >
        <header className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link href="/" className={`self-start ${linkClass}`}>
              ← Hub
            </Link>
            <Link href="/mood-boards/console-tiles" className={`self-start ${linkClass}`}>
              Console Tiles mood board
            </Link>
          </div>
          <p className="mt-4 text-sm font-semibold text-(--ct-muted)">Design system 02</p>
          <h1
            className="text-[2rem] leading-[1.1] font-bold sm:text-[2.5rem]"
            style={{ fontFamily: "var(--ct-display)" }}
          >
            Console Tiles
          </h1>
          <p className="max-w-2xl text-base text-(--ct-muted)">
            The LazyDonkeyGames UI as a console home screen: big tiles in a row, one ring
            showing where you are, and red saved for Play.
          </p>
          <nav aria-label="Sections" className="mt-4">
            <ul className="flex flex-wrap gap-2">
              {sections.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="inline-flex h-10 items-center rounded-full border border-(--ct-control) bg-(--ct-surface) px-4 text-sm font-semibold hover:border-(--ct-text) active:bg-(--ct-line) focus-visible:outline-2 focus-visible:outline-offset-[5px] focus-visible:outline-(--ct-text) focus-visible:ring-[3px] focus-visible:ring-(--ct-select) focus-visible:ring-offset-2 focus-visible:ring-offset-(--ct-surface)"
                  >
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
