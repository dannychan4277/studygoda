"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/libs/supabase";
import SchoolCard from "@/components/SchoolCard";

const SORT_OPTIONS = [
  { value: "recommended", label: "推薦排序" },
  { value: "price_asc", label: "價格低→高" },
  { value: "price_desc", label: "價格高→低" },
  { value: "name_asc", label: "名稱 A→Z" },
];

const FEE_RANGES = [
  { value: "all", label: "全部", min: 0, max: Infinity },
  { value: "under200", label: "< $200", min: 0, max: 200 },
  { value: "200to350", label: "$200–350", min: 200, max: 350 },
  { value: "350to500", label: "$350–500", min: 350, max: 500 },
  { value: "over500", label: "$500+", min: 500, max: Infinity },
];

function SkeletonCard() {
  return (
    <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden" }}>
      <div className="skeleton w-full" style={{ height: "180px" }} />
      <div className="p-5 space-y-3" style={{ backgroundColor: "var(--color-elevated)" }}>
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-7 w-1/3" />
        <div className="skeleton h-4 w-1/2" />
      </div>
    </div>
  );
}

/* ── Refined FilterPill ── */
function FilterPill({ label, selected, onClick, count }) {
  return (
    <button
      onClick={onClick}
      className="group relative px-3.5 py-2 text-[13px] font-display font-semibold rounded-[8px] transition-all duration-200 ease-out flex items-center gap-1.5"
      style={{
        backgroundColor: selected ? "var(--color-primary)" : "transparent",
        color: selected ? "white" : "var(--color-text-secondary)",
        border: selected ? "1.5px solid var(--color-primary)" : "1.5px solid var(--color-border)",
        boxShadow: selected ? "0 1px 3px rgba(26,107,90,0.2)" : "none",
      }}
      onMouseEnter={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "var(--color-primary-light, #238C75)";
          e.currentTarget.style.color = "var(--color-primary)";
          e.currentTarget.style.backgroundColor = "rgba(26,107,90,0.04)";
        }
      }}
      onMouseLeave={(e) => {
        if (!selected) {
          e.currentTarget.style.borderColor = "var(--color-border)";
          e.currentTarget.style.color = "var(--color-text-secondary)";
          e.currentTarget.style.backgroundColor = "transparent";
        }
      }}
    >
      {selected && (
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
          <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {label}
      {count != null && (
        <span
          className="text-[11px] font-medium"
          style={{
            opacity: 0.6,
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/* ── Sort Button (pill-style toggle) ── */
function SortButton({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-[12px] font-display font-semibold rounded-full transition-all duration-150"
      style={{
        backgroundColor: selected ? "var(--color-text)" : "transparent",
        color: selected ? "var(--color-elevated)" : "var(--color-text-muted)",
        border: selected ? "none" : "1px solid transparent",
      }}
    >
      {label}
    </button>
  );
}

/* ── Filter Section with divider ── */
function FilterSection({ title, icon, children, last }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon && (
          <span style={{ color: "var(--color-text-muted)", display: "flex", alignItems: "center" }}>
            {icon}
          </span>
        )}
        <span
          className="text-[11px] font-display font-bold uppercase tracking-widest"
          style={{ color: "var(--color-text-muted)", letterSpacing: "0.08em" }}
        >
          {title}
        </span>
      </div>
      {children}
      {!last && (
        <div className="mt-5 mb-5" style={{ borderBottom: "1px solid var(--color-border)", opacity: 0.5 }} />
      )}
    </div>
  );
}

/* ── Active filter chip (removable) ── */
function ActiveChip({ label, onRemove }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 text-[12px] font-display font-semibold rounded-full transition-colors"
      style={{
        backgroundColor: "rgba(26,107,90,0.08)",
        color: "var(--color-primary)",
        border: "1px solid rgba(26,107,90,0.15)",
      }}
    >
      {label}
      <button
        onClick={onRemove}
        className="flex items-center justify-center ml-0.5 rounded-full transition-colors"
        style={{ width: 16, height: 16 }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(26,107,90,0.15)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; }}
        aria-label={`移除 ${label}`}
      >
        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
          <path d="M3 3L9 9M9 3L3 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>
    </span>
  );
}

function attachMinPrice(school) {
  const courses = school.courses || [];
  const prices = courses.map((c) => c.price_per_week_usd).filter(Boolean);
  const courseTypes = [...new Set(courses.map((c) => c.course_type).filter(Boolean))];
  const minWeeks = courses.length > 0 ? Math.min(...courses.map((c) => c.min_weeks || 1)) : null;
  const maxWeeks = courses.length > 0 ? Math.max(...courses.map((c) => c.max_weeks || 52)) : null;

  return {
    ...school,
    min_price_per_week: prices.length > 0 ? Math.min(...prices) : null,
    course_types: courseTypes,
    duration_range: minWeeks && maxWeeks ? `${minWeeks}–${maxWeeks}` : null,
  };
}

/* ── SVG Icons for filter sections ── */
const IconCity = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21h18" /><path d="M5 21V7l8-4v18" /><path d="M19 21V11l-6-4" /><path d="M9 9v.01" /><path d="M9 12v.01" /><path d="M9 15v.01" /><path d="M9 18v.01" />
  </svg>
);
const IconCourse = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" /><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
  </svg>
);
const IconBrand = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" />
  </svg>
);
const IconFee = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [allBrands, setAllBrands] = useState([]);
  const [allCourseTypes, setAllCourseTypes] = useState([]);

  const [selectedCities, setSelectedCities] = useState(
    searchParams.get("city")?.split(",").filter(Boolean) || []
  );
  const [selectedTypes, setSelectedTypes] = useState(
    searchParams.get("course_type")?.split(",").filter(Boolean) || []
  );
  const [selectedBrands, setSelectedBrands] = useState(
    searchParams.get("brand")?.split(",").filter(Boolean) || []
  );
  const [selectedFeeRanges, setSelectedFeeRanges] = useState(
    searchParams.get("fee_range")?.split(",").filter(Boolean) || ["all"]
  );
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "recommended");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (!supabase) { setSchools([]); return; }
        const { data, error } = await supabase
          .from("schools")
          .select("*, courses(price_per_week_usd, course_type, min_weeks, max_weeks)")
          .order("popularity_score", { ascending: false });
        if (error) throw error;
        const enriched = (data || []).map(attachMinPrice);
        setSchools(enriched);

        const brands = [...new Set(enriched.map((s) => s.brand).filter(Boolean))].sort();
        const types = [...new Set(enriched.flatMap((s) => s.course_types))].sort();
        setAllBrands(brands);
        setAllCourseTypes(types);
      } catch (err) {
        console.error("Failed to load schools:", err);
        setSchools([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const availableCities = useMemo(() => {
    return [...new Set(schools.map((s) => s.city).filter(Boolean))].sort();
  }, [schools]);

  // Count schools per city for filter counts
  const citySchoolCounts = useMemo(() => {
    const counts = {};
    schools.forEach((s) => {
      if (s.city) counts[s.city] = (counts[s.city] || 0) + 1;
    });
    return counts;
  }, [schools]);

  const filteredSchools = useMemo(() => {
    let result = schools.filter((s) => {
      if (selectedCities.length > 0 && !selectedCities.includes(s.city)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(s.brand)) return false;
      if (selectedTypes.length > 0 && !s.course_types.some((ct) => selectedTypes.includes(ct))) return false;
      if (!selectedFeeRanges.includes("all") && s.min_price_per_week != null) {
        const matchesAnyRange = selectedFeeRanges.some((rv) => {
          const range = FEE_RANGES.find((r) => r.value === rv);
          return range && s.min_price_per_week >= range.min && s.min_price_per_week <= range.max;
        });
        if (!matchesAnyRange) return false;
      }
      return true;
    });

    if (sortBy === "price_asc") {
      result.sort((a, b) => (a.min_price_per_week || 9999) - (b.min_price_per_week || 9999));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => (b.min_price_per_week || 0) - (a.min_price_per_week || 0));
    } else if (sortBy === "name_asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      const prices = result.map((s) => s.min_price_per_week).filter(Boolean);
      const minP = Math.min(...prices) || 0;
      const maxP = Math.max(...prices) || 1;
      const range = maxP - minP || 1;
      result.sort((a, b) => {
        const scoreA = (a.popularity_score || 0) * 0.6 + (1 - ((a.min_price_per_week || 300) - minP) / range) * 0.4;
        const scoreB = (b.popularity_score || 0) * 0.6 + (1 - ((b.min_price_per_week || 300) - minP) / range) * 0.4;
        return scoreB - scoreA;
      });
    }

    return result;
  }, [schools, selectedCities, selectedBrands, selectedTypes, selectedFeeRanges, sortBy]);

  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCities.length) params.set("city", selectedCities.join(","));
    if (selectedTypes.length) params.set("course_type", selectedTypes.join(","));
    if (selectedBrands.length) params.set("brand", selectedBrands.join(","));
    if (!selectedFeeRanges.includes("all")) params.set("fee_range", selectedFeeRanges.join(","));
    if (sortBy !== "recommended") params.set("sort", sortBy);
    const qs = params.toString();
    router.replace(`/schools${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [selectedCities, selectedTypes, selectedBrands, selectedFeeRanges, sortBy, router]);

  useEffect(() => {
    if (!loading) syncUrl();
  }, [selectedCities, selectedTypes, selectedBrands, selectedFeeRanges, sortBy, loading, syncUrl]);

  function toggle(arr, setArr, value) {
    setArr((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
  }

  function resetFilters() {
    setSelectedCities([]);
    setSelectedTypes([]);
    setSelectedBrands([]);
    setSelectedFeeRanges(["all"]);
    setSortBy("recommended");
  }

  function toggleFeeRange(value) {
    if (value === "all") {
      setSelectedFeeRanges(["all"]);
      return;
    }
    setSelectedFeeRanges((prev) => {
      const without = prev.filter((v) => v !== "all" && v !== value);
      const next = prev.includes(value) ? without : [...without, value];
      return next.length === 0 ? ["all"] : next;
    });
  }

  const activeFilterCount = selectedCities.length + selectedTypes.length + selectedBrands.length + (selectedFeeRanges.includes("all") ? 0 : selectedFeeRanges.length);

  // Collect active filter chips for display
  const activeChips = useMemo(() => {
    const chips = [];
    selectedCities.forEach((c) => chips.push({ label: c, onRemove: () => toggle(selectedCities, setSelectedCities, c) }));
    selectedTypes.forEach((t) => chips.push({ label: t, onRemove: () => toggle(selectedTypes, setSelectedTypes, t) }));
    selectedBrands.forEach((b) => chips.push({ label: b, onRemove: () => toggle(selectedBrands, setSelectedBrands, b) }));
    if (!selectedFeeRanges.includes("all")) {
      selectedFeeRanges.forEach((rv) => {
        const r = FEE_RANGES.find((f) => f.value === rv);
        if (r) chips.push({ label: r.label, onRemove: () => toggleFeeRange(rv) });
      });
    }
    return chips;
  }, [selectedCities, selectedTypes, selectedBrands, selectedFeeRanges]);

  const filterPanel = (
    <div>
      {/* Cities */}
      {availableCities.length > 0 && (
        <FilterSection title="城市" icon={IconCity}>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
            {availableCities.map((city) => (
              <FilterPill
                key={city}
                label={city}
                count={citySchoolCounts[city]}
                selected={selectedCities.includes(city)}
                onClick={() => toggle(selectedCities, setSelectedCities, city)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Course types */}
      {allCourseTypes.length > 0 && (
        <FilterSection title="課程類型" icon={IconCourse}>
          <div className="flex flex-wrap gap-2">
            {allCourseTypes.map((type) => (
              <FilterPill
                key={type}
                label={type}
                selected={selectedTypes.includes(type)}
                onClick={() => toggle(selectedTypes, setSelectedTypes, type)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Brands */}
      {allBrands.length > 0 && (
        <FilterSection title="品牌" icon={IconBrand}>
          <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
            {allBrands.map((brand) => (
              <FilterPill
                key={brand}
                label={brand}
                selected={selectedBrands.includes(brand)}
                onClick={() => toggle(selectedBrands, setSelectedBrands, brand)}
              />
            ))}
          </div>
        </FilterSection>
      )}

      {/* Fee range */}
      <FilterSection title="週費範圍 (USD)" icon={IconFee} last>
        <div className="flex flex-wrap gap-2">
          {FEE_RANGES.map((range) => (
            <FilterPill
              key={range.value}
              label={range.label}
              selected={selectedFeeRanges.includes(range.value)}
              onClick={() => toggleFeeRange(range.value)}
            />
          ))}
        </div>
      </FilterSection>

      {/* Reset */}
      {activeFilterCount > 0 && (
        <button
          onClick={resetFilters}
          className="w-full mt-5 py-2.5 text-[13px] font-display font-semibold rounded-[8px] transition-all duration-200"
          style={{
            color: "var(--color-text-muted)",
            backgroundColor: "transparent",
            border: "1.5px dashed var(--color-border)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "var(--color-text-muted)";
            e.currentTarget.style.color = "var(--color-text-secondary)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "var(--color-border)";
            e.currentTarget.style.color = "var(--color-text-muted)";
          }}
        >
          清除所有篩選
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-surface)" }}>
      {/* Header */}
      <div
        className="px-6 pt-8 pb-5"
        style={{
          backgroundColor: "var(--color-elevated)",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div className="max-w-[1120px] mx-auto">
          <h1
            className="font-display font-extrabold text-2xl md:text-[36px]"
            style={{ color: "var(--color-text)", letterSpacing: "-0.01em" }}
          >
            找到你的語言學校
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {loading ? "載入中..." : `${filteredSchools.length} 間學校符合條件`}
          </p>
        </div>
      </div>

      <div className="max-w-[1120px] mx-auto px-6 py-6">
        {/* Active filter chips + sort bar */}
        <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            {activeChips.length > 0 ? (
              <>
                {activeChips.map((chip, i) => (
                  <ActiveChip key={i} label={chip.label} onRemove={chip.onRemove} />
                ))}
                <button
                  onClick={resetFilters}
                  className="text-[12px] font-display font-medium px-2 py-1 rounded transition-colors"
                  style={{ color: "var(--color-text-muted)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-text-secondary)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = "var(--color-text-muted)"; }}
                >
                  全部清除
                </button>
              </>
            ) : (
              <span className="text-[13px] font-display" style={{ color: "var(--color-text-muted)" }}>
                全部學校
              </span>
            )}
          </div>

          {/* Sort toggle (desktop) */}
          <div
            className="hidden lg:flex items-center rounded-full p-0.5"
            style={{ backgroundColor: "var(--color-sunken)" }}
          >
            {SORT_OPTIONS.map((opt) => (
              <SortButton
                key={opt.value}
                label={opt.label}
                selected={sortBy === opt.value}
                onClick={() => setSortBy(opt.value)}
              />
            ))}
          </div>

          {/* Sort dropdown (mobile) */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="lg:hidden px-3 py-2 rounded-[8px] text-[13px] font-display font-semibold appearance-none"
            style={{
              backgroundColor: "var(--color-sunken)",
              border: "1.5px solid var(--color-border)",
              color: "var(--color-text)",
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238A8A9A' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 10px center",
              paddingRight: "28px",
            }}
            aria-label="排序方式"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-8">
          {/* Desktop filter sidebar */}
          <aside className="hidden lg:block w-[260px] flex-shrink-0">
            <div
              className="sticky top-6 p-5 max-h-[calc(100vh-3rem)] overflow-y-auto"
              style={{
                backgroundColor: "var(--color-elevated)",
                borderRadius: "12px",
                border: "1px solid var(--color-border)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.02)",
                scrollbarWidth: "thin",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <h2
                  className="font-display font-bold text-[15px]"
                  style={{ color: "var(--color-text)" }}
                >
                  篩選條件
                </h2>
                {activeFilterCount > 0 && (
                  <span
                    className="inline-flex items-center justify-center text-[11px] font-display font-bold rounded-full"
                    style={{
                      width: 22,
                      height: 22,
                      backgroundColor: "var(--color-primary)",
                      color: "white",
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </div>
              {filterPanel}
            </div>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {/* Mobile filter FAB */}
            <button
              className="lg:hidden fixed bottom-20 right-4 z-40 flex items-center gap-2 px-5 py-3 rounded-full font-display font-semibold text-[13px] min-h-[44px]"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "white",
                boxShadow: "0 4px 12px rgba(26,107,90,0.3), 0 2px 4px rgba(0,0,0,0.1)",
              }}
              onClick={() => setShowFilters(true)}
              aria-label="開啟篩選"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="6" x2="20" y2="6" /><line x1="8" y1="12" x2="16" y2="12" /><line x1="11" y1="18" x2="13" y2="18" />
              </svg>
              篩選{activeFilterCount > 0 && (
                <span
                  className="inline-flex items-center justify-center text-[10px] font-bold rounded-full"
                  style={{
                    width: 18,
                    height: 18,
                    backgroundColor: "rgba(255,255,255,0.25)",
                    marginLeft: 2,
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredSchools.length === 0 ? (
              <div className="text-center py-20">
                <div
                  className="mx-auto mb-4 flex items-center justify-center"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    backgroundColor: "var(--color-sunken)",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
                  </svg>
                </div>
                <h3 className="font-display font-bold text-lg" style={{ color: "var(--color-text)" }}>
                  沒有符合條件的學校
                </h3>
                <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)", maxWidth: 280, margin: "8px auto 0" }}>
                  試試調整篩選條件，或查看全部學校
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-5 px-6 py-2.5 rounded-[8px] font-display font-semibold text-[13px] min-h-[44px] transition-all duration-200"
                  style={{
                    backgroundColor: "var(--color-primary)",
                    color: "white",
                    boxShadow: "0 1px 3px rgba(26,107,90,0.2)",
                  }}
                >
                  重設篩選條件
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredSchools.map((school) => (
                  <SchoolCard key={school.id} school={school} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet filter */}
      {showFilters && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="篩選條件"
          onKeyDown={(e) => { if (e.key === "Escape") setShowFilters(false); }}
        >
          <div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(26,26,46,0.5)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowFilters(false)}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto"
            style={{
              backgroundColor: "var(--color-elevated)",
              borderRadius: "20px 20px 0 0",
              boxShadow: "0 -4px 24px rgba(0,0,0,0.12)",
            }}
          >
            {/* Handle bar */}
            <div className="sticky top-0 z-10 pt-3 pb-2 flex justify-center" style={{ backgroundColor: "var(--color-elevated)" }}>
              <div className="w-9 h-1 rounded-full" style={{ backgroundColor: "var(--color-border)" }} aria-hidden="true" />
            </div>

            {/* Sheet header */}
            <div
              className="px-6 pb-4 flex items-center justify-between"
              style={{ borderBottom: "1px solid var(--color-border)" }}
            >
              <div className="flex items-center gap-2">
                <h2 className="font-display font-bold text-[17px]" style={{ color: "var(--color-text)" }}>
                  篩選條件
                </h2>
                {activeFilterCount > 0 && (
                  <span
                    className="inline-flex items-center justify-center text-[11px] font-display font-bold rounded-full"
                    style={{
                      width: 22,
                      height: 22,
                      backgroundColor: "var(--color-primary)",
                      color: "white",
                    }}
                  >
                    {activeFilterCount}
                  </span>
                )}
              </div>
              <button
                onClick={() => setShowFilters(false)}
                className="flex items-center justify-center rounded-full transition-colors"
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: "var(--color-sunken)",
                }}
                aria-label="關閉"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Filters */}
            <div className="px-6 py-5">
              {filterPanel}

              {/* Sort in mobile sheet */}
              <div className="mt-5 pt-5" style={{ borderTop: "1px solid var(--color-border)", opacity: 0.5 }} />
              <FilterSection title="排序" last>
                <div className="flex flex-wrap gap-2">
                  {SORT_OPTIONS.map((opt) => (
                    <FilterPill
                      key={opt.value}
                      label={opt.label}
                      selected={sortBy === opt.value}
                      onClick={() => setSortBy(opt.value)}
                    />
                  ))}
                </div>
              </FilterSection>
            </div>

            {/* Apply button */}
            <div
              className="sticky bottom-0 px-6 py-4"
              style={{
                backgroundColor: "var(--color-elevated)",
                borderTop: "1px solid var(--color-border)",
              }}
            >
              <button
                onClick={() => setShowFilters(false)}
                className="w-full py-3.5 rounded-[10px] font-display font-bold text-[15px] min-h-[48px] transition-all duration-200"
                style={{
                  backgroundColor: "var(--color-primary)",
                  color: "white",
                  boxShadow: "0 2px 8px rgba(26,107,90,0.25)",
                }}
                autoFocus
              >
                查看 {filteredSchools.length} 間學校
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
