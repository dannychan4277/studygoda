import HeroSection from "@/components/HeroSection";
import HomePacksPreview from "@/components/HomePacksPreview";
import HomeStats from "@/components/HomeStats";
import HomeTrust from "@/components/HomeTrust";

// Force dynamic rendering so Supabase data is fetched at request time
export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      {/* Section 1: Hero (white bg) */}
      <HeroSection />

      {/* Section 2: Lazy packs preview (surface bg) */}
      <HomePacksPreview />

      {/* Section 3: Stats (teal bg — every 3rd section) */}
      <HomeStats />

      {/* Section 4: Trust / testimonials (white bg) */}
      <HomeTrust />

      {/* Footer */}
      <footer
        className="py-12 px-6 text-center"
        style={{ backgroundColor: "#1A1A2E", color: "rgba(255,255,255,0.6)" }}
        role="contentinfo"
      >
        <p className="font-display text-sm">
          &copy; 2026 StudyGoda. 找到你的遊學。
        </p>
      </footer>
    </>
  );
}
