"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCompareList } from "@/libs/useCompareList";
import { getSupabase } from "@/libs/supabase";

export default function FloatingCompareBar() {
  const { slugs, remove, clear } = useCompareList();
  const show = slugs.length > 0;
  const [schools, setSchools] = useState([]);

  // Fetch school thumbnails when slugs change
  useEffect(() => {
    if (slugs.length === 0) {
      setSchools([]);
      return;
    }

    async function fetchSchools() {
      const supabase = getSupabase();
      if (!supabase) return;

      const { data } = await supabase
        .from("schools")
        .select("slug, name, photo_url")
        .in("slug", slugs);

      if (data) {
        // Sort by slug order
        const sorted = slugs
          .map((slug) => data.find((s) => s.slug === slug))
          .filter(Boolean);
        setSchools(sorted);
      }
    }

    fetchSchools();
  }, [slugs.join(",")]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 px-4 pb-3 md:pb-4"
        >
          <div
            className="max-w-[600px] mx-auto flex items-center justify-between gap-3 px-5 py-3 shadow-lg"
            style={{
              backgroundColor: "var(--color-elevated)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
          >
            <div className="flex items-center gap-3">
              {/* School thumbnails */}
              <div className="flex items-center -space-x-2">
                {schools.map((s) => (
                  <button
                    key={s.slug}
                    onClick={() => remove(s.slug)}
                    className="relative w-9 h-9 rounded-full overflow-hidden border-2 shrink-0 group"
                    style={{ borderColor: "var(--color-elevated)" }}
                    title={`移除 ${s.name}`}
                  >
                    <Image
                      src={
                        s.photo_url ||
                        "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=200"
                      }
                      alt={s.name}
                      fill
                      className="object-cover"
                      sizes="36px"
                    />
                    {/* Remove overlay on hover */}
                    <span
                      className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white text-xs font-bold"
                      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                    >
                      ✕
                    </span>
                  </button>
                ))}
                {/* Empty slots */}
                {Array.from({ length: 3 - slugs.length }).map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    className="w-9 h-9 rounded-full border-2 shrink-0"
                    style={{
                      borderColor: "var(--color-border)",
                      borderStyle: "dashed",
                      backgroundColor: "var(--color-surface)",
                    }}
                  />
                ))}
              </div>

              <div className="flex flex-col">
                <span
                  className="font-display font-semibold text-sm"
                  style={{ color: "var(--color-text)" }}
                >
                  已選 {slugs.length}/3 間
                </span>
                <button
                  onClick={clear}
                  className="text-xs underline text-left"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  清除
                </button>
              </div>
            </div>

            <Link
              href={`/compare?ids=${slugs.join(",")}`}
              className="px-5 py-2.5 font-display font-semibold text-sm min-h-[44px] flex items-center shrink-0"
              style={{
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-accent)",
                color: "white",
              }}
            >
              立即比較
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
