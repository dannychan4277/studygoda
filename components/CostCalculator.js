"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import config from "@/config";
import { getFeeColor, formatUSD, formatTWD } from "@/libs/utils";

const RATE = config.exchangeRate.usdToTwd;

function usdToTwd(usd) {
  return Math.round(usd * RATE);
}

export default function CostCalculator({ programs, cityGuides }) {
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedSlug, setSelectedSlug] = useState("");
  const [weeks, setWeeks] = useState(4);

  // City filter → scoped programs
  const filteredPrograms = useMemo(
    () =>
      selectedCity
        ? programs.filter((p) => p.city === selectedCity)
        : programs,
    [programs, selectedCity]
  );

  // Selected program
  const program = useMemo(
    () => programs.find((p) => p.slug === selectedSlug) || null,
    [programs, selectedSlug]
  );

  // City guide for selected program
  const cityGuide = useMemo(
    () =>
      program
        ? cityGuides.find((cg) => cg.city === program.city) || null
        : null,
    [program, cityGuides]
  );

  // Weeks slider range based on school constraints
  const minWeeks = program?.min_weeks || 1;
  const maxWeeks = program?.max_weeks || 24;

  // Clamp weeks when program changes
  const effectiveWeeks = Math.min(Math.max(weeks, minWeeks), maxWeeks);

  // Cost calculations
  const tuitionUsd = program ? program.weekly_fee_usd * effectiveWeeks : 0;
  const hasLivingCost = cityGuide && (cityGuide.weekly_food_usd || cityGuide.weekly_transport_usd || cityGuide.weekly_misc_usd);
  const livingCostWeekly = hasLivingCost
    ? (cityGuide.weekly_food_usd || 0) +
      (cityGuide.weekly_transport_usd || 0) +
      (cityGuide.weekly_misc_usd || 0)
    : 0;
  const livingCostUsd = livingCostWeekly * effectiveWeeks;

  const flightTwdMin = cityGuide?.flight_twd_min || 4000;
  const flightTwdMax = cityGuide?.flight_twd_max || 8000;
  const flightTwdAvg = Math.round((flightTwdMin + flightTwdMax) / 2);
  const flightUsd = Math.round(flightTwdAvg / RATE);

  const totalUsd = tuitionUsd + (hasLivingCost ? livingCostUsd : 0) + flightUsd;
  const weeklyFee = program?.weekly_fee_usd || 0;
  const feeColor = program ? getFeeColor(weeklyFee) : null;

  // Reset slug when city changes
  function handleCityChange(city) {
    setSelectedCity(city);
    setSelectedSlug("");
  }

  function handleProgramChange(slug) {
    setSelectedSlug(slug);
    // Reset weeks to school's min if current is out of range
    const p = programs.find((pr) => pr.slug === slug);
    if (p) {
      const min = p.min_weeks || 1;
      const max = p.max_weeks || 24;
      if (weeks < min) setWeeks(min);
      else if (weeks > max) setWeeks(max);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Left: Selectors */}
      <div
        className="p-6"
        style={{
          backgroundColor: "var(--color-elevated)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* City filter */}
        <label className="block mb-6">
          <span
            className="font-display font-semibold text-sm block mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            城市
          </span>
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full px-4 py-3 text-base"
            style={{
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-elevated)",
              color: "var(--color-text)",
            }}
          >
            <option value="">全部城市</option>
            {config.cities.map((city) => (
              <option key={city} value={city}>
                {config.cityNames[city]}
              </option>
            ))}
          </select>
        </label>

        {/* School dropdown */}
        <label className="block mb-6">
          <span
            className="font-display font-semibold text-sm block mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            學校
          </span>
          <select
            value={selectedSlug}
            onChange={(e) => handleProgramChange(e.target.value)}
            className="w-full px-4 py-3 text-base"
            style={{
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--color-border)",
              backgroundColor: "var(--color-elevated)",
              color: "var(--color-text)",
            }}
          >
            <option value="">選擇學校</option>
            {filteredPrograms.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name} — {config.cityNames[p.city] || p.city}
              </option>
            ))}
          </select>
        </label>

        {/* Weeks slider */}
        <label className="block">
          <span
            className="font-display font-semibold text-sm block mb-2"
            style={{ color: "var(--color-text-secondary)" }}
          >
            週數
          </span>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={minWeeks}
              max={maxWeeks}
              value={effectiveWeeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="flex-1"
              style={{ accentColor: "var(--color-primary)" }}
            />
            <span
              className="font-mono font-semibold text-lg min-w-[3rem] text-right"
              style={{ color: "var(--color-text)" }}
            >
              {effectiveWeeks}週
            </span>
          </div>
          <div
            className="flex justify-between mt-1 text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span>{minWeeks}週</span>
            <span>{maxWeeks}週</span>
          </div>
        </label>
      </div>

      {/* Right: Cost breakdown */}
      <div
        className="p-6"
        style={{
          backgroundColor: "var(--color-elevated)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
        }}
      >
        {!program ? (
          <div
            className="flex items-center justify-center h-full text-center py-12"
            style={{ color: "var(--color-text-muted)" }}
          >
            <p className="text-base">
              選擇學校後即時顯示費用拆解
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h2
              className="font-display font-bold text-lg mb-6"
              style={{ color: "var(--color-text)" }}
            >
              {program.name} · {effectiveWeeks}週費用拆解
            </h2>

            <div className="space-y-4">
              {/* Tuition */}
              <CostRow
                label="學費"
                sublabel={`${formatUSD(program.weekly_fee_usd)}/週 × ${effectiveWeeks}週`}
                usd={tuitionUsd}
              />

              {/* Living costs */}
              <CostRow
                label="生活費"
                sublabel={
                  hasLivingCost
                    ? `${formatUSD(livingCostWeekly)}/週 × ${effectiveWeeks}週`
                    : "此城市暫無資料"
                }
                usd={hasLivingCost ? livingCostUsd : null}
              />

              {/* Flight */}
              <CostRow
                label="機票（來回）"
                sublabel={`${formatTWD(flightTwdMin)} – ${formatTWD(flightTwdMax)}`}
                usd={flightUsd}
                note="估算取中位數"
              />

              {/* Divider */}
              <div
                className="border-t pt-4 mt-4"
                style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex items-baseline justify-between">
                  <span
                    className="font-display font-bold text-base"
                    style={{ color: "var(--color-text)" }}
                  >
                    預估總費用
                  </span>
                  <div className="text-right">
                    <span
                      className="font-mono font-semibold text-[28px] block"
                      style={{ color: feeColor }}
                    >
                      {formatUSD(totalUsd)}
                    </span>
                    <span
                      className="font-mono text-sm"
                      style={{ color: "var(--color-text-secondary)" }}
                    >
                      ≈ {formatTWD(usdToTwd(totalUsd))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <p
              className="mt-4 text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              {config.exchangeRate.disclaimer}：1 USD ≈ {RATE} TWD（{config.exchangeRate.updatedAt} 更新）
            </p>

            {/* CTAs */}
            <div className="flex gap-3 mt-6">
              <Link
                href={`/program/${program.slug}`}
                className="flex-1 text-center py-3 font-display font-semibold text-sm min-h-[44px] flex items-center justify-center"
                style={{
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-primary)",
                  color: "var(--color-primary)",
                }}
              >
                查看學校詳情
              </Link>
              <Link
                href={`/program/${program.slug}#lead-form`}
                className="flex-1 text-center py-3 font-display font-semibold text-sm min-h-[44px] flex items-center justify-center"
                style={{
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--color-accent)",
                  color: "white",
                }}
              >
                免費諮詢
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function CostRow({ label, sublabel, usd, note }) {
  return (
    <div className="flex items-start justify-between">
      <div>
        <span
          className="font-display font-semibold text-sm block"
          style={{ color: "var(--color-text)" }}
        >
          {label}
        </span>
        <span
          className="text-xs"
          style={{ color: "var(--color-text-muted)" }}
        >
          {sublabel}
        </span>
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        {usd !== null ? (
          <>
            <span className="font-mono font-semibold text-base block" style={{ color: "var(--color-text)" }}>
              {formatUSD(usd)}
            </span>
            <span className="font-mono text-xs" style={{ color: "var(--color-text-muted)" }}>
              ≈ {formatTWD(usdToTwd(usd))}
            </span>
            {note && (
              <span className="block text-[10px]" style={{ color: "var(--color-text-muted)" }}>
                {note}
              </span>
            )}
          </>
        ) : (
          <span className="font-mono text-sm" style={{ color: "var(--color-text-muted)" }}>
            N/A
          </span>
        )}
      </div>
    </div>
  );
}
