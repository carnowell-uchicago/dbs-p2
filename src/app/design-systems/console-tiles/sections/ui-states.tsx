import type { ReactNode } from "react";
import { CheckIcon, Spinner } from "@/components/ds/console-tiles/Icons";
import { EmptyCard, ErrorCard } from "./live";
import { Section } from "./ui";

const card = "flex min-h-36 flex-col items-center justify-center gap-2 rounded-2xl bg-(--ct-bg) p-3 text-center";

function State({ name, children }: { name: string; children: ReactNode }) {
  return (
    <figure className="flex min-w-0 flex-col gap-2">
      {children}
      <figcaption className="text-center text-xs text-(--ct-muted)">{name}</figcaption>
    </figure>
  );
}

export function UiStatesSection() {
  return (
    <Section id="ui-states" n={6} title="UI states">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <State name="Empty">
          <EmptyCard />
        </State>
        <State name="Loading">
          <div role="status" aria-busy="true" className={card}>
            <Spinner className="size-8 text-(--ct-text)" />
            <p className="text-sm font-semibold">Loading games…</p>
          </div>
        </State>
        <State name="Error">
          <ErrorCard />
        </State>
        <State name="Success">
          <div role="status" className={card}>
            <span className="grid size-9 place-items-center rounded-full bg-(--ct-success) text-(--ct-bg)">
              <CheckIcon />
            </span>
            <p className="text-sm font-semibold">Added to favorites</p>
          </div>
        </State>
      </div>
    </Section>
  );
}
