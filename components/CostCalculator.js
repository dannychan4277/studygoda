"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import config from "@/config";
import { supabase } from "@/libs/supabase";
import { getFeeColor, formatUSD, formatTWD } from "@/libs/utils";

// ─── Constants ───────────────────────────────────────────────────────────────
const WEEKS_PER_MONTH = 4.33;
const FALLBACK_RATE = config.exchangeRate.usdToTwd;

const ACCOMMODATION_TYPES = [
  { key: "homestay", label: "寄宿家庭" },
  { key: "single", label: "單人租房" },
  { key: "shared", label: "合租" },
];

// ─── Main Component ──────────────────────────────────────────────────────────
export default function CostCalculator() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ── Exchange rate state ──────────────────────────────────────────────────
  const [exchangeRate, setExchangeRate] = useState(FALLBACK_RATE);
  const [rateUpdatedAt, setRateUpdatedAt] = useState(config.exchangeRate.updatedAt);

  // ── Data from DB ─────────────────────────────────────────────────────────
  const [cities, setCities] = useState([]);
  const [schools, setSchools] = useState([]);
  const [courses, setCourses] = useState([]);

  // ── Selection state ──────────────────────────────────────────────────────
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get("country") || "");
  const [selectedCity, setSelectedCity] = useState(searchParams.get("city") || "");
  const [selectedSchool, setSelectedSchool] = useState(searchParams.get("school") || "");
  const [selectedCourse, setSelectedCourse] = useState(searchParams.get("course") || "");
  const [weeks, setWeeks] = useState(Number(searchParams.get("weeks")) || 4);
  const [accomType, setAccomType] = useState(searchParams.get("accom") || "shared");

  // ── Loading states ───────────────────────────────────────────────────────
  const [loadingCities, setLoadingCities] = useState(true);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);

  // ── Fetch exchange rate on mount ─────────────────────────────────────────
  useEffect(() => {
    if (!supabase) return;
    supabase
      .from("exchange_rates")
      .select("*")
      .eq("base_currency", "USD")
      .eq("target_currency", "TWD")
      .single()
      .then(({ data }) => {
        if (data) {
          setExchangeRate(Number(data.rate));
          setRateUpdatedAt(data.updated_at);
        }
      })
      .catch(() => {});
  }, []);

  // ── Fetch cities on mount ────────────────────────────────────────────────
  useEffect(() => {
    if (!supabase) { setLoadingCities(false); return; }
    supabase
      .from("cities")
      .select("*")
      .order("name")
      .then(({ data }) => {
        setCities(data || []);
        setLoadingCities(false);
      })
      .catch(() => setLoadingCities(false));
  }, []);

  // ── Derived: countries from cities ───────────────────────────────────────
  const countryOptions = useMemo(() => {
    const set = new Set(cities.map((c) => c.country));
    return [...set].sort();
  }, [cities]);

  // ── Derived: cities filtered by country ──────────────────────────────────
  const filteredCities = useMemo(
    () => (selectedCountry ? cities.filter((c) => c.country === selectedCountry) : []),
    [cities, selectedCountry]
  );

  // ── Fetch schools when city changes ──────────────────────────────────────
  useEffect(() => {
    if (!selectedCity || !supabase) { setSchools([]); return; }
    setLoadingSchools(true);
    supabase
      .from("schools")
      .select("id, slug, name, city, country, brand")
      .eq("city", selectedCity)
      .order("name")
      .then(({ data }) => {
        setSchools(data || []);
        setLoadingSchools(false);
      })
      .catch(() => { setSchools([]); setLoadingSchools(false); });
  }, [selectedCity]);

  // ── Fetch courses when school changes ────────────────────────────────────
  useEffect(() => {
    if (!selectedSchool || !supabase) { setCourses([]); return; }
    const school = schools.find((s) => s.slug === selectedSchool);
    if (!school) { setCourses([]); return; }
    setLoadingCourses(true);
    supabase
      .from("courses")
      .select("*")
      .eq("school_id", school.id)
      .order("name")
      .then(({ data }) => {
        setCourses(data || []);
        setLoadingCourses(false);
      })
      .catch(() => { setCourses([]); setLoadingCourses(false); });
  }, [selectedSchool, schools]);

  // ── Selected objects ─────────────────────────────────────────────────────
  const cityData = useMemo(
    () => cities.find((c) => c.name === selectedCity) || null,
    [cities, selectedCity]
  );

  const schoolData = useMemo(
    () => schools.find((s) => s.slug === selectedSchool) || null,
    [schools, selectedSchool]
  );

  const courseData = useMemo(
    () => courses.find((c) => String(c.id) === selectedCourse) || null,
    [courses, selectedCourse]
  );

  // ── Weeks clamping ──────────────────────────────────────────────────────
  const minWeeks = courseData?.min_weeks || 1;
  const maxWeeks = courseData?.max_weeks || 52;
  const effectiveWeeks = Math.min(Math.max(weeks, minWeeks), maxWeeks);

  // ── Conversion helper ────────────────────────────────────────────────────
  const usdToTwd = useCallback((usd) => Math.round(usd * exchangeRate), [exchangeRate]);
  const twdToUsd = useCallback((twd) => Math.round(twd / exchangeRate), [exchangeRate]);

  // ── 4.2 Tuition ─────────────────────────────────────────────────────────
  const tuitionPerWeek = courseData?.price_per_week_usd || 0;
  const registrationFee = courseData?.registration_fee || 0;
  const materialFee = courseData?.material_fee || 0;
  const tuitionBase = tuitionPerWeek * effectiveWeeks;
  const tuitionTotal = tuitionBase + registrationFee + materialFee;

  // ── 4.3 Accommodation ───────────────────────────────────────────────────
  const accomWeekly = useMemo(() => {
    if (!cityData) return 0;
    switch (accomType) {
      case "homestay":
        return cityData.homestay_weekly || 0;
      case "single":
        return (cityData.monthly_rent_single || 0) / WEEKS_PER_MONTH;
      case "shared":
        return (cityData.monthly_rent_shared || 0) / WEEKS_PER_MONTH;
      default:
        return 0;
    }
  }, [cityData, accomType]);
  const accomTotal = accomWeekly * effectiveWeeks;

  // ── 4.4 Living expenses ─────────────────────────────────────────────────
  const monthlyFood = cityData?.monthly_food || 0;
  const monthlyTransport = cityData?.monthly_transport || 0;
  const monthlyMisc = cityData?.monthly_misc || 0;
  const livingMonthly = monthlyFood + monthlyTransport + monthlyMisc;
  const livingTotal = livingMonthly * (effectiveWeeks / WEEKS_PER_MONTH);

  // ── 4.5 Additional costs ────────────────────────────────────────────────
  const insuranceMonthly = cityData?.monthly_insurance || 0;
  const insuranceTotal = insuranceMonthly * (effectiveWeeks / WEEKS_PER_MONTH);

  const flightTwdMin = cityData?.flight_twd_min || 0;
  const flightTwdMax = cityData?.flight_twd_max || 0;
  const flightTwdAvg = Math.round((flightTwdMin + flightTwdMax) / 2);
  const flightUsd = twdToUsd(flightTwdAvg);

  const visaFee = cityData?.visa_fee_local || 0;
  const visaType = cityData?.visa_type || "";
  const visaNote = cityData?.visa_note || "";
  // Visa fee might be in local currency — convert to USD if needed
  const visaCurrency = cityData?.local_currency || "USD";
  const visaUsd = visaCurrency === "USD" ? visaFee : twdToUsd(visaFee);

  // ── Grand total ─────────────────────────────────────────────────────────
  const grandTotalUsd = tuitionTotal + accomTotal + livingTotal + insuranceTotal + flightUsd + visaUsd;

  // ── 4.7 Proportional bar segments ───────────────────────────────────────
  const segments = useMemo(() => {
    if (!courseData) return [];
    const items = [
      { label: "學費", value: tuitionTotal, color: "var(--color-primary)" },
      { label: "住宿", value: accomTotal, color: "#2D6B8B" },
      { label: "生活費", value: livingTotal, color: "#D4930D" },
      { label: "保險", value: insuranceTotal, color: "#8A8A9A" },
      { label: "機票", value: flightUsd, color: "var(--color-accent)" },
      { label: "簽證", value: visaUsd, color: "#5A5A6E" },
    ].filter((s) => s.value > 0);
    const total = items.reduce((sum, s) => sum + s.value, 0);
    return items.map((s) => ({ ...s, pct: total > 0 ? (s.value / total) * 100 : 0 }));
  }, [courseData, tuitionTotal, accomTotal, livingTotal, insuranceTotal, flightUsd, visaUsd]);

  // ── 4.8 Share URL sync ──────────────────────────────────────────────────
  useEffect(() => {
    if (!courseData) return;
    const params = new URLSearchParams();
    if (selectedCountry) params.set("country", selectedCountry);
    if (selectedCity) params.set("city", selectedCity);
    if (selectedSchool) params.set("school", selectedSchool);
    if (selectedCourse) params.set("course", selectedCourse);
    params.set("weeks", String(effectiveWeeks));
    params.set("accom", accomType);
    const newUrl = `/calculator?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [selectedCountry, selectedCity, selectedSchool, selectedCourse, effectiveWeeks, accomType, courseData, router]);

  // ── Cascade handlers ─────────────────────────────────────────────────────
  function handleCountryChange(val) {
    setSelectedCountry(val);
    setSelectedCity("");
    setSelectedSchool("");
    setSelectedCourse("");
  }

  function handleCityChange(val) {
    setSelectedCity(val);
    setSelectedSchool("");
    setSelectedCourse("");
  }

  function handleSchoolChange(val) {
    setSelectedSchool(val);
    setSelectedCourse("");
  }

  function handleCourseChange(val) {
    setSelectedCourse(val);
    const course = courses.find((c) => String(c.id) === val);
    if (course) {
      const min = course.min_weeks || 1;
      const max = course.max_weeks || 52;
      if (weeks < min) setWeeks(min);
      else if (weeks > max) setWeeks(max);
    }
  }

  // ── Fee color ────────────────────────────────────────────────────────────
  const feeColor = courseData ? getFeeColor(tuitionPerWeek) : null;

  // ── Copy share link ─────────────────────────────────────────────────────
  const [copied, setCopied] = useState(false);
  function handleCopyLink() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  // ── Render ──────────────────────────────────────────────────────────────
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* ── Left: Selectors ────────────────────────────────────────────── */}
      <div
        className="p-6"
        style={{
          backgroundColor: "var(--color-elevated)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
        }}
      >
        {/* Country */}
        <SelectorLabel label="國家">
          <select
            value={selectedCountry}
            onChange={(e) => handleCountryChange(e.target.value)}
            className="w-full px-4 py-3 text-base"
            style={selectStyle}
            disabled={loadingCities}
          >
            <option value="">選擇國家</option>
            {countryOptions.map((c) => (
              <option key={c} value={c}>
                {config.countryFlags[c] || ""} {config.countryNames[c] || c}
              </option>
            ))}
          </select>
        </SelectorLabel>

        {/* City */}
        <SelectorLabel label="城市">
          <select
            value={selectedCity}
            onChange={(e) => handleCityChange(e.target.value)}
            className="w-full px-4 py-3 text-base"
            style={selectStyle}
            disabled={!selectedCountry}
          >
            <option value="">{selectedCountry ? "選擇城市" : "先選國家"}</option>
            {filteredCities.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name_zh || c.name}
              </option>
            ))}
          </select>
        </SelectorLabel>

        {/* School */}
        <SelectorLabel label="學校">
          <select
            value={selectedSchool}
            onChange={(e) => handleSchoolChange(e.target.value)}
            className="w-full px-4 py-3 text-base"
            style={selectStyle}
            disabled={!selectedCity || loadingSchools}
          >
            <option value="">
              {loadingSchools ? "載入中..." : !selectedCity ? "先選城市" : "選擇學校"}
            </option>
            {schools.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
        </SelectorLabel>

        {/* Course */}
        <SelectorLabel label="課程">
          <select
            value={selectedCourse}
            onChange={(e) => handleCourseChange(e.target.value)}
            className="w-full px-4 py-3 text-base"
            style={selectStyle}
            disabled={!selectedSchool || loadingCourses}
          >
            <option value="">
              {loadingCourses ? "載入中..." : !selectedSchool ? "先選學校" : "選擇課程"}
            </option>
            {courses.map((c) => (
              <option key={c.id} value={String(c.id)}>
                {c.name} — {formatUSD(c.price_per_week_usd)}/週
              </option>
            ))}
          </select>
        </SelectorLabel>

        {/* Weeks slider */}
        <SelectorLabel label="週數" noMargin>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={minWeeks}
              max={maxWeeks}
              value={effectiveWeeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="flex-1 accent-[var(--color-primary)]"
              disabled={!courseData}
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
        </SelectorLabel>

        {/* 4.3 Accommodation type */}
        {cityData && (
          <div className="mt-6">
            <span
              className="font-display font-semibold text-sm block mb-2"
              style={{ color: "var(--color-text-secondary)" }}
            >
              住宿類型
            </span>
            <div className="flex gap-2">
              {ACCOMMODATION_TYPES.map((t) => {
                const isActive = accomType === t.key;
                return (
                  <button
                    key={t.key}
                    onClick={() => setAccomType(t.key)}
                    className="flex-1 py-2 px-3 text-sm font-display font-semibold transition-colors duration-150"
                    style={{
                      borderRadius: "var(--radius-sm)",
                      border: `1.5px solid ${isActive ? "var(--color-primary)" : "var(--color-border)"}`,
                      backgroundColor: isActive ? "var(--color-primary)" : "transparent",
                      color: isActive ? "#fff" : "var(--color-text-secondary)",
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
            {accomType === "homestay" && cityData.homestay_includes && (
              <p className="text-xs mt-2" style={{ color: "var(--color-text-muted)" }}>
                含：{cityData.homestay_includes}
              </p>
            )}
          </div>
        )}
      </div>

      {/* ── Right: Cost breakdown ──────────────────────────────────────── */}
      <div
        className="p-6"
        style={{
          backgroundColor: "var(--color-elevated)",
          borderRadius: "var(--radius-lg)",
          border: "1px solid var(--color-border)",
        }}
      >
        {!courseData ? (
          <div
            className="flex items-center justify-center h-full text-center py-12"
            style={{ color: "var(--color-text-muted)" }}
          >
            <p className="text-base">
              依序選擇國家、城市、學校、課程後<br />即時顯示費用拆解
            </p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={`${selectedCourse}-${effectiveWeeks}-${accomType}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <h2
                className="font-display font-bold text-lg mb-6"
                style={{ color: "var(--color-text)" }}
              >
                {courseData.name} · {effectiveWeeks}週費用拆解
              </h2>

              <div className="space-y-4">
                {/* ── 4.2 Tuition line items ──────────────────────────── */}
                <SectionHeader label="學費" />
                <CostRow
                  label="課程學費"
                  sublabel={`${formatUSD(tuitionPerWeek)}/週 × ${effectiveWeeks}週`}
                  usd={tuitionBase}
                  rate={exchangeRate}
                />
                {registrationFee > 0 && (
                  <CostRow
                    label="註冊費"
                    sublabel="一次性"
                    usd={registrationFee}
                    rate={exchangeRate}
                  />
                )}
                {materialFee > 0 && (
                  <CostRow
                    label="教材費"
                    sublabel="一次性"
                    usd={materialFee}
                    rate={exchangeRate}
                  />
                )}

                <Divider />

                {/* ── 4.3 Accommodation ───────────────────────────────── */}
                <SectionHeader label="住宿" />
                <CostRow
                  label={ACCOMMODATION_TYPES.find((t) => t.key === accomType)?.label || "住宿"}
                  sublabel={`${formatUSD(Math.round(accomWeekly))}/週 × ${effectiveWeeks}週`}
                  usd={accomTotal}
                  rate={exchangeRate}
                />

                <Divider />

                {/* ── 4.4 Living expenses ─────────────────────────────── */}
                <SectionHeader label="生活費" />
                {monthlyFood > 0 && (
                  <CostRow
                    label="飲食"
                    sublabel={`${formatUSD(monthlyFood)}/月`}
                    usd={monthlyFood * (effectiveWeeks / WEEKS_PER_MONTH)}
                    rate={exchangeRate}
                  />
                )}
                {monthlyTransport > 0 && (
                  <CostRow
                    label="交通"
                    sublabel={`${formatUSD(monthlyTransport)}/月`}
                    usd={monthlyTransport * (effectiveWeeks / WEEKS_PER_MONTH)}
                    rate={exchangeRate}
                  />
                )}
                {monthlyMisc > 0 && (
                  <CostRow
                    label="雜支"
                    sublabel={`${formatUSD(monthlyMisc)}/月`}
                    usd={monthlyMisc * (effectiveWeeks / WEEKS_PER_MONTH)}
                    rate={exchangeRate}
                  />
                )}

                <Divider />

                {/* ── 4.5 Additional costs ────────────────────────────── */}
                <SectionHeader label="其他費用" />
                {insuranceTotal > 0 && (
                  <CostRow
                    label="保險"
                    sublabel={`${formatUSD(insuranceMonthly)}/月`}
                    usd={insuranceTotal}
                    rate={exchangeRate}
                  />
                )}
                {flightUsd > 0 && (
                  <CostRow
                    label="機票（來回）"
                    sublabel={`${formatTWD(flightTwdMin)} – ${formatTWD(flightTwdMax)}`}
                    usd={flightUsd}
                    rate={exchangeRate}
                    note="估算取中位數"
                  />
                )}
                {visaUsd > 0 && (
                  <CostRow
                    label={`簽證${visaType ? `（${visaType}）` : ""}`}
                    sublabel={visaNote || "一次性"}
                    usd={visaUsd}
                    rate={exchangeRate}
                  />
                )}

                {/* ── 4.7 Proportional bar chart ──────────────────────── */}
                {segments.length > 0 && (
                  <div className="mt-6">
                    <div
                      className="flex overflow-hidden h-4"
                      style={{ borderRadius: "var(--radius-full, 9999px)" }}
                    >
                      {segments.map((s) => (
                        <div
                          key={s.label}
                          title={`${s.label}: ${formatUSD(Math.round(s.value))} (${Math.round(s.pct)}%)`}
                          style={{
                            width: `${s.pct}%`,
                            backgroundColor: s.color,
                            minWidth: s.pct > 0 ? 4 : 0,
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
                      {segments.map((s) => (
                        <span key={s.label} className="flex items-center gap-1 text-xs" style={{ color: "var(--color-text-secondary)" }}>
                          <span
                            className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                            style={{ backgroundColor: s.color }}
                          />
                          {s.label} {Math.round(s.pct)}%
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* ── Grand total ─────────────────────────────────────── */}
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
                        {formatUSD(Math.round(grandTotalUsd))}
                      </span>
                      <span
                        className="font-mono text-sm"
                        style={{ color: "var(--color-text-secondary)" }}
                      >
                        ≈ {formatTWD(usdToTwd(grandTotalUsd))}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── 4.6 Exchange rate info ────────────────────────────── */}
              <p
                className="mt-4 text-xs"
                style={{ color: "var(--color-text-muted)" }}
              >
                {config.exchangeRate.disclaimer}：1 USD ≈ {exchangeRate} TWD
                {rateUpdatedAt && `（${rateUpdatedAt.slice(0, 10)} 更新）`}
              </p>

              {/* ── CTAs ──────────────────────────────────────────────── */}
              <div className="flex gap-3 mt-6">
                {schoolData && (
                  <Link
                    href={`/schools/${schoolData.slug}`}
                    className="flex-1 text-center py-3 font-display font-semibold text-sm min-h-[44px] flex items-center justify-center"
                    style={{
                      borderRadius: "var(--radius-md)",
                      border: "1px solid var(--color-primary)",
                      color: "var(--color-primary)",
                    }}
                  >
                    查看學校詳情
                  </Link>
                )}
                <button
                  onClick={handleCopyLink}
                  className="flex-1 text-center py-3 font-display font-semibold text-sm min-h-[44px] flex items-center justify-center transition-colors duration-150"
                  style={{
                    borderRadius: "var(--radius-md)",
                    backgroundColor: copied ? "var(--color-primary)" : "var(--color-accent)",
                    color: "white",
                  }}
                >
                  {copied ? "已複製連結" : "分享試算結果"}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const selectStyle = {
  borderRadius: "var(--radius-sm)",
  border: "1px solid var(--color-border)",
  backgroundColor: "var(--color-elevated)",
  color: "var(--color-text)",
};

function SelectorLabel({ label, children, noMargin }) {
  return (
    <label className={noMargin ? "block" : "block mb-6"}>
      <span
        className="font-display font-semibold text-sm block mb-2"
        style={{ color: "var(--color-text-secondary)" }}
      >
        {label}
      </span>
      {children}
    </label>
  );
}

function SectionHeader({ label }) {
  return (
    <span
      className="font-display font-bold text-xs uppercase tracking-wider block"
      style={{ color: "var(--color-text-muted)", letterSpacing: "0.06em" }}
    >
      {label}
    </span>
  );
}

function Divider() {
  return (
    <div
      className="border-t my-2"
      style={{ borderColor: "var(--color-border)", opacity: 0.5 }}
    />
  );
}

function CostRow({ label, sublabel, usd, rate, note }) {
  const twdAmount = Math.round((usd || 0) * (rate || FALLBACK_RATE));
  return (
    <div className="flex items-start justify-between">
      <div>
        <span
          className="font-display font-semibold text-sm block"
          style={{ color: "var(--color-text)" }}
        >
          {label}
        </span>
        <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
          {sublabel}
        </span>
      </div>
      <div className="text-right flex-shrink-0 ml-4">
        {usd != null && usd > 0 ? (
          <>
            <span
              className="font-mono font-semibold text-base block"
              style={{ color: "var(--color-text)" }}
            >
              {formatUSD(Math.round(usd))}
            </span>
            <span
              className="font-mono text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              ≈ {formatTWD(twdAmount)}
            </span>
            {note && (
              <span
                className="block text-[10px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                {note}
              </span>
            )}
          </>
        ) : (
          <span
            className="font-mono text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            N/A
          </span>
        )}
      </div>
    </div>
  );
}
