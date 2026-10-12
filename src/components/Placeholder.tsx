import Link from "next/link";

// Temporary page so hub links resolve; replaced as each page is built.
export function Placeholder({ title }: { title: string }) {
  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <Link href="/" className="text-sm text-neutral-500 underline">
        ← Hub
      </Link>
      <h1 className="mt-4 text-3xl font-semibold">{title}</h1>
      <p className="mt-2 text-neutral-600">Not built yet.</p>
    </main>
  );
}
