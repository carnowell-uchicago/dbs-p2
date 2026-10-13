"use client";

import { formatPlays, type Game } from "@/data/games";
import { Badge } from "@/components/ds/console-tiles/Badge";
import { FavoriteButton } from "@/components/ds/console-tiles/FavoriteButton";
import { GameArt } from "@/components/ds/console-tiles/GameArt";
import { PlayButton } from "@/components/ds/console-tiles/PlayButton";
import { Rating } from "@/components/ds/console-tiles/Rating";

// The first thing on the page: one featured game and its Play button, the
// only red on screen.
export function Hero({
  game,
  favorite,
  onToggleFavorite,
}: {
  game: Game;
  favorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <section
      aria-labelledby="featured-title"
      className="grid grid-cols-1 overflow-hidden rounded-3xl bg-(--ct-surface) shadow-[0_10px_24px_rgb(0_0_0/0.5)] lg:grid-cols-[minmax(0,26rem)_1fr]"
    >
      <div className="aspect-[4/3] lg:aspect-square">
        <GameArt motif={game.motif} />
      </div>
      <div className="flex flex-col justify-center gap-4 p-5 sm:p-8 lg:p-12">
        <p className="text-xs font-bold tracking-wide text-(--ct-muted) uppercase">Featured today</p>
        <h2
          id="featured-title"
          className="text-[2rem] leading-[1.1] font-bold sm:text-[2.5rem]"
          style={{ fontFamily: "var(--ct-display)" }}
        >
          {game.title}
        </h2>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-(--ct-muted)">
          <Badge>{game.category}</Badge>
          <span className="text-(--ct-text)">
            <Rating value={game.rating} />
          </span>
          <span>{formatPlays(game.plays)}</span>
        </div>
        <p className="max-w-prose text-base leading-relaxed">{game.blurb}</p>
        <div className="flex items-center gap-3 pt-2">
          <PlayButton title={game.title} className="flex-1 sm:flex-none" />
          <FavoriteButton title={game.title} on={favorite} onClick={onToggleFavorite} />
          {/* Phones rely on the filled heart; the message would squeeze the Play button. */}
          <span role="status" className="sr-only text-sm font-semibold text-(--ct-success) sm:not-sr-only">
            {favorite ? "Saved to favorites" : ""}
          </span>
        </div>
      </div>
    </section>
  );
}
