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

const CITY_ZH = {
  "New York": "紐約",
  "Los Angeles": "洛杉磯",
  "San Francisco": "舊金山",
  "San Diego": "聖地牙哥",
  Boston: "波士頓",
  Miami: "邁阿密",
  Chicago: "芝加哥",
  Honolulu: "檀香山",
};

const CITY_HOOK = {
  "New York": "繁華都會 · 校園密度最高",
  "Los Angeles": "陽光加州 · 好萊塢旁學英文",
  "San Francisco": "科技之都 · 金門大橋相伴",
  "San Diego": "海灘城市 · 氣候最宜人",
  Boston: "學術重鎮 · 哈佛 MIT 旁",
  Miami: "拉丁風情 · 夜生活最豐富",
  Chicago: "建築之城 · 中西部核心",
  Honolulu: "熱帶天堂 · 度假式學習",
};

const DEFAULT_PHOTO = "https://pub-a8259d97bc254f95981092323524064c.r2.dev/photos/cities/new-york/1.jpg";

export default function HomeCities({ cityStats }) {
  if (!cityStats || cityStats.length === 0) return null;

  return (
    <section className="py-12 md:py-16 px-6" style={{ backgroundColor: "var(--color-elevated)" }}>
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
            const zhName = CITY_ZH[cs.city] || cs.city;
            const hook = CITY_HOOK[cs.city] || "";

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
                    alt={zhName}
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
                    {zhName}
                  </h3>
                  {hook && (
                    <p className="text-[13px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                      {hook}
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[14px]" style={{ color: "var(--color-text-secondary)" }}>
                      {cs.schoolCount} 間學校
                    </span>
                    {cs.avgFee != null && (
                      <span
                        className="font-mono font-semibold text-[14px]"
                        style={{ color: "var(--color-accent)" }}
                      >
                        {formatWeeklyTWD(cs.avgFee)} 起
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
