"use client";

import config from "@/config";

export default function AffiliateBlock() {
  const items = [config.affiliates.esim, config.affiliates.insurance];

  return (
    <div
      className="p-5"
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <span
          className="text-[10px] font-display font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            backgroundColor: "var(--color-sunken)",
            color: "var(--color-text-muted)",
            letterSpacing: "0.06em",
          }}
        >
          Partner
        </span>
        <span
          className="text-xs font-display font-bold uppercase tracking-wider"
          style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}
        >
          你可能還需要
        </span>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <a
            key={item.name}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 rounded-md transition-colors"
            style={{ border: "1px solid var(--color-border)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "var(--color-elevated)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <div className="flex-1">
              <p className="font-display font-semibold text-sm" style={{ color: "var(--color-text)" }}>
                {item.name}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                {item.description}
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
                {item.price}
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
