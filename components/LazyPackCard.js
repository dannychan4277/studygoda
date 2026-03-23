"use client";

import Link from "next/link";
import Image from "next/image";
import { formatTWD, getFeeColor } from "@/libs/utils";

export default function LazyPackCard({ pack, variant = "default" }) {
  const programSlug = pack.program?.slug;
  const weeklyFee = pack.program?.weekly_fee_usd || 0;
  const feeColor = getFeeColor(weeklyFee);

  const content = (
    <>
      {/* Photo */}
      <div
        className={
          variant === "landscape"
            ? "relative w-full md:w-[40%] min-h-[200px] md:min-h-0"
            : "relative w-full aspect-[16/10]"
        }
      >
        <Image
          src={pack.photo_url || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"}
          alt={pack.title}
          fill
          className="object-cover"
          sizes={variant === "landscape" ? "(max-width: 768px) 100vw, 40vw" : "(max-width: 768px) 100vw, 33vw"}
        />
        {/* Tag badges */}
        {pack.tags?.length > 0 && (
          <div className="absolute top-3 right-3 flex gap-1.5">
            {pack.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[11px] font-display font-bold text-white rounded-full"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div
        className={
          variant === "landscape"
            ? "flex-1 p-5 flex flex-col justify-between"
            : "p-5"
        }
      >
        <div>
          <h3 className="font-display font-bold text-lg" style={{ color: "var(--color-text)" }}>
            {pack.title}
          </h3>
          <p className="mt-1 text-sm" style={{ color: "var(--color-text-secondary)" }}>
            {pack.description}
          </p>
        </div>
        <div className="mt-3 flex items-end justify-between">
          <span
            className="font-mono font-semibold"
            style={{ fontSize: variant === "landscape" ? "28px" : "22px", color: feeColor }}
          >
            {formatTWD(pack.price_twd)}
          </span>
          <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
            {pack.weeks} 週
          </span>
        </div>
      </div>
    </>
  );

  const className =
    variant === "landscape"
      ? "flex flex-col md:flex-row overflow-hidden transition-all cursor-pointer"
      : "overflow-hidden transition-all cursor-pointer";

  return (
    <Link
      href={programSlug ? `/program/${programSlug}` : "/packs"}
      className={`${className} card-hover`}
      style={{
        borderRadius: "16px",
        backgroundColor: "var(--color-elevated)",
      }}
    >
      {content}
    </Link>
  );
}
