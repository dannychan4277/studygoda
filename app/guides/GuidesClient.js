"use client";

import { useState } from "react";
import Link from "next/link";

export default function GuidesClient({ allGuides, categories }) {
  const [category, setCategory] = useState(null);

  const guides = category
    ? allGuides.filter((g) => g.category === category)
    : allGuides;

  const activeCategory = categories.find((c) => c.value === category);

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-surface)" }}>
      {/* Header */}
      <div className="px-6 pt-10 pb-6" style={{ backgroundColor: "var(--color-elevated)" }}>
        <div className="max-w-[960px] mx-auto">
          <h1
            className="font-display font-bold text-2xl md:text-3xl"
            style={{ color: "var(--color-text)" }}
          >
            遊學攻略
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            實用指南，幫你準備遊學的每一步
          </p>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 mt-5">
            <button
              onClick={() => setCategory(null)}
              className="px-4 py-2 rounded-full text-sm font-display font-medium transition-all"
              style={{
                backgroundColor: !category ? "var(--color-primary)" : "var(--color-surface)",
                color: !category ? "white" : "var(--color-text)",
                border: `1px solid ${!category ? "var(--color-primary)" : "var(--color-border)"}`,
              }}
            >
              全部
            </button>
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className="px-4 py-2 rounded-full text-sm font-display font-medium transition-all"
                style={{
                  backgroundColor: category === cat.value ? "var(--color-primary)" : "var(--color-surface)",
                  color: category === cat.value ? "white" : "var(--color-text)",
                  border: `1px solid ${category === cat.value ? "var(--color-primary)" : "var(--color-border)"}`,
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Guide list */}
      <div className="max-w-[960px] mx-auto px-6 py-8">
        {guides.length === 0 ? (
          <div
            className="text-center py-16 px-6"
            style={{
              backgroundColor: "var(--color-elevated)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p
              className="font-display font-semibold text-lg mb-2"
              style={{ color: "var(--color-text)" }}
            >
              {activeCategory
                ? `「${activeCategory.label}」分類尚無文章`
                : "攻略文章即將推出"}
            </p>
            <p className="text-sm mb-6" style={{ color: "var(--color-text-secondary)" }}>
              我們正在準備實用的遊學攻略，敬請期待！
            </p>
            <Link
              href="/schools"
              className="inline-flex items-center px-5 py-2.5 rounded-full font-display font-medium text-sm"
              style={{
                backgroundColor: "var(--color-primary)",
                color: "white",
              }}
            >
              先去看看學校
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {guides.map((guide) => {
              const cat = categories.find((c) => c.value === guide.category);
              const isNew = guide.publishedAt && (Date.now() - new Date(guide.publishedAt).getTime()) < 7 * 24 * 60 * 60 * 1000;
              return (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="block card-hover"
                  style={{
                    backgroundColor: "var(--color-elevated)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                    overflow: "hidden",
                  }}
                >
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      {cat && (
                        <span
                          className="inline-block px-2.5 py-0.5 rounded-full text-xs font-display font-medium"
                          style={{
                            backgroundColor: "var(--color-surface)",
                            color: "var(--color-primary)",
                            border: "1px solid var(--color-border)",
                          }}
                        >
                          {cat.label}
                        </span>
                      )}
                      {isNew && (
                        <span
                          className="inline-block px-2 py-0.5 rounded-full text-xs font-display font-semibold"
                          style={{
                            backgroundColor: "var(--color-accent)",
                            color: "white",
                          }}
                        >
                          NEW
                        </span>
                      )}
                    </div>
                    <h2
                      className="font-display font-bold text-base mb-2 line-clamp-2"
                      style={{ color: "var(--color-text)" }}
                    >
                      {guide.title}
                    </h2>
                    <p
                      className="text-sm line-clamp-2"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {guide.summary}
                    </p>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                        {guide.publishedAt}
                      </span>
                      {guide.readTime && (
                        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                          {guide.readTime} 分鐘
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* CTA */}
        {guides.length > 0 && (
          <div
            className="mt-10 p-6 text-center"
            style={{
              backgroundColor: "var(--color-elevated)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p className="font-display font-semibold text-base mb-3" style={{ color: "var(--color-text)" }}>
              準備好開始了嗎？
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-2.5 rounded-full font-display font-medium text-sm"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "white",
              }}
            >
              免費諮詢
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
