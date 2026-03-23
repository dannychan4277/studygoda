import Link from "next/link";
import { getAllPrograms, getAllCityGuides } from "@/libs/data/programs";
import { formatUSD, formatWeeklyTWD, formatTWD, usdToTwd } from "@/libs/utils";
import config from "@/config";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "2026 菲律賓遊學費用報告",
  description:
    "菲律賓遊學一個月花多少錢？宿霧、碧瑤、馬尼拉、克拉克各城市學費、生活費、機票完整比較。2026 最新資料。",
  openGraph: {
    title: "2026 菲律賓遊學費用報告 | StudyGoda",
    description: "各城市週費比較 + 生活費明細 + 機票範圍",
  },
};

export default async function CostReportPage() {
  let cityFees = [];
  let cityGuides = [];

  try {
    const programs = (await getAllPrograms()) || [];
    cityGuides = (await getAllCityGuides()) || [];

    // Calculate average weekly fee per city
    const cityMap = {};
    for (const p of programs) {
      if (!cityMap[p.city]) cityMap[p.city] = { total: 0, count: 0 };
      cityMap[p.city].total += p.weekly_fee_usd;
      cityMap[p.city].count += 1;
    }

    cityFees = Object.entries(cityMap)
      .map(([city, data]) => ({
        city,
        avgFee: Math.round(data.total / data.count),
        count: data.count,
      }))
      .sort((a, b) => a.avgFee - b.avgFee);
  } catch {
    // Static fallback
  }

  const maxFee = Math.max(...cityFees.map((c) => c.avgFee), 1);

  function feeColor(fee) {
    if (fee < 250) return "var(--color-fee-budget)";
    if (fee <= 400) return "var(--color-fee-mid)";
    return "var(--color-fee-premium)";
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--color-surface)" }}>
      {/* Header */}
      <div
        className="px-6 pt-8 pb-6"
        style={{ backgroundColor: "var(--color-primary)", color: "white" }}
      >
        <div className="max-w-[1120px] mx-auto">
          <h1 className="font-display font-extrabold text-2xl md:text-4xl">
            2026 菲律賓遊學費用報告
          </h1>
          <p className="mt-2 text-sm opacity-80">
            學費 + 生活費 + 機票，一次看清楚
          </p>
        </div>
      </div>

      <div className="max-w-[1120px] mx-auto px-6 py-8 space-y-12">
        {/* Section: City weekly fee comparison bar chart */}
        <section>
          <h2 className="font-display font-bold text-xl mb-6" style={{ color: "var(--color-text)" }}>
            各城市平均週費比較
          </h2>
          <div className="space-y-4">
            {cityFees.map((city) => (
              <div key={city.city} className="flex items-center gap-4">
                <span
                  className="w-20 text-sm font-display font-semibold text-right flex-shrink-0"
                  style={{ color: "var(--color-text)" }}
                >
                  {config.cityNames[city.city] || city.city}
                </span>
                <div className="flex-1 h-10 rounded-md overflow-hidden" style={{ backgroundColor: "var(--color-sunken)" }}>
                  <div
                    className="h-full rounded-md flex items-center justify-end px-3 transition-all"
                    style={{
                      width: `${(city.avgFee / maxFee) * 100}%`,
                      backgroundColor: feeColor(city.avgFee),
                      minWidth: "60px",
                    }}
                  >
                    <span className="font-mono font-semibold text-sm text-white">
                      {formatWeeklyTWD(city.avgFee)}
                    </span>
                  </div>
                </div>
                <span className="text-xs flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>
                  {city.count} 間
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Living cost breakdown */}
        <section>
          <h2 className="font-display font-bold text-xl mb-6" style={{ color: "var(--color-text)" }}>
            每週生活費明細
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cityGuides.map((guide) => {
              const total =
                guide.weekly_food_usd +
                guide.weekly_transport_usd +
                guide.weekly_misc_usd;

              return (
                <div
                  key={guide.city}
                  className="p-5"
                  style={{
                    backgroundColor: "var(--color-elevated)",
                    borderRadius: "var(--radius-md)",
                    border: "1px solid var(--color-border)",
                  }}
                >
                  <h3 className="font-display font-bold text-base mb-3" style={{ color: "var(--color-text)" }}>
                    {config.cityNames[guide.city] || guide.city}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span style={{ color: "var(--color-text-secondary)" }}>餐飲</span>
                      <span className="font-mono" style={{ color: "var(--color-text)" }}>{formatTWD(usdToTwd(guide.weekly_food_usd))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "var(--color-text-secondary)" }}>交通</span>
                      <span className="font-mono" style={{ color: "var(--color-text)" }}>{formatTWD(usdToTwd(guide.weekly_transport_usd))}</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: "var(--color-text-secondary)" }}>雜支/SIM</span>
                      <span className="font-mono" style={{ color: "var(--color-text)" }}>{formatTWD(usdToTwd(guide.weekly_misc_usd))}</span>
                    </div>
                    <div className="flex justify-between pt-2 mt-2 font-semibold" style={{ borderTop: "1px solid var(--color-border)" }}>
                      <span style={{ color: "var(--color-text)" }}>合計</span>
                      <span className="font-mono" style={{ color: "var(--color-primary)" }}>{formatTWD(usdToTwd(total))}/週</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: Flight estimate */}
        <section
          className="p-8 text-center"
          style={{
            backgroundColor: "var(--color-elevated)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--color-border)",
          }}
        >
          <h2 className="font-display font-bold text-xl mb-2" style={{ color: "var(--color-text)" }}>
            機票參考
          </h2>
          <p className="font-mono text-2xl font-semibold" style={{ color: "var(--color-accent)" }}>
            {config.flights.range}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
            {config.flights.note}
          </p>
          <a
            href={config.flights.skyscannerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-4 px-6 py-2.5 rounded-full font-display font-semibold text-sm"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-text)" }}
          >
            查看 Skyscanner 機票 →
          </a>
        </section>

        {/* CTAs */}
        <section className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/calculator"
            className="px-8 py-3 rounded-full font-display font-semibold text-sm text-center min-h-[44px] flex items-center justify-center"
            style={{ backgroundColor: "var(--color-accent)", color: "white" }}
          >
            用計算機算出你的預算 →
          </Link>
          <Link
            href="/search"
            className="px-8 py-3 rounded-full font-display font-semibold text-sm text-center min-h-[44px] flex items-center justify-center"
            style={{ border: "1px solid var(--color-border)", color: "var(--color-text)" }}
          >
            找到最適合你的 →
          </Link>
        </section>
      </div>
    </div>
  );
}
