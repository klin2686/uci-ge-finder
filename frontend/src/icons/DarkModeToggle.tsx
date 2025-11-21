export function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 13.5C20.5 18.5 15.5 22 10.5 21C6 20 2.5 16 2 11.5C1.5 6.5 5 2 9.5 1.5C10 1.5 9.5 2 9.5 2.5C9.5 7.5 13.5 11.5 18.5 11.5C19 11.5 20.5 11.5 21 11C21.5 10.5 21.5 13 21 13.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="26"
      height="26"
      viewBox="0 0 26 26"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="13" cy="13" r="5" fill="currentColor" />
      <path d="M13 1V4M13 22V25M25 13H22M4 13H1M21.5 4.5L19.5 6.5M6.5 19.5L4.5 21.5M21.5 21.5L19.5 19.5M6.5 6.5L4.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
