"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LeadForm({ programId, programName }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    preferred_weeks: 4,
    message: "",
    website: "", // honeypot
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function validate() {
    const errs = {};
    if (!form.name.trim()) errs.name = "請輸入姓名";
    if (!form.email.trim()) errs.email = "請輸入 Email";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Email 格式不正確";
    if (!form.preferred_weeks || form.preferred_weeks < 1)
      errs.preferred_weeks = "請選擇預計週數";
    return errs;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          program_id: programId,
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
      setForm({ name: "", email: "", phone: "", preferred_weeks: 4, message: "", website: "" });
    } catch {
      setErrors({ _global: "網路錯誤，請稍後再試" });
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <motion.div
        id="lead-form"
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
        <div className="text-5xl mb-4">✓</div>
        <h3 className="font-display font-bold text-xl" style={{ color: "var(--color-text)" }}>
          已送出！
        </h3>
        <p className="mt-2 text-sm" style={{ color: "var(--color-text-secondary)" }}>
          我們的顧問會盡快透過 Email 聯繫你
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-display font-medium"
          style={{ color: "var(--color-accent)" }}
        >
          再送一次
        </button>
      </motion.div>
    );
  }

  return (
    <form
      id="lead-form"
      onSubmit={handleSubmit}
      className="p-6 space-y-4"
      style={{
        backgroundColor: "var(--color-elevated)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--color-border)",
      }}
    >
      <h3 className="font-display font-bold text-lg" style={{ color: "var(--color-text)" }}>
        美國遊學免費諮詢
      </h3>
      {programName && (
        <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
          關於 {programName}
        </p>
      )}

      {errors._global && (
        <p className="text-sm px-3 py-2 rounded-md" style={{ backgroundColor: "#fef2f2", color: "var(--color-error)" }}>
          {errors._global}
        </p>
      )}

      {/* Honeypot — hidden from real users */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor="lead-name" className="block text-sm font-display font-medium mb-1" style={{ color: "var(--color-text)" }}>
          姓名 *
        </label>
        <input
          id="lead-name"
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full px-3 py-2.5 rounded-md text-sm min-h-[44px]"
          style={{
            border: `1px solid ${errors.name ? "var(--color-error)" : "var(--color-border)"}`,
            backgroundColor: "var(--color-surface)",
          }}
          placeholder="你的名字"
        />
        {errors.name && <p className="mt-1 text-xs" style={{ color: "var(--color-error)" }}>{errors.name}</p>}
      </div>

      <div>
        <label htmlFor="lead-email" className="block text-sm font-display font-medium mb-1" style={{ color: "var(--color-text)" }}>
          Email *
        </label>
        <input
          id="lead-email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full px-3 py-2.5 rounded-md text-sm min-h-[44px]"
          style={{
            border: `1px solid ${errors.email ? "var(--color-error)" : "var(--color-border)"}`,
            backgroundColor: "var(--color-surface)",
          }}
          placeholder="your@email.com"
        />
        {errors.email && <p className="mt-1 text-xs" style={{ color: "var(--color-error)" }}>{errors.email}</p>}
      </div>

      <div>
        <label htmlFor="lead-phone" className="block text-sm font-display font-medium mb-1" style={{ color: "var(--color-text)" }}>
          電話（選填）
        </label>
        <input
          id="lead-phone"
          type="tel"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="w-full px-3 py-2.5 rounded-md text-sm min-h-[44px]"
          style={{
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
          placeholder="0912-345-678"
        />
      </div>

      <div>
        <label htmlFor="lead-weeks" className="block text-sm font-display font-medium mb-1" style={{ color: "var(--color-text)" }}>
          預計週數 *
        </label>
        <select
          id="lead-weeks"
          value={form.preferred_weeks}
          onChange={(e) => setForm({ ...form, preferred_weeks: Number(e.target.value) })}
          className="w-full px-3 py-2.5 rounded-md text-sm min-h-[44px]"
          style={{
            border: `1px solid ${errors.preferred_weeks ? "var(--color-error)" : "var(--color-border)"}`,
            backgroundColor: "var(--color-surface)",
          }}
        >
          <option value={2}>2 週</option>
          <option value={4}>4 週</option>
          <option value={8}>8 週</option>
          <option value={12}>12 週</option>
          <option value={24}>24 週</option>
        </select>
        {errors.preferred_weeks && <p className="mt-1 text-xs" style={{ color: "var(--color-error)" }}>{errors.preferred_weeks}</p>}
      </div>

      <div>
        <label htmlFor="lead-message" className="block text-sm font-display font-medium mb-1" style={{ color: "var(--color-text)" }}>
          留言（選填）
        </label>
        <textarea
          id="lead-message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className="w-full px-3 py-2.5 rounded-md text-sm min-h-[88px]"
          style={{
            border: "1px solid var(--color-border)",
            backgroundColor: "var(--color-surface)",
          }}
          placeholder="想了解美國哪個城市或課程？"
          maxLength={1000}
        />
      </div>

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
          "免費諮詢美國遊學"
        )}
      </button>
    </form>
  );
}
