/**
 * Seed script for StudyGoda — US Language Schools
 * Populates: cities, schools, courses, exchange_rates
 * Idempotent: uses upsert on unique fields
 *
 * Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-us.mjs
 */

import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ============================================================
// Cities
// ============================================================
const cities = [
  {
    name: "New York",
    name_zh: "紐約",
    country: "USA",
    climate: "temperate",
    homestay_weekly: 350,
    homestay_includes: "早晚餐",
    monthly_rent_single: 2200,
    monthly_rent_shared: 1400,
    monthly_food: 600,
    monthly_transport: 130,
    monthly_misc: 250,
    monthly_insurance: 80,
    flight_twd_min: 28000,
    flight_twd_max: 40000,
    visa_fee_local: 185,
    visa_type: "F-1",
    visa_note: "另加 SEVIS 費 $350",
    local_currency: "USD",
  },
  {
    name: "Los Angeles",
    name_zh: "洛杉磯",
    country: "USA",
    climate: "warm",
    homestay_weekly: 310,
    homestay_includes: "早晚餐",
    monthly_rent_single: 1900,
    monthly_rent_shared: 1200,
    monthly_food: 520,
    monthly_transport: 150,
    monthly_misc: 220,
    monthly_insurance: 80,
    flight_twd_min: 25000,
    flight_twd_max: 36000,
    visa_fee_local: 185,
    visa_type: "F-1",
    visa_note: "另加 SEVIS 費 $350",
    local_currency: "USD",
  },
  {
    name: "Boston",
    name_zh: "波士頓",
    country: "USA",
    climate: "temperate",
    homestay_weekly: 330,
    homestay_includes: "早晚餐",
    monthly_rent_single: 2000,
    monthly_rent_shared: 1300,
    monthly_food: 560,
    monthly_transport: 100,
    monthly_misc: 200,
    monthly_insurance: 80,
    flight_twd_min: 27000,
    flight_twd_max: 38000,
    visa_fee_local: 185,
    visa_type: "F-1",
    visa_note: "另加 SEVIS 費 $350",
    local_currency: "USD",
  },
  {
    name: "San Francisco",
    name_zh: "舊金山",
    country: "USA",
    climate: "warm",
    homestay_weekly: 340,
    homestay_includes: "早晚餐",
    monthly_rent_single: 2100,
    monthly_rent_shared: 1350,
    monthly_food: 580,
    monthly_transport: 120,
    monthly_misc: 220,
    monthly_insurance: 80,
    flight_twd_min: 26000,
    flight_twd_max: 37000,
    visa_fee_local: 185,
    visa_type: "F-1",
    visa_note: "另加 SEVIS 費 $350",
    local_currency: "USD",
  },
];

// ============================================================
// Schools + Courses (from old programs, normalized)
// Each school entry has a `courses` array
// ============================================================
const schoolsData = [
  // ── New York (10 schools) ──────────────────────────────────
  {
    slug: "ny-kaplan-empire",
    name: "Kaplan New York Empire State",
    city: "New York",
    brand: "Kaplan",
    photo_url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    popularity_score: 92,
    features: ["WiFi", "自習室", "學生休息區", "電腦教室"],
    accommodation_types: ["校外學生宿舍"],
    description: "位於帝國大廈附近的 Kaplan 旗艦校區，提供一般英語與學術英語課程。校區現代化設施完善，地理位置絕佳，步行可達時代廣場與中央車站。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 420, registration_fee: 185, material_fee: 0, min_weeks: 1, max_weeks: 52 },
      { name: "Academic English", course_type: "Academic English", price_per_week_usd: 460, registration_fee: 185, material_fee: 50, min_weeks: 4, max_weeks: 24 },
    ],
  },
  {
    slug: "ny-ec-english",
    name: "EC English New York",
    city: "New York",
    brand: "EC English",
    photo_url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800",
    popularity_score: 90,
    features: ["WiFi", "互動白板", "學生交誼廳", "自習室"],
    accommodation_types: ["寄宿家庭", "校外宿舍"],
    description: "EC English 紐約校區位於時代廣場旁，密集英語課程每週 30 堂。國籍比例多元，課後活動豐富，適合想快速提升英文的學生。",
    courses: [
      { name: "Intensive English", course_type: "Intensive English", price_per_week_usd: 480, registration_fee: 160, material_fee: 0, min_weeks: 1, max_weeks: 24 },
      { name: "General English", course_type: "General English", price_per_week_usd: 400, registration_fee: 160, material_fee: 0, min_weeks: 1, max_weeks: 24 },
    ],
  },
  {
    slug: "ny-lsi-manhattan",
    name: "LSI New York",
    city: "New York",
    brand: "LSI",
    photo_url: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800",
    popularity_score: 78,
    features: ["WiFi", "自習室", "學生休息區"],
    accommodation_types: ["寄宿家庭", "校外宿舍"],
    description: "LSI 紐約校區位於曼哈頓 SoHo 區，環境時尚、交通便利。小班制教學，注重口語溝通，適合想提升日常會話能力的學生。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 380, registration_fee: 150, material_fee: 0, min_weeks: 1, max_weeks: 48 },
    ],
  },
  {
    slug: "ny-ilsc-toefl",
    name: "ILSC New York",
    city: "New York",
    brand: "ILSC",
    photo_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
    popularity_score: 82,
    features: ["WiFi", "自習室", "電腦教室", "模擬考場"],
    accommodation_types: ["校外學生宿舍"],
    description: "ILSC 紐約提供專業 TOEFL 備考課程，模擬考試與解題技巧訓練完善。師資團隊經驗豐富，適合準備美國大學申請的學生。",
    courses: [
      { name: "TOEFL Preparation", course_type: "TOEFL Preparation", price_per_week_usd: 450, registration_fee: 150, material_fee: 75, min_weeks: 4, max_weeks: 24 },
      { name: "General English", course_type: "General English", price_per_week_usd: 390, registration_fee: 150, material_fee: 0, min_weeks: 1, max_weeks: 24 },
    ],
  },
  {
    slug: "ny-rennert-business",
    name: "Rennert International",
    city: "New York",
    brand: "Rennert",
    photo_url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
    popularity_score: 85,
    features: ["WiFi", "會議室", "商業模擬教室", "自習室"],
    accommodation_types: ["校外公寓"],
    description: "紐約知名的商業英語學校，課程涵蓋簡報、談判、商業寫作。位於曼哈頓中城，鄰近華爾街，適合職場人士進修。",
    courses: [
      { name: "Business English", course_type: "Business English", price_per_week_usd: 520, registration_fee: 155, material_fee: 50, min_weeks: 2, max_weeks: 12 },
    ],
  },
  {
    slug: "ny-els-manhattan",
    name: "ELS Language Centers Manhattan",
    city: "New York",
    brand: "ELS",
    photo_url: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=800",
    popularity_score: 88,
    features: ["WiFi", "自習室", "電腦教室", "學生交誼廳"],
    accommodation_types: ["校外學生宿舍"],
    description: "ELS 是全美最大的語言學校體系之一。曼哈頓校區分級明確，從初學到進階共 12 級，完成後可免托福申請合作大學。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 440, registration_fee: 180, material_fee: 0, min_weeks: 1, max_weeks: 52 },
      { name: "Academic English", course_type: "Academic English", price_per_week_usd: 480, registration_fee: 180, material_fee: 50, min_weeks: 4, max_weeks: 36 },
    ],
  },
  {
    slug: "ny-st-giles",
    name: "St Giles New York",
    city: "New York",
    brand: "St Giles",
    photo_url: "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800",
    popularity_score: 80,
    features: ["WiFi", "自習室", "屋頂露台", "學生休息區"],
    accommodation_types: ["寄宿家庭", "校外宿舍"],
    description: "英國老牌語言學校 St Giles 的紐約分校，位於第五大道旁。屋頂露台可欣賞帝國大廈美景，教學品質穩定。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 400, registration_fee: 140, material_fee: 0, min_weeks: 1, max_weeks: 24 },
    ],
  },
  {
    slug: "ny-zoni-language",
    name: "Zoni Language Centers",
    city: "New York",
    brand: "Zoni",
    photo_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
    popularity_score: 72,
    features: ["WiFi", "自習室", "電腦教室"],
    accommodation_types: ["校外公寓"],
    description: "紐約平價語言學校，學費親民但教學不打折。校區位於曼哈頓中城，周邊生活機能便利。適合預算有限的學生。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 310, registration_fee: 100, material_fee: 0, min_weeks: 1, max_weeks: 48 },
    ],
  },
  {
    slug: "ny-new-york-language",
    name: "New York Language Center",
    city: "New York",
    brand: null,
    photo_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800",
    popularity_score: 75,
    features: ["WiFi", "自習室", "學生休息區"],
    accommodation_types: ["校外公寓"],
    description: "紐約在地語言中心，密集課程每週 25 小時。小班制搭配多元國籍，老師注重互動式教學。",
    courses: [
      { name: "Intensive English", course_type: "Intensive English", price_per_week_usd: 340, registration_fee: 100, material_fee: 0, min_weeks: 1, max_weeks: 24 },
    ],
  },
  {
    slug: "ny-kaplan-ielts",
    name: "Kaplan New York IELTS",
    city: "New York",
    brand: "Kaplan",
    photo_url: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800",
    popularity_score: 86,
    features: ["WiFi", "自習室", "電腦教室", "模擬考場"],
    accommodation_types: ["校外學生宿舍"],
    description: "Kaplan 的 IELTS 專門課程，搭配獨家 K+ 線上學習系統。定期模考追蹤進度，適合準備留學或移民的學生。",
    courses: [
      { name: "IELTS Preparation", course_type: "IELTS Preparation", price_per_week_usd: 460, registration_fee: 185, material_fee: 50, min_weeks: 4, max_weeks: 16 },
    ],
  },

  // ── Los Angeles (8 schools) ────────────────────────────────
  {
    slug: "la-els-santa-monica",
    name: "ELS Santa Monica",
    city: "Los Angeles",
    brand: "ELS",
    photo_url: "https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=800",
    popularity_score: 85,
    features: ["WiFi", "自習室", "學生休息區", "電腦教室"],
    accommodation_types: ["寄宿家庭", "校外宿舍"],
    description: "ELS 聖塔莫尼卡校區距離海灘步行僅 10 分鐘。陽光加州的輕鬆學習氛圍，課後可直奔海邊。適合喜歡戶外生活的學生。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 400, registration_fee: 180, material_fee: 0, min_weeks: 1, max_weeks: 52 },
    ],
  },
  {
    slug: "la-kaplan-westwood",
    name: "Kaplan Los Angeles Westwood",
    city: "Los Angeles",
    brand: "Kaplan",
    photo_url: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800",
    popularity_score: 88,
    features: ["WiFi", "自習室", "電腦教室", "學生交誼廳"],
    accommodation_types: ["校外學生宿舍"],
    description: "位於 UCLA 旁邊的 Kaplan 洛杉磯校區，學術氛圍濃厚。密集課程搭配 K+ 學習系統，週末可參加好萊塢和迪士尼之旅。",
    courses: [
      { name: "Intensive English", course_type: "Intensive English", price_per_week_usd: 460, registration_fee: 185, material_fee: 0, min_weeks: 1, max_weeks: 24 },
      { name: "General English", course_type: "General English", price_per_week_usd: 400, registration_fee: 185, material_fee: 0, min_weeks: 1, max_weeks: 52 },
    ],
  },
  {
    slug: "la-ec-english",
    name: "EC English Los Angeles",
    city: "Los Angeles",
    brand: "EC English",
    photo_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    popularity_score: 84,
    features: ["WiFi", "互動白板", "學生交誼廳", "自習室"],
    accommodation_types: ["寄宿家庭", "校外宿舍"],
    description: "EC English 洛杉磯校區位於聖塔莫尼卡，現代化校舍、陽光明媚的學習環境。免費工作坊和豐富社交活動。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 420, registration_fee: 160, material_fee: 0, min_weeks: 1, max_weeks: 24 },
    ],
  },
  {
    slug: "la-mentor-language",
    name: "Mentor Language Institute",
    city: "Los Angeles",
    brand: "Mentor",
    photo_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
    popularity_score: 76,
    features: ["WiFi", "自習室", "電腦教室"],
    accommodation_types: ["校外公寓"],
    description: "洛杉磯好萊塢校區的 TOEFL 備考學校，學費實惠。課程扎實，老師有豐富的考試準備經驗。適合想在陽光中準備考試的學生。",
    courses: [
      { name: "TOEFL Preparation", course_type: "TOEFL Preparation", price_per_week_usd: 350, registration_fee: 150, material_fee: 50, min_weeks: 4, max_weeks: 24 },
      { name: "General English", course_type: "General English", price_per_week_usd: 300, registration_fee: 150, material_fee: 0, min_weeks: 1, max_weeks: 48 },
    ],
  },
  {
    slug: "la-columbia-west",
    name: "Columbia West College",
    city: "Los Angeles",
    brand: null,
    photo_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    popularity_score: 70,
    features: ["WiFi", "自習室", "學生休息區"],
    accommodation_types: ["校外公寓"],
    description: "洛杉磯韓國城附近的平價語言學校。課程彈性大、國籍比例多元。周邊亞洲美食豐富，適合長期就讀。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 320, registration_fee: 100, material_fee: 0, min_weeks: 1, max_weeks: 48 },
    ],
  },
  {
    slug: "la-kings-english",
    name: "Kings Los Angeles",
    city: "Los Angeles",
    brand: "Kings",
    photo_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
    popularity_score: 87,
    features: ["WiFi", "游泳池", "自習室", "學生交誼廳", "花園"],
    accommodation_types: ["寄宿家庭", "校外宿舍"],
    description: "Kings 洛杉磯校區擁有獨立校園與游泳池，環境如同大學校園。位於好萊塢山丘附近，學習與生活品質兼顧。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 440, registration_fee: 175, material_fee: 0, min_weeks: 2, max_weeks: 24 },
    ],
  },
  {
    slug: "la-lsi-language",
    name: "LSI San Diego / LA",
    city: "Los Angeles",
    brand: "LSI",
    photo_url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
    popularity_score: 79,
    features: ["WiFi", "自習室", "會議室", "電腦教室"],
    accommodation_types: ["寄宿家庭", "校外公寓"],
    description: "LSI 南加州校區提供商業英語與職場溝通課程。融合加州輕鬆文化與專業訓練，適合想提升職場英語的上班族。",
    courses: [
      { name: "Business English", course_type: "Business English", price_per_week_usd: 470, registration_fee: 150, material_fee: 50, min_weeks: 2, max_weeks: 12 },
    ],
  },
  {
    slug: "la-cel-english",
    name: "CEL English Los Angeles",
    city: "Los Angeles",
    brand: "CEL",
    photo_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
    popularity_score: 77,
    features: ["WiFi", "自習室", "學生休息區"],
    accommodation_types: ["寄宿家庭", "校外宿舍"],
    description: "CEL 洛杉磯校區離海灘很近，班級人數少、師生互動密切。提供一般英語和考試準備課程。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 390, registration_fee: 120, material_fee: 0, min_weeks: 1, max_weeks: 24 },
      { name: "Exam Prep", course_type: "Exam Prep", price_per_week_usd: 430, registration_fee: 120, material_fee: 50, min_weeks: 4, max_weeks: 12 },
    ],
  },

  // ── Boston (7 schools) ─────────────────────────────────────
  {
    slug: "boston-ec-english",
    name: "EC English Boston",
    city: "Boston",
    brand: "EC English",
    photo_url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
    popularity_score: 88,
    features: ["WiFi", "互動白板", "學生交誼廳", "自習室"],
    accommodation_types: ["寄宿家庭", "校外宿舍"],
    description: "EC English 波士頓校區位於 Faneuil Hall 附近，歷史文化氛圍濃厚。課程注重溝通能力，社交活動豐富，適合喜歡學術城市的學生。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 450, registration_fee: 160, material_fee: 0, min_weeks: 1, max_weeks: 24 },
    ],
  },
  {
    slug: "boston-kaplan-harvard",
    name: "Kaplan Boston Harvard Square",
    city: "Boston",
    brand: "Kaplan",
    photo_url: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800",
    popularity_score: 95,
    features: ["WiFi", "自習室", "電腦教室", "學生交誼廳"],
    accommodation_types: ["校外學生宿舍"],
    description: "位於哈佛廣場旁的 Kaplan 波士頓旗艦校區。沉浸在世界頂尖學府的學術氛圍中，密集課程搭配 K+ 系統，適合學術導向的學生。",
    courses: [
      { name: "Intensive English", course_type: "Intensive English", price_per_week_usd: 490, registration_fee: 185, material_fee: 0, min_weeks: 1, max_weeks: 24 },
      { name: "TOEFL Preparation", course_type: "TOEFL Preparation", price_per_week_usd: 490, registration_fee: 185, material_fee: 75, min_weeks: 4, max_weeks: 16 },
    ],
  },
  {
    slug: "boston-els-center",
    name: "ELS Boston Downtown",
    city: "Boston",
    brand: "ELS",
    photo_url: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800",
    popularity_score: 83,
    features: ["WiFi", "自習室", "電腦教室", "學生休息區"],
    accommodation_types: ["校外學生宿舍"],
    description: "ELS 波士頓市中心校區，交通便利、生活機能佳。12 級分級系統清楚，完成高級可免托福申請合作大學。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 430, registration_fee: 180, material_fee: 0, min_weeks: 1, max_weeks: 52 },
    ],
  },
  {
    slug: "boston-lsi-language",
    name: "LSI Boston",
    city: "Boston",
    brand: "LSI",
    photo_url: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800",
    popularity_score: 80,
    features: ["WiFi", "自習室", "電腦教室", "模擬考場"],
    accommodation_types: ["寄宿家庭", "校外宿舍"],
    description: "LSI 波士頓提供專業 TOEFL 備考課程，結合波士頓的學術氛圍。定期模考與個人化回饋，適合計畫在美國升學的學生。",
    courses: [
      { name: "TOEFL Preparation", course_type: "TOEFL Preparation", price_per_week_usd: 440, registration_fee: 150, material_fee: 75, min_weeks: 4, max_weeks: 24 },
    ],
  },
  {
    slug: "boston-fls-international",
    name: "FLS International Boston",
    city: "Boston",
    brand: "FLS",
    photo_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    popularity_score: 76,
    features: ["WiFi", "自習室", "學生交誼廳"],
    accommodation_types: ["寄宿家庭"],
    description: "FLS 波士頓校區與當地大學合作，可旁聽大學課程。小班教學、師資優良，適合想體驗美國大學生活的學生。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 410, registration_fee: 150, material_fee: 0, min_weeks: 1, max_weeks: 48 },
    ],
  },
  {
    slug: "boston-nese",
    name: "NESE Boston",
    city: "Boston",
    brand: "NESE",
    photo_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
    popularity_score: 91,
    features: ["WiFi", "自習室", "圖書館", "學生交誼廳"],
    accommodation_types: ["校外學生宿舍"],
    description: "哈佛大學旁的精英語言學校。以學術英語著稱，師資全部擁有碩士以上學歷。小班制教學品質極高。",
    courses: [
      { name: "Intensive English", course_type: "Intensive English", price_per_week_usd: 500, registration_fee: 200, material_fee: 50, min_weeks: 2, max_weeks: 24 },
      { name: "Academic English", course_type: "Academic English", price_per_week_usd: 520, registration_fee: 200, material_fee: 50, min_weeks: 4, max_weeks: 24 },
    ],
  },
  {
    slug: "boston-talk-school",
    name: "TALK English Schools Boston",
    city: "Boston",
    brand: "TALK",
    photo_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
    popularity_score: 73,
    features: ["WiFi", "自習室", "電腦教室"],
    accommodation_types: ["校外公寓"],
    description: "TALK 波士頓提供 IELTS 備考課程，學費合理。位於波士頓市中心，交通便利，課後可探索這座歷史名城。",
    courses: [
      { name: "IELTS Preparation", course_type: "IELTS Preparation", price_per_week_usd: 380, registration_fee: 100, material_fee: 50, min_weeks: 4, max_weeks: 16 },
    ],
  },

  // ── San Francisco (7 schools) ──────────────────────────────
  {
    slug: "sf-kaplan-berkeley",
    name: "Kaplan San Francisco Berkeley",
    city: "San Francisco",
    brand: "Kaplan",
    photo_url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
    popularity_score: 89,
    features: ["WiFi", "自習室", "電腦教室", "學生交誼廳"],
    accommodation_types: ["寄宿家庭", "校外宿舍"],
    description: "Kaplan 舊金山校區位於柏克萊大學旁，學術氛圍濃厚。矽谷近在咫尺，適合對科技產業有興趣的學生。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 440, registration_fee: 185, material_fee: 0, min_weeks: 1, max_weeks: 52 },
    ],
  },
  {
    slug: "sf-ec-english",
    name: "EC English San Francisco",
    city: "San Francisco",
    brand: "EC English",
    photo_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    popularity_score: 86,
    features: ["WiFi", "互動白板", "學生交誼廳", "自習室"],
    accommodation_types: ["寄宿家庭", "校外宿舍"],
    description: "EC English 舊金山校區位於市中心 Market Street，現代化校舍、景觀優美。密集課程搭配豐富的舊金山探索活動。",
    courses: [
      { name: "Intensive English", course_type: "Intensive English", price_per_week_usd: 470, registration_fee: 160, material_fee: 0, min_weeks: 1, max_weeks: 24 },
    ],
  },
  {
    slug: "sf-lsi-language",
    name: "LSI San Francisco",
    city: "San Francisco",
    brand: "LSI",
    photo_url: "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=800",
    popularity_score: 78,
    features: ["WiFi", "自習室", "學生休息區"],
    accommodation_types: ["寄宿家庭", "校外宿舍"],
    description: "LSI 舊金山校區位於市中心，步行可達聯合廣場和中國城。小班教學，課程注重實際溝通能力。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 390, registration_fee: 150, material_fee: 0, min_weeks: 1, max_weeks: 48 },
    ],
  },
  {
    slug: "sf-els-silicon-valley",
    name: "ELS Silicon Valley",
    city: "San Francisco",
    brand: "ELS",
    photo_url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
    popularity_score: 84,
    features: ["WiFi", "自習室", "會議室", "電腦教室"],
    accommodation_types: ["校外公寓"],
    description: "ELS 矽谷校區提供科技產業商業英語課程。鄰近 Google、Apple 總部，可參訪科技公司。適合科技業人士進修。",
    courses: [
      { name: "Business English", course_type: "Business English", price_per_week_usd: 500, registration_fee: 180, material_fee: 50, min_weeks: 2, max_weeks: 12 },
    ],
  },
  {
    slug: "sf-st-giles",
    name: "St Giles San Francisco",
    city: "San Francisco",
    brand: "St Giles",
    photo_url: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800",
    popularity_score: 81,
    features: ["WiFi", "自習室", "學生交誼廳", "電腦教室"],
    accommodation_types: ["寄宿家庭", "校外宿舍"],
    description: "St Giles 舊金山校區位於市中心，可眺望金門大橋。英式教學傳統搭配美式活力，教學品質穩定可靠。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 410, registration_fee: 140, material_fee: 0, min_weeks: 1, max_weeks: 24 },
    ],
  },
  {
    slug: "sf-converse-school",
    name: "Converse International San Francisco",
    city: "San Francisco",
    brand: "Converse",
    photo_url: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=800",
    popularity_score: 83,
    features: ["WiFi", "自習室", "學生休息區"],
    accommodation_types: ["寄宿家庭"],
    description: "舊金山精緻語言學校，每班最多 8 人。高度個人化教學，師資經驗豐富。適合追求高品質學習體驗的學生。",
    courses: [
      { name: "General English", course_type: "General English", price_per_week_usd: 530, registration_fee: 175, material_fee: 0, min_weeks: 1, max_weeks: 24 },
    ],
  },
  {
    slug: "sf-talk-english",
    name: "TALK English Schools San Francisco",
    city: "San Francisco",
    brand: "TALK",
    photo_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800",
    popularity_score: 71,
    features: ["WiFi", "自習室", "電腦教室"],
    accommodation_types: ["校外公寓"],
    description: "TALK 舊金山提供 TOEFL 備考課程，學費親民。校區交通便利，課後可探索舊金山的多元文化與美景。",
    courses: [
      { name: "TOEFL Preparation", course_type: "TOEFL Preparation", price_per_week_usd: 370, registration_fee: 100, material_fee: 50, min_weeks: 4, max_weeks: 24 },
    ],
  },
];

// ============================================================
// Exchange Rate
// ============================================================
const exchangeRates = [
  {
    base_currency: "USD",
    target_currency: "TWD",
    rate: 31,
  },
];

// ============================================================
// Seed execution
// ============================================================
async function seed() {
  console.log("Seeding US language school data...\n");

  // 1. Cities
  console.log("→ Upserting cities...");
  const { error: citiesErr } = await supabase
    .from("cities")
    .upsert(cities, { onConflict: "name" });
  if (citiesErr) {
    console.error("  Cities error:", citiesErr.message);
  } else {
    console.log(`  ✓ ${cities.length} cities`);
  }

  // 2. Schools + Courses
  console.log("→ Upserting schools & courses...");
  let schoolCount = 0;
  let courseCount = 0;

  for (const { courses: schoolCourses, ...school } of schoolsData) {
    // Upsert school
    const { data: schoolRow, error: schoolErr } = await supabase
      .from("schools")
      .upsert(
        { ...school, country: "USA" },
        { onConflict: "slug" }
      )
      .select("id")
      .single();

    if (schoolErr) {
      console.error(`  School "${school.name}" error:`, schoolErr.message);
      continue;
    }
    schoolCount++;

    // Delete existing courses for this school, then insert fresh
    await supabase.from("courses").delete().eq("school_id", schoolRow.id);

    if (schoolCourses?.length > 0) {
      const coursesWithSchoolId = schoolCourses.map((c) => ({
        ...c,
        school_id: schoolRow.id,
      }));
      const { error: courseErr } = await supabase
        .from("courses")
        .insert(coursesWithSchoolId);
      if (courseErr) {
        console.error(`  Courses for "${school.name}" error:`, courseErr.message);
      } else {
        courseCount += schoolCourses.length;
      }
    }
  }
  console.log(`  ✓ ${schoolCount} schools, ${courseCount} courses`);

  // 3. Exchange rates
  console.log("→ Upserting exchange rates...");
  const { error: rateErr } = await supabase
    .from("exchange_rates")
    .upsert(exchangeRates, { onConflict: "base_currency,target_currency" });
  if (rateErr) {
    console.error("  Exchange rates error:", rateErr.message);
  } else {
    console.log(`  ✓ ${exchangeRates.length} rate(s)`);
  }

  console.log("\nDone!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
