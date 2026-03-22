"use client";

import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import { formatUSD } from "@/libs/utils";
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
    <AnimatedSection
      className="py-12 md:py-16 px-6"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="max-w-[1120px] mx-auto">
        <h2
          className="font-display font-extrabold text-2xl md:text-3xl mb-2"
          style={{ color: "var(--color-text)" }}
        >
          探索城市
        </h2>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-secondary)" }}>
          每個城市都有不同的學習氛圍和生活步調。
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {cityStats.map((cs) => (
            <Link
              key={cs.city}
              href={`/search?city=${cs.city}`}
              className="group block overflow-hidden transition-transform hover:-translate-y-1"
              style={{
                borderRadius: "var(--radius-lg)",
                border: "1px solid var(--color-border)",
                backgroundColor: "var(--color-elevated)",
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={CITY_PHOTOS[cs.city] || CITY_PHOTOS.Cebu}
                  alt={config.cityNames[cs.city] || cs.city}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: "linear-gradient(180deg, transparent 40%, rgba(26,26,46,0.7) 100%)",
                  }}
                />
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-display font-bold text-lg text-white">
                    {config.cityNames[cs.city] || cs.city}
                  </h3>
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs" style={{ color: "var(--color-text-secondary)" }}>
                  {cs.schoolCount} 間學校
                </p>
                <p
                  className="font-mono font-semibold text-sm mt-1"
                  style={{ color: "var(--color-text)" }}
                >
                  平均 {formatUSD(cs.avgFee)}/週
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
