import { getAllGuides, GUIDE_CATEGORIES } from "@/libs/guides";
import GuidesClient from "./GuidesClient";

export const metadata = {
  title: "美國遊學攻略 — StudyGoda",
  description:
    "美國遊學行前準備、F-1 簽證攻略、費用預算、城市介紹等實用文章，幫你做好出發前的每一步準備。",
  alternates: {
    canonical: "https://studygoda.com/guides",
  },
};

export default function GuidesPage() {
  const allGuides = getAllGuides();

  return (
    <GuidesClient
      allGuides={allGuides}
      categories={GUIDE_CATEGORIES}
    />
  );
}
