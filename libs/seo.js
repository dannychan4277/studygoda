const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://studygoda.com";

/**
 * 8.1: Generate metadata for a school detail page.
 * Usage in /app/schools/[slug]/page.js:
 *   import { generateSchoolMetadata } from "@/libs/seo";
 *   export async function generateMetadata({ params }) {
 *     const school = await getSchoolBySlug(params.slug);
 *     return generateSchoolMetadata(school);
 *   }
 */
export function generateSchoolMetadata(school) {
  if (!school) {
    return {
      title: "找不到學校",
      description: "這間語言學校不存在或已被移除。",
    };
  }

  const title = `${school.name} — 美國${school.city} | StudyGoda`;
  const description = school.description
    ? school.description.slice(0, 155)
    : `${school.name} 位於美國${school.city}。查看課程費用、評價與詳細資訊，在 StudyGoda 輕鬆比較遊學方案。`;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_URL}/schools/${school.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/schools/${school.slug}`,
      type: "website",
      locale: "zh_TW",
      siteName: "StudyGoda",
      images: [
        {
          url: `${SITE_URL}/api/og/${school.slug}`,
          width: 1200,
          height: 630,
          alt: school.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${SITE_URL}/api/og/${school.slug}`],
    },
  };
}

/**
 * 8.3: JSON-LD for EducationalOrganization schema.
 * Returns a <script> tag string for use in page components.
 */
export function schoolJsonLd(school) {
  if (!school) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: school.name,
    url: `${SITE_URL}/schools/${school.slug}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: school.city,
      addressCountry: "USA",
    },
    description:
      school.description ||
      `${school.name} 是位於美國${school.city}的語言學校。`,
  };

  if (school.photo_url) {
    jsonLd.image = school.photo_url;
  }

  if (school.google_rating) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: school.google_rating,
      bestRating: 5,
    };
  }

  return jsonLd;
}

/**
 * 8.3: JSON-LD for Course schema (attached to a school).
 */
export function courseJsonLd(school, course) {
  if (!school || !course) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.course_type || `${school.name} Language Course`,
    provider: {
      "@type": "EducationalOrganization",
      name: school.name,
      url: `${SITE_URL}/schools/${school.slug}`,
    },
    description: `${course.course_type || "Language"} course at ${school.name} in ${school.city}, ${school.country}`,
    offers: course.price_per_week_usd
      ? {
          "@type": "Offer",
          price: course.price_per_week_usd,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        }
      : undefined,
  };
}

/**
 * 9: JSON-LD for Article (guides).
 */
export function guideArticleJsonLd(guide) {
  if (!guide) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.summary,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt || guide.publishedAt,
    author: {
      "@type": "Organization",
      name: "StudyGoda",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "StudyGoda",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/guides/${guide.slug}`,
    },
    keywords: guide.keywords?.join(", "),
  };
}

/**
 * JSON-LD for FAQPage schema.
 * Extracts Q&A pairs from guide content where h2 headings contain "？"
 */
export function guideFaqJsonLd(guide, rawContent) {
  if (!guide || !rawContent) return null;

  const faqRegex = /^##\s+(.+？)\s*\n([\s\S]*?)(?=\n##\s|\n*$)/gm;
  const pairs = [];
  let match;

  while ((match = faqRegex.exec(rawContent)) !== null) {
    const question = match[1].trim();
    const answer = match[2]
      .replace(/<[^>]+>/g, "")
      .replace(/[#*`\[\]()]/g, "")
      .trim();
    if (question && answer) {
      pairs.push({ question, answer });
    }
  }

  if (!pairs.length) return null;

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: pairs.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };
}

/**
 * Helper: render JSON-LD as a script tag (for use in JSX).
 */
export function JsonLdScript({ data }) {
  if (!data) return null;
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
