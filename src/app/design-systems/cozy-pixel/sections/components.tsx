import type { ReactNode } from "react";
import { gameBySlug } from "@/data/games";
import type { ForcedState } from "@/lib/design-system";
import { Button } from "@/components/ds/cozy-pixel/Button";
import { Chip } from "@/components/ds/cozy-pixel/Chip";
import { Checkbox, Radio, SearchInput, Select, Toggle } from "@/components/ds/cozy-pixel/Fields";
import { GameCard, ListRow } from "@/components/ds/cozy-pixel/GameCard";
import { Badge, FavoriteButton, Rating } from "@/components/ds/cozy-pixel/Meta";
import { TabButton } from "@/components/ds/cozy-pixel/Tabs";
import { TextLink } from "@/components/ds/cozy-pixel/TextLink";
import { font, type } from "@/components/ds/cozy-pixel/styles";
import { Block, Caption, Section, Specimens } from "./showcase";
import { CardsDemo, ChipsDemo, DialogDemo, DialogPreview, FavoriteDemo, ListDemo, TabsDemo } from "./live";

const hay = gameBySlug("hay-runner");
const golf = gameBySlug("pocket-golf");

const pointer: ForcedState[] = ["rest", "hover", "focus", "pressed", "disabled"];
const toggled: ForcedState[] = ["rest", "hover", "focus", "pressed", "selected", "disabled"];

function sortOptions() {
  return (
    <>
      <option value="popular">Most played</option>
      <option value="new">Newest</option>
      <option value="rating">Top rated</option>
    </>
  );
}

function Fieldset({ legend, children }: { legend: string; children: ReactNode }) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className={`${type.label} mb-4 text-(--cp-text)`}>{legend}</legend>
      {children}
    </fieldset>
  );
}

export function ComponentsSection() {
  return (
    <Section
      id="components"
      title="Components"
      intro="Each component has a live copy to try with mouse or keyboard, then frozen copies in every state it can be in. Selected always means a wood fill or check, never color alone."
    >
      <div className="grid grid-cols-1 gap-12">
        <Block
          title="Buttons"
          note="Primary is pumpkin and appears once per view, for the main action. Secondary is paper. Pressing sinks the button into its shadow."
          live={
            <div className="flex flex-wrap gap-6">
              <Button variant="primary">Play</Button>
              <Button>Details</Button>
            </div>
          }
        >
          <Specimens
            label="Primary"
            items={pointer.map((s) => ({ state: s, node: <Button variant="primary" force={s}>Play</Button> }))}
          />
          <Specimens
            label="Secondary"
            items={pointer.map((s) => ({ state: s, node: <Button force={s}>Details</Button> }))}
          />
        </Block>

        <Block
          title="Link"
          note="Cocoa text with a wood underline that thickens on hover. Used inside sentences and for navigation."
          live={
            <p className={type.body}>
              Want more? <TextLink href="/mood-boards/cozy-pixel">See the mood board</TextLink> behind this style.
            </p>
          }
        >
          <Specimens
            items={(["rest", "hover", "focus", "pressed"] as ForcedState[]).map((s) => ({
              state: s,
              node: (
                <TextLink href="#components" force={s}>
                  All games
                </TextLink>
              ),
            }))}
          />
        </Block>

        <Block
          title="Text input"
          note="Search field with a label above. The edge turns cocoa on hover; focus adds the square outline."
          live={<SearchInput id="cp-live-search" label="Search games" placeholder="Try “golf”" />}
        >
          <Specimens
            wide
            items={[
              { state: "rest", node: <SearchInput id="cp-s-rest" label="Search games" placeholder="Try “golf”" className="w-full" /> },
              { state: "hover", node: <SearchInput id="cp-s-hover" label="Search games" placeholder="Try “golf”" force="hover" className="w-full" /> },
              { state: "focus, filled", node: <SearchInput id="cp-s-focus" label="Search games" defaultValue="golf" force="focus" className="w-full" /> },
              { state: "disabled", node: <SearchInput id="cp-s-disabled" label="Search games" placeholder="Try “golf”" force="disabled" className="w-full" /> },
            ]}
          />
        </Block>

        <Block
          title="Select"
          note="A native select, so the keyboard and phone pickers work as people expect."
          live={
            <Select id="cp-live-sort" label="Sort by" defaultValue="popular" className="max-w-xs">
              {sortOptions()}
            </Select>
          }
        >
          <Specimens
            wide
            items={(["rest", "hover", "focus", "disabled"] as ForcedState[]).map((s) => ({
              state: s,
              node: (
                <Select id={`cp-sort-${s}`} label="Sort by" defaultValue="popular" force={s} className="w-full">
                  {sortOptions()}
                </Select>
              ),
            }))}
          />
        </Block>

        <Block
          title="Checkboxes"
          note="Any number can be on. Checked fills with wood and shows a cream check."
          live={
            <Fieldset legend="Show">
              <Checkbox label="New games" defaultChecked />
              <Checkbox label="Hot games" />
              <Checkbox label="Games under 5 minutes" />
            </Fieldset>
          }
        >
          <Specimens items={toggled.map((s) => ({ state: s, node: <Checkbox label="New" force={s} /> }))} />
        </Block>

        <Block
          title="Radios"
          note="Exactly one is on. Arrow keys move between options in the group."
          live={
            <Fieldset legend="Session length">
              <Radio name="cp-length" label="Quick, under 5 minutes" defaultChecked />
              <Radio name="cp-length" label="Any length" />
              <Radio name="cp-length" label="Long, 10 minutes or more" />
            </Fieldset>
          }
        >
          <Specimens
            items={toggled.map((s) => ({ state: s, node: <Radio name={`cp-radio-${s}`} label="Quick" force={s} /> }))}
          />
        </Block>

        <Block
          title="Toggle"
          note="A switch for settings that apply at once. On slides the knob right and fills the track with wood."
          live={<Toggle label="Sound effects" defaultChecked />}
        >
          <Specimens items={toggled.map((s) => ({ state: s, node: <Toggle label="Sound" force={s} /> }))} />
        </Block>

        <Block
          title="Tabs"
          note="Switch between lists without leaving the page. Arrow keys move between tabs; Home and End jump to the ends."
          live={<TabsDemo />}
        >
          <Specimens
            items={toggled.map((s) => ({
              state: s,
              node: (
                <div className="bg-(--cp-sunken) px-2 pt-2 pb-1">
                  <TabButton selected={s === "selected"} force={s}>
                    New
                  </TabButton>
                </div>
              ),
            }))}
          />
        </Block>

        <Block
          title="Filter chips"
          note="Pick any categories to narrow the games. A picked chip sinks in, fills with wood, and gains a check."
          live={<ChipsDemo />}
        >
          <Specimens items={toggled.map((s) => ({ state: s, node: <Chip force={s}>Puzzle</Chip> }))} />
        </Block>

        <Block
          title="Game card"
          note="The whole card is one button that opens the game's details. Hover lifts it and shows an arrow."
          live={<CardsDemo />}
        >
          <Specimens
            wide
            items={(["rest", "hover", "focus", "pressed"] as ForcedState[]).map((s) => ({
              state: s,
              node: <GameCard game={golf} force={s} />,
            }))}
          />
        </Block>

        <Block
          title="List rows"
          note="Compact rows for ranked lists. The row for the game that's open gets a wood bar and a wheat fill."
          live={<ListDemo />}
        >
          <Specimens
            wide
            columns="grid-cols-1 md:grid-cols-2"
            items={(["rest", "hover", "focus", "pressed", "selected"] as ForcedState[]).map((s) => ({
              state: s === "selected" ? "selected (open)" : s,
              node: (
                <div className="@container w-full bg-(--cp-surface) shadow-[0_0_0_2px_var(--cp-wood)]">
                  <ListRow game={hay} rank={1} force={s} />
                </div>
              ),
            }))}
          />
        </Block>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <Block
            title="Badges"
            note="Static tags with no states. Sky marks new games, gold marks hot ones, and paper names the category."
            live={
              <div className="flex flex-wrap gap-4">
                <Badge tone="new">New</Badge>
                <Badge tone="hot">Hot</Badge>
                <Badge tone="category">Puzzle</Badge>
              </div>
            }
          />
          <Block
            title="Rating"
            note="Whole stars for a quick read, plus the exact score. Screen readers hear “Rated 4.7 out of 5”."
            live={
              <ul className="flex flex-col gap-3">
                {["dungeon-dash", "pocket-golf", "paddle-panic"].map((slug) => {
                  const g = gameBySlug(slug);
                  return (
                    <li key={slug} className="flex flex-wrap items-center justify-between gap-3">
                      <span className={`${font.body} text-base`}>{g.title}</span>
                      <Rating value={g.rating} />
                    </li>
                  );
                })}
              </ul>
            }
          />
        </div>

        <Block
          title="Favorite"
          note="A heart toggle. Filled blossom means the game is saved for this visit."
          live={<FavoriteDemo />}
        >
          <Specimens
            items={toggled.map((s) => ({
              state: s,
              node: <FavoriteButton on={s === "selected"} force={s} />,
            }))}
          />
        </Block>

        <Block
          title="Game dialog"
          note="Opens from any card or row. Escape, the close button, or a click outside closes it, and focus returns to what opened it. Play is the only pumpkin button: it loads, then launches."
          live={<DialogDemo />}
        >
          <div className="flex flex-col gap-3">
            <Caption>Inside the dialog</Caption>
            <DialogPreview />
          </div>
        </Block>
      </div>
    </Section>
  );
}
