"use client";

import Link from "next/link";
import Image from "next/image";
import { getFeeColorClass, formatUSD } from "@/libs/utils";

export default function ProgramCard({ program }) {
  const feeClass = getFeeColorClass(program.weekly_fee_usd);

  return (
    <Link
      href={`/program/${program.slug}`}
      className="block overflow-hidden transition-all"
      style={{
        borderRadius: "var(--radius-md)",
        backgroundColor: "var(--color-elevated)",
        border: "1px solid var(--color-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px) scale(1.02)";
        e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      {/* Photo */}
      <div className="relative w-full aspect-[16/10]">
        <Image
          src={program.photo_url || "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800"}
          alt={program.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {/* Bottom gradient for text readability */}
        <div
          className="absolute inset-x-0 bottom-0 h-16"
          style={{
            background: "linear-gradient(transparent, rgba(0,0,0,0.25))",
          }}
        />
        {/* Tags overlay */}
        <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
          {program.google_rating > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-white rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
              ★ {program.google_rating}
            </span>
          )}
          {program.accommodation && (
            <span className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-white rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
              🏠 {program.accommodation.includes("含") ? "住宿含" : "住宿另計"}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-white rounded-full" style={{ backgroundColor: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }}>
            📍 {program.city}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display font-bold text-base" style={{ color: "var(--color-text)" }}>
          {program.name}
        </h3>

        <div className="mt-2 flex items-baseline gap-2">
          <span className={`font-mono font-semibold text-[22px] ${feeClass}`}>
            {formatUSD(program.weekly_fee_usd)}/週
          </span>
        </div>

        <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <span>{program.course_type}</span>
          <span>·</span>
          <span>{program.min_weeks}-{program.max_weeks} 週</span>
        </div>
      </div>
    </Link>
  );
}
