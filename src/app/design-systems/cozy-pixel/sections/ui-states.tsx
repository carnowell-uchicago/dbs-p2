import type { ReactNode } from "react";
import { Button } from "@/components/ds/cozy-pixel/Button";
import { PixelSprite } from "@/components/ds/cozy-pixel/PixelSprite";
import { Icon } from "@/components/ds/cozy-pixel/icons";
import { edge, font, type } from "@/components/ds/cozy-pixel/styles";
import { Caption, Section } from "./frame";

// What a screen says when there's nothing, not yet, a problem, or good news.
// Frozen like the states table, so the buttons here are pictures, not stops.

const basket = [
  "...tttttt...",
  "..t......t..",
  ".t........t.",
  "tttttttttttt",
  "twlwlwlwlwlt",
  "tlwlwlwlwlwt",
  ".twlwlwlwlt.",
  ".tlwlwlwlwt.",
  "..tttttttt..",
];

function Card({ label, edgeColor = "var(--cp-wood)", children }: { label: string; edgeColor?: string; children: ReactNode }) {
  return (
    <figure className="flex min-w-0 flex-col gap-3">
      <div
        style={{ ...edge, ["--e" as string]: edgeColor }}
        className="flex min-h-44 flex-col items-center justify-center gap-3 bg-(--cp-surface) p-4 text-center [--w:2px] [--d:0px]"
      >
        {children}
      </div>
      <figcaption>
        <Caption>{label}</Caption>
      </figcaption>
    </figure>
  );
}

const message = `${font.display} text-base leading-snug font-semibold`;

export function UiStatesSection() {
  return (
    <Section n={6} id="ui-states" title="UI states">
      <div inert className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card label="Empty">
          <PixelSprite rows={basket} colors={{ t: "var(--cp-text)", w: "var(--cp-wood)", l: "var(--cp-bevel)" }} className="w-10" />
          <p className={message}>No games match “zebra”</p>
          <Button size="sm">Clear search</Button>
        </Card>

        <Card label="Loading">
          <span aria-hidden className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block size-3 bg-(--cp-wood) motion-safe:animate-pulse"
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </span>
          <p className={`${type.body} text-(--cp-muted)`}>Fetching games from the barn…</p>
        </Card>

        <Card label="Error" edgeColor="var(--cp-error)">
          <span className="text-(--cp-error)">
            <Icon name="bang" className="size-6" />
          </span>
          <p className={`${message} text-(--cp-error)`}>Pocket Golf didn’t load</p>
          <Button size="sm">Retry</Button>
        </Card>

        <Card label="Success">
          <span
            style={edge}
            className="grid size-9 place-items-center bg-(--cp-success) text-(--cp-text) [--w:2px] [--e:var(--cp-text)] [--d:0px]"
          >
            <Icon name="check" className="size-5" />
          </span>
          <p className={message}>Hay Runner is in your favorites</p>
        </Card>
      </div>
    </Section>
  );
}
