"use client";

import Link from "next/link";
import ProgramCard from "./ProgramCard";
import AnimatedSection from "./AnimatedSection";

export default function HomeFeatured({ programs }) {
  if (!programs || programs.length === 0) return null;

  return (
    <AnimatedSection
      className="py-12 md:py-16 px-6"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="max-w-[1120px] mx-auto">
        <h2
          className="font-display font-bold text-[28px] mb-2"
          style={{ color: "var(--color-text)" }}
        >
          最多人看的語言學校
        </h2>
        <p className="text-[14px] mb-8" style={{ color: "var(--color-text-secondary)" }}>
          綜合評價和性價比，為你精選。
        </p>

        {/* Horizontal scroll on all viewports */}
        <div
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "thin" }}
        >
          {programs.map((program) => (
            <div
              key={program.slug}
              className="flex-shrink-0 w-[280px] md:w-[320px] snap-start"
            >
              <ProgramCard program={program} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/search"
            className="inline-flex items-center gap-2 font-display font-semibold text-sm px-6 py-3 transition-all"
            style={{
              borderRadius: "var(--radius-full)",
              border: "1px solid var(--color-primary)",
              color: "var(--color-primary)",
            }}
          >
            看全部學校 →
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}
