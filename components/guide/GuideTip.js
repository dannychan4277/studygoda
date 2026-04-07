const TYPES = {
  info: {
    color: "var(--color-info, #2D6B8B)",
    bg: "rgba(45, 107, 139, 0.08)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  },
  warning: {
    color: "var(--color-warning, #D4930D)",
    bg: "rgba(212, 147, 13, 0.08)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
  },
  success: {
    color: "var(--color-success, #2D8B55)",
    bg: "rgba(45, 139, 85, 0.08)",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
  },
};

export default function GuideTip({ type = "info", children }) {
  const config = TYPES[type] || TYPES.info;

  return (
    <div
      className="my-6 not-prose flex gap-3 p-4"
      style={{
        backgroundColor: config.bg,
        borderLeft: `3px solid ${config.color}`,
        borderRadius: "0 var(--radius-sm, 6px) var(--radius-sm, 6px) 0",
      }}
    >
      <div className="flex-shrink-0 mt-0.5" style={{ color: config.color }}>
        {config.icon}
      </div>
      <div className="text-sm leading-relaxed" style={{ color: "var(--color-text)" }}>
        {children}
      </div>
    </div>
  );
}
