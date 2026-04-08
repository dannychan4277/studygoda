const config = {
  appName: "Studygoda",
  appDescription: "遊學比較平台 — 美國語言學校搜尋、比較、費用計算",
  domainName: "studygoda.com",
  locale: "zh-TW",

  // Brand
  brand: {
    tagline: "找到你的美國遊學",
    heroTitle: "你的第一趟\n獨立冒險",
    heroSubtitle: "美國語言學校，透明比價、AI 配對推薦",
  },

  // Countries (currently US-only)
  countries: ["US"],
  countryNames: {
    US: "美國",
  },
  countryFlags: {
    US: "🇺🇸",
  },

  // Fee thresholds (USD/week) — DESIGN.md spec
  feeThresholds: {
    budget: 250, // < 250 = green
    premium: 400, // > 400 = coral
  },

  // Flight estimates (per-country defaults, TWD)
  flights: {
    USA: { range: "NT$25,000 – NT$45,000", note: "台北出發來回" },
  },

  // Exchange rate (fallback — prefer exchange_rates table)
  exchangeRate: {
    usdToTwd: 31,
    disclaimer: "參考匯率，實際匯率以銀行為準",
    updatedAt: "2026-04-03",
  },

  // Compare feature
  compare: {
    maxItems: 3,
  },

  // Resend email config
  resend: {
    fromNoReply: "Studygoda <noreply@studygoda.com>",
    fromAdmin: "Studygoda <hello@studygoda.com>",
  },

  // LINE notification config
  line: {
    pushApiUrl: "https://api.line.me/v2/bot/message/push",
  },

  // Navigation
  nav: {
    tabs: [
      { label: "首頁", href: "/", icon: "home" },
      { label: "搜尋", href: "/schools", icon: "search" },
      { label: "測驗", href: "/quiz", icon: "sparkles" },
      { label: "計算", href: "/calculator", icon: "calculator" },
    ],
  },
};

export default config;
