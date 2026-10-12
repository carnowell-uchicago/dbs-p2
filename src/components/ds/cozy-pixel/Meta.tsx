import type { ButtonHTMLAttributes } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { Heart, Star } from "./icons";
import { edge, focusRing, font, type } from "./styles";

const badgeTone = {
  new: "bg-(--cp-new) [--e:var(--cp-text)]",
  hot: "bg-(--cp-popular) [--e:var(--cp-text)]",
  category: "bg-(--cp-surface) [--e:var(--cp-wood)]",
};

export type BadgeTone = keyof typeof badgeTone;

// Static tag. Not interactive, so it has no states.
export function Badge({ tone, children }: { tone: BadgeTone; children: string }) {
  return (
    <span
      style={edge}
      className={`inline-flex h-6 items-center px-1.5 text-(--cp-text) [--w:2px] [--d:0px] ${type.label} ${badgeTone[tone]}`}
    >
      {children}
    </span>
  );
}

// Whole stars, rounded, with the exact score as text.
export function Rating({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <span role="img" aria-label={`Rated ${value} out of 5`} className="inline-flex items-center gap-1.5">
      <span className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} filled={n <= full} />
        ))}
      </span>
      <span className={`${font.display} text-base font-semibold text-(--cp-text)`}>{value.toFixed(1)}</span>
    </span>
  );
}

type FavoriteProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  on: boolean;
  force?: ForcedState;
  showLabel?: boolean;
};

// Heart toggle. The label stays "Favorite"; the filled heart and aria-pressed
// carry the state.
export function FavoriteButton({ on, force, showLabel = true, disabled, className = "", ...rest }: FavoriteProps) {
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={showLabel ? undefined : "Favorite"}
      disabled={disabled || force === "disabled"}
      {...forceAttr(force)}
      style={edge}
      className={`group/fav inline-flex h-11 items-center justify-center gap-2 bg-(--cp-surface) text-lg font-semibold text-(--cp-text) select-none [--w:3px] [--e:var(--cp-wood)] [--d:3px] ${showLabel ? "px-4" : "w-11"} ${font.display} ${focusRing}
        hover:bg-(--cp-hover) data-[force=hover]:bg-(--cp-hover) active:translate-y-[3px] active:[--d:0px] active:bg-(--cp-pressed) data-[force=pressed]:translate-y-[3px] data-[force=pressed]:[--d:0px] data-[force=pressed]:bg-(--cp-pressed)
        disabled:cursor-not-allowed disabled:bg-(--cp-bg) disabled:text-(--cp-muted) disabled:[--e:var(--cp-bevel)] disabled:[--d:0px] ${className}`}
      {...rest}
    >
      <Heart filled={on} className="size-5 motion-safe:group-active/fav:scale-125" />
      {showLabel ? "Favorite" : null}
    </button>
  );
}
