import type { CategoryId } from "../types";
import { GE_CATEGORIES } from "../lib/categories";

interface Props {
  id: CategoryId;
  matched?: boolean;
  shared?: boolean;
  big?: boolean;
}

const HUES: Record<CategoryId, number> = Object.fromEntries(
  GE_CATEGORIES.map((c) => [c.id, c.hue]),
) as Record<CategoryId, number>;

export function CatBadge({ id, matched, shared, big }: Props) {
  const hue = HUES[id] ?? 250;
  const isHighlighted = matched || shared;

  const style: React.CSSProperties = {
    background: isHighlighted
      ? `oklch(var(--bdg-l-bg) calc(var(--bdg-c-bg) * 3) ${hue} / 0.9)`
      : `oklch(var(--bdg-l-bg) var(--bdg-c-bg) ${hue})`,
    borderColor: isHighlighted
      ? `oklch(var(--bdg-l-bd) calc(var(--bdg-c-bd) * 2) ${hue})`
      : `oklch(var(--bdg-l-bd) var(--bdg-c-bd) ${hue})`,
    color: `oklch(var(--bdg-l-fg) var(--bdg-c-fg) ${hue})`,
    fontSize: big ? 13 : undefined,
    padding: big ? "4px 10px" : undefined,
  };

  return (
    <span
      className="inline-flex items-center font-mono font-semibold tracking-wide rounded-md border whitespace-nowrap transition-transform"
      style={{
        ...style,
        fontSize: big ? 13 : "11.5px",
        padding: big ? "4px 10px" : "3px 8px",
        letterSpacing: "0.02em",
        lineHeight: 1,
      }}
    >
      {id}
    </span>
  );
}
