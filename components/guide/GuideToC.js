"use client";

import { useState, useEffect } from "react";

export default function GuideToC({ headings = [] }) {
  const [activeId, setActiveId] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px" }
    );

    for (const { id } of headings) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (!headings.length) return null;

  const tocList = (
    <ul className="space-y-1">
      {headings.map(({ id, text }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            onClick={() => setIsOpen(false)}
            className="block py-1.5 text-sm font-display transition-colors"
            style={{
              color: activeId === id ? "var(--color-primary)" : "var(--color-text-muted)",
              fontWeight: activeId === id ? 600 : 500,
              borderLeft: activeId === id ? "2px solid var(--color-primary)" : "2px solid transparent",
              paddingLeft: "12px",
            }}
          >
            {text}
          </a>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Mobile: collapsible panel */}
      <div className="md:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 w-full px-4 py-3 text-sm font-display font-medium"
          style={{
            backgroundColor: "var(--color-elevated)",
            border: "1px solid var(--color-border)",
            borderRadius: "var(--radius-md)",
            color: "var(--color-text)",
          }}
        >
          目錄
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 200ms ease-out",
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </button>
        <div
          style={{
            display: "grid",
            gridTemplateRows: isOpen ? "1fr" : "0fr",
            transition: "grid-template-rows 250ms ease-in-out",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <div
              className="px-4 py-3"
              style={{
                backgroundColor: "var(--color-elevated)",
                borderBottom: "1px solid var(--color-border)",
                borderLeft: "1px solid var(--color-border)",
                borderRight: "1px solid var(--color-border)",
                borderRadius: "0 0 var(--radius-md) var(--radius-md)",
              }}
            >
              {tocList}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop: sticky sidebar */}
      <aside
        className="hidden md:block"
        style={{
          position: "sticky",
          top: "80px",
          width: "200px",
          flexShrink: 0,
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
        }}
      >
        <p
          className="text-xs font-display font-semibold uppercase mb-3"
          style={{
            color: "var(--color-text-muted)",
            letterSpacing: "0.06em",
          }}
        >
          目錄
        </p>
        {tocList}
      </aside>
    </>
  );
}
