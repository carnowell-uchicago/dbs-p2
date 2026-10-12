import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Lora, Pixelify_Sans, Silkscreen } from "next/font/google";
import { references } from "@/data/mood-boards/cozy-pixel";
import { boardOrder } from "@/lib/board-order";
import { colorTypeArtifacts } from "./artifacts/color-type";
import { interfaceArtifacts } from "./artifacts/interface";
import { textureArtifacts } from "./artifacts/textures";

const display = Pixelify_Sans({ subsets: ["latin"], variable: "--cp-display" });
const label = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--cp-label",
});
const body = Lora({ subsets: ["latin"], variable: "--cp-body" });

export const metadata: Metadata = {
  title: "Cozy Pixel mood board · LazyDonkeyGames",
};

const palette = {
  "--cp-bg": "#f7ecd6",
  "--cp-surface": "#fff8ea",
  "--cp-text": "#3b2a20",
  "--cp-muted": "#6e5644",
  "--cp-wood": "#8a4a24",
  "--cp-wood-light": "#d9a066",
  "--cp-grass": "#6aa84f",
  "--cp-pumpkin": "#f08a24",
  "--cp-sky": "#8fd3f4",
  "--cp-pink": "#f4a7b9",
  "--cp-gold": "#f6c945",
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
              className={`h-auto w-full ${item.pixelated ? "[image-rendering:pixelated]" : ""}`}
            />
          ),
        }
      : { key: item.id, label: item.label, content: item.content },
  );
}

// Chunky wood frame: dark outer border, light inner bevel, hard pixel shadow.
const frame =
  "border-4 border-(--cp-wood) shadow-[inset_0_0_0_2px_var(--cp-wood-light),4px_4px_0_color-mix(in_srgb,var(--cp-wood),black_35%)]";
const linkFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--cp-text)";

export default function CozyPixelMoodBoard() {
  const tiles = boardTiles();

  return (
    <div
      style={palette}
      className={`${display.variable} ${label.variable} ${body.variable} flex-1 bg-(--cp-bg) text-(--cp-text)`}
    >
      <main
        className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 sm:py-14"
        style={{ fontFamily: "var(--cp-body)" }}
      >
        <header className="flex flex-col gap-3">
          <Link
            href="/"
            className={`self-start text-sm text-(--cp-muted) underline underline-offset-4 hover:text-(--cp-text) ${linkFocus}`}
            style={{ fontFamily: "var(--cp-label)" }}
          >
            ← Hub
          </Link>
          <p
            className="mt-2 text-sm text-(--cp-muted)"
            style={{ fontFamily: "var(--cp-label)" }}
          >
            Mood board 03
          </p>
          <h1
            className="text-4xl font-bold sm:text-6xl"
            style={{
              fontFamily: "var(--cp-display)",
              textShadow: "3px 3px 0 var(--cp-wood-light)",
            }}
          >
            Cozy Pixel
          </h1>
          <p className="max-w-xl text-lg text-(--cp-muted)">
            A warm evening on the farm. Hand-placed pixels, parchment and wood,
            harvest oranges and soft spring pinks. Games that feel like a short,
            happy chore.
          </p>
        </header>

        <section
          aria-label="Artifacts"
          className="mt-10 columns-2 gap-4 md:columns-3 xl:columns-4"
        >
          {tiles.map((tile, i) => (
            <figure
              key={tile.key}
              className={`mb-5 break-inside-avoid bg-(--cp-surface) ${frame}`}
            >
              <div className="overflow-hidden">{tile.content}</div>
              <figcaption className="flex items-baseline gap-2 border-t-4 border-(--cp-wood-light) px-3 py-2 text-sm font-semibold">
                <span
                  aria-hidden="true"
                  className="text-xs text-(--cp-muted)"
                  style={{ fontFamily: "var(--cp-label)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{tile.label}</span>
              </figcaption>
            </figure>
          ))}
        </section>

        <footer className="mt-12 border-t-4 border-(--cp-wood-light) pt-6">
          <h2
            className="text-xl font-bold"
            style={{ fontFamily: "var(--cp-display)" }}
          >
            Image credits
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-(--cp-muted)">
            Reference images are research only and never appear in the site.
            Everything else on this board is built in code.
          </p>
          <ul className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
            {references.map((ref) => (
              <li key={ref.src} className="text-(--cp-muted)">
                <a
                  href={ref.source}
                  className={`font-semibold text-(--cp-text) underline underline-offset-4 ${linkFocus}`}
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
