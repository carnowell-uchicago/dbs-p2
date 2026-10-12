import type { ButtonHTMLAttributes } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { disabledLook, focusRing } from "./classes";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  force?: ForcedState;
};

const base =
  "inline-flex items-center justify-center gap-2 rounded-(--na-r-md) border-2 font-bold uppercase tracking-[0.08em] transition-[background-color,border-color,color,box-shadow,translate] duration-150 select-none";

const sizes = {
  md: "h-11 min-w-28 px-5 text-sm",
  sm: "h-9 px-3.5 text-xs",
};

// Orange is the accent: only primary actions (Play) wear it.
const primary =
  "border-(--na-orange) bg-(--na-orange) text-(--na-void) hover:border-(--na-orange-hot) hover:bg-(--na-orange-hot) hover:shadow-[0_0_6px_var(--na-orange),0_0_20px_color-mix(in_srgb,var(--na-orange)_55%,transparent)] data-[force=hover]:border-(--na-orange-hot) data-[force=hover]:bg-(--na-orange-hot) data-[force=hover]:shadow-[0_0_6px_var(--na-orange),0_0_20px_color-mix(in_srgb,var(--na-orange)_55%,transparent)] active:translate-y-px active:brightness-[.82] active:shadow-[inset_0_3px_0_rgb(0_0_0/0.35)] data-[force=pressed]:translate-y-px data-[force=pressed]:brightness-[.82] data-[force=pressed]:shadow-[inset_0_3px_0_rgb(0_0_0/0.35)] disabled:bg-transparent";

const secondary =
  "border-(--na-edge) bg-transparent text-(--na-ice) hover:border-(--na-cyan) hover:bg-(--na-raised) hover:text-(--na-cyan) hover:shadow-[0_0_8px_color-mix(in_srgb,var(--na-cyan)_45%,transparent)] data-[force=hover]:border-(--na-cyan) data-[force=hover]:bg-(--na-raised) data-[force=hover]:text-(--na-cyan) data-[force=hover]:shadow-[0_0_8px_color-mix(in_srgb,var(--na-cyan)_45%,transparent)] active:translate-y-px active:border-(--na-cyan) active:bg-(--na-cyan)/15 active:shadow-none data-[force=pressed]:translate-y-px data-[force=pressed]:border-(--na-cyan) data-[force=pressed]:bg-(--na-cyan)/15 data-[force=pressed]:text-(--na-cyan) disabled:bg-transparent";

export function Button({
  variant = "secondary",
  size = "md",
  force,
  className = "",
  disabled,
  type = "button",
  ...rest
}: Props) {
  return (
    <button
      type={type}
      disabled={disabled || force === "disabled"}
      {...forceAttr(force)}
      className={`${base} ${sizes[size]} ${variant === "primary" ? primary : secondary} ${focusRing} ${disabledLook} ${className}`}
      style={{ fontFamily: "var(--na-display)" }}
      {...rest}
    />
  );
}
