"use client";

import { useEffect, useRef, useState } from "react";
import { categories, games, type Category, type Game } from "@/data/games";
import { Button } from "@/components/ds/console-tiles/Button";
import { Chip } from "@/components/ds/console-tiles/Chip";
import { FavoriteButton } from "@/components/ds/console-tiles/FavoriteButton";
import { GameCard } from "@/components/ds/console-tiles/GameTile";
import { GameDialog } from "@/components/ds/console-tiles/GameDialog";
import { AlertIcon, CheckIcon, SearchIcon, Spinner } from "@/components/ds/console-tiles/Icons";
import { ListRow } from "@/components/ds/console-tiles/ListRow";

// Live demos for the showcase. State lives in the browser and resets on reload.

export function LiveChips() {
  const [picked, setPicked] = useState<Category[]>([]);
  const count = picked.length ? games.filter((g) => picked.includes(g.category)).length : games.length;
  const toggle = (c: Category) =>
    setPicked((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]));
  return (
    <div className="flex flex-col gap-2">
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

export function LiveCard({ game }: { game: Game }) {
  const [open, setOpen] = useState<Game | null>(null);
  return (
    <>
      <GameCard game={game} onClick={() => setOpen(game)} />
      <GameDialog game={open} onClose={() => setOpen(null)} />
    </>
  );
}

export function LiveList({ items }: { items: Game[] }) {
  const [open, setOpen] = useState<Game | null>(null);
  return (
    <>
      <ol aria-label="Top this week" className="flex flex-col gap-1">
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

export function LiveHeart({ game }: { game: Game }) {
  const [on, setOn] = useState(false);
  return (
    <>
      <FavoriteButton title={game.title} on={on} onClick={() => setOn(!on)} />
      <span role="status" className="sr-only">
        {on ? `${game.title} added to favorites` : ""}
      </span>
    </>
  );
}

export function LiveDialog({ game }: { game: Game }) {
  const [open, setOpen] = useState<Game | null>(null);
  return (
    <>
      <Button aria-haspopup="dialog" onClick={() => setOpen(game)}>
        Open detail panel
      </Button>
      <GameDialog game={open} onClose={() => setOpen(null)} />
    </>
  );
}

// UI state cards. Each is a small gray card; the caption sits under it.
const card = "flex min-h-36 flex-col items-center justify-center gap-2 rounded-2xl bg-(--ct-bg) p-3 text-center";

export function EmptyCard() {
  const [cleared, setCleared] = useState(false);
  return (
    <div role="status" className={card}>
      <span className="grid size-9 place-items-center rounded-full border-2 border-dashed border-(--ct-control) text-(--ct-muted)">
        <SearchIcon className="size-4" />
      </span>
      {cleared ? (
        <p className="text-sm font-semibold">Showing all {games.length} games</p>
      ) : (
        <>
          <p className="text-sm font-semibold">No games match “zebra”</p>
          <Button size="sm" onClick={() => setCleared(true)}>
            Clear search
          </Button>
        </>
      )}
    </div>
  );
}

type Phase = "error" | "retrying" | "ready";

export function ErrorCard() {
  const [phase, setPhase] = useState<Phase>("error");
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  function retry() {
    setPhase("retrying");
    timer.current = window.setTimeout(() => setPhase("ready"), 1200);
  }

  return (
    <div role="status" className={card}>
      {phase === "ready" ? (
        <>
          <span className="grid size-9 place-items-center rounded-full bg-(--ct-success) text-(--ct-bg)">
            <CheckIcon />
          </span>
          <p className="text-sm font-semibold">Hay Runner is ready</p>
        </>
      ) : (
        <>
          <span className="grid size-9 place-items-center rounded-full bg-(--ct-attention) text-(--ct-text)">
            <AlertIcon className="size-5" />
          </span>
          <p className="text-sm font-semibold">Hay Runner didn’t load</p>
          <Button
            size="sm"
            onClick={phase === "retrying" ? undefined : retry}
            aria-disabled={phase === "retrying" || undefined}
            className={phase === "retrying" ? "cursor-progress" : ""}
          >
            {phase === "retrying" ? (
              <>
                <Spinner className="size-4" /> Retrying…
              </>
            ) : (
              "Retry"
            )}
          </Button>
        </>
      )}
    </div>
  );
}
