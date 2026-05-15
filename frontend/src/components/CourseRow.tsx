import type { Course, CategoryId } from "../types";
import { CatBadge } from "./CatBadge";
import { UnitsPill } from "./UnitsPill";
import {
  IconChevDn,
  IconChevUp,
  IconPlus,
  IconCheck,
  IconPrereq,
  IconReq,
} from "./icons";

interface Props {
  course: Course;
  expanded: boolean;
  onToggle: () => void;
  inCompare: boolean;
  onCompare: () => void;
  selectedCats: CategoryId[];
}

export function CourseRow({
  course,
  expanded,
  onToggle,
  inCompare,
  onCompare,
  selectedCats,
}: Props) {
  return (
    <>
      <tr
        onClick={onToggle}
        className="cursor-pointer transition-colors border-b last:border-b-0"
        style={{
          borderColor: "var(--color-border)",
          background: expanded ? "var(--color-bg-2)" : undefined,
        }}
        onMouseEnter={(e) => {
          if (!expanded)
            (e.currentTarget as HTMLTableRowElement).style.background =
              "var(--color-bg-2)";
        }}
        onMouseLeave={(e) => {
          if (!expanded)
            (e.currentTarget as HTMLTableRowElement).style.background = "";
        }}
      >
        <td className="py-4 px-4 whitespace-nowrap w-[130px]">
          <span
            className="font-mono text-[12.5px] font-semibold"
            style={{ color: "var(--color-accent)" }}
          >
            {course.courseCode}
          </span>
        </td>
        <td className="py-4 px-4 w-[280px]">
          <span
            className="font-semibold text-[14px] tracking-tight"
            style={{ color: "var(--color-text)" }}
          >
            {course.courseTitle}
          </span>
        </td>
        <td className="py-4 px-4 w-20">
          <UnitsPill n={course.units} />
        </td>
        <td className="py-4 px-4 w-[180px]">
          <div className="flex flex-wrap gap-1">
            {course.geCategories.map((g) => (
              <CatBadge key={g} id={g} shared={selectedCats.includes(g)} />
            ))}
          </div>
        </td>
        <td className="py-4 px-4" style={{ color: "var(--color-text-2)" }}>
          <span
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {course.description}
          </span>
        </td>
        <td
          className="py-4 px-4 w-20 text-right"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="inline-flex gap-1">
            <ActionBtn
              active={inCompare}
              onClick={onCompare}
              title={inCompare ? "Remove from comparison" : "Add to comparison"}
            >
              {inCompare ? (
                <IconCheck className="w-[15px] h-[15px]" />
              ) : (
                <IconPlus className="w-[15px] h-[15px]" />
              )}
            </ActionBtn>
            <ActionBtn
              onClick={onToggle}
              title={expanded ? "Hide details" : "Show details"}
            >
              {expanded ? (
                <IconChevUp className="w-[15px] h-[15px]" />
              ) : (
                <IconChevDn className="w-[15px] h-[15px]" />
              )}
            </ActionBtn>
          </div>
        </td>
      </tr>
      {expanded && (
        <tr style={{ background: "var(--color-bg-2)" }}>
          <td colSpan={6} className="px-4 pb-[18px]">
            <div className="grid grid-cols-2 gap-4 pt-1">
              <ExpandBlock
                icon={<IconPrereq className="w-3 h-3" />}
                label="Prerequisites"
              >
                {course.prerequisites || "None"}
              </ExpandBlock>
              <ExpandBlock
                icon={<IconReq className="w-3 h-3" />}
                label="Restrictions"
              >
                {course.restrictions || "None"}
              </ExpandBlock>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function ActionBtn({
  active,
  onClick,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-8 h-8 rounded-[7px] inline-grid place-items-center border transition-all"
      style={{
        color: active ? "var(--color-accent)" : "var(--color-text-muted)",
        background: active ? "var(--color-accent-bg)" : "transparent",
        borderColor: active ? "var(--color-accent-bd)" : "transparent",
      }}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background = "var(--color-surface-2)";
          e.currentTarget.style.color = "var(--color-text)";
          e.currentTarget.style.borderColor = "var(--color-border)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = "var(--color-text-muted)";
          e.currentTarget.style.borderColor = "transparent";
        }
      }}
    >
      {children}
    </button>
  );
}

function ExpandBlock({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="p-3.5 rounded-[10px] border"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      <div
        className="flex items-center gap-1.5 text-[10.5px] font-semibold tracking-[0.08em] uppercase mb-1.5"
        style={{ color: "var(--color-text-muted)" }}
      >
        {icon}
        {label}
      </div>
      <div
        className="text-[13.5px] leading-[1.55]"
        style={{ color: "var(--color-text-2)" }}
      >
        {children}
      </div>
    </div>
  );
}
