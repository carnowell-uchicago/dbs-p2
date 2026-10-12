import type { ButtonHTMLAttributes } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { edge, focusRing, font } from "./styles";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  size?: "md" | "sm";
  force?: ForcedState;
};

const base = `inline-flex items-center justify-center gap-2 font-semibold select-none [--w:3px] [--e:var(--cp-wood)] [--d:3px] motion-safe:transition-[translate,background-color] motion-safe:duration-75 ${font.display} ${focusRing}`;

// Pressed sinks the face into its drop shadow; disabled goes flat and pale.
const states =
  "active:translate-y-[3px] active:[--d:0px] data-[force=pressed]:translate-y-[3px] data-[force=pressed]:[--d:0px] disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-(--cp-bg) disabled:text-(--cp-muted) disabled:[--e:var(--cp-bevel)] disabled:[--d:0px]";

const variants = {
  // Pumpkin is reserved for this variant: the one main action in a view.
  primary:
    "bg-(--cp-accent) text-(--cp-text) hover:bg-(--cp-accent-hover) data-[force=hover]:bg-(--cp-accent-hover) active:bg-(--cp-accent-pressed) data-[force=pressed]:bg-(--cp-accent-pressed)",
  secondary:
    "bg-(--cp-surface) text-(--cp-text) hover:bg-(--cp-hover) data-[force=hover]:bg-(--cp-hover) active:bg-(--cp-pressed) data-[force=pressed]:bg-(--cp-pressed)",
};

const sizes = {
  md: "h-11 px-5 text-lg",
  sm: "h-9 px-3 text-base",
};

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
      style={edge}
      className={`${base} ${variants[variant]} ${states} ${sizes[size]} ${className}`}
      {...rest}
    />
  );
}
