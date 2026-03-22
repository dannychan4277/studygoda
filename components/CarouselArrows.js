"use client";

export default function CarouselArrows({ targetId }) {
  function scroll(direction) {
    const el = document.getElementById(targetId);
    if (!el) return;
    const scrollAmount = direction === "left" ? -400 : 400;
    el.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }

  return (
    <div className="hidden md:flex gap-2">
      <button
        onClick={() => scroll("left")}
        className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
        style={{
          border: "1px solid var(--color-border)",
          color: "var(--color-text-secondary)",
        }}
        aria-label="向左捲動"
      >
        ←
      </button>
      <button
        onClick={() => scroll("right")}
        className="w-10 h-10 flex items-center justify-center rounded-full transition-colors"
        style={{
          border: "1px solid var(--color-border)",
          color: "var(--color-text-secondary)",
        }}
        aria-label="向右捲動"
      >
        →
      </button>
    </div>
  );
}
