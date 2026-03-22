import AnimatedSection from "./AnimatedSection";

const TESTIMONIALS = [
  {
    id: 1,
    quote: "校園超美，設施完善。4 週下來英文真的進步很多，推薦！",
    source: "Dcard 看板",
    author: "匿名",
    school: "EV Academy",
  },
  {
    id: 2,
    quote: "碧瑤天氣涼爽很適合讀書，而且比宿霧便宜。斯巴達模式雖然累但真的有效。",
    source: "PTT StudyAbroad",
    author: "ptt_user",
    school: "PINES Main Campus",
  },
  {
    id: 3,
    quote: "老師很有耐心，一對一教學讓我從不敢開口到可以日常對話。CP 值超高！",
    source: "Dcard 看板",
    author: "匿名",
    school: "Monol International",
  },
];

export default function HomeTrust() {
  return (
    <AnimatedSection
      className="py-12 md:py-16 px-6"
      style={{ backgroundColor: "var(--color-elevated)" }}
    >
      <div className="max-w-[1120px] mx-auto">
        <h2
          className="font-display font-extrabold text-2xl md:text-3xl mb-2"
          style={{ color: "var(--color-text)" }}
        >
          學員心得
        </h2>
        <p className="text-sm mb-8" style={{ color: "var(--color-text-secondary)" }}>
          來自真實學員的分享。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              className="p-5"
              style={{
                borderLeft: "3px solid var(--color-accent)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <p
                className="italic text-base leading-relaxed"
                style={{ color: "var(--color-text)" }}
              >
                「{t.quote}」
              </p>
              <div className="mt-3 flex items-center gap-2 flex-wrap">
                <span
                  className="text-xs font-display font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: "var(--color-sunken)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {t.source}
                </span>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  {t.author}
                </span>
                <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                  · {t.school}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
