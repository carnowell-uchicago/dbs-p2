import type { InputHTMLAttributes, ReactNode } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  children: ReactNode;
  force?: ForcedState;
};

// Box and dot share one look: Edge outline at rest, cyan once hovered,
// filled with cyan light once chosen.
const control =
  "peer col-start-1 row-start-1 size-5 appearance-none border-2 border-(--na-edge) bg-(--na-panel) transition-[border-color,box-shadow,background-color] outline-hidden group-hover:border-(--na-cyan) data-[force=hover]:border-(--na-cyan) focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-2 focus-visible:outline-(--na-cyan) data-[force=focus]:outline-3 data-[force=focus]:outline-solid data-[force=focus]:outline-offset-2 data-[force=focus]:outline-(--na-cyan) active:bg-(--na-cyan)/25 data-[force=pressed]:bg-(--na-cyan)/25 checked:border-(--na-cyan) checked:bg-(--na-cyan)/15 checked:shadow-[0_0_8px_color-mix(in_srgb,var(--na-cyan)_45%,transparent)] disabled:border-(--na-line) disabled:bg-(--na-void) disabled:shadow-none";

const row =
  "group inline-flex cursor-pointer items-center gap-3 text-base text-(--na-ice) has-disabled:pointer-events-none has-disabled:text-(--na-muted)";

export function Checkbox({ children, force, disabled, className = "", ...rest }: Props) {
  return (
    <label className={`${row} ${className}`} style={{ fontFamily: "var(--na-body)" }}>
      <span className="grid place-items-center">
        <input
          type="checkbox"
          disabled={disabled || force === "disabled"}
          defaultChecked={force === "selected" ? true : undefined}
          {...forceAttr(force)}
          className={`${control} rounded-(--na-r-sm)`}
          {...rest}
        />
        <svg
          viewBox="0 0 16 16"
          className="pointer-events-none col-start-1 row-start-1 size-3.5 text-(--na-cyan) opacity-0 peer-checked:opacity-100 peer-disabled:text-(--na-muted)"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          aria-hidden
        >
          <path d="m3 8.5 3.5 3.5L13 4.5" />
        </svg>
      </span>
      {children}
    </label>
  );
}

export function Radio({ children, force, disabled, className = "", ...rest }: Props) {
  return (
    <label className={`${row} ${className}`} style={{ fontFamily: "var(--na-body)" }}>
      <span className="grid place-items-center">
        <input
          type="radio"
          disabled={disabled || force === "disabled"}
          defaultChecked={force === "selected" ? true : undefined}
          {...forceAttr(force)}
          className={`${control} rounded-full`}
          {...rest}
        />
        <span
          className="pointer-events-none col-start-1 row-start-1 size-2 rounded-full bg-(--na-cyan) opacity-0 shadow-[0_0_6px_var(--na-cyan)] peer-checked:opacity-100 peer-disabled:bg-(--na-muted) peer-disabled:shadow-none"
          aria-hidden
        />
      </span>
      {children}
    </label>
  );
}
