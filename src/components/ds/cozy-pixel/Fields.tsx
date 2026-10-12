import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { forceAttr, type ForcedState } from "@/lib/design-system";
import { Icon } from "./icons";
import { edge, focusRingTight, font, type } from "./styles";

// Text input and select share one well: paper fill, 2px wood edge that turns
// cocoa on hover, square cocoa outline on focus, flat and pale when disabled.
const well = `h-11 w-full bg-(--cp-surface) text-base text-(--cp-text) [--w:2px] [--e:var(--cp-wood)] [--d:0px] hover:[--e:var(--cp-text)] data-[force=hover]:[--e:var(--cp-text)] disabled:cursor-not-allowed disabled:bg-(--cp-bg) disabled:text-(--cp-muted) disabled:[--e:var(--cp-bevel)] ${font.body} ${focusRingTight}`;

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={`${type.label} self-start text-(--cp-text)`}>
      {children}
    </label>
  );
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  id: string;
  label: string;
  force?: ForcedState;
};

export function SearchInput({ id, label, force, disabled, className = "", ...rest }: InputProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-(--cp-muted)">
          <Icon name="search" />
        </span>
        <input
          id={id}
          type="search"
          autoComplete="off"
          disabled={disabled || force === "disabled"}
          {...forceAttr(force)}
          style={edge}
          className={`${well} pr-3 pl-10 placeholder:text-(--cp-muted) [&::-webkit-search-cancel-button]:hidden`}
          {...rest}
        />
      </div>
    </div>
  );
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  label: string;
  force?: ForcedState;
};

export function Select({ id, label, force, disabled, className = "", children, ...rest }: SelectProps) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <div className="relative">
        <select
          id={id}
          disabled={disabled || force === "disabled"}
          {...forceAttr(force)}
          style={edge}
          className={`${well} cursor-pointer appearance-none pr-10 pl-3`}
          {...rest}
        >
          {children}
        </select>
        <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-(--cp-text)">
          <Icon name="chevron" />
        </span>
      </div>
    </div>
  );
}

type CheckProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: ReactNode;
  force?: ForcedState;
};

// Forced hover/focus/pressed sit on the <label>; the input reads them via group-data.
const choiceLabel = `group inline-flex cursor-pointer items-center gap-3 self-start text-(--cp-text) has-disabled:cursor-not-allowed has-disabled:text-(--cp-muted) ${font.body} text-base`;

const choiceFocus =
  "outline-hidden focus-visible:outline-3 focus-visible:outline-solid focus-visible:outline-offset-[5px] focus-visible:outline-(--cp-text) group-data-[force=focus]:outline-3 group-data-[force=focus]:outline-solid group-data-[force=focus]:outline-offset-[5px] group-data-[force=focus]:outline-(--cp-text)";

export function Checkbox({ label, force, disabled, ...rest }: CheckProps) {
  return (
    <label className={choiceLabel} {...forceAttr(force)}>
      <span className="relative grid size-6 shrink-0 place-items-center">
        <input
          type="checkbox"
          disabled={disabled || force === "disabled"}
          defaultChecked={force === "selected" ? true : undefined}
          style={edge}
          className={`peer absolute inset-0 m-0 cursor-[inherit] appearance-none bg-(--cp-surface) [--w:2px] [--e:var(--cp-wood)] [--d:0px] hover:[--e:var(--cp-text)] group-data-[force=hover]:[--e:var(--cp-text)] not-checked:hover:bg-(--cp-hover) group-data-[force=hover]:not-checked:bg-(--cp-hover) not-checked:active:bg-(--cp-pressed) group-data-[force=pressed]:not-checked:bg-(--cp-pressed) checked:bg-(--cp-wood) disabled:bg-(--cp-bg) disabled:[--e:var(--cp-bevel)] disabled:checked:bg-(--cp-bevel) ${choiceFocus}`}
          {...rest}
        />
        <span className="pointer-events-none relative hidden text-(--cp-surface) peer-checked:block">
          <Icon name="check" />
        </span>
      </span>
      {label}
    </label>
  );
}

const ringRows = [
  "..oooo..",
  ".offffo.",
  "offffffo",
  "offffffo",
  "offffffo",
  "offffffo",
  ".offffo.",
  "..oooo..",
];
const dotRows = ["........", "........", "...dd...", "..dddd..", "..dddd..", "...dd...", "........", "........"];

export function Radio({ label, force, disabled, ...rest }: CheckProps) {
  // The input is transparent over a pixel-circle drawing; the drawing reads
  // its colors from variables the input sets through `peer-*`.
  return (
    <label className={choiceLabel} {...forceAttr(force)}>
      <span className="relative size-6 shrink-0">
        <input
          type="radio"
          disabled={disabled || force === "disabled"}
          defaultChecked={force === "selected" ? true : undefined}
          className={`peer absolute inset-0 z-10 m-0 cursor-[inherit] appearance-none ${choiceFocus}`}
          {...rest}
        />
        <svg
          aria-hidden
          focusable="false"
          viewBox="0 0 8 8"
          shapeRendering="crispEdges"
          className="absolute inset-0 size-6 [--fill:var(--cp-surface)] [--ring:var(--cp-wood)] [--dot:transparent] peer-hover:[--ring:var(--cp-text)] peer-hover:[--fill:var(--cp-hover)] group-data-[force=hover]:[--ring:var(--cp-text)] group-data-[force=hover]:[--fill:var(--cp-hover)] peer-active:[--fill:var(--cp-pressed)] group-data-[force=pressed]:[--fill:var(--cp-pressed)] peer-checked:[--dot:var(--cp-wood)] peer-checked:[--fill:var(--cp-surface)] peer-disabled:[--ring:var(--cp-bevel)] peer-disabled:[--fill:var(--cp-bg)] peer-disabled:peer-checked:[--dot:var(--cp-bevel)]"
        >
          <PixelRects rows={ringRows} colors={{ o: "var(--ring)", f: "var(--fill)" }} />
          <PixelRects rows={dotRows} colors={{ d: "var(--dot)" }} />
        </svg>
      </span>
      {label}
    </label>
  );
}

function PixelRects({ rows, colors }: { rows: string[]; colors: Record<string, string> }) {
  return rows.flatMap((row, y) =>
    [...row].map((ch, x) =>
      colors[ch] ? <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} style={{ fill: colors[ch] }} /> : null,
    ),
  );
}

export function Toggle({ label, force, disabled, ...rest }: CheckProps) {
  return (
    <label className={choiceLabel} {...forceAttr(force)}>
      <span className="relative inline-flex h-8 w-14 shrink-0">
        <input
          type="checkbox"
          role="switch"
          disabled={disabled || force === "disabled"}
          defaultChecked={force === "selected" ? true : undefined}
          style={edge}
          className={`peer absolute inset-0 m-0 cursor-[inherit] appearance-none bg-(--cp-sunken) [--w:2px] [--e:var(--cp-wood)] [--d:0px] hover:[--e:var(--cp-text)] group-data-[force=hover]:[--e:var(--cp-text)] checked:bg-(--cp-wood) disabled:bg-(--cp-bg) disabled:[--e:var(--cp-bevel)] disabled:checked:bg-(--cp-bevel) ${choiceFocus}`}
          {...rest}
        />
        <span className="pointer-events-none absolute top-1 left-1 size-6 bg-(--cp-wood) peer-checked:translate-x-6 peer-checked:bg-(--cp-surface) peer-active:scale-75 group-data-[force=pressed]:scale-75 peer-disabled:bg-(--cp-bevel) peer-disabled:peer-checked:bg-(--cp-bg) motion-safe:transition-transform motion-safe:duration-100" />
      </span>
      {label}
    </label>
  );
}
