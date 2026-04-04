"use client";

import Link from "next/link";
import Image from "next/image";
import { formatWeeklyTWD } from "@/libs/utils";
import AnimatedSection from "./AnimatedSection";

const CITY_PHOTOS = {
  "New York": "https://pub-a8259d97bc254f95981092323524064c.r2.dev/photos/cities/new-york/1.jpg",
  "Los Angeles": "https://pub-a8259d97bc254f95981092323524064c.r2.dev/photos/cities/los-angeles/1.jpg",
  "San Francisco": "https://pub-a8259d97bc254f95981092323524064c.r2.dev/photos/cities/san-francisco/1.jpg",
  "San Diego": "https://pub-a8259d97bc254f95981092323524064c.r2.dev/photos/cities/san-diego/1.jpg",
  Boston: "https://pub-a8259d97bc254f95981092323524064c.r2.dev/photos/cities/boston/1.jpg",
  Miami: "https://pub-a8259d97bc254f95981092323524064c.r2.dev/photos/cities/miami/1.jpg",
  Chicago: "https://pub-a8259d97bc254f95981092323524064c.r2.dev/photos/cities/chicago/1.jpg",
  Honolulu: "https://pub-a8259d97bc254f95981092323524064c.r2.dev/photos/cities/honolulu/1.jpg",
};

const DEFAULT_PHOTO = "https://pub-a8259d97bc254f95981092323524064c.r2.dev/photos/cities/new-york/1.jpg";

export default function HomeCities({ cityStats }) {
  // cityStats: [{ city, schoolCount, avgFee }]
  if (!cityStats || cityStats.length === 0) return null;

  return (
    <AnimatedSection className="py-12 md:py-16 px-6" style={{ backgroundColor: "var(--color-elevated)" }}>
      <div className="max-w-[1120px] mx-auto">
        <h2
          className="font-display font-bold text-[28px] mb-2"
          style={{ color: "var(--color-text)" }}
        >
          探索美國城市
        </h2>
        <p className="text-[14px] mb-8" style={{ color: "var(--color-text-secondary)" }}>
          每個城市都有不同的學習氛圍和生活體驗，找到最適合你的美國遊學城市。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
          {cityStats.slice(0, 4).map((cs, index) => {
            const isFeatured = index === 0;

            return (
              <Link
                key={cs.city}
                href={`/schools?city=${encodeURIComponent(cs.city)}`}
                className={`group block overflow-hidden card-hover ${isFeatured ? "md:col-span-2" : ""}`}
                style={{
                  borderRadius: "16px",
                  backgroundColor: "var(--color-elevated)",
                }}
              >
                <div
                  className="relative overflow-hidden"
                  style={{
                    aspectRatio: isFeatured ? "21/9" : "16/9",
                    borderRadius: "16px 16px 0 0",
                  }}
                >
                  <Image
                    src={CITY_PHOTOS[cs.city] || DEFAULT_PHOTO}
                    alt={cs.city}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes={isFeatured ? "(max-width: 768px) 100vw, 100vw" : "(max-width: 768px) 100vw, 50vw"}
                  />
                </div>
                <div className="p-4">
                  <h3
                    className={`font-display font-semibold ${isFeatured ? "text-[20px]" : "text-[16px]"}`}
                    style={{ color: "var(--color-text)" }}
                  >
                    {cs.city}
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
