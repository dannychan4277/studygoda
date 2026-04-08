/**
 * 共用翻譯標籤 — 所有面向用戶的英轉中對照表
 * 支援 snake_case (DB) 和 Title Case 兩種格式
 */

export const GOAL_LABELS = {
  // snake_case (from DB)
  general_english: "一般英語",
  intensive_english: "密集英語",
  exam_prep: "考試準備",
  pathway: "升學銜接",
  specialized: "專業課程",
  // Title Case (legacy)
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
  { label: "密集英語", value: "intensive_english" },
  { label: "考試準備", value: "exam_prep" },
  { label: "升學銜接", value: "pathway" },
  { label: "專業課程", value: "specialized" },
];

export function translateGoal(englishName) {
  return GOAL_LABELS[englishName] || englishName;
}
