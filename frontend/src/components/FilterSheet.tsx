import { useState } from "react";
import type { CategoryId } from "../types";
import { GE_CATEGORIES } from "../lib/categories";
import { IconClose, IconCheck } from "./icons";

interface Props {
  cats: CategoryId[];
  onCats: (v: CategoryId[]) => void;
  onClose: () => void;
}

export function FilterSheet({ cats, onCats, onClose }: Props) {
  const [local, setLocal] = useState<CategoryId[]>(cats);

  const toggle = (id: CategoryId) => {
    if (local.includes(id)) setLocal(local.filter((x) => x !== id));
    else if (local.length < 2) setLocal([...local, id]);
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-end animate-fade-in"
      style={{ background: "oklch(0 0 0 / 0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full flex flex-col rounded-t-[18px] border-t animate-slide-up"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
          maxHeight: "80%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-9 h-1 rounded-full mx-auto mt-2.5 mb-1.5"
          style={{ background: "var(--color-border-2)" }}
        />

        <div
          className="flex items-center justify-between px-[18px] pb-3.5 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h3 className="m-0 text-[17px] font-semibold tracking-tight">
            Filter by GE category
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg grid place-items-center transition-colors"
            style={{ color: "var(--color-text-2)" }}
            aria-label="Close"
          >
            <IconClose className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="px-[18px] pt-3 pb-6 overflow-y-auto flex-1 flex flex-col gap-2.5">
          <p
            className="text-[12.5px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Pick up to 2 categories. Results will show classes that fulfill{" "}
            <strong style={{ color: "var(--color-text-2)" }}>all</strong>{" "}
            selected.
          </p>
          {GE_CATEGORIES.map((c) => {
            const sel = local.includes(c.id);
            const disabled = !sel && local.length >= 2;
            return (
              <button
                key={c.id}
                disabled={disabled}
                onClick={() => toggle(c.id)}
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-[10px] text-left text-[14px] transition-all"
                style={{
                  minHeight: 44,
                  lineHeight: 1.35,
                  opacity: disabled ? 0.4 : 1,
                  cursor: disabled ? "not-allowed" : "pointer",
                  background: sel ? "var(--color-accent-bg)" : "transparent",
                  color: sel ? "var(--color-text)" : "var(--color-text-2)",
                }}
                onMouseEnter={(e) => {
                  if (!disabled && !sel)
                    e.currentTarget.style.background = "var(--color-hover)";
                }}
                onMouseLeave={(e) => {
                  if (!sel) e.currentTarget.style.background = "transparent";
                }}
              >
                <span
                  className="font-mono text-[12.5px] font-semibold tracking-wider flex-none text-left"
                  style={{ width: 40, color: "var(--color-accent)" }}
                >
                  {c.id}
                </span>
                <span className="flex-1 min-w-0">{c.name}</span>
                {sel && (
                  <IconCheck
                    className="w-4 h-4 flex-none"
                    style={{ color: "var(--color-accent)", marginLeft: "auto" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div
          className="flex gap-2.5 px-[18px] py-3.5 border-t"
          style={{ borderColor: "var(--color-border)" }}
        >
          <button
            onClick={() => setLocal([])}
            className="flex-1 h-11 rounded-[10px] font-medium border transition-colors"
            style={{
              color: "var(--color-text-muted)",
              borderColor: "var(--color-border)",
            }}
          >
            Clear
          </button>
          <button
            onClick={() => {
              onCats(local);
              onClose();
            }}
            className="flex-1 h-11 rounded-[10px] font-medium transition-colors"
            style={{ background: "var(--color-accent)", color: "white" }}
          >
            Show results
          </button>
        </div>
      </div>
    </div>
  );
}
