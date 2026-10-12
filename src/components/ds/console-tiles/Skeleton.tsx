// Placeholder shapes while games load. The pulse only runs with motion allowed.
export function SkeletonCard() {
  return (
    <div aria-hidden className="overflow-hidden rounded-2xl bg-(--ct-surface)">
      <div className="aspect-[4/3] bg-(--ct-line) motion-safe:animate-pulse" />
      <div className="flex flex-col gap-2 p-3">
        <div className="h-4 w-3/4 rounded-full bg-(--ct-line) motion-safe:animate-pulse" />
        <div className="h-3.5 w-1/2 rounded-full bg-(--ct-bg) motion-safe:animate-pulse" />
      </div>
    </div>
  );
}
