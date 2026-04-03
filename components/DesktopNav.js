"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_LINKS = [
  { label: "搜尋學校", href: "/schools" },
  { label: "配對測驗", href: "/quiz" },
  { label: "費用計算", href: "/calculator" },
  { label: "遊學攻略", href: "/guides" },
];

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav
      className="hidden md:flex items-center justify-between sticky top-0 z-50 px-6"
      style={{
        height: "64px",
        backgroundColor: "var(--color-elevated)",
        borderBottom: "1px solid var(--color-border)",
      }}
      role="navigation"
      aria-label="桌面版導覽"
    >
      <div className="flex items-center gap-10 max-w-[1120px] mx-auto w-full">
        {/* Brand */}
        <Link
          href="/"
          className="font-display font-bold text-xl flex-shrink-0"
          style={{ color: "var(--color-primary)" }}
        >
          StudyGoda
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className="font-display font-semibold text-sm transition-colors"
                style={{
                  color: isActive
                    ? "var(--color-text)"
                    : "var(--color-text-secondary)",
                }}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          href="/contact"
          className="ml-auto font-display font-semibold text-sm text-white flex-shrink-0"
          style={{
            backgroundColor: "var(--color-accent)",
            borderRadius: "9999px",
            padding: "10px 20px",
          }}
        >
          免費諮詢
        </Link>
      </div>
    </nav>
  );
}
