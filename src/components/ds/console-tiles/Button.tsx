import type { ButtonHTMLAttributes } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { focusRing, pressScale } from "./styles";

type Variant = "primary" | "secondary";

const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 text-base font-semibold whitespace-nowrap select-none disabled:cursor-not-allowed";

// Primary is the only place the accent appears.
const variants: Record<Variant, string> = {
  primary:
    "bg-(--ct-accent) text-white hover:bg-(--ct-accent-hover) data-[force=hover]:bg-(--ct-accent-hover) active:bg-(--ct-accent-press) data-[force=pressed]:bg-(--ct-accent-press) disabled:bg-(--ct-disabled) disabled:text-(--ct-disabled-text)",
  secondary:
    "border border-(--ct-control) bg-(--ct-surface) text-(--ct-text) hover:border-(--ct-text) hover:shadow-[0_4px_12px_rgb(0_0_0/0.12)] data-[force=hover]:border-(--ct-text) data-[force=hover]:shadow-[0_4px_12px_rgb(0_0_0/0.12)] active:bg-(--ct-line) data-[force=pressed]:bg-(--ct-line) disabled:border-(--ct-disabled) disabled:bg-(--ct-disabled) disabled:text-(--ct-disabled-text) disabled:shadow-none",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  force?: ForcedState;
};

export function buttonClass(variant: Variant = "secondary") {
  return `${base} ${variants[variant]} ${focusRing} ${pressScale}`;
}

export function Button({
  variant = "secondary",
  force,
  className = "",
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || force === "disabled"}
      className={`${buttonClass(variant)} ${className}`}
      {...forceAttr(force)}
      {...rest}
    />
  );
}
