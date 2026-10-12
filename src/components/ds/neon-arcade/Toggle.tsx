"use client";

import { useState, type ReactNode } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";

type Props = {
  children: ReactNode;
  defaultChecked?: boolean;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  force?: ForcedState;
  className?: string;
};

// A switch, not a checkbox: the change takes effect right away.
export function Toggle({
  children,
  defaultChecked = false,
  checked,
  onCheckedChange,
  disabled,
  force,
  className = "",
}: Props) {
  const [own, setOwn] = useState(defaultChecked || force === "selected");
  const on = checked ?? own;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled || force === "disabled"}
      {...forceAttr(force)}
      onClick={() => {
        setOwn(!on);
        onCheckedChange?.(!on);
      }}
      className={`group inline-flex items-center gap-3 text-left text-base text-(--na-ice) focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-(--na-cyan) data-[force=focus]:outline-2 data-[force=focus]:outline-offset-4 data-[force=focus]:outline-(--na-cyan) disabled:pointer-events-none disabled:text-(--na-muted) ${className}`}
      style={{ fontFamily: "var(--na-body)" }}
    >
      <span
        className="relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-(--na-edge) bg-(--na-panel) px-0.5 transition-[border-color,background-color,box-shadow] group-hover:border-(--na-cyan) group-data-[force=hover]:border-(--na-cyan) group-aria-checked:border-(--na-cyan) group-aria-checked:bg-(--na-cyan)/20 group-aria-checked:shadow-[0_0_8px_color-mix(in_srgb,var(--na-cyan)_45%,transparent)] group-disabled:border-(--na-line) group-disabled:bg-(--na-void) group-disabled:shadow-none"
        aria-hidden
      >
        <span className="h-4 w-4 rounded-full bg-(--na-muted) transition-[translate,width,background-color] group-active:w-5 group-data-[force=pressed]:w-5 group-aria-checked:translate-x-5 group-aria-checked:bg-(--na-cyan) group-aria-checked:group-active:translate-x-4 group-disabled:bg-(--na-line)" />
      </span>
      {children}
    </button>
  );
}
