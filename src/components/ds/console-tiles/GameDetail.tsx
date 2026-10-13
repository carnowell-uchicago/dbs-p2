"use client";

import { useState } from "react";
import { formatPlays, type Game } from "@/data/games";
import { Badge, GameBadges } from "./Badge";
import { FavoriteButton } from "./FavoriteButton";
import { GameArt } from "./GameArt";
import { CloseIcon } from "./Icons";
import { PlayButton } from "./PlayButton";
import { Rating } from "./Rating";
import { StarRating } from "./StarRating";
import { focusRing } from "./styles";

export type FavoriteProps = {
  // Pass both to share favorites with the page; leave out for local state.
  favorite?: boolean;
  onToggleFavorite?: () => void;
};

export type RatingProps = {
  // Same idea for the player's own star rating (0 = not rated yet).
  myRating?: number;
  onRate?: (stars: number) => void;
};

// The detail panel's content. Used inside GameDialog, and on its own as a
// frozen specimen on the design-system page.
export function GameDetail({
  game,
  titleId,
  onClose,
  favorite: shared,
  onToggleFavorite,
  myRating,
  onRate,
}: {
  game: Game;
  titleId?: string;
  onClose?: () => void;
} & FavoriteProps & RatingProps) {
  const [local, setLocal] = useState(false);
  const favorite = shared ?? local;
  const toggle = onToggleFavorite ?? (() => setLocal(!local));
  const [localRating, setLocalRating] = useState(0);
  const rating = myRating ?? localRating;
  const rate = onRate ?? setLocalRating;
  return (
    <div className="@container flex flex-col">
      <div className="relative aspect-[16/9] w-full overflow-hidden">
        <GameArt motif={game.motif} />
        <span className="absolute top-3 left-3">
          <GameBadges isNew={game.isNew} isHot={game.isHot} />
        </span>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className={`absolute top-3 right-3 grid size-11 place-items-center rounded-full bg-(--ct-surface) text-(--ct-text) shadow-[0_2px_8px_rgb(0_0_0/0.4)] hover:bg-(--ct-bg) active:bg-(--ct-line) ${focusRing}`}
        >
          <CloseIcon />
        </button>
      </div>
      <div className="flex flex-col gap-3 p-4 @[28rem]:p-5">
        <div className="flex flex-col gap-2">
          <h2 id={titleId} className="text-2xl leading-tight font-semibold" style={{ fontFamily: "var(--ct-display)" }}>
            {game.title}
          </h2>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-(--ct-muted)">
            <Badge>{game.category}</Badge>
            <span className="text-(--ct-text)">
              <Rating value={game.rating} />
            </span>
            <span>{formatPlays(game.plays)}</span>
          </div>
        </div>
        <p className="text-base leading-relaxed">{game.blurb}</p>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
          <dt className="text-(--ct-muted)">Controls</dt>
          <dd className="font-semibold">{game.controls}</dd>
          <dt className="text-(--ct-muted)">A round</dt>
          <dd className="font-semibold">About {game.minutes} min</dd>
        </dl>
        <div className="flex items-center gap-3">
          <PlayButton title={game.title} className="flex-1 @[28rem]:flex-none" />
          <FavoriteButton title={game.title} on={favorite} onClick={toggle} />
          <span role="status" className="text-sm font-semibold text-(--ct-success)">
            {favorite ? "Saved to favorites" : ""}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-(--ct-line) pt-2">
          <span className="text-sm font-semibold">Your rating</span>
          <StarRating label={`Rate ${game.title}`} value={rating} onChange={rate} />
          <span role="status" className="text-sm text-(--ct-muted)">
            {rating ? `Thanks! ${rating} of 5` : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
