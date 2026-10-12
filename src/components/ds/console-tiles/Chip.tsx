import type { ButtonHTMLAttributes } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { CheckIcon } from "./Icons";
import { focusRing, pressScale } from "./styles";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed"> & {
  selected?: boolean;
  force?: ForcedState;
};

// A filter toggle. Selected chips fill dark and gain a check, so the state
// never depends on color alone.
export function Chip({
  selected = false,
  force,
  disabled,
  className = "",
  children,
  ...rest
}: Props) {
  const on = selected || force === "selected";
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled || force === "disabled"}
      className={`group inline-flex h-10 items-center gap-1.5 rounded-full border border-(--ct-control) bg-(--ct-surface) px-4 text-sm font-semibold text-(--ct-text) hover:border-(--ct-text) hover:shadow-[0_4px_12px_rgb(0_0_0/0.12)] data-[force=hover]:border-(--ct-text) data-[force=hover]:shadow-[0_4px_12px_rgb(0_0_0/0.12)] active:bg-(--ct-line) data-[force=pressed]:bg-(--ct-line) aria-pressed:border-(--ct-text) aria-pressed:bg-(--ct-text) aria-pressed:text-white aria-pressed:active:bg-(--ct-muted) disabled:cursor-not-allowed disabled:border-(--ct-disabled) disabled:bg-(--ct-disabled) disabled:text-(--ct-disabled-text) disabled:shadow-none ${focusRing} ${pressScale} ${className}`}
      {...forceAttr(force)}
      {...rest}
    >
      {on && <CheckIcon className="-ml-1 size-4" />}
      {children}
    </button>
  );
}
