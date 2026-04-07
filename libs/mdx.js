import { compileMDX } from "next-mdx-remote/rsc";
import GuideSchoolCard from "@/components/guide/GuideSchoolCard";
import GuideTip from "@/components/guide/GuideTip";
import GuideCTA from "@/components/guide/GuideCTA";
import GuideCompare from "@/components/guide/GuideCompare";

/**
 * Custom component mapping for MDX rendering
 */
const mdxComponents = {
  GuideSchoolCard,
  GuideTip,
  GuideCTA,
  GuideCompare,
  // Add anchor IDs to h2 headings for ToC linking
  h2: ({ children }) => {
    const id = typeof children === "string"
      ? children.replace(/\s+/g, "-").replace(/[^\w\u4e00-\u9fff-]/g, "").toLowerCase()
      : "";
    return <h2 id={id}>{children}</h2>;
  },
};

/**
 * Compile MDX source string to renderable content
 */
export async function compileGuide(source) {
  const { content, frontmatter } = await compileMDX({
    source,
    components: mdxComponents,
    options: {
      parseFrontmatter: true,
    },
  });

  return { content, frontmatter };
}

/**
 * Extract h2 headings from raw MDX content for ToC generation
 */
export function extractHeadings(rawContent) {
  const headingRegex = /^##\s+(.+)$/gm;
  const headings = [];
  let match;

  while ((match = headingRegex.exec(rawContent)) !== null) {
    const text = match[1].trim();
    const id = text
      .replace(/\s+/g, "-")
      .replace(/[^\w\u4e00-\u9fff-]/g, "")
      .toLowerCase();
    headings.push({ id, text });
  }

  return headings;
}

/**
 * Calculate read time from content (Chinese: ~300 chars/min)
 */
export function calculateReadTime(rawContent) {
  // Strip MDX/HTML tags and frontmatter
  const text = rawContent
    .replace(/^---[\s\S]*?---/, "")
    .replace(/<[^>]+>/g, "")
    .replace(/[#*`\[\]()]/g, "")
    .trim();

  const charCount = text.length;
  const minutes = Math.ceil(charCount / 300);
  return Math.max(1, minutes);
}
