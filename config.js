const config = {
  appName: "StudyGoda",
  appDescription: "菲律賓遊學比價平台 — 找到最適合你的語言學校",
  domainName: "studygoda.com",
  locale: "zh-TW",

  // Brand
  brand: {
    tagline: "找到你的遊學",
    heroTitle: "你的第一趟\n獨立冒險",
    heroSubtitle: "菲律賓語言學校，透明比價、真人推薦",
  },

  // Cities
  cities: ["Cebu", "Baguio", "Manila", "Clark"],
  cityNames: {
    Cebu: "宿霧",
    Baguio: "碧瑤",
    Manila: "馬尼拉",
    Clark: "克拉克",
  },

  // Fee thresholds (USD/week)
  feeThresholds: {
    budget: 250, // < 250 = green
    premium: 400, // > 400 = coral
  },

  // Affiliate links
  affiliates: {
    esim: {
      name: "Airalo eSIM",
      url: "https://ref.airalo.com/studygoda",
      price: "NT$120-300",
      description: "菲律賓上網 eSIM，落地即用",
    },
    insurance: {
      name: "旅平險",
      url: "#",
      price: "NT$500-1,500/月",
      description: "海外遊學旅平險推薦",
    },
  },

  // Flight estimates (static TWD ranges)
  flights: {
    range: "NT$4,000 – NT$8,000",
    note: "台北直飛宿霧/馬尼拉來回",
    skyscannerUrl:
      "https://www.skyscanner.com.tw/transport/flights/tpe/ceb/",
  },

  // Resend email config
  resend: {
    fromNoReply: "StudyGoda <noreply@studygoda.com>",
    fromAdmin: "StudyGoda <hello@studygoda.com>",
  },

  // Navigation
  nav: {
    tabs: [
      { label: "首頁", href: "/", icon: "home" },
      { label: "搜尋", href: "/search", icon: "search" },
      { label: "懶人包", href: "/packs", icon: "package" },
      { label: "費用", href: "/cost-report", icon: "dollar" },
    ],
  },
};

export default config;
