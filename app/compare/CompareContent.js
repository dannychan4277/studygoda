"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import CompareTable from "@/components/CompareTable";
import Link from "next/link";
import { getSupabase } from "@/libs/supabase";
import { useCompareList } from "@/libs/useCompareList";

export default function CompareContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const idsParam = searchParams.get("ids") || "";
  const slugs = idsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3);

  const { add, remove, has, isFull } = useCompareList();

  const [schools, setSchools] = useState([]);
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

      // Fetch schools by slug
      const { data: schoolRows } = await supabase
        .from("schools")
        .select("*")
        .in("slug", slugs);

      if (!schoolRows || schoolRows.length === 0) {
        setLoading(false);
        return;
      }

      // Sort by the order of slugs in URL
      const sorted = slugs
        .map((slug) => schoolRows.find((s) => s.slug === slug))
        .filter(Boolean);

      // Fetch courses for these schools
      const schoolIds = sorted.map((s) => s.id);
      const { data: courseRows } = await supabase
        .from("courses")
        .select("*")
        .in("school_id", schoolIds);

      // Attach courses to each school
      const schoolsWithCourses = sorted.map((school) => ({
        ...school,
        courses: (courseRows || []).filter((c) => c.school_id === school.id),
      }));

      setSchools(schoolsWithCourses);
      setLoading(false);
    }

    fetchData();
  }, [idsParam]);

  // Add a school to compare (updates URL)
  const handleAddSchool = useCallback(
    (slug) => {
      if (slugs.length >= 3) return;
      const newSlugs = [...slugs, slug];
      add(slug);
      router.replace(`/compare?ids=${newSlugs.join(",")}`, { scroll: false });
    },
    [slugs, add, router]
  );

  // Remove a school from compare (updates URL)
  const handleRemoveSchool = useCallback(
    (slug) => {
      const newSlugs = slugs.filter((s) => s !== slug);
      remove(slug);
      if (newSlugs.length === 0) {
        router.replace("/compare", { scroll: false });
      } else {
        router.replace(`/compare?ids=${newSlugs.join(",")}`, {
          scroll: false,
        });
      }
    },
    [slugs, remove, router]
  );

  if (loading) {
    return <div className="skeleton" style={{ height: 400, width: "100%" }} />;
  }

  // Empty state (5.6)
  if (slugs.length === 0 || schools.length === 0) {
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
          href="/schools"
          className="inline-flex items-center px-6 py-3 font-display font-semibold text-sm min-h-[44px]"
          style={{
            borderRadius: "var(--radius-md)",
            backgroundColor: "var(--color-accent)",
            color: "white",
          }}
        >
          前往搜尋學校
        </Link>
      </div>
    );
  }

  return (
    <CompareTable
      schools={schools}
      currentSlugs={slugs}
      onAddSchool={handleAddSchool}
      onRemoveSchool={handleRemoveSchool}
    />
  );
}
