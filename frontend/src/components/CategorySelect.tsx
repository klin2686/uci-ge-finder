import { useState, useRef, useEffect } from "react";
import type { CategoryId } from "../types";
import { GE_CATEGORIES } from "../lib/categories";
import { IconChevDn, IconCheck } from "./icons";

interface Props {
  value: CategoryId | undefined;
  otherValue: CategoryId | undefined;
  placeholder: string;
  alignRight?: boolean;
  onChange: (v: CategoryId | null) => void;
}

export function CategorySelect({
  value,
  otherValue,
  placeholder,
  alignRight,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  const cat = value ? GE_CATEGORIES.find((c) => c.id === value) : null;

  return (
    <div ref={ref} className="relative flex-none">
      <button
        onClick={() => setOpen((o) => !o)}
        className="relative h-12 rounded-xl flex items-center gap-2.5 text-[14px] transition-all text-left overflow-hidden border"
        style={{
          width: 220,
          padding: "0 36px 0 14px",
          background: "var(--color-surface)",
          borderColor:
            open || value ? "var(--color-accent-bd)" : "var(--color-border)",
          color: value ? "var(--color-accent)" : "var(--color-text-faint)",
          fontWeight: value ? undefined : 500,
        }}
      >
        <span className="flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap flex items-center gap-2">
          {cat ? (
            <>
              <span
                className="font-mono text-xs font-semibold"
                style={{ color: "var(--color-accent)" }}
              >
                {cat.id}
              </span>
              <span className="truncate">{cat.name}</span>
            </>
          ) : (
            placeholder
          )}
        </span>
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: "var(--color-text-muted)" }}
        >
          <IconChevDn className="w-3.5 h-3.5" />
        </span>
      </button>

      {open && (
        <div
          className={`absolute top-[calc(100%+6px)] ${alignRight ? "right-0" : "left-0"} min-w-full z-20 rounded-xl border p-1.5 overflow-y-auto`}
          style={{
            width: 300,
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
            maxHeight: 340,
            boxShadow:
              "0 0 0 1px var(--color-border), 0 8px 24px oklch(0 0 0 / 0.30)",
          }}
        >
          {value && (
            <button
              onClick={() => {
                onChange(null);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-2.5 py-2 rounded-[7px] text-left text-[13.5px] transition-colors"
              style={{ minHeight: 36 }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "var(--color-hover)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <span
                className="font-mono text-xs font-semibold w-9 text-left"
                style={{ color: "var(--color-text-muted)" }}
              >
                —
              </span>
              <span style={{ color: "var(--color-text-muted)" }}>
                Clear selection
              </span>
            </button>
          )}
          {GE_CATEGORIES.map((c) => {
            const isSelf = value === c.id;
            const isOther = otherValue === c.id;
            return (
              <button
                key={c.id}
                disabled={isOther}
                onClick={() => {
                  if (!isOther) {
                    onChange(c.id);
                    setOpen(false);
                  }
                }}
                className="w-full flex items-center gap-3 px-2.5 py-2 rounded-[7px] text-left text-[13.5px] transition-colors"
                style={{
                  minHeight: 36,
                  opacity: isOther ? 0.4 : 1,
                  cursor: isOther ? "not-allowed" : "pointer",
                  color: isSelf ? "var(--color-accent)" : "var(--color-text)",
                }}
                onMouseEnter={(e) => {
                  if (!isOther)
                    e.currentTarget.style.background = "var(--color-hover)";
                }}
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span
                  className="font-mono text-xs font-semibold w-9 text-left tracking-wider"
                  style={{ color: "var(--color-accent)" }}
                >
                  {c.id}
                </span>
                <span className="flex-1 min-w-0">{c.name}</span>
                {isSelf && (
                  <IconCheck
                    className="w-4 h-4 flex-none"
                    style={{ color: "var(--color-accent)" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
