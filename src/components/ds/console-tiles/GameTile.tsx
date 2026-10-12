import type { ButtonHTMLAttributes } from "react";
import { formatPlays, type Game } from "@/data/games";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { GameBadges } from "./Badge";
import { GameArt } from "./GameArt";
import { Rating } from "./Rating";
import { focusRing, tileLift } from "./styles";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> & {
  game: Game;
  force?: ForcedState;
};

// Grid card: art on top, then title and one meta line. The whole card is the button.
export function GameCard({ game, force, className = "", ...rest }: Props) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className={`@container group flex w-full flex-col overflow-hidden rounded-2xl bg-(--ct-surface) text-left active:bg-(--ct-bg) data-[force=pressed]:bg-(--ct-bg) ${tileLift} ${focusRing} ${className}`}
      {...forceAttr(force)}
      {...rest}
    >
      <span className="relative block aspect-[4/3] w-full">
        <GameArt motif={game.motif} />
        <span className="absolute top-2 left-2">
          <GameBadges isNew={game.isNew} isHot={game.isHot} />
        </span>
      </span>
      <span className="flex flex-col gap-1 p-3 @[14rem]:p-4">
        <span className="truncate text-base font-semibold" style={{ fontFamily: "var(--ct-display)" }}>
          {game.title}
        </span>
        <span className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-sm text-(--ct-muted)">
          <span>
            {game.category} · {formatPlays(game.plays)}
          </span>
          <span className="text-(--ct-text)">
            <Rating value={game.rating} />
          </span>
        </span>
      </span>
    </button>
  );
}

// Home-screen tile: square art only. The title appears above the tile when it
// is the one selected (hovered or focused), like a console home row. The title
// stays in the button for screen readers at all times.
export function GameTile({ game, force, className = "", ...rest }: Props) {
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      className={`group relative block shrink-0 snap-start rounded-2xl pt-8 text-left outline-none ${className}`}
      {...forceAttr(force)}
      {...rest}
    >
      <span
        className="absolute top-0 left-0 max-w-full truncate text-base font-semibold text-(--ct-text) opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 group-data-[force=hover]:opacity-100 group-data-[force=focus]:opacity-100 motion-safe:transition-opacity"
        style={{ fontFamily: "var(--ct-display)" }}
      >
        {game.title}
      </span>
      <span
        className={`block aspect-square w-full overflow-hidden rounded-2xl bg-(--ct-surface) shadow-[0_1px_3px_rgb(0_0_0/0.08)] motion-safe:transition group-focus-visible:outline-2 group-focus-visible:outline-offset-[5px] group-focus-visible:outline-(--ct-text) group-focus-visible:ring-[3px] group-focus-visible:ring-(--ct-select) group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-(--ct-surface) group-data-[force=focus]:outline-2 group-data-[force=focus]:outline-offset-[5px] group-data-[force=focus]:outline-(--ct-text) group-data-[force=focus]:ring-[3px] group-data-[force=focus]:ring-(--ct-select) group-data-[force=focus]:ring-offset-2 group-data-[force=focus]:ring-offset-(--ct-surface) group-hover:shadow-[0_10px_24px_rgb(0_0_0/0.14)] group-data-[force=hover]:shadow-[0_10px_24px_rgb(0_0_0/0.14)] motion-safe:group-hover:-translate-y-1 motion-safe:group-data-[force=hover]:-translate-y-1 motion-safe:group-active:scale-[0.97] motion-safe:group-data-[force=pressed]:scale-[0.97] group-active:brightness-90 group-data-[force=pressed]:brightness-90`}
      >
        <GameArt motif={game.motif} />
      </span>
    </button>
  );
}
