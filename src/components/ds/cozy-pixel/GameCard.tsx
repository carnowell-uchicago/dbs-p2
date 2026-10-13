import type { ButtonHTMLAttributes } from "react";
import { formatPlays, type Game } from "@/data/games";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { GameArt } from "./GameArt";
import { Icon } from "./icons";
import { Badge, Rating } from "./Meta";
import { edge, focusRing, font, type } from "./styles";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  game: Game;
  force?: ForcedState;
  // Art and title only (for tight spaces like the states table).
  compact?: boolean;
};

function Flags({ game }: { game: Game }) {
  if (!game.isNew && !game.isHot) return null;
  return (
    <span className="flex gap-2">
      {game.isNew ? <Badge tone="new">New</Badge> : null}
      {game.isHot ? <Badge tone="hot">Hot</Badge> : null}
    </span>
  );
}

// The whole card is one button that opens the game's detail dialog.
// Hover lifts it on a deeper shadow; pressed sets it down flat.
export function GameCard({ game, force, compact = false, className = "", ...rest }: Props) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      {...forceAttr(force)}
      style={edge}
      className={`group/card flex w-full flex-col bg-(--cp-surface) p-2 text-left text-(--cp-text) [--w:4px] [--e:var(--cp-wood)] [--d:4px] ${focusRing}
        hover:-translate-y-1 hover:[--d:8px] data-[force=hover]:-translate-y-1 data-[force=hover]:[--d:8px]
        active:translate-y-1 active:[--d:0px] data-[force=pressed]:translate-y-1 data-[force=pressed]:[--d:0px]
        motion-safe:transition-[translate] motion-safe:duration-100 ${className}`}
      {...rest}
    >
      <span className="relative block w-full shadow-[inset_0_0_0_2px_var(--cp-bevel)]">
        <GameArt motif={game.motif} />
        {!compact && (
          <span className="absolute top-2 left-2">
            <Flags game={game} />
          </span>
        )}
      </span>
      <span className="flex w-full flex-col gap-1 px-1 pt-3 pb-1">
        <span className="flex items-start justify-between gap-2">
          <span className={type.title}>{game.title}</span>
          <span className="mt-1 text-(--cp-wood) opacity-0 group-hover/card:opacity-100 group-focus-visible/card:opacity-100 group-data-[force=hover]/card:opacity-100 group-data-[force=focus]/card:opacity-100">
            <Icon name="arrow" />
          </span>
        </span>
        {!compact && (
          <>
            <span className={`${font.body} text-base text-(--cp-muted)`}>
              {game.category} · {formatPlays(game.plays)}
            </span>
            <span className="mt-1">
              <Rating value={game.rating} />
            </span>
          </>
        )}
      </span>
    </button>
  );
}

type RowProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  game: Game;
  rank?: number;
  current?: boolean;
  force?: ForcedState;
  // Title and category only: no rank, art, rating, or arrow (for tight spaces).
  compact?: boolean;
};

// A compact row for ranked lists. `current` marks the game open in the dialog.
// The rating shows when the row's @container is at least 24rem wide.
export function ListRow({ game, rank, current, force, compact = false, className = "", ...rest }: RowProps) {
  const isCurrent = current ?? force === "selected";
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-current={isCurrent ? "true" : undefined}
      {...forceAttr(force)}
      className={`group/row flex w-full items-center gap-3 px-3 py-2 text-left text-(--cp-text) outline-hidden
        hover:bg-(--cp-hover) data-[force=hover]:bg-(--cp-hover) active:bg-(--cp-pressed) data-[force=pressed]:bg-(--cp-pressed)
        aria-[current=true]:bg-(--cp-sunken) aria-[current=true]:shadow-[inset_4px_0_0_var(--cp-wood)]
        focus-visible:outline-3 focus-visible:outline-solid focus-visible:-outline-offset-3 focus-visible:outline-(--cp-text) data-[force=focus]:outline-3 data-[force=focus]:outline-solid data-[force=focus]:-outline-offset-3 data-[force=focus]:outline-(--cp-text) ${className}`}
      {...rest}
    >
      {rank && !compact ? <span className={`${type.title} w-6 shrink-0 text-center`}>{rank}</span> : null}
      {!compact && (
        <span className="block w-14 shrink-0 shadow-[0_0_0_3px_var(--cp-wood)]">
          <GameArt motif={game.motif} />
        </span>
      )}
      <span className="flex min-w-0 flex-1 flex-col">
        <span className={`${type.title} truncate`}>{game.title}</span>
        <span className={`${font.body} truncate text-base text-(--cp-muted)`}>
          {compact ? game.category : `${game.category} · ${formatPlays(game.plays)}`}
        </span>
      </span>
      {!compact && (
        <>
          <span className="hidden shrink-0 @[24rem]:block">
            <Rating value={game.rating} />
          </span>
          <span className="shrink-0 text-(--cp-wood)">
            <Icon name="arrow" />
          </span>
        </>
      )}
    </button>
  );
}
