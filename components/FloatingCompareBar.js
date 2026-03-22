"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCompareList } from "@/libs/useCompareList";

export default function FloatingCompareBar() {
  const { slugs, clear } = useCompareList();
  const show = slugs.length > 0;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-16 md:bottom-0 left-0 right-0 z-40 px-4 pb-3 md:pb-4"
        >
          <div
            className="max-w-[600px] mx-auto flex items-center justify-between gap-3 px-5 py-3 shadow-lg"
            style={{
              backgroundColor: "var(--color-elevated)",
              borderRadius: "var(--radius-lg)",
              border: "1px solid var(--color-border)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
            }}
          >
            <div className="flex items-center gap-3">
              <span
                className="font-display font-semibold text-sm"
                style={{ color: "var(--color-text)" }}
              >
                已選 {slugs.length}/3 間
              </span>
              <button
                onClick={clear}
                className="text-xs underline"
                style={{ color: "var(--color-text-muted)" }}
              >
                清除
              </button>
            </div>
            <Link
              href={`/compare?ids=${slugs.join(",")}`}
              className="px-5 py-2.5 font-display font-semibold text-sm min-h-[44px] flex items-center"
              style={{
                borderRadius: "var(--radius-md)",
                backgroundColor: "var(--color-accent)",
                color: "white",
              }}
            >
              比較
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
