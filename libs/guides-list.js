/**
 * Guide listing utilities — NO fs import, safe for client + serverless.
 * Use this in pages that list guides (e.g., /guides).
 * For reading individual guide content (MDX), use libs/guides.js instead.
 */
import { guidesIndex } from "./guides-data";

export const GUIDE_CATEGORIES = [
  { value: "country", label: "國家介紹" },
  { value: "visa", label: "簽證資訊" },
  { value: "budget", label: "費用預算" },
  { value: "preparation", label: "行前準備" },
  { value: "tips", label: "遊學攻略" },
];

export function getAllGuides() {
  return guidesIndex;
}

export function getGuidesByCategory(category) {
  return guidesIndex.filter((g) => g.category === category);
}
