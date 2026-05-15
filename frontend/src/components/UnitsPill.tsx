interface Props {
  n: number;
}

export function UnitsPill({ n }: Props) {
  return (
    <span
      className="inline-flex text-xs px-2 py-0.5 rounded-md whitespace-nowrap tabular-nums"
      style={{ background: "var(--color-bg-2)", color: "var(--color-text-2)" }}
    >
      {n}&nbsp;Units
    </span>
  );
}
