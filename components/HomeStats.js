import { getStats } from "@/libs/data/schools";
import AnimatedSection from "./AnimatedSection";
import CountUp from "./CountUp";

export default async function HomeStats() {
  let stats = { schoolCount: 31, cityCount: 4, lowestFee: 175 };
  try {
    stats = await getStats();
  } catch {
    // Use defaults
  }

  return (
    <AnimatedSection
      className="py-16 md:py-20 px-6"
      style={{ backgroundColor: "var(--color-primary)", color: "white" }}
    >
      <div className="max-w-[1120px] mx-auto">
        <div className="grid grid-cols-3 gap-8 text-center">
          <div>
            <div className="font-display font-extrabold text-4xl md:text-6xl">
              <CountUp end={stats.schoolCount} suffix="+" />
            </div>
            <p className="mt-2 text-sm md:text-base opacity-80 font-display">
              間語言學校
            </p>
          </div>
          <div>
            <div className="font-display font-extrabold text-4xl md:text-6xl">
              <CountUp end={stats.cityCount} />
            </div>
            <p className="mt-2 text-sm md:text-base opacity-80 font-display">
              個城市
            </p>
          </div>
          <div>
            <div className="font-display font-extrabold text-4xl md:text-6xl">
              <CountUp end={stats.lowestFee} prefix="$" />
            </div>
            <p className="mt-2 text-sm md:text-base opacity-80 font-display">
              最低週費
            </p>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
