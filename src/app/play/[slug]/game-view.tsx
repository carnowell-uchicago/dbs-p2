"use client";

import { useEffect, useRef, useState } from "react";
import { formatPlays, type Game } from "@/data/games";
import { FavoriteButton } from "@/components/ds/console-tiles/FavoriteButton";
import { Spinner } from "@/components/ds/console-tiles/Icons";
import { Rating } from "@/components/ds/console-tiles/Rating";
import { StarRating } from "@/components/ds/console-tiles/StarRating";
import { TextLink } from "@/components/ds/console-tiles/TextLink";
import { focusRing } from "@/components/ds/console-tiles/styles";
import { useStore } from "../store";

// A game page: the title, then the game itself (a standalone canvas game
// from public/games, in a frame), then how to play and your rating.
export function GameView({ game }: { game: Game }) {
  const { favorites, toggleFavorite, ratings, rate } = useStore();
  const favorite = favorites.includes(game.slug);
  const myRating = ratings[game.slug] ?? 0;
  const frame = useRef<HTMLIFrameElement>(null);
  const [ready, setReady] = useState(false);

  // Focus the game once it loads so the keys work right away. The frame may
  // finish before React attaches onLoad, so check once on mount too.
  const onReady = () => {
    setReady(true);
    frame.current?.focus();
  };
  useEffect(() => {
    const doc = frame.current?.contentDocument;
    if (doc?.readyState === "complete" && doc.URL !== "about:blank") onReady();
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <TextLink href="/play" className="self-start text-sm">
        ← All games
      </TextLink>

      <div className="flex items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[2rem] leading-[1.1] font-bold" style={{ fontFamily: "var(--ct-display)" }}>
            {game.title}
          </h1>
          <p className="flex flex-wrap items-center gap-x-3 text-sm text-(--ct-muted)">
            <span>{game.category}</span>
            <span className="text-(--ct-text)">
              <Rating value={game.rating} />
            </span>
            <span>{formatPlays(game.plays)}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span role="status" className="hidden text-sm font-semibold text-(--ct-success) sm:inline">
            {favorite ? "Saved to favorites" : ""}
          </span>
          <FavoriteButton title={game.title} on={favorite} onClick={() => toggleFavorite(game.slug)} />
        </div>
      </div>

      <div className="relative h-[max(26rem,calc(100dvh-15rem))] overflow-hidden rounded-3xl border border-(--ct-line) bg-(--ct-bg) shadow-[0_10px_24px_rgb(0_0_0/0.5)] sm:h-[max(30rem,calc(100dvh-17rem))]">
        <iframe
          ref={frame}
          src={`/games/${game.slug}/index.html`}
          title={`${game.title}, the game`}
          onLoad={onReady}
          className={`size-full rounded-3xl ${focusRing} focus-visible:outline-offset-[-3px]`}
        />
        {!ready && (
          <div className="absolute inset-0 grid place-content-center justify-items-center gap-3 bg-(--ct-bg)">
            <Spinner className="size-8" />
            <p role="status" className="text-sm font-semibold">
              Loading {game.title}…
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-(--ct-muted)">Controls</dt>
          <dd className="font-semibold">{game.controls}</dd>
          <dt className="text-(--ct-muted)">Pause</dt>
          <dd className="font-semibold">P or Esc</dd>
          <dt className="text-(--ct-muted)">Keys not working?</dt>
          <dd className="font-semibold">Click the game first</dd>
        </dl>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-sm font-semibold">Your rating</span>
          <StarRating label={`Rate ${game.title}`} value={myRating} onChange={(n) => rate(game.slug, n)} />
          <span role="status" className="text-sm text-(--ct-muted)">
            {myRating ? `Thanks! ${myRating} of 5` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
