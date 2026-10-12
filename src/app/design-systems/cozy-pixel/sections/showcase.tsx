import type { ReactNode } from "react";
import type { ForcedState } from "@/lib/design-system";
import { Panel } from "@/components/ds/cozy-pixel/Panel";
import { type } from "@/components/ds/cozy-pixel/styles";

// Layout pieces for the design-system page only (not used by the site).

export function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6 border-t-4 border-(--cp-bevel) pt-10">
      <h2 id={`${id}-title`} className={type.heading}>
        {title}
      </h2>
      <p className={`${type.body} mt-2 max-w-2xl text-(--cp-muted)`}>{intro}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export function Caption({ children }: { children: ReactNode }) {
  return <span className={`${type.label} text-(--cp-muted)`}>{children}</span>;
}

export type Specimen = { state: ForcedState | string; node: ReactNode };

// Frozen copies of a control, one per state. `inert` keeps them out of the
// tab order, so keyboard users only meet the live control above.
// `wide` is for controls that fill their cell, like text fields and cards.
export function Specimens({
  items,
  label,
  wide,
  columns,
}: {
  items: Specimen[];
  label?: string;
  wide?: boolean;
  columns?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      {label ? <Caption>{label}</Caption> : null}
      <div
        inert
        className={`grid gap-x-6 gap-y-8 ${columns ?? (wide ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6")}`}
      >
        {items.map(({ state, node }) => (
          <div key={state} className="flex min-w-0 flex-col items-start gap-4">
            <div className={`flex min-h-12 items-center p-2 ${wide ? "w-full" : ""}`}>{node}</div>
            <Caption>{state}</Caption>
          </div>
        ))}
      </div>
    </div>
  );
}

// One component: name, one line on how it behaves, a live control, then its states.
export function Block({
  title,
  note,
  live,
  children,
}: {
  title: string;
  note: string;
  live: ReactNode;
  children?: ReactNode;
}) {
  return (
    <Panel as="article" className="min-w-0">
      <div className="flex flex-col gap-6 p-5 sm:p-6">
        <header className="flex flex-col gap-1">
          <h3 className={type.title}>{title}</h3>
          <p className={`${type.body} text-(--cp-muted)`}>{note}</p>
        </header>
        <div className="flex flex-col gap-3">
          <Caption>Try it</Caption>
          <div className="bg-(--cp-bg) p-5">{live}</div>
        </div>
        {children}
      </div>
    </Panel>
  );
}
