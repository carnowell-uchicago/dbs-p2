"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

type Store = {
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  ratings: Record<string, number>; // the player's own stars, 0 = not rated
  rate: (slug: string, stars: number) => void;
};

const StoreContext = createContext<Store | null>(null);

// Favorites and ratings live in the /play layout, so they survive moving
// between the catalog and a game. They reset on reload; nothing is saved.
export function StoreProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ratings, setRatings] = useState<Record<string, number>>({});

  const toggleFavorite = (slug: string) =>
    setFavorites((f) => (f.includes(slug) ? f.filter((s) => s !== slug) : [...f, slug]));
  const rate = (slug: string, stars: number) => setRatings((r) => ({ ...r, [slug]: stars }));

  return (
    <StoreContext.Provider value={{ favorites, toggleFavorite, ratings, rate }}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("useStore needs StoreProvider");
  return store;
}
