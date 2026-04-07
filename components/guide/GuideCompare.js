export default function GuideCompare({ headers = [], rows = [] }) {
  if (!headers.length || !rows.length) return null;

  return (
    <div className="my-6 overflow-x-auto not-prose" style={{ borderRadius: "var(--radius-md)", border: "1px solid var(--color-border)" }}>
      <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "var(--color-elevated)" }}>
            {headers.map((h, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-display font-semibold"
                style={{
                  color: "var(--color-text)",
                  borderBottom: "1px solid var(--color-border)",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              style={{
                backgroundColor: ri % 2 === 0 ? "transparent" : "var(--color-surface)",
              }}
            >
              {row.map((cell, ci) => (
                <td
                  key={ci}
                  className={`px-4 py-3 ${/[\d$,US]/.test(cell) ? "font-mono" : ""}`}
                  style={{
                    color: "var(--color-text)",
                    borderBottom: ri < rows.length - 1 ? "1px solid var(--color-border)" : "none",
                  }}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
