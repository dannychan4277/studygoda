/**
 * 共用翻譯標籤 — 所有面向用戶的英轉中對照表
 */

export const GOAL_LABELS = {
  "General English": "一般英語",
  "Intensive English": "密集英語",
  "IELTS Preparation": "雅思備考",
  "TOEFL Preparation": "托福備考",
  "Business English": "商業英語",
  "Cambridge Preparation": "劍橋備考",
  "Academic English": "學術英語",
  "English for Young Learners": "青少年英語",
  "Exam Prep": "考試準備",
};

export const TRENDING_TAGS = [
  { label: "密集英語", value: "Intensive English" },
  { label: "雅思備考", value: "IELTS Preparation" },
  { label: "商業英語", value: "Business English" },
  { label: "考試準備", value: "Exam Prep" },
];

export function translateGoal(englishName) {
  return GOAL_LABELS[englishName] || englishName;
}
