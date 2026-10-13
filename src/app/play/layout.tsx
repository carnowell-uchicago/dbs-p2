import type { ReactNode } from "react";
import { Figtree, Rubik } from "next/font/google";
import { palette } from "@/components/ds/console-tiles/tokens";
import { TextLink } from "@/components/ds/console-tiles/TextLink";
import { Brand } from "./brand";
import { StoreProvider } from "./store";

const display = Rubik({ subsets: ["latin"], variable: "--ct-display" });
const body = Figtree({ subsets: ["latin"], variable: "--ct-body" });

// The site, in the Console Tiles style. The catalog and every game page share
// this header and footer, plus the favorites and ratings.
export default function PlayLayout({ children }: { children: ReactNode }) {
  return (
    <div
      data-theme="dark"
      style={{ ...palette, fontFamily: "var(--ct-body)" }}
      className={`${display.variable} ${body.variable} flex flex-1 flex-col bg-(--ct-bg) text-(--ct-text)`}
    >
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 pt-6 sm:px-8 sm:pt-8">
        <Brand />
        <TextLink href="/" className="text-sm">
          Hub
        </TextLink>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 py-6 sm:gap-12 sm:px-8 sm:py-8">
        <StoreProvider>{children}</StoreProvider>
      </main>

      <footer className="mx-auto w-full max-w-7xl px-4 pb-8 text-sm text-(--ct-muted) sm:px-8">
        A class project. Nothing is saved.
      </footer>
    </div>
  );
}
