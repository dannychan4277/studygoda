"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/libs/supabase";
import SchoolCard from "@/components/SchoolCard";
import config from "@/config";

const SORT_OPTIONS = [
  { value: "recommended", label: "推薦排序" },
  { value: "price_asc", label: "價格低→高" },
  { value: "price_desc", label: "價格高→低" },
  { value: "name_asc", label: "名稱 A→Z" },
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

function FilterPill({ label, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 text-sm font-display font-medium rounded-full transition-colors min-h-[44px] flex items-center"
      style={{
        backgroundColor: selected ? "var(--color-primary)" : "var(--color-sunken)",
        color: selected ? "white" : "var(--color-text)",
      }}
    >
      {label}
    </button>
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

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Dynamic filter options (derived from data)
  const [allBrands, setAllBrands] = useState([]);
  const [allCourseTypes, setAllCourseTypes] = useState([]);

  // Filter state from URL
  const [selectedCountries, setSelectedCountries] = useState(
    searchParams.get("country")?.split(",").filter(Boolean) || []
  );
  const [selectedCities, setSelectedCities] = useState(
    searchParams.get("city")?.split(",").filter(Boolean) || []
  );
  const [selectedTypes, setSelectedTypes] = useState(
    searchParams.get("course_type")?.split(",").filter(Boolean) || []
  );
  const [selectedBrands, setSelectedBrands] = useState(
    searchParams.get("brand")?.split(",").filter(Boolean) || []
  );
  const [minFee, setMinFee] = useState(Number(searchParams.get("price_min")) || 0);
  const [maxFee, setMaxFee] = useState(Number(searchParams.get("price_max")) || 800);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "recommended");

  // Fetch all schools with courses
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

        // Derive dynamic filter options
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

  // Available cities based on selected countries
  const availableCities = useMemo(() => {
    const filtered = selectedCountries.length > 0
      ? schools.filter((s) => selectedCountries.includes(s.country))
      : schools;
    return [...new Set(filtered.map((s) => s.city).filter(Boolean))].sort();
  }, [schools, selectedCountries]);

  // Clear invalid city selections when country changes
  useEffect(() => {
    if (selectedCities.length > 0) {
      const valid = selectedCities.filter((c) => availableCities.includes(c));
      if (valid.length !== selectedCities.length) {
        setSelectedCities(valid);
      }
    }
  }, [availableCities, selectedCities]);

  // Client-side filtering
  const filteredSchools = useMemo(() => {
    let result = schools.filter((s) => {
      if (selectedCountries.length > 0 && !selectedCountries.includes(s.country)) return false;
      if (selectedCities.length > 0 && !selectedCities.includes(s.city)) return false;
      if (selectedBrands.length > 0 && !selectedBrands.includes(s.brand)) return false;
      if (selectedTypes.length > 0 && !s.course_types.some((ct) => selectedTypes.includes(ct))) return false;
      if (s.min_price_per_week != null) {
        if (s.min_price_per_week < minFee || s.min_price_per_week > maxFee) return false;
      }
      return true;
    });

    // Sort
    if (sortBy === "price_asc") {
      result.sort((a, b) => (a.min_price_per_week || 9999) - (b.min_price_per_week || 9999));
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => (b.min_price_per_week || 0) - (a.min_price_per_week || 0));
    } else if (sortBy === "name_asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Recommended: popularity + value
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
  }, [schools, selectedCountries, selectedCities, selectedBrands, selectedTypes, minFee, maxFee, sortBy]);

  // Sync filters to URL
  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCountries.length) params.set("country", selectedCountries.join(","));
    if (selectedCities.length) params.set("city", selectedCities.join(","));
    if (selectedTypes.length) params.set("course_type", selectedTypes.join(","));
    if (selectedBrands.length) params.set("brand", selectedBrands.join(","));
    if (minFee > 0) params.set("price_min", minFee);
    if (maxFee < 800) params.set("price_max", maxFee);
    if (sortBy !== "recommended") params.set("sort", sortBy);
    const qs = params.toString();
    router.replace(`/schools${qs ? `?${qs}` : ""}`, { scroll: false });
  }, [selectedCountries, selectedCities, selectedTypes, selectedBrands, minFee, maxFee, sortBy, router]);

  useEffect(() => {
    if (!loading) syncUrl();
  }, [selectedCountries, selectedCities, selectedTypes, selectedBrands, minFee, maxFee, sortBy, loading, syncUrl]);

  function toggle(arr, setArr, value) {
    setArr((prev) => prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]);
  }

  function resetFilters() {
    setSelectedCountries([]);
    setSelectedCities([]);
    setSelectedTypes([]);
    setSelectedBrands([]);
    setMinFee(0);
    setMaxFee(800);
    setSortBy("recommended");
  }

  const activeFilterCount = selectedCountries.length + selectedCities.length + selectedTypes.length + selectedBrands.length + (minFee > 0 ? 1 : 0) + (maxFee < 800 ? 1 : 0);

  const filterPanel = (
    <div className="space-y-6">
      {/* Countries */}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>
          國家
        </label>
        <div className="flex flex-wrap gap-2">
          {config.countries.map((country) => (
            <FilterPill
              key={country}
              label={`${config.countryFlags[country]} ${config.countryNames[country]}`}
              selected={selectedCountries.includes(country)}
              onClick={() => toggle(selectedCountries, setSelectedCountries, country)}
            />
          ))}
        </div>
      </div>

      {/* Cities */}
      {availableCities.length > 0 && (
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>
            城市
          </label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {availableCities.map((city) => (
              <FilterPill
                key={city}
                label={city}
                selected={selectedCities.includes(city)}
                onClick={() => toggle(selectedCities, setSelectedCities, city)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Course types */}
      {allCourseTypes.length > 0 && (
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>
            課程類型
          </label>
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
        </div>
      )}

      {/* Brands */}
      {allBrands.length > 0 && (
        <div>
          <label className="block text-xs font-display font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>
            品牌
          </label>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {allBrands.map((brand) => (
              <FilterPill
                key={brand}
                label={brand}
                selected={selectedBrands.includes(brand)}
                onClick={() => toggle(selectedBrands, setSelectedBrands, brand)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Fee range */}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>
          週費範圍 (USD)
        </label>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm">${minFee}</span>
          <input
            type="range"
            min="0"
            max="800"
            step="25"
            value={minFee}
            onChange={(e) => setMinFee(Number(e.target.value))}
            className="flex-1 accent-[var(--color-primary)]"
            aria-label="最低週費"
          />
          <input
            type="range"
            min="0"
            max="800"
            step="25"
            value={maxFee}
            onChange={(e) => setMaxFee(Number(e.target.value))}
            className="flex-1 accent-[var(--color-primary)]"
            aria-label="最高週費"
          />
          <span className="font-mono text-sm">${maxFee}</span>
        </div>
      </div>

      {/* Sort */}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>
          排序
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 rounded-md text-sm font-display min-h-[44px]"
          style={{
            backgroundColor: "var(--color-sunken)",
            border: "1px solid var(--color-border)",
            color: "var(--color-text)",
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

      {/* Reset */}
      <button
        onClick={resetFilters}
        className="w-full py-2 text-sm font-display font-medium rounded-md transition-colors min-h-[44px]"
        style={{
          border: "1px solid var(--color-border)",
          color: "var(--color-text-secondary)",
        }}
      >
        重設所有篩選
      </button>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-surface)" }}>
      {/* Header */}
      <div className="px-6 pt-8 pb-4" style={{ backgroundColor: "var(--color-elevated)" }}>
        <div className="max-w-[1120px] mx-auto">
          <h1 className="font-display font-extrabold text-2xl md:text-4xl" style={{ color: "var(--color-text)" }}>
            找到你的語言學校
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {loading ? "載入中..." : `${filteredSchools.length} 間學校`}
          </p>
        </div>
      </div>

      <div className="max-w-[1120px] mx-auto px-6 py-6">
        <div className="flex gap-8">
          {/* Desktop filter sidebar (25%) */}
          <aside className="hidden lg:block w-1/4 flex-shrink-0">
            <div className="sticky top-6 p-5" style={{ backgroundColor: "var(--color-elevated)", borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
              {filterPanel}
            </div>
          </aside>

          {/* Results (75%) */}
          <div className="flex-1">
            {/* Mobile filter FAB */}
            <button
              className="lg:hidden fixed bottom-20 right-4 z-40 flex items-center gap-2 px-5 py-3 rounded-full font-display font-semibold text-sm shadow-lg min-h-[44px]"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "white",
              }}
              onClick={() => setShowFilters(true)}
              aria-label="開啟篩選"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46" />
              </svg>
              篩選{activeFilterCount > 0 ? ` (${activeFilterCount})` : ""}
            </button>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredSchools.length === 0 ? (
              <div className="text-center py-16">
                <h3 className="font-display font-bold text-lg" style={{ color: "var(--color-text)" }}>
                  沒有符合條件的學校
                </h3>
                <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                  試試調整篩選條件，或查看全部學校
                </p>
                <button
                  onClick={resetFilters}
                  className="mt-4 px-6 py-2.5 rounded-full font-display font-semibold text-sm min-h-[44px]"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "white",
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
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilters(false)}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto p-6 pt-4"
            style={{
              backgroundColor: "var(--color-elevated)",
              borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
            }}
          >
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "var(--color-border)" }} aria-hidden="true" />
            </div>
            {filterPanel}
            <button
              onClick={() => setShowFilters(false)}
              className="w-full mt-4 py-3 rounded-full font-display font-semibold text-sm min-h-[44px]"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "white",
              }}
              autoFocus
            >
              套用篩選
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
