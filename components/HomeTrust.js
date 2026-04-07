import AnimatedSection from "./AnimatedSection";

const TESTIMONIALS = [
  {
    id: 1,
    quote: "The school in New York was amazing — after class I'd just step outside and practice English in the city. My speaking improved so much in 4 weeks!",
    source: "Dcard",
    author: "Anonymous",
    school: "Kaplan New York",
  },
  {
    id: 2,
    quote: "Boston has such a strong academic vibe. The courses were solid and fun. Visiting Harvard and MIT on weekends made the whole experience worth it.",
    source: "PTT",
    author: "Anonymous",
    school: "EC English Boston",
  },
  {
    id: 3,
    quote: "Great weather in LA and classmates from all over the world. The teachers were so patient — I went from too shy to speak to having daily conversations.",
    source: "Dcard",
    author: "Anonymous",
    school: "ELS Language Centers",
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

        <div className="flex flex-col gap-5">
          {/* Featured quote — first testimonial */}
          <blockquote
            className="p-8 md:p-10 card-hover"
            style={{
              borderRadius: "16px",
              backgroundColor: "var(--color-surface)",
            }}
          >
            <span
              className="block font-display text-[48px] leading-none"
              style={{ color: "var(--color-primary)", opacity: 0.3 }}
              aria-hidden="true"
            >
              "
            </span>
            <p
              className="font-display text-lg md:text-xl font-medium -mt-4"
              style={{ color: "var(--color-text)", lineHeight: 1.7 }}
            >
              {TESTIMONIALS[0].quote}
            </p>
            <footer className="mt-5 flex items-center gap-2">
              <cite
                className="text-[12px] font-display font-semibold px-2.5 py-1 rounded-full not-italic"
                style={{
                  border: "1px solid var(--color-primary)",
                  color: "var(--color-primary)",
                }}
              >
                {TESTIMONIALS[0].source}
              </cite>
              <span className="text-[13px]" style={{ color: "var(--color-text-muted)" }}>
                · {TESTIMONIALS[0].school}
              </span>
            </footer>
          </blockquote>

          {/* Remaining testimonials — side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TESTIMONIALS.slice(1).map((t) => (
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
                  style={{ color: "var(--color-text)", lineHeight: 1.7 }}
                >
                  &ldquo;{t.quote}&rdquo;
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
      </div>
    </AnimatedSection>
  );
}
