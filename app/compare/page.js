import { Suspense } from "react";
import CompareContent from "./CompareContent";

export const metadata = {
  title: "學校比較 — 並排比較語言學校",
  description:
    "最多 3 間菲律賓語言學校並排比較：費用、評價、課程、住宿、設施、生活費。",
};

export default function ComparePage() {
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
            學校比較
          </h1>
          <p
            className="mt-3 text-base"
            style={{ color: "var(--color-text-secondary)" }}
          >
            最多 3 間並排比較，找到最適合你的學校
          </p>
        </header>

        <Suspense
          fallback={
            <div className="skeleton" style={{ height: 400, width: "100%" }} />
          }
        >
          <CompareContent />
        </Suspense>
      </div>
    </div>
  );
}
