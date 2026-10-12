import { gameBySlug, games } from "@/data/games";
import type { ForcedState } from "@/lib/design-system";
import { Badge, Rating } from "@/components/ds/neon-arcade/Badge";
import { Button } from "@/components/ds/neon-arcade/Button";
import { Checkbox, Radio } from "@/components/ds/neon-arcade/Choice";
import { Chip } from "@/components/ds/neon-arcade/Chip";
import { FavoriteButton } from "@/components/ds/neon-arcade/FavoriteButton";
import { SearchInput, Select } from "@/components/ds/neon-arcade/Field";
import { GameCard } from "@/components/ds/neon-arcade/GameCard";
import { ListRow } from "@/components/ds/neon-arcade/ListRow";
import { TabButton } from "@/components/ds/neon-arcade/Tabs";
import { TextLink } from "@/components/ds/neon-arcade/TextLink";
import { Toggle } from "@/components/ds/neon-arcade/Toggle";
import {
  ButtonDemo,
  CardsDemo,
  ChipsDemo,
  FavoriteDemo,
  ListDemo,
  ModalDemo,
  SearchDemo,
  SelectDemo,
  TabsDemo,
} from "./demos";
import { Block, Section, Spec, StateGrid, labelClass, mono } from "./parts";

const press: ForcedState[] = ["rest", "hover", "focus", "pressed", "disabled"];
const pick: ForcedState[] = ["rest", "hover", "focus", "pressed", "selected", "disabled"];
const field: ForcedState[] = ["rest", "hover", "focus", "disabled"];

const name = (s: ForcedState) => s[0].toUpperCase() + s.slice(1);

const sorts = (
  <>
    <option>Most played</option>
    <option>Top rated</option>
  </>
);

export function ComponentsSection() {
  const hay = gameBySlug("hay-runner");
  return (
    <Section
      id="components"
      index="04"
      title="Components"
      intro="Each control is live; try it with mouse or keyboard. The row below it freezes every state side by side."
    >
      <div className="grid items-start gap-4 lg:grid-cols-2">
        <Block
          title="Buttons"
          note="Primary is the only orange thing on a page. Everything else is secondary."
          live={<ButtonDemo />}
          states={
            <div className="flex flex-col gap-6">
              <StateGrid cols={5}>
                {press.map((s) => (
                  <Spec key={s} label={`Primary · ${name(s)}`}>
                    <Button variant="primary" force={s}>
                      Play
                    </Button>
                  </Spec>
                ))}
              </StateGrid>
              <StateGrid cols={5}>
                {press.map((s) => (
                  <Spec key={s} label={`Secondary · ${name(s)}`}>
                    <Button force={s}>Details</Button>
                  </Spec>
                ))}
              </StateGrid>
            </div>
          }
        />

        <Block
          title="Link"
          note="For navigation in running text. Cyan with an underline."
          live={
            <p className="text-base text-(--na-ice)">
              New here? See the <TextLink href="/mood-boards/neon-arcade">Neon Arcade mood board</TextLink>.
            </p>
          }
          states={
            <StateGrid cols={4}>
              {(["rest", "hover", "focus", "pressed"] as const).map((s) => (
                <Spec key={s} label={name(s)}>
                  <TextLink href="/mood-boards/neon-arcade" force={s}>
                    All puzzles
                  </TextLink>
                </Spec>
              ))}
            </StateGrid>
          }
        />

        <Block
          title="Text input"
          note="Search. Filters as you type."
          live={<SearchDemo />}
          states={
            <StateGrid cols={4}>
              {field.map((s) => (
                <Spec key={s} label={name(s)}>
                  <SearchInput label="Search" hideLabel placeholder="Search games" force={s} className="w-full" />
                </Spec>
              ))}
            </StateGrid>
          }
        />

        <Block
          title="Select"
          note="Sort order. The native menu, styled closed."
          live={<SelectDemo />}
          states={
            <StateGrid cols={4}>
              {field.map((s) => (
                <Spec key={s} label={name(s)}>
                  <Select label="Sort" hideLabel force={s} className="w-full">
                    {sorts}
                  </Select>
                </Spec>
              ))}
            </StateGrid>
          }
        />

        <Block
          title="Checkboxes"
          note="Any number of options."
          live={
            <fieldset className="flex flex-col gap-3">
              <legend className={`${labelClass} mb-3`} style={mono}>
                Only show
              </legend>
              <Checkbox defaultChecked>New this week</Checkbox>
              <Checkbox>Under 5 minutes</Checkbox>
              <Checkbox>Two players</Checkbox>
            </fieldset>
          }
          states={
            <StateGrid>
              {pick.map((s) => (
                <Spec key={s} label={s === "selected" ? "Checked" : name(s)}>
                  <Checkbox force={s}>Racing</Checkbox>
                </Spec>
              ))}
            </StateGrid>
          }
        />

        <Block
          title="Radios"
          note="Exactly one option."
          live={
            <fieldset className="flex flex-col gap-3">
              <legend className={`${labelClass} mb-3`} style={mono}>
                Difficulty
              </legend>
              <Radio name="na-difficulty" value="easy">Easy</Radio>
              <Radio name="na-difficulty" value="normal" defaultChecked>Normal</Radio>
              <Radio name="na-difficulty" value="hard">Hard</Radio>
            </fieldset>
          }
          states={
            <StateGrid>
              {pick.map((s) => (
                <Spec key={s} label={s === "selected" ? "Checked" : name(s)}>
                  <Radio name={`na-radio-${s}`} force={s}>Hard</Radio>
                </Spec>
              ))}
            </StateGrid>
          }
        />

        <Block
          title="Toggle"
          note="Takes effect at once, so there is no Save button."
          live={
            <div className="flex flex-col items-start gap-4">
              <Toggle defaultChecked>Sound effects</Toggle>
              <Toggle>Reduce glow</Toggle>
            </div>
          }
          states={
            <StateGrid>
              {pick.map((s) => (
                <Spec key={s} label={s === "selected" ? "On" : name(s)}>
                  <Toggle force={s}>Sound</Toggle>
                </Spec>
              ))}
            </StateGrid>
          }
        />

        <Block
          title="Filter chips"
          note="Pick several categories. A check marks each chosen one."
          live={<ChipsDemo />}
          states={
            <StateGrid>
              {pick.map((s) => (
                <Spec key={s} label={name(s)}>
                  <Chip force={s}>Puzzle</Chip>
                </Spec>
              ))}
            </StateGrid>
          }
        />

        <Block
          title="Tabs"
          wide
          note="Switch views in place. Arrow keys move between tabs."
          live={<TabsDemo />}
          states={
            <StateGrid>
              {pick.map((s) => (
                <Spec key={s} label={name(s)}>
                  <TabButton force={s}>Popular</TabButton>
                </Spec>
              ))}
            </StateGrid>
          }
        />

        <Block
          title="Game card"
          wide
          note="The whole card opens the game's details. The heart saves it."
          live={<CardsDemo />}
          states={
            <StateGrid cols={4}>
              {(["rest", "hover", "focus", "pressed"] as const).map((s) => (
                <Spec key={s} label={name(s)}>
                  <div className="w-full">
                    <GameCard game={gameBySlug("pirate-cove")} force={s} headingLevel="h4" />
                  </div>
                </Spec>
              ))}
            </StateGrid>
          }
        />

        <Block
          title="List rows and detail panel"
          wide
          note="Pick a row; the panel shows that game."
          live={<ListDemo />}
          states={
            <div className="flex flex-col gap-3">
              {(["rest", "hover", "focus", "pressed", "selected"] as const).map((s) => (
                <div key={s} className="grid items-center gap-1 sm:grid-cols-[6rem_1fr] sm:gap-4">
                  <span className="text-xs uppercase tracking-[0.16em] text-(--na-muted)" style={mono}>
                    {name(s)}
                  </span>
                  <ListRow game={hay} rank={1} force={s} />
                </div>
              ))}
            </div>
          }
        />

        <Block
          title="Favorite"
          note="A toggle button. Saved fills the heart."
          live={<FavoriteDemo />}
          states={
            <StateGrid>
              {pick.map((s) => (
                <Spec key={s} label={s === "selected" ? "Saved" : name(s)}>
                  <FavoriteButton title={hay.title} force={s} />
                </Spec>
              ))}
            </StateGrid>
          }
        />

        <Block
          title="Badges and rating"
          note="Labels, not buttons: no hover, no focus."
          live={
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="new">New</Badge>
                <Badge tone="hot">Hot</Badge>
                <Badge>{games[0].category}</Badge>
              </div>
              <Rating value={4.7} />
            </div>
          }
        />

        <Block
          title="Detail dialog"
          wide
          note="Opens over the page. Play is its primary action: it loads, then launches."
          live={<ModalDemo />}
        />
      </div>
    </Section>
  );
}
