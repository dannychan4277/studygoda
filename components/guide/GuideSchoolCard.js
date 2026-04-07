import Link from "next/link";

export default function GuideSchoolCard({ name, city, fee, href = "/schools" }) {
  return (
    <div
      className="my-6 p-5 not-prose"
      style={{
        backgroundColor: "var(--color-elevated)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
      }}
    >
      <p
        className="font-display font-bold text-base mb-1"
        style={{ color: "var(--color-text)" }}
      >
        {name}
      </p>
      <p className="text-sm mb-2" style={{ color: "var(--color-text-secondary)" }}>
        {city}
      </p>
      {fee && (
        <p
          className="font-mono font-semibold text-base mb-3"
          style={{ color: "var(--color-accent-dark, #C45E43)" }}
        >
          {fee}
        </p>
      )}
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-sm font-display font-medium"
        style={{ color: "var(--color-primary)" }}
      >
        查看學校
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </Link>
    </div>
  );
}
