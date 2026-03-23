"use client";

import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import { formatWeeklyTWD } from "@/libs/utils";
import AnimatedSection from "./AnimatedSection";

const CITY_PHOTOS = {
  Cebu: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  Baguio: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
  Manila: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
  Clark: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
};

export default function HomeCities({ cityStats }) {
  if (!cityStats || cityStats.length === 0) return null;

  return (
    <AnimatedSection className="py-12 md:py-16 px-6" style={{ backgroundColor: "#FFFFFF" }}>
      <div className="max-w-[1120px] mx-auto">
        <h2
          className="font-display font-bold text-[28px] mb-2"
          style={{ color: "var(--color-text)" }}
        >
          探索城市
        </h2>
        <p className="text-[14px] mb-8" style={{ color: "var(--color-text-secondary)" }}>
          每個城市都有不同的學習氛圍和生活步調。
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {cityStats.map((cs) => (
            <Link
              key={cs.city}
              href={`/search?city=${cs.city}`}
              className="group block overflow-hidden"
              style={{
                borderRadius: "16px",
                backgroundColor: "var(--color-elevated)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
                transition: "box-shadow 200ms ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.08)";
              }}
            >
              {/* Photo above — NOT overlaid */}
              <div className="relative aspect-[4/3] overflow-hidden" style={{ borderRadius: "16px 16px 0 0" }}>
                <Image
                  src={CITY_PHOTOS[cs.city] || CITY_PHOTOS.Cebu}
                  alt={config.cityNames[cs.city] || cs.city}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
              </div>
              {/* Text below */}
              <div className="p-4">
                <h3 className="font-display font-semibold text-[16px]" style={{ color: "var(--color-text)" }}>
                  {config.cityNames[cs.city] || cs.city}
                </h3>
                <p className="text-[14px] mt-1" style={{ color: "var(--color-text-secondary)" }}>
                  {cs.schoolCount} 間學校
                </p>
                <p className="font-mono font-semibold text-[14px] mt-1" style={{ color: "var(--color-text)" }}>
                  {formatWeeklyTWD(cs.avgFee)} 起
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
