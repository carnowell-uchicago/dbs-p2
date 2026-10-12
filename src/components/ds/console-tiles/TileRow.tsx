"use client";

import { useState, type KeyboardEvent } from "react";
import type { Game } from "@/data/games";
import { GameDialog } from "./GameDialog";
import { GameTile } from "./GameTile";

// The signature home row: big square tiles in one line that scrolls sideways
// inside itself. Tab or ← → moves the selection ring; Enter opens the game.
export function TileRow({ label, games }: { label: string; games: Game[] }) {
  const [open, setOpen] = useState<Game | null>(null);

  function onKeyDown(e: KeyboardEvent<HTMLUListElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const tiles = [...e.currentTarget.querySelectorAll<HTMLButtonElement>("button")];
    const i = tiles.indexOf(document.activeElement as HTMLButtonElement);
    if (i === -1) return;
    e.preventDefault();
    const next = tiles[e.key === "ArrowRight" ? Math.min(i + 1, tiles.length - 1) : Math.max(i - 1, 0)];
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
        {games.map((game) => (
          <li key={game.slug} className="shrink-0 snap-start">
            <GameTile game={game} onClick={() => setOpen(game)} className="w-36 sm:w-48" />
          </li>
        ))}
      </ul>
      <GameDialog game={open} onClose={() => setOpen(null)} />
    </>
  );
}
