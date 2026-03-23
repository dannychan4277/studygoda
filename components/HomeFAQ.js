"use client";

import { useState } from "react";
import AnimatedSection from "./AnimatedSection";

const FAQ_ITEMS = [
  {
    q: "菲律賓遊學安全嗎？",
    a: "菲律賓主要遊學城市（宿霧、碧瑤、克拉克）的語言學校大多位在安全社區內，部分學校甚至有 24 小時保全和門禁管理。只要避開深夜外出、保管好財物，整體安全性和其他東南亞國家相當。",
  },
  {
    q: "英文程度不好可以去嗎？",
    a: "完全可以！菲律賓遊學最大的特色就是「一對一教學」，老師會根據你的程度調整課程內容。很多學生是從零基礎開始，4 週就能有明顯進步。",
  },
  {
    q: "一個月大概花多少錢？",
    a: "4 週費用大約 NT$30,000–60,000（含學費和住宿），加上生活費約 NT$8,000–15,000/月，機票 NT$4,000–8,000 來回。總預算大概 NT$45,000–85,000，可以用我們的費用計算機精算。",
  },
  {
    q: "住宿是什麼樣的？",
    a: "大部分學校提供校內宿舍（1-4 人房），含三餐、洗衣、打掃。也有部分學校提供飯店式住宿或外部公寓選擇。住宿品質差異蠻大的，建議看照片和評價再決定。",
  },
  {
    q: "簽證怎麼辦？",
    a: "台灣護照到菲律賓可以免簽停留 30 天。如果要待超過 30 天，可以在當地延簽（學校通常會協助辦理），延簽費約 NT$2,000–3,000。不需要事先申請簽證。",
  },
  {
    q: "什麼時候去最好？",
    a: "全年都可以去！菲律賓是熱帶氣候，但要注意 6-10 月是雨季。碧瑤因為在山上，氣溫涼爽（20-25°C），是暑假的熱門選擇。寒暑假是旺季，建議提前 2-3 個月報名。",
  },
];

export default function HomeFAQ() {
  const [openIndex, setOpenIndex] = useState(-1);

  return (
    <AnimatedSection
      className="py-12 md:py-16 px-6"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="max-w-[720px] mx-auto">
        <h2
          className="font-display font-bold text-[28px] mb-2"
          style={{ color: "var(--color-text)" }}
        >
          第一次遊學？你可能想知道...
        </h2>
        <p className="text-[14px] mb-8" style={{ color: "var(--color-text-secondary)" }}>
          最常被問到的 6 個問題。
        </p>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                style={{
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  backgroundColor: "var(--color-elevated)",
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between p-4 text-left font-display font-semibold text-base"
                  style={{ color: "var(--color-text)" }}
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${i}`}
                >
                  <span>{item.q}</span>
                  <span
                    className="flex-shrink-0 ml-3 text-lg transition-transform"
                    style={{
                      transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
                      color: "var(--color-accent)",
                    }}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div
                  id={`faq-panel-${i}`}
                  role="region"
                  className="overflow-hidden transition-all"
                  style={{
                    maxHeight: isOpen ? "500px" : "0",
                    opacity: isOpen ? 1 : 0,
                    transition: "max-height 300ms ease, opacity 200ms ease",
                  }}
                >
                  <p
                    className="px-4 pb-4 text-[14px] leading-relaxed"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
