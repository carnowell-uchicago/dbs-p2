import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Figtree, Nunito, Rubik } from "next/font/google";
import { references } from "@/data/mood-boards/console-tiles";
import { boardOrder } from "@/lib/board-order";
import { colorTypeArtifacts } from "./artifacts/color-type";
import { interfaceArtifacts } from "./artifacts/interface";
import { textureArtifacts } from "./artifacts/textures";

const display = Rubik({ subsets: ["latin"], variable: "--ct-display" });
const body = Figtree({ subsets: ["latin"], variable: "--ct-body" });
const round = Nunito({ subsets: ["latin"], variable: "--ct-round" });

export const metadata: Metadata = {
  title: "Console Tiles mood board · LazyDonkeyGames",
};

const palette = {
  "--ct-bg": "#2d2d2d",
  "--ct-surface": "#3c3c3c",
  "--ct-text": "#ffffff",
  "--ct-ink": "#2d2d2d",
  "--ct-muted": "#b4b4b4",
  "--ct-line": "#4a4a4a",
  "--ct-control": "#919191",
  "--ct-select": "#00c3e3",
  "--ct-red": "#ff3c28",
  "--ct-blue": "#0ab9e6",
  "--ct-yellow": "#ffd400",
} as CSSProperties;

type Tile = { key: string; label: string; content: ReactNode };

function boardTiles(): Tile[] {
  const items = boardOrder(references, [
    colorTypeArtifacts,
    textureArtifacts,
    interfaceArtifacts,
  ]);
  return items.map(({ kind, item }, i) =>
    kind === "reference"
      ? {
          key: item.src,
          label: item.label,
          content: (
            <Image
              src={item.src}
              alt={item.alt}
              width={item.width}
              height={item.height}
              loading={i === 0 ? "eager" : "lazy"}
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="h-auto w-full"
            />
          ),
        }
      : { key: item.id, label: item.label, content: item.content },
  );
}

// The style's cyan ring: 6.5:1 on the charcoal background, so it needs no
// dark edge.
const linkFocus =
  "rounded-sm focus-visible:outline-2 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-(--ct-select)";

export default function ConsoleTilesMoodBoard() {
  const tiles = boardTiles();

  return (
    <div
      style={palette}
      className={`${display.variable} ${body.variable} ${round.variable} flex-1 bg-(--ct-bg) text-(--ct-text)`}
    >
      <main
        className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 sm:py-14"
        style={{ fontFamily: "var(--ct-body)" }}
      >
        <header className="flex flex-col gap-3">
          <Link
            href="/"
            className={`self-start text-sm font-semibold text-(--ct-muted) underline underline-offset-4 hover:text-(--ct-text) ${linkFocus}`}
          >
            ← Hub
          </Link>
          <p className="mt-2 text-sm font-semibold text-(--ct-muted)">
            Mood board 02
          </p>
          <h1
            className="text-4xl font-bold tracking-tight sm:text-6xl"
            style={{ fontFamily: "var(--ct-display)" }}
          >
            Console Tiles
          </h1>
          <p className="max-w-xl text-lg text-(--ct-muted)">
            Big friendly tiles in one row, a single ring showing where you are,
            and nothing else in the way. Calm charcoal, with a flash of
            controller color.
          </p>
        </header>

        <section
          aria-label="Artifacts"
          className="mt-10 columns-2 gap-4 md:columns-3 xl:columns-4"
        >
          {tiles.map((tile, i) => (
            <figure
              key={tile.key}
              className="mb-4 break-inside-avoid overflow-hidden rounded-2xl bg-(--ct-surface) shadow-[0_2px_8px_rgb(0_0_0/0.35)]"
            >
              {tile.content}
              <figcaption className="flex gap-2 px-3 py-2.5 text-sm font-semibold text-(--ct-muted)">
                <span aria-hidden="true" className="tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-(--ct-text)">{tile.label}</span>
              </figcaption>
            </figure>
          ))}
        </section>

        <footer className="mt-12 border-t border-(--ct-line) pt-6">
          <h2
            className="text-lg font-bold"
            style={{ fontFamily: "var(--ct-display)" }}
          >
            Image credits
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-(--ct-muted)">
            Reference images are research only and never appear in the site.
            Everything else on this board is built in code.
          </p>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {references.map((ref) => (
              <li key={ref.src} className="text-(--ct-muted)">
                <a
                  href={ref.source}
                  className={`font-semibold text-(--ct-text) underline underline-offset-4 ${linkFocus}`}
                >
                  {ref.label}
                </a>
                {ref.author ? `, ${ref.author}` : ""} · {ref.license}
              </li>
            ))}
          </ul>
        </footer>
      </main>
    </div>
  );
}
