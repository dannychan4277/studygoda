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
    city: "New York",
    country: "US",
    weekly_food_usd: 140,
    weekly_transport_usd: 40,
    weekly_misc_usd: 55,
    flight_twd_min: 28000,
    flight_twd_max: 40000,
    notes: "紐約是全球最國際化的城市，語言學校密集、文化體驗豐富，適合想要沉浸式英語環境的學生。",
  },
  {
    city: "Los Angeles",
    country: "US",
    weekly_food_usd: 120,
    weekly_transport_usd: 45,
    weekly_misc_usd: 50,
    flight_twd_min: 25000,
    flight_twd_max: 36000,
    notes: "洛杉磯陽光充沛、文化多元，好萊塢與海灘近在咫尺，適合喜歡戶外活動的學生。",
  },
  {
    city: "Boston",
    country: "US",
    weekly_food_usd: 130,
    weekly_transport_usd: 35,
    weekly_misc_usd: 45,
    flight_twd_min: 27000,
    flight_twd_max: 38000,
    notes: "波士頓是美國學術重鎮，哈佛與 MIT 所在地，學習氛圍濃厚，適合準備升學的學生。",
  },
  {
    city: "San Francisco",
    country: "US",
    weekly_food_usd: 135,
    weekly_transport_usd: 38,
    weekly_misc_usd: 50,
    flight_twd_min: 26000,
    flight_twd_max: 37000,
    notes: "舊金山是矽谷門戶，科技氣息濃厚、氣候宜人，適合對科技產業有興趣的學生。",
  },
];

// ============================================================
// Programs (30+ schools across 4 cities)
// ============================================================
const programs = [
  // New York (10 schools)
  {
    slug: "ny-kaplan-empire",
    name: "Kaplan New York Empire State",
    city: "New York",
    course_type: "General English",
    weekly_fee_usd: 420,
    min_weeks: 1,
    max_weeks: 52,
    accommodation: "校外學生宿舍（另計）",
    facilities: ["WiFi", "自習室", "學生休息區", "電腦教室"],
    google_rating: 4.5,
    photo_url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    description: "位於帝國大廈附近的 Kaplan 旗艦校區，提供一般英語與學術英語課程。校區現代化設施完善，地理位置絕佳，步行可達時代廣場與中央車站。",
  },
  {
    slug: "ny-ec-english",
    name: "EC English New York",
    city: "New York",
    course_type: "Intensive English",
    weekly_fee_usd: 480,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "寄宿家庭或校外宿舍（另計）",
    facilities: ["WiFi", "互動白板", "學生交誼廳", "自習室"],
    google_rating: 4.6,
    photo_url: "https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800",
    description: "EC English 紐約校區位於時代廣場旁，密集英語課程每週 30 堂。國籍比例多元，課後活動豐富，適合想快速提升英文的學生。",
  },
  {
    slug: "ny-lsi-manhattan",
    name: "LSI New York",
    city: "New York",
    course_type: "General English",
    weekly_fee_usd: 380,
    min_weeks: 1,
    max_weeks: 48,
    accommodation: "寄宿家庭或校外宿舍（另計）",
    facilities: ["WiFi", "自習室", "學生休息區"],
    google_rating: 4.3,
    photo_url: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800",
    description: "LSI 紐約校區位於曼哈頓 SoHo 區，環境時尚、交通便利。小班制教學，注重口語溝通，適合想提升日常會話能力的學生。",
  },
  {
    slug: "ny-ils-toefl",
    name: "ILSC New York",
    city: "New York",
    course_type: "TOEFL",
    weekly_fee_usd: 450,
    min_weeks: 4,
    max_weeks: 24,
    accommodation: "校外學生宿舍（另計）",
    facilities: ["WiFi", "自習室", "電腦教室", "模擬考場"],
    google_rating: 4.4,
    photo_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
    description: "ILSC 紐約提供專業 TOEFL 備考課程，模擬考試與解題技巧訓練完善。師資團隊經驗豐富，適合準備美國大學申請的學生。",
  },
  {
    slug: "ny-rennert-business",
    name: "Rennert International",
    city: "New York",
    course_type: "Business English",
    weekly_fee_usd: 520,
    min_weeks: 2,
    max_weeks: 12,
    accommodation: "校外公寓（另計）",
    facilities: ["WiFi", "會議室", "商業模擬教室", "自習室"],
    google_rating: 4.5,
    photo_url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
    description: "紐約知名的商業英語學校，課程涵蓋簡報、談判、商業寫作。位於曼哈頓中城，鄰近華爾街，適合職場人士進修。",
  },
  {
    slug: "ny-els-manhattan",
    name: "ELS Language Centers Manhattan",
    city: "New York",
    course_type: "General English",
    weekly_fee_usd: 440,
    min_weeks: 1,
    max_weeks: 52,
    accommodation: "校外學生宿舍（另計）",
    facilities: ["WiFi", "自習室", "電腦教室", "學生交誼廳"],
    google_rating: 4.3,
    photo_url: "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=800",
    description: "ELS 是全美最大的語言學校體系之一。曼哈頓校區分級明確，從初學到進階共 12 級，完成後可免托福申請合作大學。",
  },
  {
    slug: "ny-st-giles",
    name: "St Giles New York",
    city: "New York",
    course_type: "General English",
    weekly_fee_usd: 400,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "寄宿家庭或校外宿舍（另計）",
    facilities: ["WiFi", "自習室", "屋頂露台", "學生休息區"],
    google_rating: 4.4,
    photo_url: "https://images.unsplash.com/photo-1522083165195-3424ed129620?w=800",
    description: "英國老牌語言學校 St Giles 的紐約分校，位於第五大道旁。屋頂露台可欣賞帝國大廈美景，教學品質穩定。",
  },
  {
    slug: "ny-zoni-language",
    name: "Zoni Language Centers",
    city: "New York",
    course_type: "General English",
    weekly_fee_usd: 310,
    min_weeks: 1,
    max_weeks: 48,
    accommodation: "校外公寓（另計）",
    facilities: ["WiFi", "自習室", "電腦教室"],
    google_rating: 4.1,
    photo_url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800",
    description: "紐約平價語言學校，學費親民但教學不打折。校區位於曼哈頓中城，周邊生活機能便利。適合預算有限的學生。",
  },
  {
    slug: "ny-new-york-language",
    name: "New York Language Center",
    city: "New York",
    course_type: "Intensive English",
    weekly_fee_usd: 340,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "校外公寓（另計）",
    facilities: ["WiFi", "自習室", "學生休息區"],
    google_rating: 4.2,
    photo_url: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800",
    description: "紐約在地語言中心，密集課程每週 25 小時。小班制搭配多元國籍，老師注重互動式教學。",
  },
  {
    slug: "ny-kaplan-ielts",
    name: "Kaplan New York IELTS",
    city: "New York",
    course_type: "IELTS",
    weekly_fee_usd: 460,
    min_weeks: 4,
    max_weeks: 16,
    accommodation: "校外學生宿舍（另計）",
    facilities: ["WiFi", "自習室", "電腦教室", "模擬考場"],
    google_rating: 4.5,
    photo_url: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800",
    description: "Kaplan 的 IELTS 專門課程，搭配獨家 K+ 線上學習系統。定期模考追蹤進度，適合準備留學或移民的學生。",
  },

  // Los Angeles (8 schools)
  {
    slug: "la-els-santa-monica",
    name: "ELS Santa Monica",
    city: "Los Angeles",
    course_type: "General English",
    weekly_fee_usd: 400,
    min_weeks: 1,
    max_weeks: 52,
    accommodation: "寄宿家庭或校外宿舍（另計）",
    facilities: ["WiFi", "自習室", "學生休息區", "電腦教室"],
    google_rating: 4.4,
    photo_url: "https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=800",
    description: "ELS 聖塔莫尼卡校區距離海灘步行僅 10 分鐘。陽光加州的輕鬆學習氛圍，課後可直奔海邊。適合喜歡戶外生活的學生。",
  },
  {
    slug: "la-kaplan-westwood",
    name: "Kaplan Los Angeles Westwood",
    city: "Los Angeles",
    course_type: "Intensive English",
    weekly_fee_usd: 460,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "校外學生宿舍（另計）",
    facilities: ["WiFi", "自習室", "電腦教室", "學生交誼廳"],
    google_rating: 4.5,
    photo_url: "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=800",
    description: "位於 UCLA 旁邊的 Kaplan 洛杉磯校區，學術氛圍濃厚。密集課程搭配 K+ 學習系統，週末可參加好萊塢和迪士尼之旅。",
  },
  {
    slug: "la-ec-english",
    name: "EC English Los Angeles",
    city: "Los Angeles",
    course_type: "General English",
    weekly_fee_usd: 420,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "寄宿家庭或校外宿舍（另計）",
    facilities: ["WiFi", "互動白板", "學生交誼廳", "自習室"],
    google_rating: 4.4,
    photo_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800",
    description: "EC English 洛杉磯校區位於聖塔莫尼卡，現代化校舍、陽光明媚的學習環境。免費工作坊和豐富社交活動。",
  },
  {
    slug: "la-mentor-language",
    name: "Mentor Language Institute",
    city: "Los Angeles",
    course_type: "TOEFL",
    weekly_fee_usd: 350,
    min_weeks: 4,
    max_weeks: 24,
    accommodation: "校外公寓（另計）",
    facilities: ["WiFi", "自習室", "電腦教室"],
    google_rating: 4.2,
    photo_url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
    description: "洛杉磯好萊塢校區的 TOEFL 備考學校，學費實惠。課程扎實，老師有豐富的考試準備經驗。適合想在陽光中準備考試的學生。",
  },
  {
    slug: "la-columbia-west",
    name: "Columbia West College",
    city: "Los Angeles",
    course_type: "General English",
    weekly_fee_usd: 320,
    min_weeks: 1,
    max_weeks: 48,
    accommodation: "校外公寓（另計）",
    facilities: ["WiFi", "自習室", "學生休息區"],
    google_rating: 4.1,
    photo_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800",
    description: "洛杉磯韓國城附近的平價語言學校。課程彈性大、國籍比例多元。周邊亞洲美食豐富，適合長期就讀。",
  },
  {
    slug: "la-kings-english",
    name: "Kings Los Angeles",
    city: "Los Angeles",
    course_type: "General English",
    weekly_fee_usd: 440,
    min_weeks: 2,
    max_weeks: 24,
    accommodation: "寄宿家庭或校外宿舍（另計）",
    facilities: ["WiFi", "游泳池", "自習室", "學生交誼廳", "花園"],
    google_rating: 4.6,
    photo_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
    description: "Kings 洛杉磯校區擁有獨立校園與游泳池，環境如同大學校園。位於好萊塢山丘附近，學習與生活品質兼顧。",
  },
  {
    slug: "la-lsi-language",
    name: "LSI San Diego / LA",
    city: "Los Angeles",
    course_type: "Business English",
    weekly_fee_usd: 470,
    min_weeks: 2,
    max_weeks: 12,
    accommodation: "寄宿家庭或校外公寓（另計）",
    facilities: ["WiFi", "自習室", "會議室", "電腦教室"],
    google_rating: 4.3,
    photo_url: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800",
    description: "LSI 南加州校區提供商業英語與職場溝通課程。融合加州輕鬆文化與專業訓練，適合想提升職場英語的上班族。",
  },
  {
    slug: "la-ceg-english",
    name: "CEL English Los Angeles",
    city: "Los Angeles",
    course_type: "General English",
    weekly_fee_usd: 390,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "寄宿家庭或校外宿舍（另計）",
    facilities: ["WiFi", "自習室", "學生休息區"],
    google_rating: 4.3,
    photo_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
    description: "CEL 洛杉磯校區離海灘很近，班級人數少、師生互動密切。提供一般英語和考試準備課程。",
  },

  // Boston (7 schools)
  {
    slug: "boston-ec-english",
    name: "EC English Boston",
    city: "Boston",
    course_type: "General English",
    weekly_fee_usd: 450,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "寄宿家庭或校外宿舍（另計）",
    facilities: ["WiFi", "互動白板", "學生交誼廳", "自習室"],
    google_rating: 4.6,
    photo_url: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800",
    description: "EC English 波士頓校區位於 Faneuil Hall 附近，歷史文化氛圍濃厚。課程注重溝通能力，社交活動豐富，適合喜歡學術城市的學生。",
  },
  {
    slug: "boston-kaplan-harvard",
    name: "Kaplan Boston Harvard Square",
    city: "Boston",
    course_type: "Intensive English",
    weekly_fee_usd: 490,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "校外學生宿舍（另計）",
    facilities: ["WiFi", "自習室", "電腦教室", "學生交誼廳"],
    google_rating: 4.7,
    photo_url: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800",
    description: "位於哈佛廣場旁的 Kaplan 波士頓旗艦校區。沉浸在世界頂尖學府的學術氛圍中，密集課程搭配 K+ 系統，適合學術導向的學生。",
  },
  {
    slug: "boston-els-center",
    name: "ELS Boston Downtown",
    city: "Boston",
    course_type: "General English",
    weekly_fee_usd: 430,
    min_weeks: 1,
    max_weeks: 52,
    accommodation: "校外學生宿舍（另計）",
    facilities: ["WiFi", "自習室", "電腦教室", "學生休息區"],
    google_rating: 4.3,
    photo_url: "https://images.unsplash.com/photo-1523050854058-8df90110c476?w=800",
    description: "ELS 波士頓市中心校區，交通便利、生活機能佳。12 級分級系統清楚，完成高級可免托福申請合作大學。",
  },
  {
    slug: "boston-lsi-language",
    name: "LSI Boston",
    city: "Boston",
    course_type: "TOEFL",
    weekly_fee_usd: 440,
    min_weeks: 4,
    max_weeks: 24,
    accommodation: "寄宿家庭或校外宿舍（另計）",
    facilities: ["WiFi", "自習室", "電腦教室", "模擬考場"],
    google_rating: 4.4,
    photo_url: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800",
    description: "LSI 波士頓提供專業 TOEFL 備考課程，結合波士頓的學術氛圍。定期模考與個人化回饋，適合計畫在美國升學的學生。",
  },
  {
    slug: "boston-fls-international",
    name: "FLS International Boston",
    city: "Boston",
    course_type: "General English",
    weekly_fee_usd: 410,
    min_weeks: 1,
    max_weeks: 48,
    accommodation: "寄宿家庭（另計）",
    facilities: ["WiFi", "自習室", "學生交誼廳"],
    google_rating: 4.2,
    photo_url: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800",
    description: "FLS 波士頓校區與當地大學合作，可旁聽大學課程。小班教學、師資優良，適合想體驗美國大學生活的學生。",
  },
  {
    slug: "boston-nese",
    name: "NESE Boston",
    city: "Boston",
    course_type: "Intensive English",
    weekly_fee_usd: 500,
    min_weeks: 2,
    max_weeks: 24,
    accommodation: "校外學生宿舍（另計）",
    facilities: ["WiFi", "自習室", "圖書館", "學生交誼廳"],
    google_rating: 4.5,
    photo_url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800",
    description: "哈佛大學旁的精英語言學校。以學術英語著稱，師資全部擁有碩士以上學歷。小班制教學品質極高。",
  },
  {
    slug: "boston-talk-school",
    name: "TALK English Schools Boston",
    city: "Boston",
    course_type: "IELTS",
    weekly_fee_usd: 380,
    min_weeks: 4,
    max_weeks: 16,
    accommodation: "校外公寓（另計）",
    facilities: ["WiFi", "自習室", "電腦教室"],
    google_rating: 4.2,
    photo_url: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800",
    description: "TALK 波士頓提供 IELTS 備考課程，學費合理。位於波士頓市中心，交通便利，課後可探索這座歷史名城。",
  },

  // San Francisco (7 schools)
  {
    slug: "sf-kaplan-berkeley",
    name: "Kaplan San Francisco Berkeley",
    city: "San Francisco",
    course_type: "General English",
    weekly_fee_usd: 440,
    min_weeks: 1,
    max_weeks: 52,
    accommodation: "寄宿家庭或校外宿舍（另計）",
    facilities: ["WiFi", "自習室", "電腦教室", "學生交誼廳"],
    google_rating: 4.5,
    photo_url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
    description: "Kaplan 舊金山校區位於柏克萊大學旁，學術氛圍濃厚。矽谷近在咫尺，適合對科技產業有興趣的學生。",
  },
  {
    slug: "sf-ec-english",
    name: "EC English San Francisco",
    city: "San Francisco",
    course_type: "Intensive English",
    weekly_fee_usd: 470,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "寄宿家庭或校外宿舍（另計）",
    facilities: ["WiFi", "互動白板", "學生交誼廳", "自習室"],
    google_rating: 4.5,
    photo_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    description: "EC English 舊金山校區位於市中心 Market Street，現代化校舍、景觀優美。密集課程搭配豐富的舊金山探索活動。",
  },
  {
    slug: "sf-lsi-language",
    name: "LSI San Francisco",
    city: "San Francisco",
    course_type: "General English",
    weekly_fee_usd: 390,
    min_weeks: 1,
    max_weeks: 48,
    accommodation: "寄宿家庭或校外宿舍（另計）",
    facilities: ["WiFi", "自習室", "學生休息區"],
    google_rating: 4.3,
    photo_url: "https://images.unsplash.com/photo-1521747116042-5a810fda9664?w=800",
    description: "LSI 舊金山校區位於市中心，步行可達聯合廣場和中國城。小班教學，課程注重實際溝通能力。",
  },
  {
    slug: "sf-els-silicon-valley",
    name: "ELS Silicon Valley",
    city: "San Francisco",
    course_type: "Business English",
    weekly_fee_usd: 500,
    min_weeks: 2,
    max_weeks: 12,
    accommodation: "校外公寓（另計）",
    facilities: ["WiFi", "自習室", "會議室", "電腦教室"],
    google_rating: 4.4,
    photo_url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
    description: "ELS 矽谷校區提供科技產業商業英語課程。鄰近 Google、Apple 總部，可參訪科技公司。適合科技業人士進修。",
  },
  {
    slug: "sf-st-giles",
    name: "St Giles San Francisco",
    city: "San Francisco",
    course_type: "General English",
    weekly_fee_usd: 410,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "寄宿家庭或校外宿舍（另計）",
    facilities: ["WiFi", "自習室", "學生交誼廳", "電腦教室"],
    google_rating: 4.4,
    photo_url: "https://images.unsplash.com/photo-1449034446853-66c86144b0ad?w=800",
    description: "St Giles 舊金山校區位於市中心，可眺望金門大橋。英式教學傳統搭配美式活力，教學品質穩定可靠。",
  },
  {
    slug: "sf-converse-school",
    name: "Converse International San Francisco",
    city: "San Francisco",
    course_type: "General English",
    weekly_fee_usd: 530,
    min_weeks: 1,
    max_weeks: 24,
    accommodation: "寄宿家庭（另計）",
    facilities: ["WiFi", "自習室", "學生休息區"],
    google_rating: 4.6,
    photo_url: "https://images.unsplash.com/photo-1560439514-4e9645039924?w=800",
    description: "舊金山精緻語言學校，每班最多 8 人。高度個人化教學，師資經驗豐富。適合追求高品質學習體驗的學生。",
  },
  {
    slug: "sf-talk-english",
    name: "TALK English Schools San Francisco",
    city: "San Francisco",
    course_type: "TOEFL",
    weekly_fee_usd: 370,
    min_weeks: 4,
    max_weeks: 24,
    accommodation: "校外公寓（另計）",
    facilities: ["WiFi", "自習室", "電腦教室"],
    google_rating: 4.1,
    photo_url: "https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800",
    description: "TALK 舊金山提供 TOEFL 備考課程，學費親民。校區交通便利，課後可探索舊金山的多元文化與美景。",
  },
];

// Add country default
const programsWithCountry = programs.map((p) => ({
  ...p,
  country: "US",
}));

// ============================================================
// Lazy Packs (8 curated packages)
// ============================================================
const lazyPacks = [
  {
    slug: "ny-4w-intensive",
    title: "紐約 4 週密集英語",
    description: "在世界之都紐約密集學英文，每週 30 堂課快速提升。課後探索曼哈頓！",
    photo_url: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800",
    price_twd: 72000,
    weeks: 4,
    tags: ["最熱門", "短期衝刺"],
    program_slug: "ny-ec-english",
  },
  {
    slug: "ny-4w-budget",
    title: "紐約 4 週超值英語",
    description: "平價紐約遊學方案，學費親民但教學不打折。體驗紐約生活的最佳入門！",
    photo_url: "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=800",
    price_twd: 55000,
    weeks: 4,
    tags: ["最便宜", "新手推薦"],
    program_slug: "ny-zoni-language",
  },
  {
    slug: "la-8w-sunshine",
    title: "洛杉磯 8 週陽光英語",
    description: "在加州陽光下學英文，課後直奔聖塔莫尼卡海灘。學習與度假兩不誤！",
    photo_url: "https://images.unsplash.com/photo-1515896769750-31548aa180ed?w=800",
    price_twd: 110000,
    weeks: 8,
    tags: ["度假風", "海灘生活"],
    program_slug: "la-els-santa-monica",
  },
  {
    slug: "boston-8w-academic",
    title: "波士頓 8 週學術英語",
    description: "在哈佛旁邊學英文，沉浸頂尖學府氛圍。適合準備留學的學生。",
    photo_url: "https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=800",
    price_twd: 125000,
    weeks: 8,
    tags: ["學術導向", "留學準備"],
    program_slug: "boston-kaplan-harvard",
  },
  {
    slug: "boston-8w-toefl",
    title: "波士頓 8 週 TOEFL 備考",
    description: "專業 TOEFL 備考課程，在學術之城波士頓全力衝刺。定期模考追蹤進度。",
    photo_url: "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800",
    price_twd: 115000,
    weeks: 8,
    tags: ["TOEFL", "考試準備"],
    program_slug: "boston-lsi-language",
  },
  {
    slug: "sf-4w-tech",
    title: "舊金山 4 週科技英語",
    description: "矽谷門戶學商業英語，參訪科技公司、認識業界人脈。適合科技人。",
    photo_url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
    price_twd: 78000,
    weeks: 4,
    tags: ["商業英語", "科技產業"],
    program_slug: "sf-els-silicon-valley",
  },
  {
    slug: "ny-4w-business",
    title: "紐約 4 週商業英語",
    description: "華爾街旁的商業英語特訓，簡報、談判、商業寫作一次學會。",
    photo_url: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800",
    price_twd: 82000,
    weeks: 4,
    tags: ["商業英語", "職場導向"],
    program_slug: "ny-rennert-business",
  },
  {
    slug: "la-12w-longstay",
    title: "洛杉磯 12 週長期遊學",
    description: "三個月加州深度遊學，從基礎到流利。享受陽光校園與游泳池設施。",
    photo_url: "https://images.unsplash.com/photo-1562774053-701939374585?w=800",
    price_twd: 185000,
    weeks: 12,
    tags: ["長期方案", "從零開始"],
    program_slug: "la-kings-english",
  },
];

// ============================================================
// Testimonials (15+ quotes)
// ============================================================
const testimonials = [
  { program_slug: "ny-kaplan-empire", author: "PTT u/nystudy", source: "PTT", source_url: "https://www.ptt.cc", quote: "紐約校區地點超好，走路就到時代廣場。老師教學認真，4 週下來英文進步很多！" },
  { program_slug: "ny-ec-english", author: "Dcard 匿名", source: "Dcard", source_url: "https://www.dcard.tw", quote: "EC 的密集課程真的很操但有效，同學來自世界各地，英文被逼著一直用。" },
  { program_slug: "la-els-santa-monica", author: "PTT u/californiadream", source: "PTT", source_url: "https://www.ptt.cc", quote: "聖塔莫尼卡離海灘超近，每天下課可以去海邊散步。一邊學英文一邊度假的感覺。" },
  { program_slug: "la-kaplan-westwood", author: "Dcard 匿名", source: "Dcard", source_url: "https://www.dcard.tw", quote: "校區就在 UCLA 旁邊，整個大學城的氛圍很棒。K+ 學習系統蠻好用的。" },
  { program_slug: "boston-kaplan-harvard", author: "PTT u/bostonlife", source: "PTT", source_url: "https://www.ptt.cc", quote: "在哈佛旁邊學英文的感覺太好了，走路就可以逛哈佛校園。學術氣氛超濃。" },
  { program_slug: "boston-ec-english", author: "Dcard 匿名", source: "Dcard", source_url: "https://www.dcard.tw", quote: "波士頓秋天超美，EC 的課後活動帶我們去看紅襪隊比賽，很難忘的體驗。" },
  { program_slug: "sf-kaplan-berkeley", author: "PTT u/sftech", source: "PTT", source_url: "https://www.ptt.cc", quote: "柏克萊校區附近很有大學城的感覺，咖啡廳和書店超多。舊金山的氣候很舒服。" },
  { program_slug: "sf-els-silicon-valley", author: "Dcard 匿名", source: "Dcard", source_url: "https://www.dcard.tw", quote: "商業英語課程對我的工作幫助很大，還安排了 Google 園區參訪，大開眼界。" },
  { program_slug: "ny-rennert-business", author: "PTT u/wallstreet", source: "PTT", source_url: "https://www.ptt.cc", quote: "商業英語課程幫我拿到外商 offer，面試英文變得有自信。位置就在曼哈頓超方便。" },
  { program_slug: "boston-nese", author: "Dcard 匿名", source: "Dcard", source_url: "https://www.dcard.tw", quote: "NESE 的教學品質真的很高，每班不超過 12 人。老師全部碩士以上，超專業。" },
  { program_slug: "la-kings-english", author: "PTT u/hollywoodstudent", source: "PTT", source_url: "https://www.ptt.cc", quote: "Kings 校園有游泳池！在洛杉磯學英文真的太幸福了，天天好天氣。" },
  { program_slug: "ny-ils-toefl", author: "Dcard 匿名", source: "Dcard", source_url: "https://www.dcard.tw", quote: "TOEFL 從 70 考到 95，老師的解題技巧教學很實用。強烈推薦想留學的人。" },
  { program_slug: "sf-converse-school", author: "PTT u/sflife", source: "PTT", source_url: "https://www.ptt.cc", quote: "每班最多 8 人，幾乎是半私人家教了。學費貴但品質真的沒話說。" },
  { program_slug: "ny-zoni-language", author: "Dcard 匿名", source: "Dcard", source_url: "https://www.dcard.tw", quote: "紐約遊學不用花大錢！Zoni 學費便宜，但老師一樣很認真。推薦給預算有限的人。" },
  { program_slug: "boston-lsi-language", author: "PTT u/toeflprep", source: "PTT", source_url: "https://www.ptt.cc", quote: "在波士頓準備 TOEFL 效率超高，整個城市都很有讀書的氣氛。LSI 模考安排得很好。" },
  { program_slug: "la-ec-english", author: "Dcard 匿名", source: "Dcard", source_url: "https://www.dcard.tw", quote: "聖塔莫尼卡的 EC 校區超美，同學有來自巴西、義大利、日本的，超級國際化。" },
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
