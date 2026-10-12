import type { ReactNode } from "react";

export const mono = { fontFamily: "var(--na-mono)" };
export const heading = { fontFamily: "var(--na-display-alt)" };

export const labelClass = "text-xs uppercase tracking-[0.2em] text-(--na-muted)";

export function Section({
  id,
  index,
  title,
  intro,
  children,
}: {
  id: string;
  index: string;
  title: string;
  intro: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-6 border-t border-(--na-line) py-12 sm:py-16">
      <p className={labelClass} style={mono}>
        {index}
      </p>
      <h2 id={`${id}-title`} className="mt-2 text-2xl font-semibold text-(--na-ice)" style={heading}>
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-base text-(--na-muted)">{intro}</p>
      <div className="mt-8">{children}</div>
    </section>
  );
}

// One component: a live control to try, then frozen specimens of each state.
export function Block({
  title,
  note,
  live,
  states,
  wide,
}: {
  title: string;
  note?: string;
  live: ReactNode;
  states?: ReactNode;
  wide?: boolean;
}) {
  return (
    <article className={`@container flex flex-col border border-(--na-line) bg-(--na-panel) ${wide ? "lg:col-span-2" : ""}`}>
      <header className="flex flex-col gap-1 border-b border-(--na-line) px-4 py-3 sm:px-5">
        <h3 className="text-lg font-semibold text-(--na-ice)" style={heading}>
          {title}
        </h3>
        {note && <p className="text-base text-(--na-muted)">{note}</p>}
      </header>
      <div className="flex flex-1 flex-col gap-3 px-4 py-5 sm:px-5">
        <p className={labelClass} style={mono}>
          Live
        </p>
        {live}
      </div>
      {states && (
        <div className="border-t border-(--na-line) bg-(--na-void) px-4 py-5 sm:px-5">
          <p className={labelClass} style={mono}>
            States
          </p>
          <div inert className="mt-3">
            {states}
          </div>
        </div>
      )}
    </article>
  );
}

// A grid of captioned specimens; wraps to two columns on narrow blocks.
export function StateGrid({ children, cols = 6 }: { children: ReactNode; cols?: 3 | 4 | 5 | 6 }) {
  const wide = {
    3: "@lg:grid-cols-3",
    4: "@2xl:grid-cols-4",
    5: "@lg:grid-cols-3 @3xl:grid-cols-5",
    6: "@lg:grid-cols-3 @3xl:grid-cols-6",
  }[cols];
  return <div className={`grid grid-cols-2 gap-x-4 gap-y-5 ${wide}`}>{children}</div>;
}

export function Spec({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div className="flex min-h-11 items-center">{children}</div>
      <span className="text-xs uppercase tracking-[0.16em] text-(--na-muted)" style={mono}>
        {label}
      </span>
    </div>
  );
}
