"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";


const LINE_ID_REGEX = /^[a-zA-Z0-9._-]{4,20}$/;

const DURATION_OPTIONS = [
  { value: "2wk", label: "2 週" },
  { value: "4wk", label: "4 週" },
  { value: "8wk", label: "8 週" },
  { value: "12wk", label: "12 週" },
  { value: "24wk", label: "24 週" },
  { value: "48wk", label: "48 週" },
];

const GOAL_OPTIONS = [
  { value: "General English", label: "一般英語" },
  { value: "Intensive", label: "密集英語" },
  { value: "Business", label: "商業英語" },
  { value: "IELTS", label: "IELTS 備考" },
  { value: "TOEFL", label: "TOEFL 備考" },
  { value: "Other", label: "其他" },
];

const INITIAL_FORM = {
  name: "",
  line_id: "",
  email: "",
  phone: "",
  interested_countries: ["US"],
  interested_schools: [],
  budget_twd_monthly: "",
  preferred_duration: "",
  target_start: "",
  goal: "",
  message: "",
};

export default function ContactForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill from URL params
  useEffect(() => {
    const schoolSlug = searchParams.get("school");
    const quizSession = searchParams.get("quiz");

    if (schoolSlug || quizSession) {
      prefillFromParams(schoolSlug, quizSession);
    }
  }, [searchParams]);

  async function prefillFromParams(schoolSlug, quizSession) {
    try {
      if (quizSession) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/quiz_results?session_id=eq.${encodeURIComponent(quizSession)}&select=country_preference,recommended_schools&limit=1`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        );
        if (res.ok) {
          const rows = await res.json();
          if (rows[0]) {
            const quiz = rows[0];
            setForm((prev) => ({
              ...prev,
              interested_schools: quiz.recommended_schools || prev.interested_schools,
            }));
          }
        }
      }

      if (schoolSlug) {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/schools?slug=eq.${encodeURIComponent(schoolSlug)}&select=id,name,country&limit=1`,
          {
            headers: {
              apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
          }
        );
        if (res.ok) {
          const rows = await res.json();
          if (rows[0]) {
            setForm((prev) => ({
              ...prev,
              interested_schools: [...new Set([...prev.interested_schools, rows[0].id])],
            }));
          }
        }
      }
    } catch {
      // Pre-fill is best-effort, ignore errors
    }
  }

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "請輸入姓名";
    if (!form.line_id.trim()) {
      errs.line_id = "請輸入 LINE ID";
    } else if (!LINE_ID_REGEX.test(form.line_id.trim())) {
      errs.line_id = "LINE ID 格式不正確（4-20 字元，僅限英數字、點、底線、減號）";
    }
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = "Email 格式不正確";
    }
    if (form.message && form.message.length > 1000) {
      errs.message = "留言不能超過 1000 字";
    }
    if (form.budget_twd_monthly && (isNaN(form.budget_twd_monthly) || Number(form.budget_twd_monthly) < 0)) {
      errs.budget_twd_monthly = "請輸入有效金額";
    }
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      // Collect UTM params
      const utm_source = searchParams.get("utm_source") || undefined;
      const utm_medium = searchParams.get("utm_medium") || undefined;
      const utm_campaign = searchParams.get("utm_campaign") || undefined;

      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          budget_twd_monthly: form.budget_twd_monthly ? Number(form.budget_twd_monthly) : null,
          source_page: window.location.pathname,
          utm_source,
          utm_medium,
          utm_campaign,
        }),
      });

      if (res.status === 429) {
        setErrors({ _global: "送出太頻繁，請稍後再試" });
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const fieldErrors = {};
          data.errors.forEach((err) => {
            fieldErrors[err.field] = err.message;
          });
          setErrors(fieldErrors);
        } else {
          setErrors({ _global: data.error || "發生錯誤，請稍後再試" });
        }
        return;
      }

      setSubmitted(true);
    } catch {
      setErrors({ _global: "網路錯誤，請稍後再試" });
    } finally {
      setSubmitting(false);
    }
  }

  // 7.7: Success state
  if (submitted) {
    return (
      <motion.div
        className="p-8 text-center"
        style={{
          backgroundColor: "var(--color-elevated)",
          borderRadius: "var(--radius-md)",
          border: "1px solid var(--color-border)",
        }}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div
          className="text-5xl mb-4 mx-auto flex items-center justify-center w-16 h-16 rounded-full"
          style={{ backgroundColor: "var(--color-success)", color: "white" }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h3 className="font-display font-bold text-xl" style={{ color: "var(--color-text)" }}>
          已送出！
        </h3>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          我們會在 24 小時內透過 LINE 聯繫你
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/schools"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-display font-medium text-sm transition-colors"
            style={{
              backgroundColor: "var(--color-primary)",
              color: "white",
            }}
          >
            瀏覽學校
          </Link>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full font-display font-medium text-sm transition-colors"
            style={{
              border: "1px solid var(--color-border)",
              color: "var(--color-text)",
            }}
          >
            做配對測驗
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-6 md:p-8 space-y-5"
      style={{
        backgroundColor: "var(--color-elevated)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
      }}
    >
      <div>
        <h2 className="font-display font-bold text-xl" style={{ color: "var(--color-text)" }}>
          免費諮詢
        </h2>
        <p className="text-sm mt-1" style={{ color: "var(--color-text-secondary)" }}>
          填寫以下表單，我們會透過 LINE 與你聯繫
        </p>
      </div>

      {/* TODO: 整合 Cloudflare Turnstile 驗證（需要 site key） */}

      {errors._global && (
        <p className="text-sm px-3 py-2 rounded-md" style={{ backgroundColor: "#fef2f2", color: "var(--color-error)" }}>
          {errors._global}
        </p>
      )}

      {/* Name */}
      <FormField label="姓名" required error={errors.name}>
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="form-input"
          style={{ borderColor: errors.name ? "var(--color-error)" : "var(--color-border)" }}
          placeholder="你的名字"
        />
      </FormField>

      {/* LINE ID */}
      <FormField label="LINE ID" required error={errors.line_id}>
        <input
          type="text"
          value={form.line_id}
          onChange={(e) => setForm({ ...form, line_id: e.target.value })}
          className="form-input"
          style={{ borderColor: errors.line_id ? "var(--color-error)" : "var(--color-border)" }}
          placeholder="your_line_id"
        />
      </FormField>

      {/* Email */}
      <FormField label="Email" error={errors.email} hint="選填">
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="form-input"
          style={{ borderColor: errors.email ? "var(--color-error)" : "var(--color-border)" }}
          placeholder="your@email.com"
        />
      </FormField>

      {/* Phone */}
      <FormField label="電話" hint="選填">
        <input
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="form-input"
          placeholder="0912-345-678"
        />
      </FormField>

      {/* Budget */}
      <FormField label="每月預算（台幣）" error={errors.budget_twd_monthly} hint="選填">
        <input
          type="number"
          value={form.budget_twd_monthly}
          onChange={(e) => setForm({ ...form, budget_twd_monthly: e.target.value })}
          className="form-input"
          style={{ borderColor: errors.budget_twd_monthly ? "var(--color-error)" : "var(--color-border)" }}
          placeholder="例如 30000"
          min={0}
        />
      </FormField>

      {/* Duration */}
      <FormField label="預計遊學時間" hint="選填">
        <select
          value={form.preferred_duration}
          onChange={(e) => setForm({ ...form, preferred_duration: e.target.value })}
          className="form-input"
        >
          <option value="">請選擇</option>
          {DURATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </FormField>

      {/* Target Start */}
      <FormField label="預計出發時間" hint="選填">
        <input
          type="text"
          value={form.target_start}
          onChange={(e) => setForm({ ...form, target_start: e.target.value })}
          className="form-input"
          placeholder="例如：2026 年 7 月"
        />
      </FormField>

      {/* Goal */}
      <FormField label="學習目標" hint="選填">
        <select
          value={form.goal}
          onChange={(e) => setForm({ ...form, goal: e.target.value })}
          className="form-input"
        >
          <option value="">請選擇</option>
          {GOAL_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </FormField>

      {/* Message */}
      <FormField label="留言" error={errors.message} hint="選填">
        <textarea
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="form-input min-h-[88px]"
          style={{ borderColor: errors.message ? "var(--color-error)" : "var(--color-border)" }}
          placeholder="有什麼想問的？"
          maxLength={1000}
        />
      </FormField>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3 rounded-full font-display font-semibold text-sm transition-all min-h-[44px] flex items-center justify-center gap-2"
        style={{
          backgroundColor: submitting ? "var(--color-text-muted)" : "var(--color-accent)",
          color: "white",
        }}
      >
        {submitting ? (
          <>
            <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            送出中...
          </>
        ) : (
          "免費諮詢"
        )}
      </button>
    </form>
  );
}

/** Reusable form field wrapper */
function FormField({ label, required, error, hint, children }) {
  return (
    <div>
      <label className="block text-sm font-display font-medium mb-1" style={{ color: "var(--color-text)" }}>
        {label}
        {required && " *"}
        {hint && (
          <span className="font-normal ml-1" style={{ color: "var(--color-text-muted)" }}>
            ({hint})
          </span>
        )}
      </label>
      {children}
      {error && <p className="mt-1 text-xs" style={{ color: "var(--color-error)" }}>{error}</p>}
    </div>
  );
}
