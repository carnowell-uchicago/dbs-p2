import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Exo_2, Orbitron, Share_Tech_Mono, Tektur } from "next/font/google";
import { references } from "@/data/mood-boards/neon-arcade";
import { boardOrder } from "@/lib/board-order";
import { colorTypeArtifacts } from "./artifacts/color-type";
import { interfaceArtifacts } from "./artifacts/interface";
import { textureArtifacts } from "./artifacts/textures";

const display = Orbitron({ subsets: ["latin"], variable: "--na-display" });
const displayAlt = Tektur({ subsets: ["latin"], variable: "--na-display-alt" });
const body = Exo_2({ subsets: ["latin"], variable: "--na-body" });
const mono = Share_Tech_Mono({
  subsets: ["latin"],
  weight: "400",
  variable: "--na-mono",
});

export const metadata: Metadata = {
  title: "Neon Arcade mood board · LazyDonkeyGames",
};

const palette = {
  "--na-void": "#05070d",
  "--na-panel": "#0a1220",
  "--na-line": "#1c2f4a",
  "--na-cyan": "#4df3ff",
  "--na-ice": "#e6fbff",
  "--na-muted": "#7f9bb3",
  "--na-orange": "#ff9a3c",
  "--na-magenta": "#ff3df2",
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

export default function NeonArcadeMoodBoard() {
  const tiles = boardTiles();

  return (
    <div
      style={palette}
      className={`${display.variable} ${displayAlt.variable} ${body.variable} ${mono.variable} flex-1 bg-(--na-void) text-(--na-ice)`}
    >
      <main
        className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 sm:py-14"
        style={{ fontFamily: "var(--na-body)" }}
      >
        <header className="flex flex-col gap-4">
          <Link
            href="/"
            className="self-start text-sm text-(--na-muted) underline underline-offset-4 hover:text-(--na-ice) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--na-cyan)"
            style={{ fontFamily: "var(--na-mono)" }}
          >
            ← Hub
          </Link>
          <p
            className="text-xs uppercase tracking-[0.3em] text-(--na-muted)"
            style={{ fontFamily: "var(--na-mono)" }}
          >
            Mood board 01
          </p>
          <h1
            className="text-4xl font-bold uppercase tracking-wider text-(--na-ice) sm:text-6xl"
            style={{
              fontFamily: "var(--na-display)",
              textShadow: "0 0 6px var(--na-cyan), 0 0 24px var(--na-cyan)",
            }}
          >
            Neon Arcade
          </h1>
          <p className="max-w-xl text-lg text-(--na-ice)/85">
            Light drawn on darkness. Thin glowing lines on a black grid, one hot
            color at a time, the original Tron made crisp and modern.
          </p>
        </header>

        <section
          aria-label="Artifacts"
          className="mt-10 columns-2 gap-3 md:columns-3 xl:columns-4"
        >
          {tiles.map((tile, i) => (
            <figure
              key={tile.key}
              className="mb-3 break-inside-avoid border border-(--na-line) bg-(--na-panel)"
            >
              <div className="overflow-hidden">{tile.content}</div>
              <figcaption
                className="flex gap-2 border-t border-(--na-line) px-3 py-2 text-xs uppercase tracking-widest text-(--na-muted)"
                style={{ fontFamily: "var(--na-mono)" }}
              >
                <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <span>{tile.label}</span>
              </figcaption>
            </figure>
          ))}
        </section>

        <footer className="mt-12 border-t border-(--na-line) pt-6">
          <h2
            className="text-xs uppercase tracking-[0.3em] text-(--na-muted)"
            style={{ fontFamily: "var(--na-mono)" }}
          >
            Image credits
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-(--na-muted)">
            Reference images are research only and never appear in the site.
            Everything else on this board is built in code.
          </p>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {references.map((ref) => (
              <li key={ref.src} className="text-(--na-muted)">
                <a
                  href={ref.source}
                  className="text-(--na-ice) underline underline-offset-4 hover:text-(--na-cyan) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--na-cyan)"
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
