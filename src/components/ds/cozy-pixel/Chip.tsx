import type { ButtonHTMLAttributes } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { Icon } from "./icons";
import { edge, focusRing, font } from "./styles";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  selected?: boolean;
  force?: ForcedState;
};

// Filter chip: a toggle button. Selected fills with wood and shows a check,
// so the state never rests on color alone.
export function Chip({ selected, force, disabled, className = "", children, ...rest }: Props) {
  const on = selected ?? force === "selected";
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={disabled || force === "disabled"}
      {...forceAttr(force)}
      style={edge}
      className={`inline-flex h-9 items-center gap-2 px-3 text-base font-semibold select-none [--w:3px] [--e:var(--cp-wood)] [--d:3px] ${font.display} ${focusRing}
        bg-(--cp-surface) text-(--cp-text) not-aria-pressed:hover:bg-(--cp-hover) data-[force=hover]:bg-(--cp-hover)
        active:translate-y-[3px] active:[--d:0px] data-[force=pressed]:translate-y-[3px] data-[force=pressed]:[--d:0px] not-aria-pressed:active:bg-(--cp-pressed) data-[force=pressed]:bg-(--cp-pressed)
        aria-pressed:bg-(--cp-wood) aria-pressed:text-(--cp-surface) aria-pressed:[--e:var(--cp-text)] aria-pressed:[--d:0px] aria-pressed:translate-y-[3px]
        disabled:cursor-not-allowed disabled:translate-y-0 disabled:bg-(--cp-bg) disabled:text-(--cp-muted) disabled:[--e:var(--cp-bevel)] disabled:[--d:0px]
        motion-safe:transition-[translate] motion-safe:duration-75 ${className}`}
      {...rest}
    >
      {on ? <Icon name="check" /> : null}
      {children}
    </button>
  );
}
