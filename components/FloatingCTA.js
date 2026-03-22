"use client";

export default function FloatingCTA() {
  return (
    <div
      className="fixed bottom-16 left-0 right-0 z-40 md:hidden px-4 pb-2"
    >
      <button
        onClick={() => {
          document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
        }}
        className="w-full py-3.5 rounded-full font-display font-semibold text-sm shadow-lg min-h-[44px]"
        style={{
          backgroundColor: "var(--color-accent)",
          color: "white",
          boxShadow: "0 4px 20px rgba(224,122,95,0.3)",
        }}
      >
        免費諮詢
      </button>
    </div>
  );
}
