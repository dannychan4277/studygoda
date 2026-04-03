import { Suspense } from "react";
import CostCalculator from "@/components/CostCalculator";

export const metadata = {
  title: "費用計算機 — 算出你的遊學預算",
  description:
    "選擇國家、城市、學校、課程，即時計算學費、住宿、生活費、保險、機票、簽證總費用。TWD/USD 雙幣顯示。",
  openGraph: {
    title: "費用計算機 | StudyGoda",
    description: "選國家 → 城市 → 學校 → 課程 → 即時計算遊學總費用",
  },
};

export default function CalculatorPage() {
  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="max-w-[1120px] mx-auto px-4 py-12">
        <header className="mb-10">
          <h1
            className="font-display font-extrabold text-4xl tracking-tight"
            style={{ color: "var(--color-text)", letterSpacing: "-0.04em" }}
          >
            費用計算機
          </h1>
          <p
            className="mt-3 text-base"
            style={{ color: "var(--color-text-secondary)" }}
          >
            選國家、選學校、設週數，即時算出你的遊學預算
          </p>
        </header>

        <Suspense
          fallback={
            <div className="skeleton" style={{ height: 400, width: "100%" }} />
          }
        >
          <CostCalculator />
        </Suspense>
      </div>
    </div>
  );
}
