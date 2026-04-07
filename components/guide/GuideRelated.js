import Link from "next/link";
import { GUIDE_CATEGORIES } from "@/libs/guides";

function getRelatedGuides(currentGuide, allGuides, limit = 3) {
  const others = allGuides.filter((g) => g.slug !== currentGuide.slug);

  const scored = others.map((g) => {
    let score = 0;
    if (g.category === currentGuide.category) score += 10;
    if (currentGuide.keywords && g.keywords) {
      const overlap = g.keywords.filter((k) => currentGuide.keywords.includes(k));
      score += overlap.length * 2;
    }
    return { ...g, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export default function GuideRelated({ currentGuide, allGuides }) {
  const related = getRelatedGuides(currentGuide, allGuides);
  if (!related.length) return null;

  return (
    <div className="mt-10">
      <h3
        className="font-display font-bold text-lg mb-4"
        style={{ color: "var(--color-text)" }}
      >
        相關文章
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {related.map((guide) => {
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
              <div className="p-4">
                {cat && (
                  <span
                    className="inline-block px-2 py-0.5 rounded-full text-xs font-display font-medium mb-2"
                    style={{
                      backgroundColor: "var(--color-surface)",
                      color: "var(--color-primary)",
                      border: "1px solid var(--color-border)",
                    }}
                  >
                    {cat.label}
                  </span>
                )}
                <h4
                  className="font-display font-bold text-sm mb-1 line-clamp-2"
                  style={{ color: "var(--color-text)" }}
                >
                  {guide.title}
                </h4>
                <p
                  className="text-xs line-clamp-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {guide.summary}
                </p>
                {guide.readTime && (
                  <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
                    {guide.readTime} 分鐘
                  </p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
