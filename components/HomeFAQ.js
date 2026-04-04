"use client";

import { useState } from "react";
import AnimatedSection from "./AnimatedSection";

const FAQ_ITEMS = [
  {
    q: "去美國遊學需要什麼簽證？",
    a: "如果課程每週超過 18 小時，需要申請 F-1 學生簽證（需 I-20 表格）。短期課程（每週低於 18 小時、90 天內）可用 ESTA 免簽入境。建議提前 2-3 個月準備簽證申請。",
  },
  {
    q: "美國遊學一個月大概花多少錢？",
    a: "4 週學費約 NT$35,000–65,000（依城市和學校不同），住宿另計約 NT$25,000–50,000/月，生活費約 NT$15,000–30,000/月，機票約 NT$25,000–45,000 來回。總預算大概 NT$100,000–190,000，可以用我們的費用計算機精算。",
  },
  {
    q: "英文程度不好可以去嗎？",
    a: "完全可以！美國語言學校提供從初級到高級的分級課程，入學前會做程度測試，依照你的等級安排班級。沉浸式的全英文環境加上小班教學，進步速度通常比在台灣學快很多。",
  },
  {
    q: "住宿有哪些選擇？",
    a: "常見的住宿方式有：寄宿家庭（Homestay，含餐，融入當地生活）、學生宿舍（靠近校區，適合交朋友）、校外公寓（獨立空間，自由度高）。費用和體驗差異大，建議依預算和生活習慣選擇。",
  },
  {
    q: "哪個城市最推薦？",
    a: "紐約和洛杉磯最熱門，生活機能強但費用較高。波士頓學術氣氛濃厚，舊金山適合喜歡科技和自然的人。邁阿密天氣好、拉丁文化豐富。聖地牙哥氣候宜人、生活步調輕鬆，適合第一次出國的人。",
  },
  {
    q: "美國遊學安全嗎？",
    a: "語言學校大多位在大學城或市中心的安全區域。建議選擇治安較好的城市和社區，避免深夜獨自外出，隨身攜帶證件影本。學校通常會提供新生指引，介紹周邊環境和注意事項。",
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
          第一次去美國遊學？你可能想知道...
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
                  className="faq-panel"
                  data-open={isOpen}
                >
                  <div>
                    <p
                      className="px-4 pb-4 text-[14px] leading-relaxed"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AnimatedSection>
  );
}
