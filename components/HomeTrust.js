import { getFeaturedTestimonials } from "@/libs/data/programs";
import { truncate, sanitizeHtml } from "@/libs/utils";
import AnimatedSection from "./AnimatedSection";

export default async function HomeTrust() {
  let testimonials = [];
  try {
    testimonials = (await getFeaturedTestimonials(4)) || [];
  } catch {
    // Show nothing
  }

  if (testimonials.length === 0) return null;

  return (
    <AnimatedSection
      className="py-12 md:py-16 px-6"
      style={{ backgroundColor: "var(--color-elevated)" }}
    >
      <div className="max-w-[1120px] mx-auto">
        <h2
          className="font-display font-extrabold text-2xl md:text-3xl mb-8"
          style={{ color: "var(--color-text)" }}
        >
          真實心得
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {testimonials.map((t, i) => (
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
                dangerouslySetInnerHTML={{
                  __html: `「${sanitizeHtml(truncate(t.quote, 120))}」`,
                }}
              />
              <div className="mt-3 flex items-center gap-2">
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
                {t.program && (
                  <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    · {t.program.name}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
