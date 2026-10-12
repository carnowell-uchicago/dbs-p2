import { formatPlays, type Game } from "@/data/games";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { GameFlag, Rating } from "./Badge";
import { FavoriteButton } from "./FavoriteButton";
import { GameArt } from "./GameArt";

type Props = {
  game: Game;
  onOpen?: () => void;
  favorite?: boolean;
  onToggleFavorite?: () => void;
  force?: ForcedState;
  headingLevel?: "h3" | "h4";
  compact?: boolean; // no heart, tighter padding: for small specimen cells
};

// The whole card is one target: the title button stretches over it, and the
// favorite heart sits above that layer as a second, separate target.
export function GameCard({
  game,
  onOpen,
  favorite = false,
  onToggleFavorite,
  force,
  headingLevel: Heading = "h3",
  compact,
}: Props) {
  return (
    <article
      {...forceAttr(force)}
      className="group relative flex flex-col rounded-(--na-r-lg) border-2 border-(--na-edge) bg-(--na-panel) transition-[border-color,box-shadow,translate] hover:-translate-y-0.5 hover:border-(--na-cyan) hover:shadow-[0_0_4px_var(--na-cyan),0_0_16px_color-mix(in_srgb,var(--na-cyan)_40%,transparent)] data-[force=hover]:-translate-y-0.5 data-[force=hover]:border-(--na-cyan) data-[force=hover]:shadow-[0_0_4px_var(--na-cyan),0_0_16px_color-mix(in_srgb,var(--na-cyan)_40%,transparent)] has-[[data-open]:active]:translate-y-0 has-[[data-open]:active]:bg-(--na-raised) has-[[data-open]:active]:shadow-none data-[force=pressed]:border-(--na-cyan) data-[force=pressed]:bg-(--na-raised)"
    >
      <GameArt motif={game.motif} className="overflow-hidden rounded-t-[8px] border-b-2 border-(--na-line)" />
      <div className="absolute left-2 top-2">
        <GameFlag game={game} />
      </div>
      {!compact && (
        <FavoriteButton
          title={game.title}
          selected={favorite}
          onClick={onToggleFavorite}
          className="absolute right-2 top-2 z-10"
        />
      )}
      <div className={`flex flex-1 flex-col gap-2 ${compact ? "p-3" : "p-4"}`}>
        <Heading
          className="text-lg font-semibold leading-tight text-(--na-ice)"
          style={{ fontFamily: "var(--na-display)" }}
        >
          <button
            type="button"
            data-open=""
            onClick={onOpen}
            aria-haspopup="dialog"
            className="text-left outline-hidden after:absolute after:inset-0 after:rounded-[8px] focus-visible:after:outline-3 focus-visible:after:outline-solid focus-visible:after:outline-offset-4 focus-visible:after:outline-(--na-cyan) group-data-[force=focus]:after:outline-3 group-data-[force=focus]:after:outline-solid group-data-[force=focus]:after:outline-offset-4 group-data-[force=focus]:after:outline-(--na-cyan)"
          >
            {game.title}
          </button>
        </Heading>
        <p
          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.06em] text-(--na-muted)"
          style={{ fontFamily: "var(--na-mono)" }}
        >
          <span>{game.category}</span>
          <span aria-hidden>·</span>
          <span>{formatPlays(game.plays)}</span>
        </p>
        <div className="mt-auto pt-1">
          <Rating value={game.rating} />
        </div>
      </div>
    </article>
  );
}
