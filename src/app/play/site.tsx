"use client";

import { useState } from "react";
import { gameBySlug, games, type Game } from "@/data/games";
import { GameDialog } from "@/components/ds/console-tiles/GameDialog";
import { TileRow } from "@/components/ds/console-tiles/TileRow";
import { Catalog } from "./catalog";
import { Hero } from "./hero";
import { useStore } from "./store";

const featured = gameBySlug("hay-runner");
const popular = [...games].sort((a, b) => b.plays - a.plays).slice(0, 8);

// The catalog page. Favorites and ratings come from the layout's store, so
// the hero, the dialog, the catalog, and the game pages all agree.
export function Site() {
  const { favorites, toggleFavorite, ratings, rate } = useStore();
  const [open, setOpen] = useState<Game | null>(null);

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
        myRating={open ? (ratings[open.slug] ?? 0) : 0}
        onRate={(stars) => open && rate(open.slug, stars)}
      />
    </>
  );
}
