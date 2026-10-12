import type { ReactNode } from "react";

// Layout pieces for the showcase page only (not part of the reusable UI).

export function Section({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6 pt-14">
      <h2 id={`${id}-title`} className="text-2xl leading-tight font-semibold" style={{ fontFamily: "var(--ct-display)" }}>
        {title}
      </h2>
      {intro && <p className="mt-2 max-w-2xl text-base text-(--ct-muted)">{intro}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-3xl bg-(--ct-surface) p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function Caption({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold tracking-wide text-(--ct-muted) uppercase">{children}</p>;
}

export type Specimen = { label: string; node: ReactNode };

// One component: a live control to try, then the same control frozen in each
// state. The frozen row is inert so keyboard users only tab through live ones.
export function Block({
  title,
  note,
  live,
  states,
  statesClass = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
}: {
  title: string;
  note?: string;
  live: ReactNode;
  states?: Specimen[];
  statesClass?: string;
}) {
  return (
    <Panel className="flex flex-col gap-5">
      <div>
        <h3 className="text-base font-semibold" style={{ fontFamily: "var(--ct-display)" }}>
          {title}
        </h3>
        {note && <p className="mt-1 text-sm text-(--ct-muted)">{note}</p>}
      </div>
      <div className="flex flex-col gap-3">
        <Caption>Try it</Caption>
        <div>{live}</div>
      </div>
      {states && (
        <div className="flex flex-col gap-3 border-t border-(--ct-line) pt-5">
          <Caption>States</Caption>
          <div inert className={`grid gap-x-4 gap-y-5 ${statesClass}`}>
            {states.map((s, i) => (
              <figure key={i} className="flex min-w-0 flex-col items-start gap-3">
                <div className="flex min-h-11 w-full items-center p-2">{s.node}</div>
                <figcaption className="px-2 text-sm text-(--ct-muted)">{s.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      )}
    </Panel>
  );
}
