"use client";

import Link from "next/link";
import SchoolCard from "./SchoolCard";
import AnimatedSection from "./AnimatedSection";

export default function HomeFeatured({ programs: schools }) {
  if (!schools || schools.length === 0) return null;

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
          熱門語言學校
        </h2>
        <p className="text-[14px] mb-8" style={{ color: "var(--color-text-secondary)" }}>
          綜合熱度和性價比，為你精選。
        </p>

        <div
          className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: "thin" }}
        >
          {schools.map((school) => (
            <div
              key={school.slug}
              className="flex-shrink-0 w-[280px] md:w-[320px] snap-start"
            >
              <SchoolCard school={school} />
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/schools"
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
