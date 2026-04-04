"use client";

import Link from "next/link";
import Image from "next/image";
import { formatWeeklyTWD } from "@/libs/utils";
import AnimatedSection from "./AnimatedSection";

const CITY_PHOTOS = {
  "New York": "https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=800",
  "Los Angeles": "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800",
  "San Francisco": "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
  "San Diego": "https://images.unsplash.com/photo-1538097304804-2a1b932466a9?w=800",
  Boston: "https://images.unsplash.com/photo-1501979376754-1d4511be17f2?w=800",
  Miami: "https://images.unsplash.com/photo-1533106497176-45ae19e68ba2?w=800",
  Chicago: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=800",
  Honolulu: "https://images.unsplash.com/photo-1507876466758-bc54f384809c?w=800",
};

const DEFAULT_PHOTO = "https://images.unsplash.com/photo-1485738422979-f5c462d49f04?w=800";

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
