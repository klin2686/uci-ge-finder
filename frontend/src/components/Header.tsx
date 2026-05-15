import type { View } from "../types";
import { IconHat, IconSun, IconMoon, IconCompare, IconList } from "./icons";

interface Props {
  isMobile: boolean;
  theme: "dark" | "light";
  onThemeToggle: () => void;
  view: View;
  onView: (v: View) => void;
  compareCount: number;
}

export function Header({
  isMobile,
  theme,
  onThemeToggle,
  view,
  onView,
  compareCount,
}: Props) {
  return (
    <header
      className="grid sticky top-0 z-10 border-b"
      style={{
        gridTemplateColumns: isMobile ? "1fr auto" : "1fr auto 1fr",
        alignItems: "center",
        padding: isMobile ? "12px 16px" : "14px 24px",
        background: "var(--color-bg)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* brand */}
      <div className="flex items-center gap-2.5 font-semibold text-[15px] tracking-[-0.01em]">
        <span
          className="w-7 h-7 grid place-items-center rounded-[7px]"
          style={{
            background: "var(--color-accent-bg)",
            color: "var(--color-accent)",
          }}
        >
          <IconHat className="w-[18px] h-[18px]" />
        </span>
        <span>UCI GE Finder</span>
      </div>

      {/* desktop tabs */}
      {!isMobile && (
        <div className="flex gap-7 self-stretch items-stretch" role="tablist">
          {(["browse", "compare"] as View[]).map((v) => (
            <button
              key={v}
              role="tab"
              aria-selected={view === v}
              onClick={() => onView(v)}
              className="relative px-0.5 text-[14px] font-medium flex items-center gap-1.5 transition-colors"
              style={{
                color:
                  view === v
                    ? "var(--color-accent)"
                    : "var(--color-text-muted)",
                fontWeight: view === v ? 600 : 500,
              }}
            >
              {v === "browse" ? (
                <>
                  <IconList className="w-[14px] h-[14px]" /> Browse
                </>
              ) : (
                <>
                  <IconCompare className="w-[14px] h-[14px]" /> Compare
                </>
              )}
              {v === "compare" && compareCount > 0 && (
                <span
                  className="font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded-full ml-0.5"
                  style={{
                    background: "var(--color-accent-bg)",
                    color: "var(--color-accent)",
                  }}
                >
                  {compareCount}
                </span>
              )}
              {view === v && (
                <span
                  className="absolute left-0 right-0 h-0.5 rounded-sm"
                  style={{ bottom: -6, background: "var(--color-accent)" }}
                />
              )}
            </button>
          ))}
        </div>
      )}

      {/* right: theme toggle */}
      <div className="flex items-center gap-2 justify-self-end">
        <button
          onClick={onThemeToggle}
          aria-label="Toggle color theme"
          className="w-9 h-9 rounded-lg grid place-items-center transition-colors"
          style={{ color: "var(--color-text-2)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "var(--color-hover)";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--color-text)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              "transparent";
            (e.currentTarget as HTMLButtonElement).style.color =
              "var(--color-text-2)";
          }}
        >
          {theme === "dark" ? (
            <IconSun className="w-[18px] h-[18px]" />
          ) : (
            <IconMoon className="w-[18px] h-[18px]" />
          )}
        </button>
      </div>
    </header>
  );
}
