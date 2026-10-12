import type { ReactNode } from "react";
import { SkeletonCard } from "@/components/ds/console-tiles/Skeleton";
import { CheckIcon } from "@/components/ds/console-tiles/Icons";
import { EmptyDemo, ErrorDemo } from "./states-live";
import { Caption, Panel, Section } from "./ui";

function StatePanel({ name, says, children }: { name: string; says: string; children: ReactNode }) {
  return (
    <Panel className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <Caption>{name}</Caption>
        <p className="text-sm text-(--ct-muted)">{says}</p>
      </div>
      {children}
    </Panel>
  );
}

export function UiStatesSection() {
  return (
    <Section id="ui-states" title="UI states" intro="What the screen says when there’s nothing, not yet, a problem, or good news.">
      <div className="grid gap-4 md:grid-cols-2">
        <StatePanel name="Empty" says="Nothing matched. Say so, and offer the way out.">
          <EmptyDemo />
        </StatePanel>

        <StatePanel name="Loading" says="Gray tiles hold the layout so nothing jumps.">
          <div aria-busy="true" className="flex flex-col gap-3">
            <div className="grid grid-cols-3 gap-3">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <p role="status" className="text-sm text-(--ct-muted)">
              Loading games…
            </p>
          </div>
        </StatePanel>

        <StatePanel name="Error" says="Name what failed and give one thing to do.">
          <ErrorDemo />
        </StatePanel>

        <StatePanel name="Success" says="A short confirmation that doesn’t get in the way.">
          <div className="flex flex-col gap-3">
            <div
              role="status"
              className="flex items-center gap-3 self-start rounded-full bg-(--ct-text) py-2 pr-5 pl-2 text-white shadow-[0_10px_24px_rgb(0_0_0/0.14)]"
            >
              <span className="grid size-8 place-items-center rounded-full bg-(--ct-success)">
                <CheckIcon className="size-4" />
              </span>
              <span className="text-sm font-semibold">Hay Runner added to favorites</span>
            </div>
            <p className="flex items-center gap-2 text-base font-semibold text-(--ct-success)">
              <CheckIcon className="size-5" /> Launching Dungeon Dash…
            </p>
          </div>
        </StatePanel>
      </div>
    </Section>
  );
}
