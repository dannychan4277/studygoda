import Link from "next/link";
import { notFound } from "next/navigation";
import { getGuideBySlug, getAllGuides, GUIDE_CATEGORIES } from "@/libs/guides";
import { compileGuide, extractHeadings } from "@/libs/mdx";
import { guideArticleJsonLd, guideFaqJsonLd, JsonLdScript } from "@/libs/seo";
import GuideToC from "@/components/guide/GuideToC";
import GuideProgress from "@/components/guide/GuideProgress";
import GuideReadTime from "@/components/guide/GuideReadTime";
import GuideRelated from "@/components/guide/GuideRelated";
import GuideBreadcrumb from "@/components/guide/GuideBreadcrumb";

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
  const faqJsonLd = guideFaqJsonLd(guide, guide.rawContent);
  const headings = extractHeadings(guide.rawContent);
  const { content } = await compileGuide(guide.rawContent);
  const allGuides = getAllGuides();

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
      {faqJsonLd && <JsonLdScript data={faqJsonLd} />}
      <GuideProgress />

      <div className="min-h-screen" style={{ backgroundColor: "var(--color-surface)" }}>
        {/* Header */}
        <div className="px-6 pt-10 pb-8" style={{ backgroundColor: "var(--color-elevated)" }}>
          <div className="max-w-[960px] mx-auto">
            <GuideBreadcrumb guide={guide} />

            <div className="mt-4 flex items-center gap-3 flex-wrap">
              {category && (
                <span
                  className="inline-block px-2.5 py-0.5 rounded-full text-xs font-display font-medium"
                  style={{
                    backgroundColor: "var(--color-surface)",
                    color: "var(--color-primary)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  {category.label}
                </span>
              )}
              <GuideReadTime minutes={guide.readTime} />
            </div>

            <h1
              className="mt-3 font-display font-bold text-2xl md:text-3xl leading-tight"
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

        {/* Content + ToC */}
        <div className="max-w-[960px] mx-auto px-6 py-8">
          <div className="flex gap-10">
            {/* Article */}
            <div className="min-w-0 flex-1 max-w-[720px]">
              {/* Mobile ToC (hidden on desktop) */}
              <div className="md:hidden">
                <GuideToC headings={headings} />
              </div>

              <article
                className="prose prose-sm md:prose-base"
                style={{
                  color: "var(--color-text)",
                  lineHeight: 1.8,
                }}
              >
                {content}
              </article>

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

              {/* Related */}
              <GuideRelated currentGuide={guide} allGuides={allGuides} />
            </div>

            {/* Desktop ToC sidebar (hidden on mobile) */}
            <div className="hidden md:block">
              <GuideToC headings={headings} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
