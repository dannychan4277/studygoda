"use client";

import { useState, useEffect } from "react";

export default function GuideProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const handleScroll = () => {
      const article = document.querySelector("article");
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const scrolled = window.scrollY - articleTop;
      const pct = Math.min(1, Math.max(0, scrolled / (articleHeight - window.innerHeight)));
      setProgress(pct);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 50,
        backgroundColor: "var(--color-border)",
      }}
    >
      <div
        style={{
          height: "100%",
          backgroundColor: "var(--color-primary)",
          transformOrigin: "left",
          transform: `scaleX(${progress})`,
          transition: "transform 100ms ease-out",
        }}
      />
    </div>
  );
}
