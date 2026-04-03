import { formatWeeklyTWD } from "@/libs/utils";
import AnimatedSection from "./AnimatedSection";

export default function HomeFeeBars({ cityStats }) {
  // cityStats: [{ city, schoolCount, avgFee }]
  const stats = (cityStats || []).filter((c) => c.avgFee != null);
  if (stats.length === 0) return null;

  const maxFee = Math.max(...stats.map((c) => c.avgFee));
  const minFee = Math.min(...stats.map((c) => c.avgFee));

  return (
    <AnimatedSection className="py-12 md:py-16 px-6" style={{ backgroundColor: "var(--color-surface)" }}>
      <div className="max-w-[720px] mx-auto">
        <h2
          className="font-display font-bold text-[28px] mb-2"
          style={{ color: "var(--color-text)" }}
        >
          各城市平均週費
        </h2>
        <p className="text-[14px] mb-8" style={{ color: "var(--color-text-secondary)" }}>
          語言學校平均週費比較。
        </p>

        <div className="space-y-4">
          {stats
            .sort((a, b) => a.avgFee - b.avgFee)
            .map((cs) => {
              const pct = Math.round((cs.avgFee / maxFee) * 100);
              const isCheapest = cs.avgFee === minFee;
              const label = cs.city;

              return (
                <div key={cs.city} className="flex items-center gap-4">
                  <span
                    className="font-display font-semibold text-[14px] w-[60px] text-right flex-shrink-0"
                    style={{ color: "var(--color-text)" }}
                  >
                    {label}
                  </span>
                  <div className="flex-1 h-[28px] rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-sunken)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: isCheapest ? "var(--color-primary)" : "var(--color-primary-light)",
                        opacity: isCheapest ? 1 : 0.4,
                      }}
                    />
                  </div>
                  <span
                    className="font-mono font-semibold text-[14px] w-[100px] flex-shrink-0"
                    style={{ color: isCheapest ? "var(--color-primary)" : "var(--color-text)" }}
                  >
                    {formatWeeklyTWD(cs.avgFee)}
                  </span>
                  <span className="text-[12px] flex-shrink-0" style={{ color: "var(--color-text-muted)" }}>
                    {cs.schoolCount} 校
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </AnimatedSection>
  );
}
