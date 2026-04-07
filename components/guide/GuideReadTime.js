export default function GuideReadTime({ minutes }) {
  return (
    <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
      閱讀時間：{minutes} 分鐘
    </span>
  );
}
