import Link from "next/link";
import { getLazyPacks } from "@/libs/data/programs";
import LazyPackCard from "./LazyPackCard";
import AnimatedSection from "./AnimatedSection";
import CarouselArrows from "./CarouselArrows";

export default async function HomePacksPreview() {
  let packs = [];
  try {
    const allPacks = await getLazyPacks();
    packs = allPacks?.slice(0, 8) || [];
  } catch {
    // Silently handle — show empty section
  }

  if (packs.length === 0) return null;

  return (
    <AnimatedSection
      className="py-12 md:py-16 px-6"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="max-w-[1120px] mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2
              className="font-display font-bold text-[28px] mb-2"
              style={{ color: "var(--color-text)" }}
            >
              遊學懶人包
            </h2>
            <p className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
              不知道怎麼選？我們幫你配好了。
            </p>
          </div>
          <CarouselArrows targetId="packs-carousel" />
        </div>

        <div
          id="packs-carousel"
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {packs.map((pack) => (
            <div
              key={pack.id}
              className="flex-shrink-0 w-[340px] md:w-[400px] snap-start"
            >
              <LazyPackCard pack={pack} variant="landscape" />
            </div>
          ))}

          {/* CTA card at the end */}
          <div className="flex-shrink-0 w-[340px] md:w-[400px] snap-start">
            <Link
              href="/packs"
              className="flex items-center justify-center h-full min-h-[180px] font-display font-semibold text-[16px] transition-colors"
              style={{
                borderRadius: "16px",
                border: "2px dashed var(--color-border)",
                color: "var(--color-primary)",
              }}
            >
              看全部懶人包 →
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
