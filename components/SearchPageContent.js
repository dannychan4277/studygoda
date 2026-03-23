"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { supabase } from "@/libs/supabase";
import ProgramCard from "@/components/ProgramCard";

const COURSE_TYPES = ["General English", "Intensive English", "IELTS", "Business English"];
const CITIES = ["Cebu", "Baguio", "Manila", "Clark"];
const SORT_OPTIONS = [
  { value: "recommended", label: "推薦排序" },
  { value: "price-low", label: "價格低→高" },
  { value: "price-high", label: "價格高→低" },
  { value: "rating", label: "評價最高" },
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

export default function SearchPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state from URL
  const [selectedCities, setSelectedCities] = useState(
    searchParams.get("city")?.split(",").filter(Boolean) || []
  );
  const [selectedTypes, setSelectedTypes] = useState(
    searchParams.get("type")?.split(",").filter(Boolean) || []
  );
  const [minFee, setMinFee] = useState(Number(searchParams.get("minFee")) || 0);
  const [maxFee, setMaxFee] = useState(Number(searchParams.get("maxFee")) || 500);
  const [sortBy, setSortBy] = useState(searchParams.get("sort") || "recommended");

  // Fetch all programs once
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        if (!supabase) {
          setPrograms([]);
          return;
        }
        const { data, error } = await supabase
          .from("programs")
          .select("*")
          .order("google_rating", { ascending: false });
        if (error) throw error;
        setPrograms(data || []);
      } catch (err) {
        console.error("Failed to load programs:", err);
        setPrograms([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Client-side filtering
  const filteredPrograms = useMemo(() => {
    let result = programs.filter((p) => {
      if (selectedCities.length > 0 && !selectedCities.includes(p.city)) return false;
      if (selectedTypes.length > 0 && !selectedTypes.includes(p.course_type)) return false;
      if (p.weekly_fee_usd < minFee || p.weekly_fee_usd > maxFee) return false;
      return true;
    });

    // Sort
    if (sortBy === "price-low") {
      result.sort((a, b) => a.weekly_fee_usd - b.weekly_fee_usd);
    } else if (sortBy === "price-high") {
      result.sort((a, b) => b.weekly_fee_usd - a.weekly_fee_usd);
    } else if (sortBy === "rating") {
      result.sort((a, b) => (b.google_rating || 0) - (a.google_rating || 0));
    } else {
      // Recommended: score = rating * 0.6 + (1 - normalized_fee) * 0.4
      const fees = result.map((p) => p.weekly_fee_usd);
      const min = Math.min(...fees);
      const max = Math.max(...fees);
      const range = max - min || 1;
      result.sort((a, b) => {
        const scoreA = (a.google_rating || 0) * 0.6 + (1 - (a.weekly_fee_usd - min) / range) * 0.4;
        const scoreB = (b.google_rating || 0) * 0.6 + (1 - (b.weekly_fee_usd - min) / range) * 0.4;
        return scoreB - scoreA;
      });
    }

    return result;
  }, [programs, selectedCities, selectedTypes, minFee, maxFee, sortBy]);

  // Sync filters to URL
  const syncUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (selectedCities.length) params.set("city", selectedCities.join(","));
    if (selectedTypes.length) params.set("type", selectedTypes.join(","));
    if (minFee > 0) params.set("minFee", minFee);
    if (maxFee < 500) params.set("maxFee", maxFee);
    if (sortBy !== "recommended") params.set("sort", sortBy);
    router.replace(`/search?${params.toString()}`, { scroll: false });
  }, [selectedCities, selectedTypes, minFee, maxFee, sortBy, router]);

  useEffect(() => {
    if (!loading) syncUrl();
  }, [selectedCities, selectedTypes, minFee, maxFee, sortBy, loading, syncUrl]);

  function toggleCity(city) {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    );
  }

  function toggleType(type) {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }

  function resetFilters() {
    setSelectedCities([]);
    setSelectedTypes([]);
    setMinFee(0);
    setMaxFee(500);
    setSortBy("recommended");
  }

  const filterPanel = (
    <div className="space-y-6">
      {/* Cities */}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>
          城市
        </label>
        <div className="flex flex-wrap gap-2">
          {CITIES.map((city) => (
            <button
              key={city}
              onClick={() => toggleCity(city)}
              className="px-3 py-1.5 text-sm font-display font-medium rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
              style={{
                backgroundColor: selectedCities.includes(city) ? "var(--color-primary)" : "var(--color-sunken)",
                color: selectedCities.includes(city) ? "white" : "var(--color-text)",
              }}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Course types */}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>
          課程類型
        </label>
        <div className="flex flex-wrap gap-2">
          {COURSE_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className="px-3 py-1.5 text-sm font-display font-medium rounded-full transition-colors min-h-[44px] flex items-center"
              style={{
                backgroundColor: selectedTypes.includes(type) ? "var(--color-primary)" : "var(--color-sunken)",
                color: selectedTypes.includes(type) ? "white" : "var(--color-text)",
              }}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Fee range */}
      <div>
        <label className="block text-xs font-display font-bold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}>
          週費範圍
        </label>
        <div className="flex items-center gap-3">
          <span className="font-mono text-sm">NT${(minFee * 31).toLocaleString()}</span>
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={minFee}
            onChange={(e) => setMinFee(Number(e.target.value))}
            className="flex-1 accent-[var(--color-primary)]"
            aria-label="最低週費"
          />
          <input
            type="range"
            min="0"
            max="500"
            step="10"
            value={maxFee}
            onChange={(e) => setMaxFee(Number(e.target.value))}
            className="flex-1 accent-[var(--color-primary)]"
            aria-label="最高週費"
          />
          <span className="font-mono text-sm">NT${(maxFee * 31).toLocaleString()}</span>
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
            {loading ? "載入中..." : `${filteredPrograms.length} 間學校`}
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
              篩選
            </button>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filteredPrograms.length === 0 ? (
              /* Empty state */
              <div className="text-center py-16">
                <div className="text-5xl mb-4">🔍</div>
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
                {filteredPrograms.map((program) => (
                  <ProgramCard key={program.id} program={program} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile bottom sheet filter */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilters(false)}
          />
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[70vh] overflow-y-auto p-6 pt-4"
            style={{
              backgroundColor: "var(--color-elevated)",
              borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
            }}
          >
            {/* Handle bar */}
            <div className="flex justify-center mb-4">
              <div className="w-10 h-1 rounded-full" style={{ backgroundColor: "var(--color-border)" }} />
            </div>
            {filterPanel}
            <button
              onClick={() => setShowFilters(false)}
              className="w-full mt-4 py-3 rounded-full font-display font-semibold text-sm min-h-[44px]"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "white",
              }}
            >
              套用篩選
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
