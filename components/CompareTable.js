"use client";

import Image from "next/image";
import Link from "next/link";
import { getFeeColor, formatUSD, formatWeeklyTWD } from "@/libs/utils";
import config from "@/config";

const RATE = config.exchangeRate.usdToTwd;

function getMinIndex(values) {
  let min = Infinity;
  let idx = -1;
  values.forEach((v, i) => {
    if (v != null && v < min) {
      min = v;
      idx = i;
    }
  });
  return idx;
}

function getMaxIndex(values) {
  let max = -Infinity;
  let idx = -1;
  values.forEach((v, i) => {
    if (v != null && v > max) {
      max = v;
      idx = i;
    }
  });
  return idx;
}

export default function CompareTable({ programs, cityGuides }) {
  const guideMap = Object.fromEntries(
    (cityGuides || []).map((g) => [g.city, g])
  );

  const fees = programs.map((p) => p.weekly_fee_usd);
  const ratings = programs.map((p) => p.google_rating || 0);
  const lowestFeeIdx = getMinIndex(fees);
  const highestRatingIdx = getMaxIndex(ratings);

  const rows = [
    {
      label: "週費",
      render: (p, i) => (
        <div>
          <span
            className="font-mono font-semibold text-[22px]"
            style={{
              color:
                i === lowestFeeIdx
                  ? "var(--color-success)"
                  : getFeeColor(p.weekly_fee_usd),
            }}
          >
            {formatWeeklyTWD(p.weekly_fee_usd)}
          </span>
          {i === lowestFeeIdx && programs.length > 1 && (
            <span
              className="block text-[11px] font-semibold mt-1"
              style={{ color: "var(--color-success)" }}
            >
              最低價
            </span>
          )}
        </div>
      ),
    },
    {
      label: "Google 評分",
      render: (p, i) => (
        <span
          className="font-display font-semibold"
          style={{
            color:
              i === highestRatingIdx && programs.length > 1
                ? "var(--color-accent)"
                : "var(--color-text)",
          }}
        >
          ★ {p.google_rating || "—"}
          {i === highestRatingIdx && programs.length > 1 && (
            <span
              className="block text-[11px] font-semibold mt-1"
              style={{ color: "var(--color-accent)" }}
            >
              最高評分
            </span>
          )}
        </span>
      ),
    },
    {
      label: "課程類型",
      render: (p) => (
        <span style={{ color: "var(--color-text)" }}>
          {p.course_type || "—"}
        </span>
      ),
    },
    {
      label: "住宿",
      render: (p) => (
        <span style={{ color: "var(--color-text)" }}>
          {p.accommodation || "—"}
        </span>
      ),
    },
    {
      label: "設施",
      render: (p) => (
        <span
          className="text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {p.facilities?.join("、") || "—"}
        </span>
      ),
    },
    {
      label: "週數範圍",
      render: (p) => (
        <span style={{ color: "var(--color-text)" }}>
          {p.min_weeks}–{p.max_weeks} 週
        </span>
      ),
    },
    {
      label: "週生活費",
      render: (p) => {
        const guide = guideMap[p.city];
        if (!guide) return <span style={{ color: "var(--color-text-muted)" }}>N/A</span>;
        const weekly =
          (guide.weekly_food_usd || 0) +
          (guide.weekly_transport_usd || 0) +
          (guide.weekly_misc_usd || 0);
        return (
          <span className="font-mono" style={{ color: "var(--color-text)" }}>
            {formatWeeklyTWD(weekly)}
          </span>
        );
      },
    },
  ];

  return (
    <div>
      {/* Mobile scroll hint */}
      {programs.length > 1 && (
        <p
          className="text-xs mb-2 sm:hidden text-center"
          style={{ color: "var(--color-text-muted)" }}
        >
          ← 左右滑動比較 →
        </p>
      )}
      <div
        className="overflow-x-auto"
        style={{
          backgroundColor: "var(--color-elevated)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
        }}
      >
      <table className="w-full min-w-[640px]">
        <thead>
          <tr>
            {/* Label column */}
            <th
              className="sticky left-0 z-10 w-[140px] p-4"
              style={{
                backgroundColor: "var(--color-elevated)",
              }}
            />
            {programs.map((p) => (
              <th key={p.slug} className="p-4 text-left align-top" style={{ minWidth: 200 }}>
                {/* Photo */}
                <div className="relative w-full aspect-[16/10] mb-3 overflow-hidden" style={{ borderRadius: "var(--radius-md)" }}>
                  <Image
                    src={
                      p.photo_url ||
                      "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"
                    }
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="300px"
                  />
                </div>
                {/* Name + city */}
                <Link
                  href={`/program/${p.slug}`}
                  className="font-display font-bold text-base hover:underline block"
                  style={{ color: "var(--color-text)" }}
                >
                  {p.name}
                </Link>
                <span
                  className="text-xs"
                  style={{ color: "var(--color-text-muted)" }}
                >
                  📍 {config.cityNames[p.city] || p.city}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              style={{ borderTop: "1px solid var(--color-border)" }}
            >
              <td
                className="sticky left-0 z-10 p-4 font-display font-semibold text-sm"
                style={{
                  backgroundColor: "var(--color-elevated)",
                  color: "var(--color-text-secondary)",
                }}
              >
                {row.label}
              </td>
              {programs.map((p, i) => (
                <td key={p.slug} className="p-4">
                  {row.render(p, i)}
                </td>
              ))}
            </tr>
          ))}
          {/* CTA row */}
          <tr style={{ borderTop: "1px solid var(--color-border)" }}>
            <td
              className="sticky left-0 z-10 p-4"
              style={{ backgroundColor: "var(--color-elevated)" }}
            />
            {programs.map((p) => (
              <td key={p.slug} className="p-4">
                <Link
                  href={`/program/${p.slug}`}
                  className="inline-flex items-center px-4 py-2 font-display font-semibold text-sm min-h-[44px]"
                  style={{
                    borderRadius: "var(--radius-md)",
                    backgroundColor: "var(--color-accent)",
                    color: "white",
                  }}
                >
                  查看詳情
                </Link>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
      </div>
    </div>
  );
}
