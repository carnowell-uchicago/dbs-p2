export type Style = {
  slug: string;
  name: string;
  inspiration: string;
};

export const styles: Style[] = [
  {
    slug: "neon-arcade",
    name: "Neon Arcade",
    inspiration: "The original Tron's light grids, with a modern twist",
  },
  {
    slug: "console-tiles",
    name: "Console Tiles",
    inspiration: "A console home screen of large scrolling tiles",
  },
  {
    slug: "cozy-pixel",
    name: "Cozy Pixel",
    inspiration: "Warm farm-sim pixel art, like Stardew Valley",
  },
];

export const site = {
  name: "LazyDonkeyGames",
  href: "/play",
};
