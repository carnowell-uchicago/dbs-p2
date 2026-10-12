"use client";

import { useState } from "react";
import { categories, games, type Category, type Game } from "@/data/games";
import { Button } from "@/components/ds/console-tiles/Button";
import { Chip } from "@/components/ds/console-tiles/Chip";
import { FavoriteButton } from "@/components/ds/console-tiles/FavoriteButton";
import { GameCard } from "@/components/ds/console-tiles/GameTile";
import { GameDialog } from "@/components/ds/console-tiles/GameDialog";
import { ListRow } from "@/components/ds/console-tiles/ListRow";

// Live demos for the showcase. State lives in the browser and resets on reload.

export function LiveChips() {
  const [picked, setPicked] = useState<Category[]>([]);
  const count = picked.length ? games.filter((g) => picked.includes(g.category)).length : games.length;
  const toggle = (c: Category) =>
    setPicked((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));
  return (
    <div className="flex flex-col gap-3">
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
        Showing {count} of {games.length} games
      </p>
    </div>
  );
}

export function LiveCards({ items }: { items: Game[] }) {
  const [open, setOpen] = useState<Game | null>(null);
  return (
    <>
      <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((g) => (
          <li key={g.slug}>
            <GameCard game={g} onClick={() => setOpen(g)} />
          </li>
        ))}
      </ul>
      <GameDialog game={open} onClose={() => setOpen(null)} />
    </>
  );
}

export function LiveList({ items }: { items: Game[] }) {
  const [open, setOpen] = useState<Game | null>(null);
  return (
    <>
      <ol aria-label="Top this week" className="flex max-w-xl flex-col gap-1">
        {items.map((g, i) => (
          <li key={g.slug}>
            <ListRow game={g} rank={i + 1} selected={open?.slug === g.slug} onClick={() => setOpen(g)} />
          </li>
        ))}
      </ol>
      <GameDialog game={open} onClose={() => setOpen(null)} />
    </>
  );
}

export function LiveFavorite({ game }: { game: Game }) {
  const [on, setOn] = useState(false);
  return (
    <div className="flex items-center gap-3">
      <FavoriteButton title={game.title} on={on} onClick={() => setOn(!on)} />
      <p role="status" className="text-sm font-semibold">
        {on ? (
          <span className="text-(--ct-success)">{game.title} added to favorites</span>
        ) : (
          <span className="text-(--ct-muted)">{game.title} isn’t a favorite yet</span>
        )}
      </p>
    </div>
  );
}

export function LiveDialog({ game }: { game: Game }) {
  const [open, setOpen] = useState<Game | null>(null);
  return (
    <>
      <Button aria-haspopup="dialog" onClick={() => setOpen(game)}>
        Open {game.title}
      </Button>
      <GameDialog game={open} onClose={() => setOpen(null)} />
    </>
  );
}
