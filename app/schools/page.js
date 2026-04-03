import { Suspense } from "react";
import SearchPageContent from "@/components/SearchPageContent";

export const metadata = {
  title: "搜尋語言學校 — Compare Fees & Programs | Studygoda",
  description:
    "搜尋美國、英國、澳洲語言學校。依國家、城市、課程類型、週費、品牌篩選，找到最適合你的遊學方案。",
  alternates: {
    canonical: "https://studygoda.com/schools",
  },
};

function SearchFallback() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-surface)" }}>
      <div className="px-6 pt-8 pb-4" style={{ backgroundColor: "var(--color-elevated)" }}>
        <div className="max-w-[1120px] mx-auto">
          <div className="skeleton h-8 w-64 mb-2" />
          <div className="skeleton h-4 w-32" />
        </div>
      </div>
      <div className="max-w-[1120px] mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ borderRadius: "var(--radius-md)", overflow: "hidden" }}>
              <div className="skeleton w-full" style={{ height: "180px" }} />
              <div className="p-5 space-y-3" style={{ backgroundColor: "var(--color-elevated)" }}>
                <div className="skeleton h-5 w-3/4" />
                <div className="skeleton h-7 w-1/3" />
                <div className="skeleton h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SchoolsPage() {
  return (
    <Suspense fallback={<SearchFallback />}>
      <SearchPageContent />
    </Suspense>
  );
}
