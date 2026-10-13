import type { ButtonHTMLAttributes } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { HeartIcon } from "./Icons";
import { focusRing, pressScale } from "./styles";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed"> & {
  title: string;
  on?: boolean;
  force?: ForcedState;
};

// Round heart toggle. On fills the heart dark; the accent stays reserved for Play.
export function FavoriteButton({ title, on = false, force, disabled, className = "", ...rest }: Props) {
  const pressed = on || force === "selected";
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={`Favorite ${title}`}
      disabled={disabled || force === "disabled"}
      className={`grid size-11 shrink-0 place-items-center rounded-full border border-(--ct-control) bg-(--ct-surface) text-(--ct-text) hover:border-(--ct-text) hover:shadow-[0_4px_12px_rgb(0_0_0/0.4)] data-[force=hover]:border-(--ct-text) data-[force=hover]:shadow-[0_4px_12px_rgb(0_0_0/0.4)] active:bg-(--ct-line) data-[force=pressed]:bg-(--ct-line) aria-pressed:border-(--ct-text) disabled:cursor-not-allowed disabled:border-(--ct-disabled) disabled:bg-(--ct-disabled) disabled:text-(--ct-disabled-text) ${focusRing} ${pressScale} ${className}`}
      {...forceAttr(force)}
      {...rest}
    >
      <HeartIcon filled={pressed} className="size-6" />
    </button>
  );
}
