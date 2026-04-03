import HomeSearch from "@/components/HomeSearch";
import HomeCities from "@/components/HomeCities";
import HomeFeatured from "@/components/HomeFeatured";
import HomeFeeBars from "@/components/HomeFeeBars";
import HomeCalculatorCTA from "@/components/HomeCalculatorCTA";
import HomeTrust from "@/components/HomeTrust";
import HomeFAQ from "@/components/HomeFAQ";
import HomeFooter from "@/components/HomeFooter";
import { getFeaturedSchools, getCountryStats, getStats } from "@/libs/data/schools";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredSchools, countryStats, stats] = await Promise.all([
    getFeaturedSchools(6).catch(() => []),
    getCountryStats().catch(() => []),
    getStats().catch(() => ({ schoolCount: 76 })),
  ]);

  return (
    <>
      {/* S1: Search area (white) */}
      <HomeSearch schoolCount={stats.schoolCount} />

      {/* S2: Country/City cards (white) */}
      <HomeCities cityStats={countryStats} />

      {/* S3: Featured schools carousel (surface) */}
      <HomeFeatured programs={featuredSchools} />

      {/* S4: Fee quick compare (surface) */}
      <HomeFeeBars cityStats={countryStats} />

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
