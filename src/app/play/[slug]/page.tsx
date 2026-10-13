import type { Metadata } from "next";
import { gameBySlug, games } from "@/data/games";
import { GameView } from "./game-view";

// One static page per game; any other slug is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return games.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${gameBySlug(slug).title} · LazyDonkeyGames` };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <GameView game={gameBySlug(slug)} />;
}
