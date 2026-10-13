"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { focusRing } from "@/components/ds/console-tiles/styles";

const brand = "text-2xl font-semibold";

// The site name is the page heading on the catalog. On a game page the game's
// title is the heading, so the name becomes a link back home.
export function Brand() {
  const home = usePathname().replace(/\/$/, "") === "/play";
  return home ? (
    <h1 className={brand} style={{ fontFamily: "var(--ct-display)" }}>
      LazyDonkeyGames
    </h1>
  ) : (
    <Link href="/play" className={`${brand} rounded-lg ${focusRing}`} style={{ fontFamily: "var(--ct-display)" }}>
      LazyDonkeyGames
    </Link>
  );
}
