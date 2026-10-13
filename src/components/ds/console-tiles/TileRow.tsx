"use client";

import { useState, type KeyboardEvent } from "react";
import type { Game } from "@/data/games";
import { GameDialog } from "./GameDialog";
import { GameTile } from "./GameTile";

// The signature home row: big square tiles in one line that scrolls sideways
// inside itself. The row is one Tab stop (a roving tabindex): ← → and
// Home/End move the selection ring, Enter opens the game, and Tab moves on.
// Pass onOpen to use the page's dialog instead of the row's own.
export function TileRow({
  label,
  games,
  tileClassName = "w-36 sm:w-48",
  onOpen,
}: {
  label: string;
  games: Game[];
  tileClassName?: string;
  onOpen?: (game: Game) => void;
}) {
  const [open, setOpen] = useState<Game | null>(null);
  // The tile that takes the row's one Tab stop: the last one focused.
  const [current, setCurrent] = useState(0);

  function onKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    const tiles = [...e.currentTarget.querySelectorAll<HTMLButtonElement>("button")];
    const i = tiles.indexOf(document.activeElement as HTMLButtonElement);
    if (i === -1) return;
    const last = tiles.length - 1;
    const to: Record<string, number> = {
      ArrowRight: Math.min(i + 1, last),
      ArrowLeft: Math.max(i - 1, 0),
      Home: 0,
      End: last,
    };
    if (!(e.key in to)) return;
    e.preventDefault();
    const next = tiles[to[e.key]];
    next.focus();
    next.scrollIntoView({ block: "nearest", inline: "nearest" });
  }

  return (
    <>
      <ul
        aria-label={label}
        onKeyDown={onKeyDown}
        className="-mx-2 flex snap-x snap-mandatory scroll-px-2 gap-4 overflow-x-auto px-2 pt-2 pb-5 [scrollbar-width:thin]"
      >
        {games.map((game, i) => (
          <li key={game.slug} className="shrink-0 snap-start">
            <GameTile
              game={game}
              tabIndex={i === current ? 0 : -1}
              onFocus={() => setCurrent(i)}
              onClick={() => (onOpen ? onOpen(game) : setOpen(game))}
              className={tileClassName}
            />
          </li>
        ))}
      </ul>
      {!onOpen && <GameDialog game={open} onClose={() => setOpen(null)} />}
    </>
  );
}
