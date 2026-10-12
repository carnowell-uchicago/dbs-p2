export type BoardItem<R, A> =
  { kind: "reference"; item: R } | { kind: "artifact"; item: A };

// Mood board order: mix photos with code-built pieces so no kind clumps
// together. One reference, then `perReference` artifacts taken from each
// group in turn; leftovers go at the end.
export function boardOrder<R, A>(
  references: R[],
  artifactGroups: A[][],
  perReference = 2,
): BoardItem<R, A>[] {
  const groups = artifactGroups.map((group) => [...group]);
  const items: BoardItem<R, A>[] = [];
  let g = 0;
  for (const reference of references) {
    items.push({ kind: "reference", item: reference });
    for (let n = 0; n < perReference; n++) {
      const artifact = groups[g++ % groups.length].shift();
      if (artifact) items.push({ kind: "artifact", item: artifact });
    }
  }
  for (const group of groups) {
    for (const artifact of group)
      items.push({ kind: "artifact", item: artifact });
  }
  return items;
}
