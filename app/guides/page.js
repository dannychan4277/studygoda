import Link from "next/link";
import { getAllGuides, GUIDE_CATEGORIES } from "@/libs/guides";

export const metadata = {
  title: "美國遊學攻略 — StudyGoda",
  description:
    "美國遊學行前準備、F-1 簽證攻略、費用預算、城市介紹等實用文章，幫你做好出發前的每一步準備。",
  alternates: {
    canonical: "https://studygoda.com/guides",
  },
};

export default async function GuidesPage({ searchParams }) {
  const params = await searchParams;
  const category = params?.category || null;
  const allGuides = getAllGuides();
  const guides = category
    ? allGuides.filter((g) => g.category === category)
    : allGuides;

  const activeCategory = GUIDE_CATEGORIES.find((c) => c.value === category);

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
            <Link
              href="/guides"
              className="px-4 py-2 rounded-full text-sm font-display font-medium transition-all"
              style={{
                backgroundColor: !category ? "var(--color-primary)" : "var(--color-surface)",
                color: !category ? "white" : "var(--color-text)",
                border: `1px solid ${!category ? "var(--color-primary)" : "var(--color-border)"}`,
              }}
            >
              全部
            </Link>
            {GUIDE_CATEGORIES.map((cat) => (
              <Link
                key={cat.value}
                href={`/guides?category=${cat.value}`}
                className="px-4 py-2 rounded-full text-sm font-display font-medium transition-all"
                style={{
                  backgroundColor: category === cat.value ? "var(--color-primary)" : "var(--color-surface)",
                  color: category === cat.value ? "white" : "var(--color-text)",
                  border: `1px solid ${category === cat.value ? "var(--color-primary)" : "var(--color-border)"}`,
                }}
              >
                {cat.label}
              </Link>
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
              const cat = GUIDE_CATEGORIES.find((c) => c.value === guide.category);
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
                    {cat && (
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-xs font-display font-medium mb-3"
                        style={{
                          backgroundColor: "var(--color-surface)",
                          color: "var(--color-primary)",
                          border: "1px solid var(--color-border)",
                        }}
                      >
                        {cat.label}
                      </span>
                    )}
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
                    <p
                      className="text-xs mt-3"
                      style={{ color: "var(--color-text-muted)" }}
                    >
                      {guide.publishedAt}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Contextual CTA based on category */}
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
              {category === "budget"
                ? "想知道你的遊學要花多少？"
                : category === "country"
                ? "哪個國家最適合你？"
                : "準備好開始了嗎？"}
            </p>
            <Link
              href={
                category === "budget"
                  ? "/calculator"
                  : category === "country"
                  ? "/quiz"
                  : "/contact"
              }
              className="inline-flex items-center px-5 py-2.5 rounded-full font-display font-medium text-sm"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "white",
              }}
            >
              {category === "budget"
                ? "使用費用計算機"
                : category === "country"
                ? "做配對測驗"
                : "免費諮詢"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
