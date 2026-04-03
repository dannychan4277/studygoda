import HeroSection from "@/components/HeroSection";
import HomeSearch from "@/components/HomeSearch";
import HomeCities from "@/components/HomeCities";
import HomeFeatured from "@/components/HomeFeatured";
import HomeFeeBars from "@/components/HomeFeeBars";
import HomeCalculatorCTA from "@/components/HomeCalculatorCTA";
import HomeTrust from "@/components/HomeTrust";
import HomeFAQ from "@/components/HomeFAQ";
import HomeFooter from "@/components/HomeFooter";
import { getFeaturedSchools, getCityStats, getStats } from "@/libs/data/schools";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredSchools, cityStats, stats] = await Promise.all([
    getFeaturedSchools(6).catch(() => []),
    getCityStats().catch(() => []),
    getStats().catch(() => ({ schoolCount: 76 })),
  ]);

  return (
    <>
      {/* S0: Hero — emotional entry */}
      <HeroSection />

      {/* S1: Search area (white) */}
      <HomeSearch schoolCount={stats.schoolCount} />

      {/* S2: Country/City cards (white) */}
      <HomeCities cityStats={cityStats} />

      {/* S3: Featured schools carousel (surface) */}
      <HomeFeatured programs={featuredSchools} />

      {/* S4: Fee quick compare (surface) */}
      <HomeFeeBars cityStats={cityStats} />

      {/* S5: Calculator CTA (primary bg) */}
      <HomeCalculatorCTA />

      {/* S6: Testimonials (white) */}
      <HomeTrust />

      {/* S7: FAQ (surface) */}
      <HomeFAQ />

      {/* S8: Final CTA + Footer */}
      <HomeFooter />
    </>
  );
}
