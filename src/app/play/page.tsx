import type { Metadata } from "next";
import { Site } from "./site";

export const metadata: Metadata = {
  title: "LazyDonkeyGames · Free games in your browser",
};

// Featured game first, then the popular row, then every game with filters.
export default function Play() {
  return <Site />;
}
