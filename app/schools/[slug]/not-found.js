import Link from "next/link";

export default function SchoolNotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: "var(--color-surface)" }}
    >
      <div className="text-center">
        <div className="text-6xl mb-4" aria-hidden="true">
          🏫
        </div>
        <h1
          className="font-display font-extrabold text-2xl"
          style={{ color: "var(--color-text)" }}
        >
          找不到這間學校
        </h1>
        <p
          className="mt-2 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          這間學校可能已下架或網址有誤
        </p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link
            href="/schools"
            className="px-6 py-2.5 rounded-full font-display font-semibold text-sm min-h-[44px] flex items-center"
            style={{ backgroundColor: "var(--color-accent)", color: "white" }}
          >
            搜尋學校
          </Link>
          <Link
            href="/"
            className="px-6 py-2.5 rounded-full font-display font-semibold text-sm min-h-[44px] flex items-center"
            style={{
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            回首頁
          </Link>
        </div>
      </div>
    </div>
  );
}
