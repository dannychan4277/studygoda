import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { calculateReadTime } from "./mdx";

const GUIDES_DIR = path.join(process.cwd(), "content", "guides");

/**
 * Guide categories
 */
export const GUIDE_CATEGORIES = [
  { value: "country", label: "國家介紹" },
  { value: "visa", label: "簽證資訊" },
  { value: "budget", label: "費用預算" },
  { value: "preparation", label: "行前準備" },
  { value: "tips", label: "遊學攻略" },
];

/**
 * Get all guides from content/guides/*.mdx
 * Returns metadata (no compiled content) sorted by publishedAt desc
 */
export function getAllGuides() {
  if (!fs.existsSync(GUIDES_DIR)) return [];

  const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".mdx"));
  const guides = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(GUIDES_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      const readTime = calculateReadTime(content);
      guides.push({
        ...data,
        readTime,
      });
    } catch {
      // Skip malformed files
    }
  }

  return guides.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Get a single guide by slug (includes raw content for MDX compilation)
 */
export function getGuideBySlug(slug) {
  if (!fs.existsSync(GUIDES_DIR)) return null;

  const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".mdx"));

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(GUIDES_DIR, file), "utf-8");
      const { data, content } = matter(raw);
      if (data.slug === slug) {
        return {
          ...data,
          rawContent: content,
          readTime: calculateReadTime(content),
        };
      }
    } catch {
      // Skip malformed files
    }
  }

  return null;
}

/**
 * Get guides filtered by category
 */
export function getGuidesByCategory(category) {
  return getAllGuides().filter((g) => g.category === category);
}
