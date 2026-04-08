import { getSupabase } from "@/libs/supabase";
import { getAllGuides } from "@/libs/guides-list";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://studygoda.com";

export default async function sitemap() {
  const entries = [];

  // Static pages
  const staticPages = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/schools", priority: 0.9, changeFrequency: "daily" },
    { path: "/quiz", priority: 0.8, changeFrequency: "monthly" },
    { path: "/calculator", priority: 0.7, changeFrequency: "monthly" },
    { path: "/compare", priority: 0.6, changeFrequency: "monthly" },
    { path: "/contact", priority: 0.8, changeFrequency: "monthly" },
    { path: "/guides", priority: 0.7, changeFrequency: "weekly" },
  ];

  for (const page of staticPages) {
    entries.push({
      url: `${SITE_URL}${page.path}`,
      lastModified: new Date(),
      changeFrequency: page.changeFrequency,
      priority: page.priority,
    });
  }

  // Dynamic: all schools
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data: schools } = await supabase
        .from("schools")
        .select("slug, updated_at")
        .order("updated_at", { ascending: false });

      if (schools) {
        for (const school of schools) {
          entries.push({
            url: `${SITE_URL}/schools/${school.slug}`,
            lastModified: school.updated_at ? new Date(school.updated_at) : new Date(),
            changeFrequency: "weekly",
            priority: 0.8,
          });
        }
      }
    }
  } catch (err) {
    console.warn("Sitemap: failed to fetch schools:", err.message);
  }

  // Dynamic: guide pages from content/guides/*.mdx
  try {
    const guides = getAllGuides();
    for (const guide of guides) {
      entries.push({
        url: `${SITE_URL}/guides/${guide.slug}`,
        lastModified: guide.updatedAt || guide.publishedAt ? new Date(guide.updatedAt || guide.publishedAt) : new Date(),
        changeFrequency: "monthly",
        priority: 0.7,
      });
    }
  } catch {
    // content/guides may not exist yet
  }

  return entries;
}
