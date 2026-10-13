"use client";

import Link, { useLinkStatus } from "next/link";
import type { Game } from "@/data/games";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { buttonClass } from "./Button";
import { PlayIcon, Spinner } from "./Icons";

export function gameHref(game: Game) {
  return `/play/${game.slug}`;
}

// The label swaps to a spinner while the game page is still on its way
// (usually skipped, because Next prefetches the link).
function Label() {
  const { pending } = useLinkStatus();
  return pending ? (
    <>
      <Spinner /> Loading…
    </>
  ) : (
    <>
      {/* The margin cancels the icon's inner padding so the ink centers. */}
      <PlayIcon className="-ml-1 size-5" /> Play
    </>
  );
}

// The one red control: a link that opens the game's own page.
export function PlayButton({
  game,
  force,
  className = "",
}: {
  game: Game;
  force?: ForcedState;
  className?: string;
}) {
  return (
    <Link
      href={gameHref(game)}
      aria-label={`Play ${game.title}`}
      className={`${buttonClass("primary")} ${className}`}
      {...forceAttr(force)}
    >
      <Label />
    </Link>
  );
}
