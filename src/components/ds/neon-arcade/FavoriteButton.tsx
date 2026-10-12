import type { ButtonHTMLAttributes } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed"> & {
  title: string; // game title, for the accessible name
  selected?: boolean;
  force?: ForcedState;
};

// Heart toggle. Saved = filled with cyan light; never the orange accent.
export function FavoriteButton({
  title,
  selected,
  force,
  disabled,
  className = "",
  ...rest
}: Props) {
  const on = selected ?? force === "selected";
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={`Favorite ${title}`}
      disabled={disabled || force === "disabled"}
      {...forceAttr(force)}
      className={`group inline-grid size-11 place-items-center rounded-(--na-r-md) border-2 border-(--na-edge) bg-(--na-void)/85 text-(--na-ice) transition-[background-color,border-color,color,box-shadow,translate] hover:border-(--na-cyan) hover:text-(--na-cyan) data-[force=hover]:border-(--na-cyan) data-[force=hover]:text-(--na-cyan) active:translate-y-px active:bg-(--na-cyan)/25 data-[force=pressed]:translate-y-px data-[force=pressed]:bg-(--na-cyan)/25 aria-pressed:border-(--na-cyan) aria-pressed:text-(--na-cyan) aria-pressed:shadow-[0_0_8px_color-mix(in_srgb,var(--na-cyan)_45%,transparent)] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-(--na-cyan) data-[force=focus]:outline-3 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-(--na-cyan) disabled:pointer-events-none disabled:border-(--na-line) disabled:text-(--na-line) ${className}`}
      {...rest}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-5 fill-transparent stroke-current group-aria-pressed:fill-current"
        strokeWidth="2"
        aria-hidden
      >
        <path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.3 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z" />
      </svg>
    </button>
  );
}
