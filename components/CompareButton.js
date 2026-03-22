"use client";

import { useCompareList } from "@/libs/useCompareList";

export default function CompareButton({ slug, size = "sm" }) {
  const { has, toggle, isFull } = useCompareList();
  const isAdded = has(slug);
  const disabled = !isAdded && isFull;

  const isSm = size === "sm";

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) toggle(slug);
      }}
      disabled={disabled}
      className="font-display font-semibold transition-colors min-h-[44px]"
      style={{
        fontSize: isSm ? 11 : 14,
        padding: isSm ? "4px 10px" : "8px 16px",
        borderRadius: "var(--radius-full)",
        border: isAdded
          ? "1px solid var(--color-primary)"
          : "1px solid var(--color-border)",
        backgroundColor: isAdded ? "var(--color-primary)" : "transparent",
        color: isAdded ? "white" : disabled ? "var(--color-text-muted)" : "var(--color-text-secondary)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
      aria-pressed={isAdded}
      aria-label={isAdded ? "移除比較" : "加入比較"}
    >
      {isAdded ? "✓ 已加入比較" : "+ 比較"}
    </button>
  );
}
