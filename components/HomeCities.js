"use client";

import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import { formatWeeklyTWD } from "@/libs/utils";
import AnimatedSection from "./AnimatedSection";

const COUNTRY_PHOTOS = {
  USA: "https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=800",
  UK: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800",
  Australia: "https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=800",
};

export default function HomeCities({ cityStats }) {
  // cityStats is now countryStats: [{ country, schoolCount, avgFee }]
  if (!cityStats || cityStats.length === 0) return null;

  return (
    <AnimatedSection className="py-12 md:py-16 px-6" style={{ backgroundColor: "var(--color-elevated)" }}>
      <div className="max-w-[1120px] mx-auto">
        <h2
          className="font-display font-bold text-[28px] mb-2"
          style={{ color: "var(--color-text)" }}
        >
          探索國家
        </h2>
        <p className="text-[14px] mb-8" style={{ color: "var(--color-text-secondary)" }}>
          每個國家都有不同的學習氛圍和生活體驗。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
          {cityStats.map((cs) => {
            const name = config.countryNames[cs.country] || cs.country;
            const flag = config.countryFlags[cs.country] || "";

            return (
              <Link
                key={cs.country}
                href={`/schools?country=${cs.country}`}
                className="group block overflow-hidden card-hover"
                style={{
                  borderRadius: "16px",
                  backgroundColor: "var(--color-elevated)",
                }}
              >
                <div className="relative aspect-[16/9] overflow-hidden" style={{ borderRadius: "16px 16px 0 0" }}>
                  <Image
                    src={COUNTRY_PHOTOS[cs.country] || COUNTRY_PHOTOS.USA}
                    alt={name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-display font-semibold text-[16px]" style={{ color: "var(--color-text)" }}>
                    {flag} {name}
                  </h3>
                  <p className="text-[14px] mt-1" style={{ color: "var(--color-text-secondary)" }}>
                    {cs.schoolCount} 間學校
                  </p>
                  {cs.avgFee != null && (
                    <p className="font-mono font-semibold text-[14px] mt-1" style={{ color: "var(--color-text)" }}>
                      {formatWeeklyTWD(cs.avgFee)} 起
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
