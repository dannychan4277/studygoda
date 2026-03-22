"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import config from "@/config";

const TRENDING = ["密集英語", "IELTS", "親子遊學", "短期衝刺"];

export default function HomeSearch({ schoolCount = 31 }) {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  }

  return (
    <section className="px-6 pt-12 pb-10 md:pt-20 md:pb-16" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-[640px] mx-auto text-center">
        {/* Heading */}
        <h1
          className="font-display font-bold text-[28px] md:text-[36px]"
          style={{ color: "var(--color-primary)", lineHeight: 1.3 }}
        >
          找到你的遊學
        </h1>
        <p className="mt-3 text-[15px]" style={{ color: "var(--color-text-secondary)" }}>
          菲律賓 {schoolCount}+ 間語言學校，透明比價、真人推薦
        </p>

        {/* Search input */}
        <form onSubmit={handleSubmit} className="mt-8 relative">
          <div
            className="flex items-center"
            style={{
              borderRadius: "9999px",
              border: "1px solid var(--color-border)",
              backgroundColor: "#FFFFFF",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              height: "56px",
              paddingLeft: "20px",
              paddingRight: "6px",
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ color: "var(--color-text-muted)", flexShrink: 0 }}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜尋學校名稱或城市..."
              className="flex-1 px-3 text-[15px] bg-transparent outline-none"
              style={{ color: "var(--color-text)" }}
            />
            <button
              type="submit"
              className="flex-shrink-0 font-display font-semibold text-[14px] text-white px-6 h-[44px]"
              style={{
                borderRadius: "9999px",
                backgroundColor: "var(--color-accent)",
                transition: "background-color 150ms ease",
              }}
            >
              搜尋
            </button>
          </div>
        </form>

        {/* City pills */}
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {config.cities.map((city) => (
            <button
              key={city}
              onClick={() => router.push(`/search?city=${city}`)}
              className="font-display font-semibold text-[14px] px-5 py-2.5 transition-colors"
              style={{
                borderRadius: "9999px",
                border: "1px solid var(--color-primary)",
                color: "var(--color-primary)",
                backgroundColor: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "var(--color-primary)";
                e.currentTarget.style.color = "#FFFFFF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "transparent";
                e.currentTarget.style.color = "var(--color-primary)";
              }}
            >
              {config.cityNames[city]}
            </button>
          ))}
        </div>

        {/* Trending tags */}
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <span className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
            熱門：
          </span>
          {TRENDING.map((tag) => (
            <button
              key={tag}
              onClick={() => router.push(`/search?q=${encodeURIComponent(tag)}`)}
              className="text-[13px] underline-offset-2 hover:underline transition-colors"
              style={{ color: "var(--color-text-secondary)" }}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
