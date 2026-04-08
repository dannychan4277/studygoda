"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { getFeeColorClass, formatWeeklyTWD, formatUSD } from "@/libs/utils";
import { translateGoal } from "@/libs/labels";

const PLACEHOLDER_GRADIENTS = [
  "linear-gradient(135deg, #1A6B5A 0%, #238C75 50%, #2DB892 100%)",
  "linear-gradient(135deg, #0F4D3F 0%, #1A6B5A 50%, #238C75 100%)",
  "linear-gradient(135deg, #2D6B8B 0%, #1A6B5A 50%, #238C75 100%)",
  "linear-gradient(135deg, #1A6B5A 0%, #2D8B55 50%, #238C75 100%)",
];

function getPlaceholderGradient(name) {
  const idx = (name || "").charCodeAt(0) % PLACEHOLDER_GRADIENTS.length;
  return PLACEHOLDER_GRADIENTS[idx];
}

export default function SchoolCard({ school }) {
  const fee = school.min_price_per_week;
  const feeClass = fee ? getFeeColorClass(fee) : "";
  const [imgError, setImgError] = useState(false);
  const hasPhoto = school.photo_url && !imgError;

  return (
    <Link
      href={`/schools/${school.slug}`}
      className="block overflow-hidden card-hover"
      style={{
        borderRadius: "16px",
        backgroundColor: "var(--color-elevated)",
      }}
    >
      {/* Photo */}
      <div className="relative w-full aspect-[3/2] overflow-hidden">
        {hasPhoto ? (
          <>
            <Image
              src={school.photo_url}
              alt={school.name}
              fill
              className="object-cover school-card-img"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImgError(true)}
            />
            {/* Warm tint overlay for visual consistency */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(180deg, rgba(26,26,46,0.03) 0%, rgba(26,26,46,0.06) 100%)",
                mixBlendMode: "multiply",
              }}
            />
          </>
        ) : (
          /* Gradient placeholder with school initial */
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: getPlaceholderGradient(school.name) }}
          >
            <span
              className="font-display font-bold text-white/30"
              style={{ fontSize: "64px" }}
            >
              {(school.name || "S").charAt(0)}
            </span>
          </div>
        )}
        {/* Bottom gradient — stronger for text contrast */}
        <div
          className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
          style={{
            background: "linear-gradient(transparent, rgba(26,26,46,0.35))",
          }}
        />
        {/* Tags overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {school.accommodation_types?.length > 0 && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-white rounded-full"
              style={{
                backgroundColor: "rgba(26,26,46,0.55)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              {school.accommodation_types.includes("homestay") ? "住宿含" : "住宿另計"}
            </span>
          )}
          <span
            className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-white rounded-full"
            style={{
              backgroundColor: "rgba(26,26,46,0.55)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {school.city}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-2">
          <h3 className="font-display font-bold text-base truncate" style={{ color: "var(--color-text)" }}>
            {school.name}
          </h3>
        </div>
        {school.brand && (
          <p className="text-[11px] mt-0.5" style={{ color: "var(--color-text-muted)" }}>
            {school.brand}
          </p>
        )}

        <div className="mt-2 flex items-baseline gap-2">
          {fee ? (
            <>
              <span className={`font-mono font-semibold text-[22px] ${feeClass}`}>
                {formatWeeklyTWD(fee)}
              </span>
              <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
                ({formatUSD(fee)}/wk)
              </span>
            </>
          ) : (
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              Price unavailable
            </span>
          )}
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-xs flex-wrap" style={{ color: "var(--color-text-muted)" }}>
          {school.course_types?.slice(0, 2).map((ct, i) => (
            <span key={ct}>
              {i > 0 && " · "}{translateGoal(ct)}
            </span>
          ))}
          {school.duration_range && (
            <>
              <span>·</span>
              <span>{school.duration_range} wks</span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
