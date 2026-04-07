import Link from "next/link";
import { GUIDE_CATEGORIES } from "@/libs/guides";
import { JsonLdScript } from "@/libs/seo";

export default function GuideBreadcrumb({ guide }) {
  const category = GUIDE_CATEGORIES.find((c) => c.value === guide.category);
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://studygoda.com";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "首頁",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "遊學攻略",
        item: `${SITE_URL}/guides`,
      },
      ...(category
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: category.label,
              item: `${SITE_URL}/guides?category=${guide.category}`,
            },
            {
              "@type": "ListItem",
              position: 4,
              name: guide.title,
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: guide.title,
            },
          ]),
    ],
  };

  return (
    <>
      <JsonLdScript data={breadcrumbJsonLd} />
      <nav className="flex items-center gap-1.5 text-xs flex-wrap" style={{ color: "var(--color-text-muted)" }}>
        <Link href="/" style={{ color: "var(--color-primary)" }}>
          首頁
        </Link>
        <span>&gt;</span>
        <Link href="/guides" style={{ color: "var(--color-primary)" }}>
          遊學攻略
        </Link>
        {category && (
          <>
            <span>&gt;</span>
            <Link
              href={`/guides?category=${guide.category}`}
              style={{ color: "var(--color-primary)" }}
            >
              {category.label}
            </Link>
          </>
        )}
        <span>&gt;</span>
        <span style={{ color: "var(--color-text)" }}>{guide.title}</span>
      </nav>
    </>
  );
}
