import type { ButtonHTMLAttributes } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-pressed"> & {
  selected?: boolean;
  force?: ForcedState;
};

// Filter chip: a toggle button. Selected adds a check so it never relies on color.
export function Chip({
  selected,
  force,
  disabled,
  className = "",
  children,
  ...rest
}: Props) {
  const on = selected ?? force === "selected";
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled || force === "disabled"}
      {...forceAttr(force)}
      className={`group inline-flex h-9 items-center gap-2 border border-(--na-edge) px-3.5 text-xs uppercase tracking-[0.16em] text-(--na-ice) transition-[background-color,border-color,color,box-shadow,translate] hover:border-(--na-cyan) hover:bg-(--na-raised) data-[force=hover]:border-(--na-cyan) data-[force=hover]:bg-(--na-raised) active:translate-y-px active:bg-(--na-cyan)/25 data-[force=pressed]:translate-y-px data-[force=pressed]:bg-(--na-cyan)/25 aria-pressed:border-(--na-cyan) aria-pressed:bg-(--na-cyan)/15 aria-pressed:text-(--na-cyan) aria-pressed:shadow-[0_0_8px_color-mix(in_srgb,var(--na-cyan)_45%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--na-cyan) data-[force=focus]:outline-2 data-[force=focus]:outline-offset-2 data-[force=focus]:outline-(--na-cyan) disabled:pointer-events-none disabled:border-(--na-line) disabled:text-(--na-muted) ${className}`}
      style={{ fontFamily: "var(--na-mono)" }}
      {...rest}
    >
      <svg
        viewBox="0 0 16 16"
        className="hidden size-3 group-aria-pressed:block"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        aria-hidden
      >
        <path d="m3 8.5 3.5 3.5L13 4.5" />
      </svg>
      {children}
    </button>
  );
}
