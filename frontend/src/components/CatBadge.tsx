import type { CategoryId } from "../types";

interface Props {
  id: CategoryId;
  matched?: boolean;
  shared?: boolean;
  big?: boolean;
}

export function CatBadge({ id, matched, shared, big }: Props) {
  const isHighlighted = matched || shared;

  return (
    <span
      className="inline-flex items-center font-mono font-semibold tracking-wide rounded-md border whitespace-nowrap"
      style={{
        fontSize: big ? 13 : "11.5px",
        padding: big ? "4px 10px" : "3px 8px",
        letterSpacing: "0.02em",
        lineHeight: 1,
        background: isHighlighted ? "var(--color-accent-bg)" : "var(--color-surface-2)",
        borderColor: isHighlighted ? "var(--color-accent-bd)" : "var(--color-border)",
        color: isHighlighted ? "var(--color-accent-2)" : "var(--color-text-muted)",
      }}
    >
      {id}
    </span>
  );
}
