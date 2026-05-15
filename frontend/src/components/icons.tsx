import type { SVGProps } from "react";

interface IconProps extends SVGProps<SVGSVGElement> {
  sw?: number;
}

function Icon({ d, sw = 1.75, children, ...rest }: IconProps & { d?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...rest}
    >
      {d ? <path d={d} /> : children}
    </svg>
  );
}

export const IconSearch = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="M21 21l-4.3-4.3" />
  </Icon>
);
export const IconClose = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 6l12 12M18 6L6 18" />
  </Icon>
);
export const IconCheck = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 12.5l5 5L20 6" />
  </Icon>
);
export const IconChevDn = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 9l6 6 6-6" />
  </Icon>
);
export const IconChevUp = (p: IconProps) => (
  <Icon {...p}>
    <path d="M6 15l6-6 6 6" />
  </Icon>
);
export const IconChevR = (p: IconProps) => (
  <Icon {...p}>
    <path d="M9 6l6 6-6 6" />
  </Icon>
);
export const IconPlus = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
);
export const IconFilter = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 5h18M6 12h12M10 19h4" />
  </Icon>
);
export const IconSort = (p: IconProps) => (
  <Icon {...p}>
    <path d="M3 6h13M3 12h9M3 18h5M17 8v12M17 20l3-3M17 20l-3-3" />
  </Icon>
);
export const IconSun = (p: IconProps) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </Icon>
);
export const IconMoon = (p: IconProps) => (
  <Icon {...p}>
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </Icon>
);
export const IconHat = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 9l10-4 10 4-10 4-10-4z" />
    <path d="M6 11v4c0 1.5 2.7 3 6 3s6-1.5 6-3v-4" />
  </Icon>
);
export const IconCompare = (p: IconProps) => (
  <Icon {...p}>
    <rect x="3" y="5" width="7" height="14" rx="1.5" />
    <rect x="14" y="5" width="7" height="14" rx="1.5" />
    <path d="M10 10h4M10 14h4" strokeWidth={1.2} />
  </Icon>
);
export const IconReq = (p: IconProps) => (
  <Icon {...p}>
    <path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
    <path d="M14 3v6h6M9 13h6M9 17h4" />
  </Icon>
);
export const IconPrereq = (p: IconProps) => (
  <Icon {...p}>
    <path d="M4 6h11M4 18h11" />
    <path d="M17 4l3 2-3 2M17 16l3 2-3 2" />
  </Icon>
);
export const IconSparkle = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 3l1.8 4.7L18 9.5l-4.2 1.8L12 16l-1.8-4.7L6 9.5l4.2-1.8z" />
    <path d="M19 14l.9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9z" />
  </Icon>
);
export const IconList = (p: IconProps) => (
  <Icon {...p} sw={2}>
    <path d="M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01" />
  </Icon>
);
export const IconArrowDn = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12l7 7 7-7" />
  </Icon>
);
export const IconArrowUp = (p: IconProps) => (
  <Icon {...p}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </Icon>
);
export const IconBookOpen = (p: IconProps) => (
  <Icon {...p}>
    <path d="M2 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H2zM22 4h-7a3 3 0 0 0-3 3v13a2 2 0 0 1 2-2h8z" />
  </Icon>
);
