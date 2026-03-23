import Link from "next/link";
import AnimatedSection from "./AnimatedSection";

export default function HomeFooter() {
  return (
    <>
      {/* Final CTA — teal bg */}
      <AnimatedSection
        className="py-16 md:py-20 px-6 text-center"
        style={{ backgroundColor: "var(--color-primary)", color: "white" }}
      >
        <h2 className="font-display font-bold text-[28px] md:text-[36px] mb-4">
          準備好出發了嗎？
        </h2>
        <p className="text-base md:text-lg opacity-80 mb-8 mx-auto" style={{ maxWidth: "576px", lineHeight: 1.6 }}>
          30+ 間學校、4 個城市，找到最適合你的遊學方案。
        </p>
        <Link
          href="/search"
          className="inline-flex items-center font-display font-semibold text-base px-8 py-4 transition-transform hover:scale-105"
          style={{
            backgroundColor: "var(--color-accent)",
            color: "white",
            borderRadius: "var(--radius-md)",
            minHeight: "56px",
          }}
        >
          找到你的學校 →
        </Link>
      </AnimatedSection>

      {/* Footer — dark bg */}
      <footer
        className="py-12 md:py-16 px-6"
        style={{ backgroundColor: "#1A1A2E", color: "rgba(255,255,255,0.6)" }}
        role="contentinfo"
      >
        <div className="max-w-[1120px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            {/* Brand */}
            <div>
              <h3 className="font-display font-bold text-xl text-white mb-2">
                StudyGoda
              </h3>
              <p className="text-sm">
                找到你的遊學 — 菲律賓語言學校比價平台
              </p>
            </div>

            {/* 探索 */}
            <div>
              <h4 className="font-display font-semibold text-sm text-white/80 uppercase tracking-wider mb-3">
                探索
              </h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/search" className="hover:text-white transition-colors">搜尋學校</Link></li>
                <li><Link href="/packs" className="hover:text-white transition-colors">懶人包</Link></li>
                <li><Link href="/cost-report" className="hover:text-white transition-colors">費用報告</Link></li>
              </ul>
            </div>

            {/* 功能 */}
            <div>
              <h4 className="font-display font-semibold text-sm text-white/80 uppercase tracking-wider mb-3">
                功能
              </h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/calculator" className="hover:text-white transition-colors">費用計算機</Link></li>
                <li><Link href="/compare" className="hover:text-white transition-colors">學校比較</Link></li>
              </ul>
            </div>

            {/* 關於 */}
            <div>
              <h4 className="font-display font-semibold text-sm text-white/80 uppercase tracking-wider mb-3">
                關於
              </h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" aria-disabled="true" className="opacity-50 pointer-events-none">關於我們</a></li>
                <li><a href="#" aria-disabled="true" className="opacity-50 pointer-events-none">聯絡我們</a></li>
                <li><a href="#" aria-disabled="true" className="opacity-50 pointer-events-none">隱私政策</a></li>
              </ul>
            </div>
          </div>

          <div
            className="pt-6 text-center text-xs"
            style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
          >
            &copy; 2026 StudyGoda. 找到你的遊學。
          </div>
        </div>
      </footer>
    </>
  );
}
