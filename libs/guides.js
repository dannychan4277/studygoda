import fs from "fs";
import path from "path";

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
 * Get all guides from content/guides/*.json
 */
export function getAllGuides() {
  if (!fs.existsSync(GUIDES_DIR)) return [];

  const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".json"));
  const guides = [];

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(GUIDES_DIR, file), "utf-8");
      const guide = JSON.parse(raw);
      // Exclude content field for listing (lighter)
      const { content, ...meta } = guide;
      guides.push(meta);
    } catch {
      // Skip malformed files
    }
  }

  // Sort by publishedAt desc
  return guides.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

/**
 * Get a single guide by slug (includes content)
 */
export function getGuideBySlug(slug) {
  if (!fs.existsSync(GUIDES_DIR)) return null;

  const files = fs.readdirSync(GUIDES_DIR).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    try {
      const raw = fs.readFileSync(path.join(GUIDES_DIR, file), "utf-8");
      const guide = JSON.parse(raw);
      if (guide.slug === slug) return guide;
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
