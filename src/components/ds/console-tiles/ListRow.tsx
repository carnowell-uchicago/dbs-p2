import type { ButtonHTMLAttributes } from "react";
import { formatPlays, type Game } from "@/data/games";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { GameArt } from "./GameArt";
import { ChevronRight } from "./Icons";
import { Rating } from "./Rating";
import { focusRing } from "./styles";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  game: Game;
  rank?: number;
  selected?: boolean;
  force?: ForcedState;
};

// A ranked row for lists like "Top this week". Selected rows get a dark bar
// on the left and stay white; hover only tints.
export function ListRow({ game, rank, selected = false, force, className = "", ...rest }: Props) {
  const on = selected || force === "selected";
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      aria-current={on || undefined}
      className={`@container relative flex w-full items-center gap-3 rounded-xl bg-(--ct-surface) py-2 pr-3 pl-3 text-left hover:bg-(--ct-bg) data-[force=hover]:bg-(--ct-bg) active:bg-(--ct-line) data-[force=pressed]:bg-(--ct-line) ${focusRing} ${className}`}
      {...forceAttr(force)}
      {...rest}
    >
      {on && (
        <span aria-hidden className="absolute top-2 bottom-2 left-0 w-1 rounded-full bg-(--ct-text)" />
      )}
      {rank !== undefined && (
        <span className="w-6 shrink-0 text-center text-base font-semibold tabular-nums" style={{ fontFamily: "var(--ct-display)" }}>
          {rank}
        </span>
      )}
      <span className="size-12 shrink-0 overflow-hidden rounded-lg">
        <GameArt motif={game.motif} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-base font-semibold" style={{ fontFamily: "var(--ct-display)" }}>
          {game.title}
        </span>
        <span className="truncate text-sm text-(--ct-muted)">
          {game.category}
          <span className="hidden @[22rem]:inline"> · {formatPlays(game.plays)}</span>
        </span>
      </span>
      <span className="hidden shrink-0 @[18rem]:inline-flex">
        <Rating value={game.rating} />
      </span>
      <ChevronRight className="size-5 shrink-0 text-(--ct-muted)" />
    </button>
  );
}
