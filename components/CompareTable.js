"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { getFeeColor, formatWeeklyTWD } from "@/libs/utils";
import { getSupabase } from "@/libs/supabase";
import config from "@/config";

/* ─── helpers ─── */

function getMinFeeIndex(schools) {
  let min = Infinity;
  let idx = -1;
  schools.forEach((s, i) => {
    const fee = minWeeklyFee(s);
    if (fee != null && fee < min) {
      min = fee;
      idx = i;
    }
  });
  return idx;
}

function minWeeklyFee(school) {
  const prices = (school.courses || [])
    .map((c) => c.price_per_week_usd)
    .filter((p) => p != null && p > 0);
  return prices.length > 0 ? Math.min(...prices) : null;
}

function distinctCourseTypes(school) {
  const types = (school.courses || []).map((c) => c.course_type).filter(Boolean);
  return [...new Set(types)];
}

/* ─── Add School Search (5.5) ─── */

function AddSchoolColumn({ currentSlugs, onAddSchool }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (query.length < 2) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      const supabase = getSupabase();
      if (!supabase) {
        setSearching(false);
        return;
      }
      const { data } = await supabase
        .from("schools")
        .select("id, slug, name, brand, country, city, photo_url")
        .ilike("name", `%${query}%`)
        .not("slug", "in", `(${currentSlugs.join(",")})`)
        .limit(8);
      setResults(data || []);
      setSearching(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [query, currentSlugs]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        placeholder="搜尋學校名稱..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        className="w-full px-3 py-2 text-sm font-display min-h-[44px]"
        style={{
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border)",
          backgroundColor: "var(--color-surface)",
          color: "var(--color-text)",
          outline: "none",
        }}
      />
      {open && results.length > 0 && (
        <div
          className="absolute left-0 right-0 mt-1 z-20 overflow-hidden shadow-lg"
          style={{
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-elevated)",
            maxHeight: 260,
            overflowY: "auto",
          }}
        >
          {results.map((school) => (
            <button
              key={school.slug}
              onClick={() => {
                onAddSchool(school.slug);
                setQuery("");
                setResults([]);
                setOpen(false);
              }}
              className="w-full flex items-center gap-3 px-3 py-2 text-left transition-colors"
              style={{ borderBottom: "1px solid var(--color-border)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.backgroundColor =
                  "var(--color-sunken)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.backgroundColor = "transparent")
              }
            >
              <div
                className="relative w-10 h-10 shrink-0 overflow-hidden"
                style={{ borderRadius: "var(--radius-sm)" }}
              >
                <Image
                  src={
                    school.photo_url ||
                    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200"
                  }
                  alt={school.name}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="min-w-0">
                <p
                  className="font-display font-semibold text-sm truncate"
                  style={{ color: "var(--color-text)" }}
                >
                  {school.name}
                </p>
                <p
                  className="text-xs truncate"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  {school.brand && `${school.brand} · `}
                  {config.countryNames[school.country] || school.country},{" "}
                  {school.city}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
      {open && query.length >= 2 && results.length === 0 && !searching && (
        <div
          className="absolute left-0 right-0 mt-1 z-20 px-3 py-4 text-sm text-center"
          style={{
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-elevated)",
            color: "var(--color-text-muted)",
          }}
        >
          找不到符合的學校
        </div>
      )}
    </div>
  );
}

/* ─── Row definitions ─── */

function buildRows(schools) {
  const lowestFeeIdx = getMinFeeIndex(schools);

  return [
    {
      label: "品牌",
      render: (s) => (
        <span
          className="font-display font-semibold text-sm"
          style={{ color: "var(--color-text)" }}
        >
          {s.brand || "—"}
        </span>
      ),
    },
    {
      label: "國家 / 城市",
      render: (s) => (
        <span className="text-sm" style={{ color: "var(--color-text)" }}>
          {config.countryFlags[s.country] || ""}{" "}
          {config.countryNames[s.country] || s.country}, {s.city}
        </span>
      ),
    },
    {
      label: "最低週費",
      render: (s, i) => {
        const fee = minWeeklyFee(s);
        if (fee == null)
          return (
            <span style={{ color: "var(--color-text-muted)" }}>—</span>
          );
        return (
          <div>
            <span
              className="font-mono font-semibold text-[22px]"
              style={{
                color:
                  i === lowestFeeIdx
                    ? "var(--color-success)"
                    : getFeeColor(fee),
              }}
            >
              {formatWeeklyTWD(fee)}
            </span>
            {i === lowestFeeIdx && schools.length > 1 && (
              <span
                className="block text-[11px] font-semibold mt-1"
                style={{ color: "var(--color-success)" }}
              >
                最低價
              </span>
            )}
          </div>
        );
      },
    },
    {
      label: "課程類型",
      render: (s) => {
        const types = distinctCourseTypes(s);
        return (
          <span className="text-sm" style={{ color: "var(--color-text)" }}>
            {types.length > 0 ? types.join("、") : "—"}
          </span>
        );
      },
    },
    {
      label: "住宿類型",
      render: (s) => (
        <span className="text-sm" style={{ color: "var(--color-text)" }}>
          {s.accommodation_types?.length > 0
            ? s.accommodation_types.join("、")
            : "—"}
        </span>
      ),
    },
    {
      label: "設施",
      render: (s) => (
        <span
          className="text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {s.features?.length > 0 ? s.features.join("、") : "—"}
        </span>
      ),
    },
  ];
}

/* ─── Desktop Table (5.2) ─── */

function DesktopTable({ schools, rows, currentSlugs, onAddSchool, onRemoveSchool }) {
  const canAdd = schools.length < 3;

  return (
    <div
      className="overflow-x-auto"
      style={{
        backgroundColor: "var(--color-elevated)",
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--color-border)",
      }}
    >
      <table className="w-full" style={{ minWidth: 640 }}>
        <thead>
          <tr>
            {/* Label column */}
            <th
              className="sticky left-0 z-10 w-[140px] p-4"
              style={{ backgroundColor: "var(--color-elevated)" }}
            />
            {schools.map((s) => (
              <th
                key={s.slug}
                className="p-4 text-left align-top"
                style={{ minWidth: 220 }}
              >
                {/* Photo thumbnail */}
                <div
                  className="relative w-full aspect-[16/10] mb-3 overflow-hidden"
                  style={{ borderRadius: "var(--radius-md)" }}
                >
                  <Image
                    src={
                      s.photo_url ||
                      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"
                    }
                    alt={s.name}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
                {/* Name */}
                <Link
                  href={`/schools/${s.slug}`}
                  className="font-display font-bold text-base hover:underline block"
                  style={{ color: "var(--color-text)" }}
                >
                  {s.name}
                </Link>
                {/* Remove button */}
                <button
                  onClick={() => onRemoveSchool(s.slug)}
                  className="text-xs mt-1 underline"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  移除
                </button>
              </th>
            ))}
            {/* Add School column (5.5) */}
            {canAdd && (
              <th className="p-4 text-left align-top" style={{ minWidth: 220 }}>
                <div
                  className="flex flex-col items-center justify-center py-8 px-4"
                  style={{
                    borderRadius: "var(--radius-md)",
                    border: "2px dashed var(--color-border)",
                    backgroundColor: "var(--color-surface)",
                    minHeight: 160,
                  }}
                >
                  <span
                    className="font-display font-semibold text-sm mb-3"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    + 新增學校
                  </span>
                  <AddSchoolColumn
                    currentSlugs={currentSlugs}
                    onAddSchool={onAddSchool}
                  />
                </div>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              style={{ borderTop: "1px solid var(--color-border)" }}
            >
              <td
                className="sticky left-0 z-10 p-4 font-display font-semibold text-sm"
                style={{
                  backgroundColor: "var(--color-elevated)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {row.label}
              </td>
              {schools.map((s, i) => (
                <td key={s.slug} className="p-4">
                  {row.render(s, i)}
                </td>
              ))}
              {canAdd && <td className="p-4" />}
            </tr>
          ))}
          {/* CTA row */}
          <tr style={{ borderTop: "1px solid var(--color-border)" }}>
            <td
              className="sticky left-0 z-10 p-4"
              style={{ backgroundColor: "var(--color-elevated)" }}
            />
            {schools.map((s) => (
              <td key={s.slug} className="p-4">
                <Link
                  href={`/schools/${s.slug}`}
                  className="inline-flex items-center px-4 py-2 font-display font-semibold text-sm min-h-[44px]"
                  style={{
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--color-accent)",
                    color: "white",
                  }}
                >
                  查看詳情
                </Link>
              </td>
            ))}
            {canAdd && <td className="p-4" />}
          </tr>
        </tbody>
      </table>
    </div>
  );
}

/* ─── Mobile Swipe Cards (5.3) ─── */

function MobileCards({ schools, rows, currentSlugs, onAddSchool, onRemoveSchool }) {
  const scrollRef = useRef(null);
  const canAdd = schools.length < 3;

  return (
    <div>
      <p
        className="text-xs mb-2 text-center"
        style={{ color: "var(--color-text-muted)" }}
      >
        ← 左右滑動比較 →
      </p>
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {schools.map((s, schoolIdx) => (
          <div
            key={s.slug}
            className="snap-start shrink-0"
            style={{
              width: "85vw",
              maxWidth: 340,
              backgroundColor: "var(--color-elevated)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              overflow: "hidden",
            }}
          >
            {/* Card header with photo */}
            <div className="relative w-full aspect-[16/10]">
              <Image
                src={
                  s.photo_url ||
                  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"
                }
                alt={s.name}
                fill
                className="object-cover"
                sizes="340px"
              />
            </div>
            <div className="p-4">
              <Link
                href={`/schools/${s.slug}`}
                className="font-display font-bold text-base hover:underline block mb-1"
                style={{ color: "var(--color-text)" }}
              >
                {s.name}
              </Link>
              <button
                onClick={() => onRemoveSchool(s.slug)}
                className="text-xs underline mb-4"
                style={{ color: "var(--color-text-muted)" }}
              >
                移除
              </button>

              {/* Attribute rows */}
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="flex items-start py-3"
                  style={{ borderTop: "1px solid var(--color-border)" }}
                >
                  <span
                    className="font-display font-semibold text-xs w-[80px] shrink-0 pt-0.5"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {row.label}
                  </span>
                  <div className="flex-1 min-w-0">
                    {row.render(s, schoolIdx)}
                  </div>
                </div>
              ))}

              {/* CTA */}
              <div className="mt-4">
                <Link
                  href={`/schools/${s.slug}`}
                  className="flex items-center justify-center w-full px-4 py-2.5 font-display font-semibold text-sm min-h-[44px]"
                  style={{
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--color-accent)",
                    color: "white",
                  }}
                >
                  查看詳情
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Add School card (5.5) */}
        {canAdd && (
          <div
            className="snap-start shrink-0 flex flex-col items-center justify-center p-6"
            style={{
              width: "85vw",
              maxWidth: 340,
              borderRadius: "var(--radius-lg)",
              border: "2px dashed var(--color-border)",
              backgroundColor: "var(--color-surface)",
              minHeight: 300,
            }}
          >
            <span
              className="font-display font-semibold text-sm mb-4"
              style={{ color: "var(--color-text-secondary)" }}
            >
              + 新增學校
            </span>
            <div className="w-full">
              <AddSchoolColumn
                currentSlugs={currentSlugs}
                onAddSchool={onAddSchool}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main CompareTable ─── */

export default function CompareTable({
  schools,
  currentSlugs,
  onAddSchool,
  onRemoveSchool,
}) {
  const rows = buildRows(schools);

  return (
    <div>
      {/* Desktop (768px+) */}
      <div className="hidden md:block">
        <DesktopTable
          schools={schools}
          rows={rows}
          currentSlugs={currentSlugs}
          onAddSchool={onAddSchool}
          onRemoveSchool={onRemoveSchool}
        />
      </div>

      {/* Mobile (below 768px) */}
      <div className="md:hidden">
        <MobileCards
          schools={schools}
          rows={rows}
          currentSlugs={currentSlugs}
          onAddSchool={onAddSchool}
          onRemoveSchool={onRemoveSchool}
        />
      </div>
    </div>
  );
}
