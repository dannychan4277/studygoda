import AnimatedSection from "./AnimatedSection";

const TESTIMONIALS = [
  {
    id: 1,
    quote: "校園超美，設施完善。4 週下來英文真的進步很多，推薦！",
    source: "Dcard",
    author: "匿名",
    school: "EV Academy",
  },
  {
    id: 2,
    quote: "碧瑤天氣涼爽很適合讀書，而且比宿霧便宜。斯巴達模式雖然累但真的有效。",
    source: "PTT",
    author: "匿名",
    school: "PINES Main Campus",
  },
  {
    id: 3,
    quote: "老師很有耐心，一對一教學讓我從不敢開口到可以日常對話。CP 值超高！",
    source: "Dcard",
    author: "匿名",
    school: "Monol International",
  },
];

export default function HomeTrust() {
  return (
    <AnimatedSection className="py-12 md:py-16 px-6" style={{ backgroundColor: "var(--color-elevated)" }}>
      <div className="max-w-[1120px] mx-auto">
        <h2
          className="font-display font-bold text-[28px] mb-2"
          style={{ color: "var(--color-text)" }}
        >
          學員心得
        </h2>
        <p className="text-[14px] mb-8" style={{ color: "var(--color-text-secondary)" }}>
          來自真實學員的分享。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t) => (
            <blockquote
              key={t.id}
              className="p-5 card-hover"
              style={{
                borderRadius: "16px",
                backgroundColor: "var(--color-surface)",
              }}
            >
              <p
                className="italic text-[15px]"
                style={{ color: "var(--color-text)", lineHeight: 1.8 }}
              >
                「{t.quote}」
              </p>
              <footer className="mt-4 flex items-center gap-2">
                <cite
                  className="text-[12px] font-display font-semibold px-2.5 py-1 rounded-full not-italic"
                  style={{
                    border: "1px solid var(--color-primary)",
                    color: "var(--color-primary)",
                  }}
                >
                  {t.source}
                </cite>
                <span className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
                  · {t.school}
                </span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
