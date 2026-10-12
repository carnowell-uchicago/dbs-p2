import { StarIcon } from "./Icons";

// Five stars filled to the rating, plus the number so it never relies on the stars.
export function Rating({ value, size = "sm" }: { value: number; size?: "sm" | "md" }) {
  const star = size === "md" ? "size-5" : "size-4";
  const pct = `${(value / 5) * 100}%`;
  return (
    <span role="img" aria-label={`Rated ${value} out of 5`} className="inline-flex items-center gap-1.5">
      <span aria-hidden className="relative inline-flex">
        <span className="flex text-(--ct-line)">
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon key={i} className={star} />
          ))}
        </span>
        <span className="absolute inset-0 flex overflow-hidden text-(--ct-text)" style={{ width: pct }}>
          {[0, 1, 2, 3, 4].map((i) => (
            <StarIcon key={i} className={`${star} shrink-0`} />
          ))}
        </span>
      </span>
      <span aria-hidden className={`font-semibold tabular-nums ${size === "md" ? "text-base" : "text-sm"}`}>
        {value.toFixed(1)}
      </span>
    </span>
  );
}
