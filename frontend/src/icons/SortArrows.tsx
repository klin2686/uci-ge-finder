interface SortArrowsProps {
  className?: string;
  activeDirection?: 'asc' | 'desc' | null;
}

export default function SortArrows({ className, activeDirection }: SortArrowsProps) {
  return (
    <svg
      className={className}
      width="11"
      height="14"
      viewBox="0 0 11 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.5 1L8.5 4.5H2.5L5.5 1Z"
        fill="currentColor"
        opacity={activeDirection === 'asc' ? 1 : 0.4}
      />
      <path
        d="M5.5 13L2.5 9.5H8.5L5.5 13Z"
        fill="currentColor"
        opacity={activeDirection === 'desc' ? 1 : 0.4}
      />
    </svg>
  );
}
