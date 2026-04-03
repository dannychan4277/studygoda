"use client";

import Link from "next/link";
import Image from "next/image";
import { getFeeColorClass, formatWeeklyTWD, formatUSD } from "@/libs/utils";
import { translateGoal } from "@/libs/labels";
export default function SchoolCard({ school }) {
  const fee = school.min_price_per_week;
  const feeClass = fee ? getFeeColorClass(fee) : "";

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
      <div className="relative w-full aspect-[3/2]">
        <Image
          src={school.photo_url || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"}
          alt={school.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-16"
          style={{
            background: "linear-gradient(transparent, rgba(0,0,0,0.25))",
          }}
        />
        {/* Tags overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {school.accommodation_types?.length > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-white rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
              {school.accommodation_types.includes("homestay") ? "住宿含" : "住宿另計"}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-white rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
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
                {formatUSD(fee)}/wk
              </span>
              <span className="text-[12px]" style={{ color: "var(--color-text-muted)" }}>
                ({formatWeeklyTWD(fee)})
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
