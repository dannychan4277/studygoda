import HomeSearch from "@/components/HomeSearch";
import HomeCities from "@/components/HomeCities";
import HomeFeatured from "@/components/HomeFeatured";
import HomeFeeBars from "@/components/HomeFeeBars";
import HomePacksPreview from "@/components/HomePacksPreview";
import HomeCalculatorCTA from "@/components/HomeCalculatorCTA";
import HomeTrust from "@/components/HomeTrust";
import HomeFAQ from "@/components/HomeFAQ";
import HomeFooter from "@/components/HomeFooter";
import { getFeaturedPrograms, getCityStats, getStats } from "@/libs/data/programs";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [featuredPrograms, cityStats, stats] = await Promise.all([
    getFeaturedPrograms(6).catch(() => []),
    getCityStats().catch(() => []),
    getStats().catch(() => ({ schoolCount: 31 })),
  ]);

  return (
    <>
      {/* S1: Search area (white) — replaces hero */}
      <HomeSearch schoolCount={stats.schoolCount} />

      {/* S2: City photo cards (white) */}
      <HomeCities cityStats={cityStats} />

      {/* S3: Featured schools carousel (surface) */}
      <HomeFeatured programs={featuredPrograms} />

      {/* S4: Fee quick compare (surface) */}
      <HomeFeeBars cityStats={cityStats} />

      {/* S5: Lazy packs carousel (white) */}
      <HomePacksPreview />

      {/* S6: Calculator CTA (primary bg) */}
      <HomeCalculatorCTA />

      {/* S7: Testimonials (white) */}
      <HomeTrust />

      {/* S8: FAQ (surface) */}
      <HomeFAQ />

      {/* S9: Final CTA + Footer */}
      <HomeFooter />
    </>
  );
}
