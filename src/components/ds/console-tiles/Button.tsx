import type { ButtonHTMLAttributes } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { focusRing, pressScale } from "./styles";

type Variant = "primary" | "secondary";

type Size = "md" | "sm";

const base =
  "inline-flex items-center justify-center rounded-full font-semibold whitespace-nowrap select-none disabled:cursor-not-allowed";

// sm is for tight spots like state cards; md is the default everywhere else.
const sizes: Record<Size, string> = {
  md: "min-h-11 gap-2 px-6 text-base",
  sm: "min-h-9 gap-1.5 px-4 text-sm",
};

// Primary is the only place the accent appears.
const variants: Record<Variant, string> = {
  primary:
    "bg-(--ct-accent) text-white hover:bg-(--ct-accent-hover) data-[force=hover]:bg-(--ct-accent-hover) active:bg-(--ct-accent-press) data-[force=pressed]:bg-(--ct-accent-press) disabled:bg-(--ct-disabled) disabled:text-(--ct-disabled-text)",
  secondary:
    "border border-(--ct-control) bg-(--ct-surface) text-(--ct-text) hover:border-(--ct-text) hover:shadow-[0_4px_12px_rgb(0_0_0/0.12)] data-[force=hover]:border-(--ct-text) data-[force=hover]:shadow-[0_4px_12px_rgb(0_0_0/0.12)] active:bg-(--ct-line) data-[force=pressed]:bg-(--ct-line) disabled:border-(--ct-disabled) disabled:bg-(--ct-disabled) disabled:text-(--ct-disabled-text) disabled:shadow-none",
};

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  force?: ForcedState;
};

export function buttonClass(variant: Variant = "secondary", size: Size = "md") {
  return `${base} ${sizes[size]} ${variants[variant]} ${focusRing} ${pressScale}`;
}

export function Button({
  variant = "secondary",
  size = "md",
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
      className={`${buttonClass(variant, size)} ${className}`}
      {...forceAttr(force)}
      {...rest}
    />
  );
}
