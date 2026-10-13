import { formatPlays, type Game } from "@/data/games";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { Rating } from "./Badge";
import { GameArt } from "./GameArt";

type Props = {
  game: Game;
  rank: number;
  selected?: boolean;
  onSelect?: () => void;
  force?: ForcedState;
  compact?: boolean; // title (wrapping) and category only, for tight specimen cells
};

// Leaderboard row. Selected (the game shown in the detail panel) gets a cyan
// light bar on the left, so it reads without color alone.
export function ListRow({ game, rank, selected, onSelect, force, compact }: Props) {
  const on = selected ?? force === "selected";
  return (
    <button
      type="button"
      aria-current={on || undefined}
      disabled={force === "disabled"}
      {...forceAttr(force)}
      onClick={onSelect}
      className="@container group relative w-full border-b-2 border-(--na-line) text-left transition-colors before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:rounded-r-xs before:bg-transparent hover:bg-(--na-raised) data-[force=hover]:bg-(--na-raised) active:bg-(--na-cyan)/10 data-[force=pressed]:bg-(--na-cyan)/10 aria-[current=true]:bg-(--na-raised) aria-[current=true]:before:bg-(--na-cyan) aria-[current=true]:before:shadow-[0_0_8px_var(--na-cyan)] focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-(--na-cyan) data-[force=focus]:outline-3 data-[force=focus]:-outline-offset-3 data-[force=focus]:outline-(--na-cyan)"
    >
      <span className="flex items-center gap-3 px-3 py-2.5 @md:gap-4 @md:px-4">
        {!compact && (
          <span
            className="w-6 shrink-0 text-xs tracking-[0.06em] text-(--na-muted) group-aria-[current=true]:text-(--na-cyan)"
            style={{ fontFamily: "var(--na-mono)" }}
          >
            {String(rank).padStart(2, "0")}
          </span>
        )}
        {!compact && (
          <GameArt motif={game.motif} className="hidden w-20 shrink-0 overflow-hidden rounded-(--na-r-sm) border-2 border-(--na-line) @sm:block" />
        )}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span
            className={`${compact ? "" : "truncate"} text-base font-semibold text-(--na-ice)`}
            style={{ fontFamily: "var(--na-display)" }}
          >
            {game.title}
          </span>
          <span
            className="text-xs uppercase tracking-[0.06em] text-(--na-muted)"
            style={{ fontFamily: "var(--na-mono)" }}
          >
            {game.category}
            <span className="hidden @md:inline"> · {formatPlays(game.plays)}</span>
          </span>
        </span>
        {!compact && <Rating value={game.rating} />}
      </span>
    </button>
  );
}
