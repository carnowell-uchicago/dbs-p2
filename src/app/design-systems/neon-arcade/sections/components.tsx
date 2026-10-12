import { LiveComponents } from "./demos";
import { Section } from "./parts";

export function ComponentsSection() {
  return (
    <Section
      id="components"
      n={4}
      title="Components"
      caption="Buttons, link, input, select, checkbox, radio, toggle, tabs, chips, card, list rows, badge, favorite, detail panel"
    >
      <LiveComponents />
    </Section>
  );
}
