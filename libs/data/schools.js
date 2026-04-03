import { getSupabase } from "@/libs/supabase";

/**
 * Wrap Supabase queries with descriptive error handling
 */
async function query(fn) {
  const supabase = getSupabase();
  if (!supabase) return null;
  try {
    const result = await fn(supabase);
    if (result.error) {
      throw new Error(`Supabase query error: ${result.error.message}`);
    }
    return result.data;
  } catch (error) {
    if (error.message?.includes("Supabase query error")) throw error;
    throw new Error(
      `Supabase connection failed: ${error.message}. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.`
    );
  }
}

/**
 * Get all schools with their lowest course price.
 * Joins courses to compute min_price_per_week.
 */
export async function getAllSchools() {
  const schools = await query((sb) =>
    sb
      .from("schools")
      .select("*, courses(price_per_week_usd, course_type, min_weeks, max_weeks)")
      .order("popularity_score", { ascending: false })
  );
  if (!schools) return [];
  return schools.map(attachMinPrice);
}

/**
 * Get a single school by slug with courses and city data.
 */
export async function getSchoolBySlug(slug) {
  const school = await query((sb) =>
    sb
      .from("schools")
      .select("*, courses(*)")
      .eq("slug", slug)
      .single()
  );
  if (!school) return null;

  const city = await getCityByNameAndCountry(school.city, school.country);
  return { ...attachMinPrice(school), city_data: city };
}

/**
 * Get all schools with courses for search/filter (client-side filtering).
 */
export async function getSchoolsForSearch() {
  return getAllSchools();
}

/**
 * Get featured schools (top N by popularity + value score).
 */
export async function getFeaturedSchools(limit = 6) {
  const schools = await getAllSchools();
  if (!schools) return [];

  return schools
    .filter((s) => s.min_price_per_week != null)
    .map((s) => ({
      ...s,
      _score:
        (s.popularity_score || 0) * 0.6 +
        (1 - (s.min_price_per_week || 300) / 500) * 0.4,
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, limit);
}

/**
 * Get per-country stats (school count + avg fee).
 */
export async function getCountryStats() {
  const schools = await getAllSchools();
  if (!schools) return [];

  const map = {};
  for (const s of schools) {
    if (!map[s.country]) map[s.country] = { country: s.country, count: 0, totalFee: 0, feeCount: 0 };
    map[s.country].count++;
    if (s.min_price_per_week != null) {
      map[s.country].totalFee += s.min_price_per_week;
      map[s.country].feeCount++;
    }
  }

  return Object.values(map).map((c) => ({
    country: c.country,
    schoolCount: c.count,
    avgFee: c.feeCount > 0 ? Math.round(c.totalFee / c.feeCount) : null,
  }));
}

/**
 * Get aggregate stats for homepage.
 */
export async function getStats() {
  const schools = await getAllSchools();
  if (!schools || schools.length === 0) {
    return { schoolCount: 0, countryCount: 0, cityCount: 0, lowestFee: 0 };
  }

  const countries = new Set(schools.map((s) => s.country));
  const cities = new Set(schools.map((s) => s.city));
  const prices = schools.map((s) => s.min_price_per_week).filter(Boolean);
  const lowestFee = prices.length > 0 ? Math.min(...prices) : 0;

  return {
    schoolCount: schools.length,
    countryCount: countries.size,
    cityCount: cities.size,
    lowestFee: Math.round(lowestFee),
  };
}

/**
 * Get distinct brands from schools.
 */
export async function getBrands() {
  const schools = await query((sb) =>
    sb.from("schools").select("brand")
  );
  if (!schools) return [];
  return [...new Set(schools.map((s) => s.brand).filter(Boolean))].sort();
}

/**
 * Get distinct course types from courses.
 */
export async function getCourseTypes() {
  const courses = await query((sb) =>
    sb.from("courses").select("course_type")
  );
  if (!courses) return [];
  return [...new Set(courses.map((c) => c.course_type).filter(Boolean))].sort();
}

/**
 * Get city data by name and country from the cities table.
 */
export async function getCityByNameAndCountry(cityName, country) {
  return query((sb) =>
    sb
      .from("cities")
      .select("*")
      .eq("name", cityName)
      .eq("country", country)
      .single()
  ).catch(() => null);
}

/**
 * Get all cities.
 */
export async function getAllCities() {
  return query((sb) =>
    sb.from("cities").select("*").order("name")
  );
}

/**
 * Get exchange rates from DB, with static fallback.
 */
export async function getExchangeRate(baseCurrency = "USD", targetCurrency = "TWD") {
  const rate = await query((sb) =>
    sb
      .from("exchange_rates")
      .select("*")
      .eq("base_currency", baseCurrency)
      .eq("target_currency", targetCurrency)
      .single()
  ).catch(() => null);

  if (rate) return { rate: Number(rate.rate), updatedAt: rate.updated_at };
  // Fallback to static rate
  return { rate: 31, updatedAt: "2026-04-03" };
}

/**
 * Attach min_price_per_week and course metadata to a school object.
 */
function attachMinPrice(school) {
  const courses = school.courses || [];
  const prices = courses.map((c) => c.price_per_week_usd).filter(Boolean);
  const courseTypes = [...new Set(courses.map((c) => c.course_type).filter(Boolean))];
  const minWeeks = courses.length > 0 ? Math.min(...courses.map((c) => c.min_weeks || 1)) : null;
  const maxWeeks = courses.length > 0 ? Math.max(...courses.map((c) => c.max_weeks || 52)) : null;

  return {
    ...school,
    min_price_per_week: prices.length > 0 ? Math.min(...prices) : null,
    course_types: courseTypes,
    duration_range: minWeeks && maxWeeks ? `${minWeeks}–${maxWeeks}` : null,
  };
}
