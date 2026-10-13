import type { Metadata } from "next";
import { Figtree, Rubik } from "next/font/google";
import { palette } from "@/components/ds/console-tiles/tokens";
import { TextLink } from "@/components/ds/console-tiles/TextLink";
import { Site } from "./site";

const display = Rubik({ subsets: ["latin"], variable: "--ct-display" });
const body = Figtree({ subsets: ["latin"], variable: "--ct-body" });

export const metadata: Metadata = {
  title: "LazyDonkeyGames · Free games in your browser",
};

// The site, in the Console Tiles style: featured game first, then the
// popular row, then every game with filters.
export default function Play() {
  return (
    <div
      style={{ ...palette, fontFamily: "var(--ct-body)" }}
      className={`${display.variable} ${body.variable} flex flex-1 flex-col bg-(--ct-bg) text-(--ct-text)`}
    >
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 pt-6 sm:px-8 sm:pt-8">
        <h1 className="text-2xl font-semibold" style={{ fontFamily: "var(--ct-display)" }}>
          LazyDonkeyGames
        </h1>
        <TextLink href="/" className="text-sm">
          Hub
        </TextLink>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:gap-12 sm:px-8 sm:py-8">
        <Site />
      </main>

      <footer className="mx-auto w-full max-w-7xl px-4 pb-8 text-sm text-(--ct-muted) sm:px-8">
        A class project. The games are pretend, and nothing is saved.
      </footer>
    </div>
  );
}
