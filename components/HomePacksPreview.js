import Link from "next/link";
import { getLazyPacks } from "@/libs/data/programs";
import LazyPackCard from "./LazyPackCard";
import AnimatedSection from "./AnimatedSection";

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
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="max-w-[1120px] mx-auto">
        <h2
          className="font-display font-extrabold text-2xl md:text-3xl mb-2"
          style={{ color: "var(--color-text)" }}
        >
          遊學懶人包
        </h2>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-secondary)" }}>
          不知道怎麼選？我們幫你配好了。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {packs.map((pack, i) => (
            <div
              key={pack.id}
              style={{
                animationDelay: `${i * 0.08}s`,
              }}
            >
              <LazyPackCard pack={pack} variant="landscape" />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/packs"
            className="inline-flex items-center gap-2 font-display font-semibold text-sm px-6 py-3 rounded-full transition-all"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "white",
            }}
          >
            看全部懶人包 →
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}
