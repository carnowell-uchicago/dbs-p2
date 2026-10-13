"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { focusRing } from "@/components/ds/console-tiles/styles";

// The lockup from brand/logos (make.py writes public/logo-lockup.svg).
// Its card corners are 48 of 340, so the ring follows them at each size.
const logo = (
  <Image
    src="/logo-lockup.svg"
    alt="LazyDonkeyGames"
    width={930}
    height={340}
    loading="eager"
    className="h-14 w-auto sm:h-20"
  />
);

// The logo is the page heading on the catalog. On a game page the game's
// title is the heading, so the logo becomes a link back home.
export function Brand() {
  const home = usePathname().replace(/\/$/, "") === "/play";
  return home ? (
    <h1 className="shrink-0">{logo}</h1>
  ) : (
    <Link href="/play" className={`block shrink-0 rounded-lg sm:rounded-xl ${focusRing}`}>
      {logo}
    </Link>
  );
}
