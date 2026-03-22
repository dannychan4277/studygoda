import { sanitizeHtml } from "@/libs/utils";

export default function TestimonialQuote({ testimonial }) {
  return (
    <div
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
          __html: `「${sanitizeHtml(testimonial.quote)}」`,
        }}
      />
      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          — {testimonial.author}
        </span>
        {testimonial.source_url ? (
          <a
            href={testimonial.source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-display font-semibold px-2 py-0.5 rounded-full transition-colors"
            style={{
              backgroundColor: "var(--color-sunken)",
              color: "var(--color-text-secondary)",
            }}
          >
            {testimonial.source} →
          </a>
        ) : (
          <span
            className="text-xs font-display font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "var(--color-sunken)",
              color: "var(--color-text-secondary)",
            }}
          >
            {testimonial.source}
          </span>
        )}
      </div>
    </div>
  );
}
