import type { Course, CategoryId } from "../types";
import { CatBadge } from "./CatBadge";
import { UnitsPill } from "./UnitsPill";
import {
  IconChevDn,
  IconPlus,
  IconCheck,
  IconPrereq,
  IconReq,
  IconBookOpen,
} from "./icons";

interface Props {
  course: Course;
  expanded: boolean;
  onToggle: () => void;
  inCompare: boolean;
  onCompare: () => void;
  selectedCats: CategoryId[];
}

export function CourseCard({
  course,
  expanded,
  onToggle,
  inCompare,
  onCompare,
  selectedCats,
}: Props) {
  return (
    <div
      className="rounded-[14px] border transition-all"
      style={{
        background: "var(--color-surface)",
        borderColor: expanded
          ? "var(--color-accent-bd)"
          : "var(--color-border)",
        padding: 18,
        boxShadow: expanded ? "0 0 0 1px var(--color-accent-bd)" : undefined,
      }}
    >
      {/* head */}
      <div
        className="flex items-start justify-between gap-3 cursor-pointer"
        onClick={onToggle}
      >
        <div className="min-w-0 flex-1">
          <div
            className="font-mono text-xs font-semibold tracking-[0.01em]"
            style={{ color: "var(--color-accent)" }}
          >
            {course.courseCode}
          </div>
          <div
            className="text-[17px] font-semibold tracking-[-0.012em] leading-[1.25] mt-1"
            style={{ color: "var(--color-text)" }}
          >
            {course.courseTitle}
          </div>
          <div className="flex items-center flex-wrap gap-1.5 mt-2.5">
            <UnitsPill n={course.units} />
            {course.geCategories.map((g) => (
              <CatBadge key={g} id={g} shared={selectedCats.includes(g)} />
            ))}
          </div>
        </div>
        <div
          className="w-7 h-7 grid place-items-center flex-none transition-transform"
          style={{
            color: expanded ? "var(--color-accent)" : "var(--color-text-muted)",
            transform: expanded ? "rotate(180deg)" : undefined,
          }}
        >
          <IconChevDn className="w-4 h-4" />
        </div>
      </div>

      {expanded && (
        <>
          <div
            className="mt-3.5 pt-3.5 border-t flex flex-col gap-3.5"
            style={{ borderColor: "var(--color-border)" }}
          >
            <DetailBlock
              icon={<IconBookOpen className="w-3 h-3" />}
              label="Description"
            >
              <span
                className="text-[14px] leading-[1.55]"
                style={{ color: "var(--color-text-2)" }}
              >
                {course.description}
              </span>
            </DetailBlock>
            <DetailBlock
              icon={<IconPrereq className="w-3 h-3" />}
              label="Prerequisites"
            >
              <InfoBox>{course.prerequisites || "None"}</InfoBox>
            </DetailBlock>
            <DetailBlock
              icon={<IconReq className="w-3 h-3" />}
              label="Restrictions"
            >
              <InfoBox>{course.restrictions || "None"}</InfoBox>
            </DetailBlock>
          </div>

          <div className="mt-3.5 flex gap-2">
            <button
              onClick={onCompare}
              className="flex-1 h-10 rounded-[9px] border inline-flex items-center justify-center gap-1.5 text-[13.5px] font-medium transition-all"
              style={{
                color: inCompare
                  ? "var(--color-accent)"
                  : "var(--color-text-2)",
                background: inCompare
                  ? "var(--color-accent-bg)"
                  : "transparent",
                borderColor: inCompare
                  ? "var(--color-accent-bd)"
                  : "var(--color-border)",
              }}
            >
              {inCompare ? (
                <>
                  <IconCheck className="w-3.5 h-3.5" /> Added to comparison
                </>
              ) : (
                <>
                  <IconPlus className="w-3.5 h-3.5" /> Add to comparison
                </>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function DetailBlock({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div
        className="flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.08em] uppercase mb-1.5"
        style={{ color: "var(--color-text-muted)" }}
      >
        {icon}
        {label}
      </div>
      {children}
    </div>
  );
}

function InfoBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-[10px] border px-3 py-2.5 text-[13.5px] leading-[1.55]"
      style={{
        background: "var(--color-bg-2)",
        borderColor: "var(--color-border)",
        color: "var(--color-text-2)",
      }}
    >
      {children}
    </div>
  );
}
