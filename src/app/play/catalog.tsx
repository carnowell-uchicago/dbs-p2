"use client";

import { useState } from "react";
import { categories, games, type Category, type Game } from "@/data/games";
import { Button } from "@/components/ds/console-tiles/Button";
import { Chip } from "@/components/ds/console-tiles/Chip";
import { SearchField, SelectField, Toggle } from "@/components/ds/console-tiles/Fields";
import { GameCard } from "@/components/ds/console-tiles/GameTile";
import { SearchIcon } from "@/components/ds/console-tiles/Icons";

const sorts = {
  popular: { label: "Most played", compare: (a: Game, b: Game) => b.plays - a.plays },
  rating: { label: "Top rated", compare: (a: Game, b: Game) => b.rating - a.rating },
  new: { label: "New first", compare: (a: Game, b: Game) => Number(!!b.isNew) - Number(!!a.isNew) || b.plays - a.plays },
  az: { label: "A–Z", compare: (a: Game, b: Game) => a.title.localeCompare(b.title) },
};

type Sort = keyof typeof sorts;

// Every game, narrowed by search, category chips, and favorites. All in the
// browser; nothing is saved.
export function Catalog({
  favorites,
  onOpen,
}: {
  favorites: string[];
  onOpen: (game: Game) => void;
}) {
  const [query, setQuery] = useState("");
  const [picked, setPicked] = useState<Category[]>([]);
  const [sort, setSort] = useState<Sort>("popular");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const q = query.trim().toLowerCase();
  const shown = games
    .filter((g) => !q || g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q))
    .filter((g) => !picked.length || picked.includes(g.category))
    .filter((g) => !favoritesOnly || favorites.includes(g.slug))
    .sort(sorts[sort].compare);

  const toggle = (c: Category) =>
    setPicked((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));

  function clear() {
    setQuery("");
    setPicked([]);
    setFavoritesOnly(false);
  }

  return (
    <section aria-labelledby="all-games" className="flex flex-col gap-4">
      <h2 id="all-games" className="text-2xl font-semibold" style={{ fontFamily: "var(--ct-display)" }}>
        All games
      </h2>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <SearchField
          label="Search games"
          hideLabel
          placeholder="Search games"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="lg:w-80"
        />
        <div className="flex items-center justify-between gap-4 lg:contents">
          <SelectField
            label="Sort games"
            hideLabel
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="w-48 shrink-0"
          >
            {Object.entries(sorts).map(([key, s]) => (
              <option key={key} value={key}>
                Sort: {s.label}
              </option>
            ))}
          </SelectField>
          <div className="lg:ml-auto">
            <Toggle
              label={`Favorites only (${favorites.length})`}
              checked={favoritesOnly}
              onChange={(e) => setFavoritesOnly(e.target.checked)}
            />
          </div>
        </div>
      </div>

      <div role="group" aria-label="Filter by category" className="flex flex-wrap gap-2">
        <Chip selected={picked.length === 0} onClick={() => setPicked([])}>
          All
        </Chip>
        {categories.map((c) => (
          <Chip key={c} selected={picked.includes(c)} onClick={() => toggle(c)}>
            {c}
          </Chip>
        ))}
      </div>

      <p role="status" className="text-sm text-(--ct-muted)">
        Showing {shown.length} of {games.length} games
      </p>

      {shown.length ? (
        <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {shown.map((g) => (
            <li key={g.slug} className="flex">
              <GameCard game={g} onClick={() => onOpen(g)} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-2xl bg-(--ct-surface) px-4 py-12 text-center">
          <span className="grid size-12 place-items-center rounded-full border-2 border-dashed border-(--ct-control) text-(--ct-muted)">
            <SearchIcon />
          </span>
          <p className="text-base font-semibold">
            {favoritesOnly && !favorites.length
              ? "No favorites yet. Open a game and press the heart."
              : q
                ? `No games match “${query.trim()}”`
                : "No games match these filters"}
          </p>
          <Button onClick={clear}>Clear filters</Button>
        </div>
      )}
    </section>
  );
}
