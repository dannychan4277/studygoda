import QuizWizard from "@/components/QuizWizard";

export const metadata = {
  title: "幫我選美國語言學校",
  description:
    "回答 5 個問題，AI 幫你從 76+ 間美國語言學校中找到最適合的 3 間。預算、目標、城市偏好一次配對。",
  openGraph: {
    title: "幫我選美國語言學校 | StudyGoda",
    description:
      "回答 5 個問題，找到最適合你的美國語言學校。",
  },
};

export default function QuizPage() {
  return <QuizWizard />;
}
