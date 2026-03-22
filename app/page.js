import HeroSection from "@/components/HeroSection";
import HomeStats from "@/components/HomeStats";
import HomeFeatured from "@/components/HomeFeatured";
import HomePacksPreview from "@/components/HomePacksPreview";
import HomeCalculatorCTA from "@/components/HomeCalculatorCTA";
import HomeCities from "@/components/HomeCities";
import HomeTrust from "@/components/HomeTrust";
import HomeFAQ from "@/components/HomeFAQ";
import HomeFooter from "@/components/HomeFooter";
import { getFeaturedPrograms, getCityStats } from "@/libs/data/programs";

// Force dynamic rendering so Supabase data is fetched at request time
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch data for sections in parallel
  const [featuredPrograms, cityStats] = await Promise.all([
    getFeaturedPrograms(6).catch(() => []),
    getCityStats().catch(() => []),
  ]);

  return (
    <>
      {/* S1: Hero (white bg) — 情緒鉤子 */}
      <HeroSection />

      {/* S2: Stats Bar (teal bg) — 信任數字 */}
      <HomeStats />

      {/* S3: 熱門學校 (surface bg) — 探索 */}
      <HomeFeatured programs={featuredPrograms} />

      {/* S4: 懶人包 (white bg) — 探索 */}
      <HomePacksPreview />

      {/* S5: 費用計算 CTA (teal bg) — 行動 */}
      <HomeCalculatorCTA />

      {/* S6: 城市探索 (surface bg) — 探索 */}
      <HomeCities cityStats={cityStats} />

      {/* S7: 學員心得 (white bg) — 信任 */}
      <HomeTrust />

      {/* S8: FAQ (surface bg) — 行動 */}
      <HomeFAQ />

      {/* S9: 最終 CTA (teal bg) + Footer (dark bg) */}
      <HomeFooter />
    </>
  );
}
