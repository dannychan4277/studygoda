import { getAllGuides } from "@/libs/guides";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://studygoda.com";

export async function GET() {
  const guides = getAllGuides();

  const urls = guides.map((guide) => {
    const lastmod = guide.updatedAt || guide.publishedAt;
    return `  <url>
    <loc>${SITE_URL}/guides/${guide.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/guides</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml",
    },
  });
}
