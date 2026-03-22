/**
 * Seed script for StudyGoda
 * Inserts 30+ programs, city guides, lazy packs, and testimonials
 * Idempotent: uses upsert on slug/unique fields
 *
 * Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================================================
// City Guides
// ============================================================
const cityGuides = [
  {
    city: "Cebu",
    country: "Philippines",
    weekly_food_usd: 50,
    weekly_transport_usd: 15,
    weekly_misc_usd: 20,
    flight_twd_min: 4000,
    flight_twd_max: 7000,
    notes: "宿霧是菲律賓遊學最熱門的城市，海灘近、生活便利、語言學校密集。",
  },
  {
    city: "Baguio",
    country: "Philippines",
    weekly_food_usd: 40,
    weekly_transport_usd: 10,
    weekly_misc_usd: 15,
    flight_twd_min: 4500,
    flight_twd_max: 8000,
    notes: "碧瑤是菲律賓的避暑勝地，氣候涼爽、學習氣氛濃厚，適合專注衝刺。",
  },
  {
    city: "Manila",
    country: "Philippines",
    weekly_food_usd: 55,
    weekly_transport_usd: 20,
    weekly_misc_usd: 25,
    flight_twd_min: 3500,
    flight_twd_max: 6500,
    notes: "馬尼拉是首都，交通便利、娛樂豐富，但較為忙碌擁擠。",
  },
  {
    city: "Clark",
    country: "Philippines",
    weekly_food_usd: 45,
    weekly_transport_usd: 12,
    weekly_misc_usd: 18,
    flight_twd_min: 3500,
    flight_twd_max: 6500,
    notes: "克拉克是前美軍基地，環境安靜、治安好，有較多外師資源。",
  },
];

// ============================================================
// Programs (30+ schools across 4 cities)
// ============================================================
const programs = [
  // Cebu (10 schools)
  {
    slug: "cebu-english-academy",
    name: "Cebu English Academy",
    city: "Cebu",
    course_type: "General English",
    weekly_fee_usd: 220,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "游泳池", "健身房", "自習室"],
    google_rating: 4.5,
    photo_url: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800",
    description: "位於宿霧市中心的知名語言學校，提供一對一密集英語課程。校園設施完善，有游泳池和健身房。適合想要在輕鬆環境中學習的學生。",
  },
  {
    slug: "cebu-pacific-language",
    name: "Pacific Language Center",
    city: "Cebu",
    course_type: "Intensive English",
    weekly_fee_usd: 280,
    min_weeks: 2,
    max_weeks: 12,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳", "洗衣服務"],
    google_rating: 4.7,
    photo_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
    description: "高強度密集英語課程，每天 8 小時一對一教學。嚴格 English-Only 政策，適合短期想快速進步的學生。",
  },
  {
    slug: "cebu-blue-ocean",
    name: "Blue Ocean Academy",
    city: "Cebu",
    course_type: "General English",
    weekly_fee_usd: 320,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含海景飯店式住宿",
    facilities: ["WiFi", "游泳池", "海灘", "餐廳", "健身房"],
    google_rating: 4.6,
    photo_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    description: "位於宿霧麥克坦島海邊的度假式語言學校。邊學英文邊享受海灘生活，飯店式住宿品質高。",
  },
  {
    slug: "cebu-ielts-prep",
    name: "SMEAG Classic",
    city: "Cebu",
    course_type: "IELTS",
    weekly_fee_usd: 350,
    min_weeks: 4,
    max_weeks: 12,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "IELTS 考場", "餐廳"],
    google_rating: 4.4,
    photo_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
    description: "菲律賓唯一的 IELTS 官方考場學校。提供保證班課程，適合準備出國留學或移民的學生。",
  },
  {
    slug: "cebu-global-village",
    name: "Global Village English",
    city: "Cebu",
    course_type: "General English",
    weekly_fee_usd: 190,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳"],
    google_rating: 4.2,
    photo_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    description: "高 CP 值的語言學校，一對一課程搭配小班團體課。適合預算有限但想認真學英文的學生。",
  },
  {
    slug: "cebu-ev-academy",
    name: "EV Academy",
    city: "Cebu",
    course_type: "Intensive English",
    weekly_fee_usd: 380,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "游泳池", "健身房", "電影院", "自習室", "咖啡廳"],
    google_rating: 4.8,
    photo_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
    description: "宿霧最新最美的語言學校，設施豪華如度假村。有斯巴達和半斯巴達課程可選，Google 評價最高。",
  },
  {
    slug: "cebu-first-english",
    name: "First English Global",
    city: "Cebu",
    course_type: "Business English",
    weekly_fee_usd: 260,
    min_weeks: 1,
    max_weeks: 12,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳", "洗衣服務"],
    google_rating: 4.3,
    photo_url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
    description: "日系管理的商業英語學校，課程注重職場溝通和簡報技巧。很多日本和台灣上班族來這裡進修。",
  },
  {
    slug: "cebu-cpi",
    name: "CPI Language School",
    city: "Cebu",
    course_type: "General English",
    weekly_fee_usd: 300,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "游泳池", "健身房", "自習室", "餐廳"],
    google_rating: 4.5,
    photo_url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800",
    description: "位於宿霧山丘上的半斯巴達學校。環境優美、餐食豐富，平日管理嚴格但週末自由。",
  },
  {
    slug: "cebu-philinter",
    name: "Philinter Academy",
    city: "Cebu",
    course_type: "General English",
    weekly_fee_usd: 270,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳", "籃球場"],
    google_rating: 4.4,
    photo_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
    description: "多國籍混合的語言學校，學生來自日韓台越等國。課程設計著重溝通實用性。",
  },
  {
    slug: "cebu-za-english",
    name: "ZA English Academy",
    city: "Cebu",
    course_type: "General English",
    weekly_fee_usd: 200,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳"],
    google_rating: 4.1,
    photo_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800",
    description: "平價實惠的語言學校，位於宿霧大學城區域。周邊生活機能佳，適合長期遊學。",
  },

  // Baguio (8 schools)
  {
    slug: "baguio-pines-main",
    name: "PINES Main Campus",
    city: "Baguio",
    course_type: "Intensive English",
    weekly_fee_usd: 240,
    min_weeks: 4,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳", "健身房"],
    google_rating: 4.5,
    photo_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
    description: "碧瑤歷史最悠久的語言學校之一。斯巴達課程有名，適合想要高強度學習的學生。涼爽氣候有利學習。",
  },
  {
    slug: "baguio-pines-chapis",
    name: "PINES Chapis Campus",
    city: "Baguio",
    course_type: "IELTS",
    weekly_fee_usd: 280,
    min_weeks: 4,
    max_weeks: 12,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳"],
    google_rating: 4.6,
    photo_url: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800",
    description: "PINES 的進階校區，專為中高級學生設計。IELTS 和 TOEFL 保證班課程，入學需通過測試。",
  },
  {
    slug: "baguio-beci",
    name: "BECI International",
    city: "Baguio",
    course_type: "General English",
    weekly_fee_usd: 230,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳", "花園"],
    google_rating: 4.3,
    photo_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    description: "位於碧瑤綠色校園中的舒適語言學校。獨特的口說矯正系統 SP Program，有效改善發音。",
  },
  {
    slug: "baguio-monol",
    name: "Monol International",
    city: "Baguio",
    course_type: "General English",
    weekly_fee_usd: 210,
    min_weeks: 4,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "健身房", "瑜伽教室", "高爾夫練習場", "自習室"],
    google_rating: 4.4,
    photo_url: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800",
    description: "碧瑤老牌名校，以「復習系統」聞名。運動設施豐富，有瑜伽和高爾夫課程。CP 值極高。",
  },
  {
    slug: "baguio-help-longlong",
    name: "HELP Longlong",
    city: "Baguio",
    course_type: "Intensive English",
    weekly_fee_usd: 260,
    min_weeks: 4,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳"],
    google_rating: 4.2,
    photo_url: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800",
    description: "碧瑤最嚴格的斯巴達學校。全 English Only 政策，週一到週五禁止外出，適合自律能力較弱的學生。",
  },
  {
    slug: "baguio-jic",
    name: "JIC Baguio",
    city: "Baguio",
    course_type: "IELTS",
    weekly_fee_usd: 250,
    min_weeks: 4,
    max_weeks: 12,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳"],
    google_rating: 4.3,
    photo_url: "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800",
    description: "IELTS 專門學校，保證班承諾未達分數可免費續讀。師資團隊有豐富的 IELTS 教學經驗。",
  },
  {
    slug: "baguio-talk-academy",
    name: "TALK Academy",
    city: "Baguio",
    course_type: "General English",
    weekly_fee_usd: 195,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳"],
    google_rating: 4.1,
    photo_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800",
    description: "碧瑤平價語言學校。小而溫馨，老師親切認真。適合初學者和預算有限的學生。",
  },
  {
    slug: "baguio-wales",
    name: "WALES Language School",
    city: "Baguio",
    course_type: "General English",
    weekly_fee_usd: 220,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳", "咖啡廳"],
    google_rating: 4.4,
    photo_url: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=800",
    description: "碧瑤市中心的現代化語言學校。位置便利，走路可到商場和餐廳。課程彈性大。",
  },

  // Manila (7 schools)
  {
    slug: "manila-cnn-quezon",
    name: "CNN Language School",
    city: "Manila",
    course_type: "General English",
    weekly_fee_usd: 250,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校外公寓",
    facilities: ["WiFi", "自習室"],
    google_rating: 4.2,
    photo_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
    description: "位於馬尼拉奎松市的語言學校。鄰近大學區，生活機能豐富。提供一對一密集課程。",
  },
  {
    slug: "manila-bbi",
    name: "BBI International",
    city: "Manila",
    course_type: "Business English",
    weekly_fee_usd: 300,
    min_weeks: 2,
    max_weeks: 12,
    accommodation: "含校外公寓",
    facilities: ["WiFi", "自習室", "會議室"],
    google_rating: 4.3,
    photo_url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
    description: "商業英語專門學校，課程設計參考國際企業需求。適合準備外商面試或海外工作的學生。",
  },
  {
    slug: "manila-end-run",
    name: "End Run Language",
    city: "Manila",
    course_type: "General English",
    weekly_fee_usd: 200,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校外公寓",
    facilities: ["WiFi", "自習室", "餐廳"],
    google_rating: 4.0,
    photo_url: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=800",
    description: "馬尼拉 BGC 商業區的現代化語言學校。週末可探索馬尼拉都會生活。",
  },
  {
    slug: "manila-genius",
    name: "Genius English",
    city: "Manila",
    course_type: "General English",
    weekly_fee_usd: 230,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校外公寓",
    facilities: ["WiFi", "自習室", "餐廳", "游泳池"],
    google_rating: 4.4,
    photo_url: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800",
    description: "位於馬尼拉近郊的語言學校，有俄籍外師。環境安靜適合學習，泳池設施佳。",
  },
  {
    slug: "manila-enderun",
    name: "Enderun Colleges ESL",
    city: "Manila",
    course_type: "General English",
    weekly_fee_usd: 350,
    min_weeks: 2,
    max_weeks: 12,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "圖書館", "健身房", "餐廳", "游泳池"],
    google_rating: 4.6,
    photo_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
    description: "菲律賓頂尖大學附設的 ESL 課程。校園環境優美，可使用大學所有設施。學習氣氛濃厚。",
  },
  {
    slug: "manila-c21",
    name: "C21 Language School",
    city: "Manila",
    course_type: "Intensive English",
    weekly_fee_usd: 270,
    min_weeks: 2,
    max_weeks: 24,
    accommodation: "含校外公寓",
    facilities: ["WiFi", "自習室", "餐廳"],
    google_rating: 4.1,
    photo_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
    description: "馬尼拉密集英語學校，每天 10 小時課程。適合短期內想大幅提升英語能力的學生。",
  },
  {
    slug: "manila-we-academy",
    name: "WE Academy Manila",
    city: "Manila",
    course_type: "General English",
    weekly_fee_usd: 180,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校外公寓",
    facilities: ["WiFi", "自習室"],
    google_rating: 4.0,
    photo_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
    description: "馬尼拉最平價的語言學校之一。基本設施齊全，適合背包客型的遊學生。",
  },

  // Clark (6 schools)
  {
    slug: "clark-cip",
    name: "CIP Language School",
    city: "Clark",
    course_type: "General English",
    weekly_fee_usd: 290,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "游泳池", "自習室", "餐廳", "籃球場"],
    google_rating: 4.5,
    photo_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    description: "克拉克最知名的語言學校。擁有多位歐美外師，課程結合菲師一對一和外師小班教學。",
  },
  {
    slug: "clark-eeg",
    name: "EEG Language Center",
    city: "Clark",
    course_type: "General English",
    weekly_fee_usd: 240,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳", "花園"],
    google_rating: 4.3,
    photo_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    description: "位於克拉克經濟特區內的語言學校。環境安靜安全，綠化做得好。適合怕吵的學生。",
  },
  {
    slug: "clark-aelc",
    name: "AELC Language Center",
    city: "Clark",
    course_type: "General English",
    weekly_fee_usd: 260,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳", "游泳池"],
    google_rating: 4.2,
    photo_url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
    description: "克拉克的外師比例最高的學校之一。美國和英國籍老師多，口音道地。",
  },
  {
    slug: "clark-ges",
    name: "GES Academy",
    city: "Clark",
    course_type: "Intensive English",
    weekly_fee_usd: 230,
    min_weeks: 2,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳"],
    google_rating: 4.1,
    photo_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800",
    description: "克拉克密集英語學校。小班制教學，老師能充分關注每位學生。學費合理。",
  },
  {
    slug: "clark-hea",
    name: "HEA Language Center",
    city: "Clark",
    course_type: "IELTS",
    weekly_fee_usd: 280,
    min_weeks: 4,
    max_weeks: 12,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳", "模擬考場"],
    google_rating: 4.4,
    photo_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
    description: "克拉克的 IELTS 專門學校。有模擬考場和定期模考，追蹤學生進步幅度。",
  },
  {
    slug: "clark-we-academy",
    name: "WE Academy Clark",
    city: "Clark",
    course_type: "General English",
    weekly_fee_usd: 175,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "含校內宿舍",
    facilities: ["WiFi", "自習室", "餐廳"],
    google_rating: 4.0,
    photo_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800",
    description: "克拉克最平價的語言學校。環境簡單但乾淨，老師認真。適合預算有限的學生。",
  },
];

// Add country default
const programsWithCountry = programs.map((p) => ({
  ...p,
  country: "Philippines",
}));

// ============================================================
// Lazy Packs (8 curated packages)
// ============================================================
const lazyPacks = [
  {
    slug: "cebu-4w-budget",
    title: "宿霧 4 週超值遊學",
    description: "CP 值最高的宿霧遊學方案。一對一課程 + 校內宿舍，週末去跳島！",
    photo_url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    price_twd: 32000,
    weeks: 4,
    tags: ["最便宜", "新手推薦"],
    program_slug: "cebu-global-village",
  },
  {
    slug: "cebu-4w-intensive",
    title: "宿霧 4 週密集衝刺",
    description: "每天 8 小時一對一，4 週讓你英文大躍進。嚴格但有效！",
    photo_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
    price_twd: 45000,
    weeks: 4,
    tags: ["最熱門", "短期衝刺"],
    program_slug: "cebu-pacific-language",
  },
  {
    slug: "cebu-8w-resort",
    title: "宿霧 8 週度假式遊學",
    description: "海景飯店住宿 + 輕鬆英語課程，學英文也要享受生活。",
    photo_url: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800",
    price_twd: 98000,
    weeks: 8,
    tags: ["度假風", "海景住宿"],
    program_slug: "cebu-blue-ocean",
  },
  {
    slug: "baguio-4w-sparta",
    title: "碧瑤 4 週斯巴達",
    description: "涼爽山城 + 高強度學習。English Only 政策，逼你開口說英文。",
    photo_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
    price_twd: 38000,
    weeks: 4,
    tags: ["斯巴達", "衝刺"],
    program_slug: "baguio-pines-main",
  },
  {
    slug: "baguio-8w-ielts",
    title: "碧瑤 8 週 IELTS 保證班",
    description: "專業 IELTS 備考，不到分數免費續讀。碧瑤安靜環境助你專心。",
    photo_url: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800",
    price_twd: 85000,
    weeks: 8,
    tags: ["IELTS", "保證班"],
    program_slug: "baguio-pines-chapis",
  },
  {
    slug: "clark-4w-native",
    title: "克拉克 4 週外師英語",
    description: "跟歐美外師學道地發音。克拉克環境安全、治安好。",
    photo_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    price_twd: 46000,
    weeks: 4,
    tags: ["外師教學", "安全環境"],
    program_slug: "clark-cip",
  },
  {
    slug: "manila-4w-business",
    title: "馬尼拉 4 週商業英語",
    description: "職場英語特訓，準備外商面試或海外工作。週末探索馬尼拉都會。",
    photo_url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
    price_twd: 48000,
    weeks: 4,
    tags: ["商業英語", "職場導向"],
    program_slug: "manila-bbi",
  },
  {
    slug: "cebu-12w-longstay",
    title: "宿霧 12 週長期遊學",
    description: "三個月深度遊學，從零開始到流利對話。包含 EV Academy 豪華校園。",
    photo_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
    price_twd: 168000,
    weeks: 12,
    tags: ["長期方案", "從零開始"],
    program_slug: "cebu-ev-academy",
  },
];

// ============================================================
// Testimonials (15+ quotes)
// ============================================================
const testimonials = [
  { program_slug: "cebu-english-academy", author: "PTT u/studycebu", source: "PTT", source_url: "https://www.ptt.cc", quote: "老師很有耐心，4 週下來英文真的進步很多，推薦！" },
  { program_slug: "cebu-pacific-language", author: "Dcard 匿名", source: "Dcard", source_url: "https://www.dcard.tw", quote: "密集課程累但有效，回台灣多益直接進步 200 分。" },
  { program_slug: "cebu-blue-ocean", author: "PTT u/beachlife", source: "PTT", source_url: "https://www.ptt.cc", quote: "每天下課可以去海邊，住宿品質超好，像在度假。" },
  { program_slug: "cebu-ev-academy", author: "Dcard 匿名", source: "Dcard", source_url: "https://www.dcard.tw", quote: "校園超美，設施完善。斯巴達班真的會逼你進步。" },
  { program_slug: "cebu-global-village", author: "PTT u/budgettraveler", source: "PTT", source_url: "https://www.ptt.cc", quote: "CP 值超高，一對一老師很認真，宿霧物價也低。" },
  { program_slug: "cebu-ielts-prep", author: "Dcard 匿名", source: "Dcard", source_url: "https://www.dcard.tw", quote: "在這裡考到 IELTS 7.0，老師的考試技巧教學很實用。" },
  { program_slug: "baguio-pines-main", author: "PTT u/baguiostudent", source: "PTT", source_url: "https://www.ptt.cc", quote: "碧瑤天氣涼爽，不用開冷氣超舒服。學校管理嚴格但有效。" },
  { program_slug: "baguio-monol", author: "Dcard 匿名", source: "Dcard", source_url: "https://www.dcard.tw", quote: "復習系統真的有用，每天會安排時間複習當天學的內容。" },
  { program_slug: "baguio-beci", author: "PTT u/speakup", source: "PTT", source_url: "https://www.ptt.cc", quote: "SP Program 幫我矯正了很多發音問題，老師超有耐心。" },
  { program_slug: "clark-cip", author: "Dcard 匿名", source: "Dcard", source_url: "https://www.dcard.tw", quote: "外師的口音很道地，跟菲師搭配上課效果很好。" },
  { program_slug: "clark-cip", author: "PTT u/clarklife", source: "PTT", source_url: "https://www.ptt.cc", quote: "克拉克治安真的比宿霧好，學校泳池也很讚。" },
  { program_slug: "manila-bbi", author: "Dcard 匿名", source: "Dcard", source_url: "https://www.dcard.tw", quote: "商業英語課程幫我拿到外商 offer，面試英文變得有自信。" },
  { program_slug: "cebu-cpi", author: "PTT u/cpistudent", source: "PTT", source_url: "https://www.ptt.cc", quote: "餐食豐富好吃，山上環境很安靜。平日管嚴但週末自由。" },
  { program_slug: "cebu-philinter", author: "Dcard 匿名", source: "Dcard", source_url: "https://www.dcard.tw", quote: "學校有很多韓國和日本學生，交到不同國家的朋友很棒。" },
  { program_slug: "baguio-help-longlong", author: "PTT u/spartaboy", source: "PTT", source_url: "https://www.ptt.cc", quote: "最嚴格的斯巴達學校，但 8 週後英文突飛猛進，值得。" },
  { program_slug: "manila-enderun", author: "Dcard 匿名", source: "Dcard", source_url: "https://www.dcard.tw", quote: "大學校園超美，可以用圖書館和游泳池。感覺像在國外讀大學。" },
];

// ============================================================
// Seed Functions
// ============================================================
async function seedCityGuides() {
  console.log("Seeding city guides...");
  const { error } = await supabase
    .from("city_guides")
    .upsert(cityGuides, { onConflict: "city" });
  if (error) throw error;
  console.log(`  ✓ ${cityGuides.length} city guides`);
}

async function seedPrograms() {
  console.log("Seeding programs...");
  const { error } = await supabase
    .from("programs")
    .upsert(programsWithCountry, { onConflict: "slug" });
  if (error) throw error;
  console.log(`  ✓ ${programsWithCountry.length} programs`);
}

async function seedLazyPacks() {
  console.log("Seeding lazy packs...");

  // Look up program IDs by slug
  const { data: allPrograms } = await supabase
    .from("programs")
    .select("id, slug");

  const slugToId = Object.fromEntries(allPrograms.map((p) => [p.slug, p.id]));

  const packsWithIds = lazyPacks.map(({ program_slug, ...pack }) => ({
    ...pack,
    program_id: slugToId[program_slug] || null,
  }));

  const { error } = await supabase
    .from("lazy_packs")
    .upsert(packsWithIds, { onConflict: "slug" });
  if (error) throw error;
  console.log(`  ✓ ${packsWithIds.length} lazy packs`);
}

async function seedTestimonials() {
  console.log("Seeding testimonials...");

  const { data: allPrograms } = await supabase
    .from("programs")
    .select("id, slug");

  const slugToId = Object.fromEntries(allPrograms.map((p) => [p.slug, p.id]));

  const testimonialsWithIds = testimonials.map(
    ({ program_slug, ...t }) => ({
      ...t,
      program_id: slugToId[program_slug] || null,
    })
  );

  // Delete existing testimonials and re-insert (no unique constraint for idempotency)
  await supabase.from("testimonials").delete().neq("id", "00000000-0000-0000-0000-000000000000");

  const { error } = await supabase
    .from("testimonials")
    .insert(testimonialsWithIds);
  if (error) throw error;
  console.log(`  ✓ ${testimonialsWithIds.length} testimonials`);
}

async function main() {
  console.log("🌱 Seeding StudyGoda database...\n");

  try {
    await seedCityGuides();
    await seedPrograms();
    await seedLazyPacks();
    await seedTestimonials();
    console.log("\n✅ Seed complete!");
  } catch (error) {
    console.error("\n❌ Seed failed:", error.message);
    process.exit(1);
  }
}

main();
