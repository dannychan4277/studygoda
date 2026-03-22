import Link from "next/link";
import { getLazyPacks } from "@/libs/data/programs";
import LazyPackCard from "@/components/LazyPackCard";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "遊學懶人包",
  description: "精選菲律賓遊學方案，不用比價、不用煩惱，我們幫你配好了。宿霧、碧瑤、馬尼拉、克拉克懶人包。",
};

export default async function PacksPage() {
  let packs = [];
  try {
    packs = (await getLazyPacks()) || [];
  } catch {
    // Show empty state
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-surface)" }}>
      {/* Header */}
      <div className="px-6 pt-8 pb-4" style={{ backgroundColor: "var(--color-elevated)" }}>
        <div className="max-w-[1120px] mx-auto">
          <h1 className="font-display font-extrabold text-2xl md:text-4xl" style={{ color: "var(--color-text)" }}>
            遊學懶人包
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            不知道怎麼選？我們幫你配好了。選一個方案，直接出發。
          </p>
        </div>
      </div>

      <div className="max-w-[1120px] mx-auto px-6 py-8">
        {packs.length === 0 ? (
          /* Empty state */
          <div className="text-center py-16">
            <div className="text-5xl mb-4">📦</div>
            <h3 className="font-display font-bold text-lg" style={{ color: "var(--color-text)" }}>
              更多方案即將推出
            </h3>
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
              我們正在準備更多精選方案，敬請期待！
            </p>
            <Link
              href="/search"
              className="inline-block mt-4 px-6 py-2.5 rounded-full font-display font-semibold text-sm"
              style={{ backgroundColor: "var(--color-accent)", color: "white" }}
            >
              先去搜尋學校 →
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-5">
              {packs.map((pack) => (
                <LazyPackCard key={pack.id} pack={pack} variant="landscape" />
              ))}
            </div>

            {/* Self-browse CTA */}
            <div
              className="mt-12 text-center py-10 px-6"
              style={{
                backgroundColor: "var(--color-elevated)",
                borderRadius: "var(--radius-md)",
                border: "1px solid var(--color-border)",
              }}
            >
              <h3 className="font-display font-bold text-lg" style={{ color: "var(--color-text)" }}>
                想自己挑？
              </h3>
              <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
                30+ 間語言學校，用篩選找到最適合你的。
              </p>
              <Link
                href="/search"
                className="inline-block mt-4 px-6 py-2.5 rounded-full font-display font-semibold text-sm"
                style={{ backgroundColor: "var(--color-primary)", color: "white" }}
              >
                開始搜尋 →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
