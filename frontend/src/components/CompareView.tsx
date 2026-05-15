import { useMemo } from "react";
import type { Course } from "../types";
import { GE_CATEGORIES } from "../lib/categories";
import { CatBadge } from "./CatBadge";
import { UnitsPill } from "./UnitsPill";
import {
  IconClose,
  IconBookOpen,
  IconPrereq,
  IconReq,
  IconCompare,
} from "./icons";

interface Props {
  isMobile: boolean;
  compare: string[];
  allCourses: Course[];
  onRemove: (code: string) => void;
  onClear: () => void;
  onBrowse: () => void;
}

export function CompareView({
  isMobile,
  compare,
  allCourses,
  onRemove,
  onClear,
  onBrowse,
}: Props) {
  const courses = compare
    .map((code) => allCourses.find((c) => c.courseCode === code))
    .filter((c): c is Course => !!c);

  const sharedGes = useMemo(() => {
    if (courses.length < 2) return new Set<string>();
    return new Set(
      GE_CATEGORIES.map((c) => c.id).filter((cid) =>
        courses.every((c) => c.geCategories.includes(cid)),
      ),
    );
  }, [courses]);

  if (courses.length === 0) {
    return (
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: "32px 24px 24px" }}
      >
        <div
          className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed p-14"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border-2)",
            color: "var(--color-text-muted)",
          }}
        >
          <div
            className="w-14 h-14 rounded-[14px] grid place-items-center mb-[18px]"
            style={{
              background: "var(--color-accent-bg)",
              color: "var(--color-accent)",
            }}
          >
            <IconCompare className="w-[26px] h-[26px]" />
          </div>
          <h3
            className="m-0 text-[18px] font-semibold tracking-tight"
            style={{ color: "var(--color-text)" }}
          >
            Nothing to compare yet
          </h3>
          <p className="mt-1.5 max-w-[380px] text-[13.5px]">
            Add courses from Browse (up to 4) to see them side-by-side —
            including which GE categories they share, prerequisites, and
            enrollment notes.
          </p>
          <button
            onClick={onBrowse}
            className="mt-[18px] flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[13px] border transition-all hover:-translate-y-px"
            style={{
              maxWidth: 220,
              background: "var(--color-bg-2)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-2)",
            }}
          >
            Browse courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* header */}
      <div
        className="flex items-end justify-between gap-4"
        style={{ padding: isMobile ? "18px 16px 10px" : "22px 24px 12px" }}
      >
        <div>
          <h2 className="m-0 text-[22px] font-semibold tracking-tight">
            Comparison
          </h2>
          <p
            className="mt-1 text-[13.5px]"
            style={{ color: "var(--color-text-muted)" }}
          >
            Comparing{" "}
            <strong style={{ color: "var(--color-text-2)" }}>
              {courses.length}
            </strong>{" "}
            {courses.length === 1 ? "course" : "courses"}
          </p>
        </div>
        <button
          onClick={onClear}
          className="text-[13px] px-3 py-2 rounded-lg border transition-colors"
          style={{
            color: "var(--color-text-muted)",
            borderColor: "var(--color-border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "var(--color-text)";
            e.currentTarget.style.background = "var(--color-hover)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "var(--color-text-muted)";
            e.currentTarget.style.background = "transparent";
          }}
        >
          Clear all
        </button>
      </div>

      {isMobile ? (
        <MobileCompare
          courses={courses}
          sharedGes={sharedGes}
          onRemove={onRemove}
        />
      ) : (
        <DesktopCompare
          courses={courses}
          sharedGes={sharedGes}
          onRemove={onRemove}
        />
      )}
    </div>
  );
}

function CompareRow({
  label,
  icon,
  children,
  cols,
}: {
  label: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
  cols: string;
}) {
  return (
    <div
      className="grid border-b last:border-b-0"
      style={{ gridTemplateColumns: cols, borderColor: "var(--color-border)" }}
    >
      <div
        className="px-4 py-3.5 text-[11px] font-semibold tracking-[0.06em] uppercase flex items-start gap-1.5 border-r"
        style={{
          color: "var(--color-text-muted)",
          background: "var(--color-bg-2)",
          borderColor: "var(--color-border)",
          minHeight: 48,
        }}
      >
        {icon && <span className="mt-px">{icon}</span>}
        {label}
      </div>
      {children}
    </div>
  );
}

function CompareCell({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`px-4 py-3.5 text-[13.5px] leading-[1.55] border-r last:border-r-0 ${className ?? ""}`}
      style={{
        borderColor: "var(--color-border)",
        color: "var(--color-text-2)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function DesktopCompare({
  courses,
  sharedGes,
  onRemove,
}: {
  courses: Course[];
  sharedGes: Set<string>;
  onRemove: (code: string) => void;
}) {
  const cols = `220px repeat(${courses.length}, minmax(0, 1fr))`;

  return (
    <div
      className="mx-6 mb-6 rounded-[14px] border overflow-hidden"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* head row: course codes */}
      <CompareRow label=" " cols={cols}>
        {courses.map((c) => (
          <CompareCell
            key={c.courseCode}
            className="font-mono text-[13px] font-semibold relative"
            style={{
              background: "var(--color-surface-2)",
              color: "var(--color-accent)",
              paddingRight: 36,
            }}
          >
            {c.courseCode}
            <button
              onClick={() => onRemove(c.courseCode)}
              className="absolute top-2.5 right-2.5 w-[22px] h-[22px] rounded-[6px] grid place-items-center transition-colors"
              style={{ color: "var(--color-text-muted)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--color-hover)";
                e.currentTarget.style.color = "var(--color-text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--color-text-muted)";
              }}
              aria-label="Remove"
            >
              <IconClose className="w-3 h-3" />
            </button>
          </CompareCell>
        ))}
      </CompareRow>

      <CompareRow label="Title" cols={cols}>
        {courses.map((c) => (
          <CompareCell
            key={c.courseCode}
            className="font-semibold text-[15px] tracking-[-0.01em]"
            style={{ color: "var(--color-text)" }}
          >
            {c.courseTitle}
          </CompareCell>
        ))}
      </CompareRow>

      <CompareRow label="Units" cols={cols}>
        {courses.map((c) => (
          <CompareCell key={c.courseCode}>
            <UnitsPill n={c.units} />
          </CompareCell>
        ))}
      </CompareRow>

      <CompareRow label="GE Categories" cols={cols}>
        {courses.map((c) => (
          <CompareCell key={c.courseCode}>
            <div className="flex flex-wrap gap-1">
              {c.geCategories.map((g) => (
                <CatBadge key={g} id={g} shared={sharedGes.has(g)} />
              ))}
            </div>
          </CompareCell>
        ))}
      </CompareRow>

      <CompareRow
        label="Description"
        icon={<IconBookOpen className="w-3 h-3" />}
        cols={cols}
      >
        {courses.map((c) => (
          <CompareCell key={c.courseCode}>{c.description}</CompareCell>
        ))}
      </CompareRow>

      <CompareRow
        label="Prerequisites"
        icon={<IconPrereq className="w-3 h-3" />}
        cols={cols}
      >
        {courses.map((c) => (
          <CompareCell key={c.courseCode}>
            {c.prerequisites || "None"}
          </CompareCell>
        ))}
      </CompareRow>

      <CompareRow
        label="Restrictions"
        icon={<IconReq className="w-3 h-3" />}
        cols={cols}
      >
        {courses.map((c) => (
          <CompareCell key={c.courseCode}>
            {c.restrictions || "None"}
          </CompareCell>
        ))}
      </CompareRow>
    </div>
  );
}

function MobileCompare({
  courses,
  sharedGes,
  onRemove,
}: {
  courses: Course[];
  sharedGes: Set<string>;
  onRemove: (code: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5 px-4 pb-6">
      {courses.map((c) => (
        <div
          key={c.courseCode}
          className="rounded-xl border p-3.5"
          style={{
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
        >
          <div className="flex justify-between items-start gap-2.5">
            <div>
              <div
                className="font-mono text-xs font-semibold"
                style={{ color: "var(--color-accent)" }}
              >
                {c.courseCode}
              </div>
              <div
                className="text-[16px] font-semibold mt-0.5 tracking-tight"
                style={{ color: "var(--color-text)" }}
              >
                {c.courseTitle}
              </div>
            </div>
            <button
              onClick={() => onRemove(c.courseCode)}
              className="w-9 h-9 rounded-lg grid place-items-center flex-none"
              style={{ color: "var(--color-text-2)" }}
              aria-label="Remove"
            >
              <IconClose className="w-[18px] h-[18px]" />
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2.5">
            <UnitsPill n={c.units} />
            {c.geCategories.map((g) => (
              <CatBadge key={g} id={g} shared={sharedGes.has(g)} />
            ))}
          </div>

          <dl className="grid gap-2.5 mt-3">
            <DlItem label="Description">{c.description}</DlItem>
            <DlItem label="Prerequisites">{c.prerequisites || "None"}</DlItem>
            <DlItem label="Restrictions">{c.restrictions || "None"}</DlItem>
          </dl>
        </div>
      ))}
    </div>
  );
}

function DlItem({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <dt
        className="text-[10.5px] font-semibold tracking-[0.07em] uppercase"
        style={{ color: "var(--color-text-muted)" }}
      >
        {label}
      </dt>
      <dd
        className="mt-1 text-[13.5px] leading-[1.55]"
        style={{ marginLeft: 0, color: "var(--color-text-2)" }}
      >
        {children}
      </dd>
    </div>
  );
}
