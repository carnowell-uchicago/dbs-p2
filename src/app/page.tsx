import Link from "next/link";
import { hubFont } from "@/components/hub-font";
import { site, styles } from "@/data/styles";

export default function Hub() {
  return (
    <main className={`${hubFont} mx-auto w-full max-w-5xl px-6 py-16 sm:py-24`}>
      <p className="text-sm font-medium text-neutral-500">
        Design, Build, Ship · Assignment 2
      </p>
      <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
        {site.name}
      </h1>
      <p className="mt-4 max-w-xl text-lg text-neutral-600">
        A landing page for a new online games site. Three visual styles were
        explored; one was chosen and built.
      </p>

      <Link
        href={site.href}
        className="mt-8 inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-5 py-3 font-medium text-white hover:bg-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 active:bg-neutral-800"
      >
        Visit the site <span aria-hidden>→</span>
      </Link>

      <h2 className="mt-16 text-sm font-medium text-neutral-500">
        The three styles
      </h2>
      <ul className="mt-4 grid gap-4 sm:grid-cols-3">
        {styles.map((style) => (
          <li
            key={style.slug}
            className="flex flex-col rounded-xl border border-neutral-200 p-5"
          >
            <h3 className="text-xl font-semibold">{style.name}</h3>
            <p className="mt-1 text-neutral-600">{style.inspiration}</p>
            <div className="mt-auto flex flex-col gap-1 pt-5">
              <HubLink href={`/mood-boards/${style.slug}`}>Mood board</HubLink>
              <HubLink href={`/design-systems/${style.slug}`}>
                Design system
              </HubLink>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

function HubLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="self-start rounded font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-4 hover:decoration-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
    >
      {children}
    </Link>
  );
}
