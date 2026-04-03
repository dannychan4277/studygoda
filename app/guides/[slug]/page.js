import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuideBySlug, getAllGuides, GUIDE_CATEGORIES } from "@/libs/guides";
import { guideArticleJsonLd, JsonLdScript } from "@/libs/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://studygoda.com";

export async function generateStaticParams() {
  const guides = getAllGuides();
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: "找不到文章" };
  }

  return {
    title: `${guide.title} | StudyGoda`,
    description: guide.summary,
    alternates: {
      canonical: `${SITE_URL}/guides/${guide.slug}`,
    },
    openGraph: {
      title: guide.title,
      description: guide.summary,
      type: "article",
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt || guide.publishedAt,
      locale: "zh_TW",
      siteName: "StudyGoda",
    },
    keywords: guide.keywords,
  };
}

export default async function GuidePage({ params }) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const category = GUIDE_CATEGORIES.find((c) => c.value === guide.category);
  const jsonLd = guideArticleJsonLd(guide);

  // Contextual CTA based on category
  const ctaConfig = {
    budget: { href: "/calculator", text: "使用費用計算機" },
    country: { href: "/quiz", text: "做配對測驗" },
    visa: { href: "/contact", text: "免費諮詢簽證問題" },
    preparation: { href: "/contact", text: "免費諮詢" },
    tips: { href: "/schools", text: "瀏覽學校" },
  };
  const cta = ctaConfig[guide.category] || { href: "/contact", text: "免費諮詢" };

  return (
    <>
      <JsonLdScript data={jsonLd} />

      <div className="min-h-screen" style={{ backgroundColor: "var(--color-surface)" }}>
        {/* Header */}
        <div className="px-6 pt-10 pb-8" style={{ backgroundColor: "var(--color-elevated)" }}>
          <div className="max-w-[720px] mx-auto">
            <Link
              href="/guides"
              className="inline-flex items-center gap-1 text-sm font-display font-medium mb-4"
              style={{ color: "var(--color-primary)" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              遊學攻略
            </Link>

            {category && (
              <span
                className="inline-block px-2.5 py-0.5 rounded-full text-xs font-display font-medium mb-3"
                style={{
                  backgroundColor: "var(--color-surface)",
                  color: "var(--color-primary)",
                  border: "1px solid var(--color-border)",
                }}
              >
                {category.label}
              </span>
            )}

            <h1
              className="font-display font-bold text-2xl md:text-3xl leading-tight"
              style={{ color: "var(--color-text)" }}
            >
              {guide.title}
            </h1>

            <p className="mt-3 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              {guide.summary}
            </p>

            <p className="mt-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
              發佈於 {guide.publishedAt}
              {guide.updatedAt && guide.updatedAt !== guide.publishedAt && (
                <> | 更新於 {guide.updatedAt}</>
              )}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-[720px] mx-auto px-6 py-8">
          <article
            className="prose prose-sm md:prose-base"
            style={{
              color: "var(--color-text)",
              lineHeight: 1.8,
            }}
            dangerouslySetInnerHTML={{ __html: guide.content }}
          />

          {/* CTA */}
          <div
            className="mt-10 p-6 text-center"
            style={{
              backgroundColor: "var(--color-elevated)",
              borderRadius: "var(--radius-md)",
              border: "1px solid var(--color-border)",
            }}
          >
            <p className="font-display font-semibold text-base mb-3" style={{ color: "var(--color-text)" }}>
              讀完了？下一步開始行動！
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={cta.href}
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-display font-medium text-sm"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "white",
                }}
              >
                {cta.text}
              </Link>
              <Link
                href="/guides"
                className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-display font-medium text-sm"
                style={{
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text)",
                }}
              >
                更多攻略
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
