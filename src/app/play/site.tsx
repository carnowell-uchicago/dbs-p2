"use client";

import { useState } from "react";
import { gameBySlug, games, type Game } from "@/data/games";
import { GameDialog } from "@/components/ds/console-tiles/GameDialog";
import { TileRow } from "@/components/ds/console-tiles/TileRow";
import { Catalog } from "./catalog";
import { Hero } from "./hero";

const featured = gameBySlug("hay-runner");
const popular = [...games].sort((a, b) => b.plays - a.plays).slice(0, 8);

// Page state lives here so the hero, the dialog, and the catalog agree on
// favorites. It resets on reload.
export function Site() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [open, setOpen] = useState<Game | null>(null);

  const toggleFavorite = (slug: string) =>
    setFavorites((f) => (f.includes(slug) ? f.filter((s) => s !== slug) : [...f, slug]));

  return (
    <>
      <Hero
        game={featured}
        favorite={favorites.includes(featured.slug)}
        onToggleFavorite={() => toggleFavorite(featured.slug)}
      />

      <section aria-labelledby="popular" className="flex flex-col gap-2">
        <h2 id="popular" className="text-2xl font-semibold" style={{ fontFamily: "var(--ct-display)" }}>
          Popular now
        </h2>
        <TileRow label="Popular now" games={popular} onOpen={setOpen} />
      </section>

      <Catalog favorites={favorites} onOpen={setOpen} />

      <GameDialog
        game={open}
        onClose={() => setOpen(null)}
        favorite={open ? favorites.includes(open.slug) : false}
        onToggleFavorite={() => open && toggleFavorite(open.slug)}
      />
    </>
  );
}
