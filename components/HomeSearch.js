"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import config from "@/config";
import { TRENDING_TAGS } from "@/libs/labels";

export default function HomeSearch({ schoolCount = 76 }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    router.push("/schools");
  }

  return (
    <section className="px-6 pt-12 pb-10 md:pt-20 md:pb-16" style={{ backgroundColor: "var(--color-elevated)" }}>
      <div className="max-w-[640px] mx-auto text-center">
        <h1
          className="font-display font-bold text-[28px] md:text-[36px]"
          style={{ color: "var(--color-primary)", lineHeight: 1.3 }}
        >
          {config.brand.heroTitle}
        </h1>
        <p className="mt-3 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
          {schoolCount}+ 間語言學校，透明比價、AI 配對推薦
        </p>

        <form onSubmit={handleSubmit} className="mt-8 relative" role="search" aria-label="搜尋學校">
          <div
            className="flex items-center"
            style={{
              borderRadius: "9999px",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-elevated)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              height: "56px",
              paddingLeft: "20px",
              paddingRight: "6px",
            }}
          >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--color-text-muted)", flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋學校名稱或城市..."
              aria-label="搜尋學校名稱或城市"
              className="flex-1 px-3 text-[15px] bg-transparent outline-none"
              style={{ color: "var(--color-text)" }}
            />
            <button
              type="submit"
              className="flex-shrink-0 font-display font-semibold text-[14px] text-white px-6 h-[44px]"
              style={{
                borderRadius: "9999px",
                backgroundColor: "var(--color-accent)",
              }}
            >
              搜尋
            </button>
          </div>
        </form>

        <div className="mt-5 flex flex-wrap justify-center gap-2" aria-label="熱門搜尋">
          <span className="text-[13px]" style={{ color: "var(--color-text-muted)" }} aria-hidden="true">
            熱門：
          </span>
          {TRENDING_TAGS.map((tag) => (
            <button
              key={tag.value}
              onClick={() => router.push(`/schools?course_type=${encodeURIComponent(tag.value)}`)}
              className="text-[13px] underline-offset-2 hover:underline transition-colors"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
