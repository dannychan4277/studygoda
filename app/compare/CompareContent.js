"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import CompareTable from "@/components/CompareTable";
import Link from "next/link";
import { getSupabase } from "@/libs/supabase";

export default function CompareContent() {
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") || "";
  const slugs = idsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  const [programs, setPrograms] = useState([]);
  const [cityGuides, setCityGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slugs.length === 0) {
      setLoading(false);
      return;
    }

    async function fetchData() {
      const supabase = getSupabase();
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data: progs } = await supabase
        .from("programs")
        .select("*")
        .in("slug", slugs);

      if (progs && progs.length > 0) {
        // Sort by the order of slugs in URL
        const sorted = slugs
          .map((slug) => progs.find((p) => p.slug === slug))
          .filter(Boolean);
        setPrograms(sorted);

        const cities = [...new Set(sorted.map((p) => p.city))];
        const { data: guides } = await supabase
          .from("city_guides")
          .select("*")
          .in("city", cities);
        setCityGuides(guides || []);
      }

      setLoading(false);
    }

    fetchData();
  }, [idsParam]);

  if (loading) {
    return <div className="skeleton" style={{ height: 400, width: "100%" }} />;
  }

  // Empty state
  if (slugs.length === 0 || programs.length === 0) {
    return (
      <div
        className="text-center py-20 px-4"
        style={{
          backgroundColor: "var(--color-elevated)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
        }}
      >
        <p
          className="font-display font-semibold text-lg mb-2"
          style={{ color: "var(--color-text)" }}
        >
          還沒有選擇學校
        </p>
        <p className="mb-6" style={{ color: "var(--color-text-muted)" }}>
          在搜尋頁點「+ 比較」加入學校，最多可比較 3 間
        </p>
        <Link
          href="/search"
          className="inline-flex items-center px-6 py-3 font-display font-semibold text-sm min-h-[44px]"
          style={{
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-accent)",
            color: "white",
          }}
        >
          前往搜尋
        </Link>
      </div>
    );
  }

  return <CompareTable programs={programs} cityGuides={cityGuides} />;
}
