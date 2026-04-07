import Link from "next/link";

export default function GuideCTA({ text, href, label }) {
  return (
    <div
      className="my-8 p-6 text-center not-prose"
      style={{
        backgroundColor: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-md)",
      }}
    >
      {label && (
        <p
          className="font-display font-semibold text-base mb-3"
          style={{ color: "var(--color-text)" }}
        >
          {label}
        </p>
      )}
      <Link
        href={href}
        className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-display font-medium text-sm"
        style={{
          backgroundColor: "var(--color-accent)",
          color: "white",
        }}
      >
        {text}
      </Link>
    </div>
  );
}
