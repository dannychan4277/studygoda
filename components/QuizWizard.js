"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/libs/supabase";
import config from "@/config";
import { formatUSD, formatWeeklyTWD, getFeeColor } from "@/libs/utils";

/* ─────────────────── Constants ─────────────────── */

const BUDGET_RANGES = [
  { label: "< $200/週", value: "under200", min: 0, max: 200 },
  { label: "$200 – $350/週", value: "200to350", min: 200, max: 350 },
  { label: "$350 – $500/週", value: "350to500", min: 350, max: 500 },
  { label: "> $500/週", value: "over500", min: 500, max: Infinity },
];

const DURATIONS = [
  { label: "2 週", value: "2" },
  { label: "4 週", value: "4" },
  { label: "8 週", value: "8" },
  { label: "12+ 週", value: "12" },
];

const CLIMATES = [
  { label: "熱帶 / 溫暖", value: "tropical" },
  { label: "溫帶 / 涼爽", value: "temperate" },
  { label: "都可以", value: "any" },
];

const STEP_TITLES = [
  "你想去哪裡？",
  "預算大概多少？",
  "想去多久？",
  "學習目標是什麼？",
  "偏好什麼氣候？",
];

const STEP_SUBTITLES = [
  "可以選多個國家",
  "每週學費預算（美元）",
  "建議至少 4 週效果較好",
  "選擇你最想上的課程類型",
  "最後一步了！",
];

/* ─────────────────── Animation variants ─────────────────── */

const pageVariants = {
  enter: (direction) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    x: direction > 0 ? -120 : 120,
    opacity: 0,
  }),
};

const pageTransition = {
  type: "tween",
  ease: "easeInOut",
  duration: 0.3,
};

/* ─────────────────── Matching algorithm ─────────────────── */

function computeScores(schools, courses, cities, answers) {
  const { countries, budget, goal, climate } = answers;
  const budgetRange = BUDGET_RANGES.find((b) => b.value === budget);

  return schools.map((school) => {
    const schoolCourses = courses.filter((c) => c.school_id === school.id);
    const schoolCity = cities.find(
      (c) => c.country === school.country
    );

    // Budget fit — check cheapest course
    let budgetFit = 0;
    if (budgetRange && schoolCourses.length > 0) {
      const minPrice = Math.min(
        ...schoolCourses.map((c) => c.price_per_week_usd)
      );
      if (minPrice >= budgetRange.min && minPrice <= budgetRange.max) {
        budgetFit = 1.0;
      } else {
        // Within 20% boundary
        const rangeSize = budgetRange.max === Infinity ? budgetRange.min * 0.2 : (budgetRange.max - budgetRange.min);
        const boundary = rangeSize * 0.2;
        const distBelow = budgetRange.min - minPrice;
        const distAbove = minPrice - (budgetRange.max === Infinity ? budgetRange.min * 2 : budgetRange.max);
        if (
          (distBelow > 0 && distBelow <= boundary) ||
          (distAbove > 0 && distAbove <= boundary)
        ) {
          budgetFit = 0.5;
        }
      }
    }

    // Goal match
    const goalMatch = schoolCourses.some((c) => c.course_type === goal)
      ? 1.0
      : 0.0;

    // Country match
    const countryMatch = countries.includes(school.country) ? 1.0 : 0.0;

    // Climate match
    let climateMatch = 1.0;
    if (climate !== "any" && schoolCity?.climate) {
      const cityClimate = schoolCity.climate.toLowerCase();
      if (climate === "tropical") {
        climateMatch = cityClimate.includes("tropical") || cityClimate.includes("warm") ? 1.0 : 0.0;
      } else if (climate === "temperate") {
        climateMatch = cityClimate.includes("temperate") || cityClimate.includes("mild") || cityClimate.includes("cool") ? 1.0 : 0.0;
      }
    }

    const score =
      0.35 * budgetFit +
      0.3 * goalMatch +
      0.2 * countryMatch +
      0.15 * climateMatch;

    const minPrice =
      schoolCourses.length > 0
        ? Math.min(...schoolCourses.map((c) => c.price_per_week_usd))
        : null;

    return {
      ...school,
      score,
      matchPercent: Math.round(score * 100),
      min_price_per_week: minPrice,
      course_types: [...new Set(schoolCourses.map((c) => c.course_type))],
    };
  });
}

/* ─────────────────── Main component ─────────────────── */

export default function QuizWizard() {
  // Step state
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);

  // Answers
  const [countries, setCountries] = useState([]);
  const [budget, setBudget] = useState(null);
  const [duration, setDuration] = useState(null);
  const [goal, setGoal] = useState(null);
  const [climate, setClimate] = useState(null);

  // Data
  const [schools, setSchools] = useState([]);
  const [courses, setCourses] = useState([]);
  const [cities, setCities] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Results
  const [results, setResults] = useState(null);
  const [calculating, setCalculating] = useState(false);
  const [saveFailed, setSaveFailed] = useState(false);

  // Prefetch data on mount
  useEffect(() => {
    async function fetchData() {
      if (!supabase) {
        setLoading(false);
        return;
      }
      try {
        const [schoolsRes, coursesRes, citiesRes] = await Promise.all([
          supabase
            .from("schools")
            .select("id, slug, name, country, city, photo_url, popularity_score, features, accommodation_types"),
          supabase.from("courses").select("school_id, course_type, price_per_week_usd, min_weeks, max_weeks"),
          supabase.from("cities").select("country, climate"),
        ]);

        if (schoolsRes.data) setSchools(schoolsRes.data);
        if (coursesRes.data) {
          setCourses(coursesRes.data);
          const types = [...new Set(coursesRes.data.map((c) => c.course_type))].filter(Boolean);
          setCourseTypes(types);
        }
        if (citiesRes.data) setCities(citiesRes.data);
      } catch (err) {
        console.error("Quiz data fetch failed:", err);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  // Current step valid?
  const canProceed = useMemo(() => {
    switch (step) {
      case 0: return countries.length > 0;
      case 1: return budget !== null;
      case 2: return duration !== null;
      case 3: return goal !== null;
      case 4: return climate !== null;
      default: return false;
    }
  }, [step, countries, budget, duration, goal, climate]);

  // Navigate
  const goNext = useCallback(() => {
    if (!canProceed) return;
    if (step < 4) {
      setDirection(1);
      setStep((s) => s + 1);
    } else {
      runMatching();
    }
  }, [step, canProceed]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection(-1);
      setStep((s) => s - 1);
    }
  }, [step]);

  // Run matching
  const runMatching = useCallback(async () => {
    setCalculating(true);
    const answers = { countries, budget, goal, climate };

    // Minimum 3s loading
    const minDelay = new Promise((r) => setTimeout(r, 3000));

    const scored = computeScores(schools, courses, cities, answers);
    scored.sort((a, b) => b.score - a.score || (b.popularity_score || 0) - (a.popularity_score || 0));
    const top3 = scored.slice(0, 3).filter((s) => s.score > 0);

    // Save to DB
    const sessionId = crypto.randomUUID();
    const recommendedJson = top3.map((s) => ({
      school_id: s.id,
      slug: s.slug,
      name: s.name,
      score: s.score,
    }));

    try {
      if (supabase) {
        await supabase.from("quiz_results").insert({
          session_id: sessionId,
          budget_range: budget,
          duration,
          goal,
          city_preference: null,
          climate_preference: climate,
          country_preference: countries,
          recommended_schools: top3.map((s) => s.id),
          recommended_json: recommendedJson,
        });
      }
    } catch (err) {
      console.error("Failed to save quiz results:", err);
      setSaveFailed(true);
    }

    await minDelay;
    setResults(top3);
    setCalculating(false);
  }, [countries, budget, duration, goal, climate, schools, courses, cities]);

  // Keyboard navigation
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Enter" && canProceed && !calculating && !results) {
        goNext();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [canProceed, calculating, results, goNext]);

  /* ─────────────────── Render helpers ─────────────────── */

  // Country toggle
  const toggleCountry = (code) => {
    setCountries((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  /* ─────────────────── Loading state ─────────────────── */

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="w-8 h-8 rounded-full border-3 border-t-transparent animate-spin" style={{ borderColor: "var(--color-primary)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  /* ─────────────────── Calculating state ─────────────────── */

  if (calculating) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-8" style={{ backgroundColor: "#FFFFFF" }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <p
            className="font-display text-xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            正在為你挑選最適合的學校...
          </p>
          <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
            根據你的偏好配對中
          </p>
        </motion.div>
        <div className="w-64 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--color-sunken)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ backgroundColor: "var(--color-primary)" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.8, ease: "easeInOut" }}
          />
        </div>
      </div>
    );
  }

  /* ─────────────────── Results state ─────────────────── */

  if (results) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#FFFFFF" }}
      >
        {/* Header */}
        <div className="pt-12 pb-6 px-5 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-2xl font-bold"
            style={{ color: "var(--color-text)" }}
          >
            為你推薦的學校
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-2 text-sm"
            style={{ color: "var(--color-text-muted)" }}
          >
            根據你的偏好，這些學校最適合你
          </motion.p>
        </div>

        {/* Results */}
        <div className="flex-1 px-5 pb-8 max-w-[600px] mx-auto w-full">
          {results.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-lg font-display font-semibold" style={{ color: "var(--color-text)" }}>
                找不到完全符合的學校
              </p>
              <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
                試試放寬條件再測一次
              </p>
              <button
                onClick={() => {
                  setResults(null);
                  setStep(0);
                  setCountries([]);
                  setBudget(null);
                  setDuration(null);
                  setGoal(null);
                  setClimate(null);
                }}
                className="mt-6 px-6 py-3 rounded-[10px] font-display font-semibold text-white"
                style={{ backgroundColor: "var(--color-primary)", minHeight: 44 }}
              >
                重新測驗
              </button>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-5">
              {results.map((school, i) => (
                <motion.div
                  key={school.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.15 }}
                >
                  <ResultCard school={school} rank={i + 1} />
                </motion.div>
              ))}
            </div>
          )}

          {/* Actions */}
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex flex-col items-center gap-3"
            >
              <button
                onClick={() => {
                  setResults(null);
                  setStep(0);
                  setCountries([]);
                  setBudget(null);
                  setDuration(null);
                  setGoal(null);
                  setClimate(null);
                }}
                className="px-6 py-3 rounded-[10px] font-display font-semibold text-sm"
                style={{
                  color: "var(--color-primary)",
                  border: "1.5px solid var(--color-primary)",
                  minHeight: 44,
                }}
              >
                重新測驗
              </button>
              <Link
                href="/schools"
                className="text-sm font-medium"
                style={{ color: "var(--color-text-muted)" }}
              >
                瀏覽所有學校
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    );
  }

  /* ─────────────────── Quiz steps ─────────────────── */

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      {/* Close button */}
      <div className="absolute top-4 right-4 z-10">
        <Link
          href="/"
          className="flex items-center justify-center w-10 h-10 rounded-full"
          style={{ color: "var(--color-text-muted)" }}
          aria-label="關閉測驗"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </Link>
      </div>

      {/* Back button */}
      {step > 0 && (
        <div className="absolute top-4 left-4 z-10">
          <button
            onClick={goBack}
            className="flex items-center justify-center w-10 h-10 rounded-full"
            style={{ color: "var(--color-text-muted)" }}
            aria-label="上一步"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15,18 9,12 15,6" />
            </svg>
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 overflow-hidden">
        <div className="w-full max-w-[600px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={pageVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={pageTransition}
            >
              {/* Title */}
              <h2
                className="font-display text-2xl font-bold text-center"
                style={{ color: "var(--color-text)" }}
              >
                {STEP_TITLES[step]}
              </h2>
              <p
                className="mt-2 text-sm text-center"
                style={{ color: "var(--color-text-muted)" }}
              >
                {STEP_SUBTITLES[step]}
              </p>

              {/* Step content */}
              <div className="mt-8">
                {step === 0 && (
                  <StepCountry selected={countries} onToggle={toggleCountry} />
                )}
                {step === 1 && (
                  <StepSingleSelect
                    options={BUDGET_RANGES}
                    value={budget}
                    onChange={setBudget}
                  />
                )}
                {step === 2 && (
                  <StepSingleSelect
                    options={DURATIONS}
                    value={duration}
                    onChange={setDuration}
                  />
                )}
                {step === 3 && (
                  <StepGoal
                    courseTypes={courseTypes}
                    value={goal}
                    onChange={setGoal}
                  />
                )}
                {step === 4 && (
                  <StepSingleSelect
                    options={CLIMATES}
                    value={climate}
                    onChange={setClimate}
                  />
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom: Next button + progress dots */}
      <div className="pb-8 pt-4 px-5 flex flex-col items-center gap-6">
        <button
          onClick={goNext}
          disabled={!canProceed}
          className="w-full max-w-[600px] py-3.5 rounded-[10px] font-display font-semibold text-white transition-opacity"
          style={{
            backgroundColor: canProceed
              ? "var(--color-primary)"
              : "var(--color-border)",
            color: canProceed ? "#FFFFFF" : "var(--color-text-muted)",
            minHeight: 48,
            opacity: canProceed ? 1 : 0.6,
            cursor: canProceed ? "pointer" : "not-allowed",
          }}
        >
          {step === 4 ? "看結果" : "下一步"}
        </button>

        {/* Progress dots */}
        <ProgressDots current={step} total={5} />
      </div>
    </div>
  );
}

/* ─────────────────── Sub-components ─────────────────── */

function ProgressDots({ current, total }) {
  return (
    <div className="flex items-center gap-2" role="progressbar" aria-valuenow={current + 1} aria-valuemin={1} aria-valuemax={total}>
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i === current ? 24 : 8,
            height: 8,
            backgroundColor:
              i < current
                ? "var(--color-primary)"
                : i === current
                  ? "var(--color-primary)"
                  : "var(--color-border)",
          }}
        />
      ))}
    </div>
  );
}

function StepCountry({ selected, onToggle }) {
  return (
    <div className="flex flex-col gap-3">
      {config.countries.map((code) => {
        const active = selected.includes(code);
        return (
          <button
            key={code}
            onClick={() => onToggle(code)}
            className="flex items-center gap-4 px-5 py-4 rounded-[16px] transition-all duration-200 text-left"
            style={{
              border: active
                ? "2px solid var(--color-primary)"
                : "2px solid var(--color-border)",
              backgroundColor: active
                ? "rgba(26, 107, 90, 0.06)"
                : "var(--color-elevated)",
              minHeight: 56,
            }}
          >
            <span className="text-3xl leading-none">
              {config.countryFlags[code]}
            </span>
            <span
              className="font-display font-semibold text-base"
              style={{
                color: active
                  ? "var(--color-primary)"
                  : "var(--color-text)",
              }}
            >
              {config.countryNames[code]}
            </span>
            {active && (
              <svg
                className="ml-auto"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20,6 9,17 4,12" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
}

function StepSingleSelect({ options, value, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className="px-5 py-4 rounded-[16px] transition-all duration-200 text-left font-display font-semibold"
            style={{
              border: active
                ? "2px solid var(--color-primary)"
                : "2px solid var(--color-border)",
              backgroundColor: active
                ? "rgba(26, 107, 90, 0.06)"
                : "var(--color-elevated)",
              color: active ? "var(--color-primary)" : "var(--color-text)",
              minHeight: 52,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

const GOAL_LABELS = {
  "General English": "一般英語",
  "Intensive English": "密集英語",
  "IELTS Preparation": "IELTS 備考",
  "TOEFL Preparation": "TOEFL 備考",
  "Business English": "商業英語",
  "Cambridge Preparation": "劍橋備考",
  "Academic English": "學術英語",
  "English for Young Learners": "青少年英語",
};

function StepGoal({ courseTypes, value, onChange }) {
  return (
    <div className="flex flex-col gap-3">
      {courseTypes.map((type) => {
        const active = value === type;
        return (
          <button
            key={type}
            onClick={() => onChange(type)}
            className="px-5 py-4 rounded-[16px] transition-all duration-200 text-left font-display font-semibold"
            style={{
              border: active
                ? "2px solid var(--color-primary)"
                : "2px solid var(--color-border)",
              backgroundColor: active
                ? "rgba(26, 107, 90, 0.06)"
                : "var(--color-elevated)",
              color: active ? "var(--color-primary)" : "var(--color-text)",
              minHeight: 52,
            }}
          >
            {GOAL_LABELS[type] || type}
          </button>
        );
      })}
      {courseTypes.length === 0 && (
        <p className="text-center text-sm py-4" style={{ color: "var(--color-text-muted)" }}>
          載入課程類型中...
        </p>
      )}
    </div>
  );
}

/* ─────────────────── Result card ─────────────────── */

function ResultCard({ school, rank }) {
  const countryName = config.countryNames[school.country] || school.country;
  const feeColor = school.min_price_per_week
    ? getFeeColor(school.min_price_per_week)
    : null;

  return (
    <Link
      href={`/schools/${school.slug}`}
      className="block overflow-hidden card-hover"
      style={{ borderRadius: 16, backgroundColor: "var(--color-elevated)" }}
    >
      {/* Photo */}
      <div className="relative w-full aspect-[16/9]">
        <Image
          src={
            school.photo_url ||
            "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800"
          }
          alt={school.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 600px"
        />
        <div
          className="absolute inset-x-0 bottom-0 h-20"
          style={{
            background: "linear-gradient(transparent, rgba(0,0,0,0.3))",
          }}
        />
        {/* Match badge */}
        <div className="absolute top-3 right-3">
          <span
            className="inline-flex items-center px-3 py-1.5 rounded-full font-mono font-semibold text-sm text-white"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {school.matchPercent}% 吻合
          </span>
        </div>
        {/* Rank badge */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-flex items-center justify-center w-8 h-8 rounded-full font-display font-bold text-sm text-white"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            {rank}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3
          className="font-display font-bold text-lg"
          style={{ color: "var(--color-text)" }}
        >
          {school.name}
        </h3>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {countryName} · {school.city}
        </p>

        <div className="mt-3 flex items-baseline gap-2">
          {school.min_price_per_week ? (
            <>
              <span
                className="font-mono font-semibold text-[22px]"
                style={{ color: feeColor }}
              >
                {formatUSD(school.min_price_per_week)}/wk
              </span>
              <span
                className="text-[12px]"
                style={{ color: "var(--color-text-muted)" }}
              >
                ({formatWeeklyTWD(school.min_price_per_week)})
              </span>
            </>
          ) : (
            <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
              費用待確認
            </span>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between">
          <div
            className="flex items-center gap-1.5 text-xs flex-wrap"
            style={{ color: "var(--color-text-muted)" }}
          >
            {school.course_types?.slice(0, 2).map((ct, i) => (
              <span key={ct}>
                {i > 0 && " · "}
                {GOAL_LABELS[ct] || ct}
              </span>
            ))}
          </div>
          <span
            className="font-display font-semibold text-sm"
            style={{ color: "var(--color-primary)" }}
          >
            看詳情
          </span>
        </div>
      </div>
    </Link>
  );
}
