"use client";

import { useId, useRef, useState, type ComponentProps, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { font } from "./styles";

type TabButtonProps = ComponentProps<"button"> & {
  selected: boolean;
  force?: ForcedState;
};

// Unselected tabs sit on the wheat shelf; the selected tab is a paper tab
// with a wood edge on three sides that drops 3px over the panel's top border,
// so tab and panel read as one piece.
const openEdge: CSSProperties = {
  boxShadow: "0 -3px 0 0 var(--cp-wood), -3px 0 0 0 var(--cp-wood), 3px 0 0 0 var(--cp-wood)",
};

export function TabButton({ selected, force, className = "", ...rest }: TabButtonProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      tabIndex={selected ? 0 : -1}
      disabled={rest.disabled || force === "disabled"}
      {...forceAttr(force)}
      style={selected ? openEdge : undefined}
      className={`relative h-11 px-4 text-lg font-semibold text-(--cp-text) select-none ${font.display}
        hover:bg-(--cp-hover) data-[force=hover]:bg-(--cp-hover) active:bg-(--cp-pressed) data-[force=pressed]:bg-(--cp-pressed)
        aria-selected:z-10 aria-selected:-mb-[3px] aria-selected:h-[47px] aria-selected:bg-(--cp-surface) aria-selected:hover:bg-(--cp-surface)
        disabled:cursor-not-allowed disabled:bg-transparent disabled:text-(--cp-muted)
        outline-hidden focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-[5px] focus-visible:outline-(--cp-text) data-[force=focus]:outline-3 data-[force=focus]:outline-solid data-[force=focus]:outline-offset-[5px] data-[force=focus]:outline-(--cp-text) ${className}`}
      {...rest}
    />
  );
}

export type TabItem = { id: string; label: string; content: ReactNode };

// WAI-ARIA tabs with automatic activation: ←/→ move and select, Home/End jump.
export function Tabs({ label, items }: { label: string; items: TabItem[] }) {
  const [active, setActive] = useState(items[0].id);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const base = useId();

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const i = items.findIndex((t) => t.id === active);
    const last = items.length - 1;
    const next =
      e.key === "ArrowRight" ? (i === last ? 0 : i + 1)
      : e.key === "ArrowLeft" ? (i === 0 ? last : i - 1)
      : e.key === "Home" ? 0
      : e.key === "End" ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    setActive(items[next].id);
    refs.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="flex flex-wrap items-end gap-x-2 gap-y-1 bg-(--cp-sunken) px-3 pt-3"
      >
        {items.map((t, i) => (
          <TabButton
            key={t.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            id={`${base}-tab-${t.id}`}
            aria-controls={`${base}-panel-${t.id}`}
            selected={t.id === active}
            onClick={() => setActive(t.id)}
          >
            {t.label}
          </TabButton>
        ))}
      </div>
      {items.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`${base}-panel-${t.id}`}
          aria-labelledby={`${base}-tab-${t.id}`}
          hidden={t.id !== active}
          className="border-t-3 border-(--cp-wood) bg-(--cp-surface)"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
