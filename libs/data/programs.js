import { getSupabase } from "@/libs/supabase";

/**
 * Wrap Supabase queries with descriptive error handling (task 2.4)
 * Passes supabase client to callback for lazy initialization
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
 * Get all programs ordered by google_rating DESC
 */
export async function getAllPrograms() {
  return query((sb) =>
    sb.from("programs").select("*").order("google_rating", { ascending: false })
  );
}

/**
 * Get a single program by slug with testimonials and city guide joined
 */
export async function getProgramBySlug(slug) {
  const program = await query((sb) =>
    sb.from("programs").select("*").eq("slug", slug).single()
  );

  if (!program) return null;

  const [testimonials, cityGuide] = await Promise.all([
    query((sb) =>
      sb
        .from("testimonials")
        .select("*")
        .eq("program_id", program.id)
        .order("created_at", { ascending: false })
        .limit(3)
    ),
    query((sb) =>
      sb
        .from("city_guides")
        .select("*")
        .eq("city", program.city)
        .single()
    ).catch(() => null),
  ]);

  return { ...program, testimonials, cityGuide };
}

/**
 * Search programs with filters (task 2.2)
 */
export async function searchPrograms(filters = {}) {
  const supabase = getSupabase();
  if (!supabase) return [];

  let q = supabase.from("programs").select("*");

  if (filters.city) {
    q = Array.isArray(filters.city) ? q.in("city", filters.city) : q.eq("city", filters.city);
  }
  if (filters.country) {
    q = q.eq("country", filters.country);
  }
  if (filters.courseType) {
    q = Array.isArray(filters.courseType) ? q.in("course_type", filters.courseType) : q.eq("course_type", filters.courseType);
  }
  if (filters.minWeeklyFee != null) q = q.gte("weekly_fee_usd", filters.minWeeklyFee);
  if (filters.maxWeeklyFee != null) q = q.lte("weekly_fee_usd", filters.maxWeeklyFee);
  if (filters.minWeeks != null) q = q.gte("max_weeks", filters.minWeeks);
  if (filters.maxWeeks != null) q = q.lte("min_weeks", filters.maxWeeks);

  const data = await query(() => q);
  return sortByRecommended(data);
}

/**
 * D6: Recommended sort
 */
function sortByRecommended(programs) {
  if (!programs || programs.length === 0) return programs;

  const fees = programs.map((p) => p.weekly_fee_usd);
  const minFee = Math.min(...fees);
  const maxFee = Math.max(...fees);
  const feeRange = maxFee - minFee || 1;

  return programs
    .map((p) => {
      const normalizedFee = (p.weekly_fee_usd - minFee) / feeRange;
      const score = (p.google_rating || 0) * 0.6 + (1 - normalizedFee) * 0.4;
      return { ...p, _score: score };
    })
    .sort((a, b) => b._score - a._score);
}

/**
 * Get all lazy packs with linked program data
 */
export async function getLazyPacks() {
  return query((sb) =>
    sb
      .from("lazy_packs")
      .select("*, program:programs(slug, name, city, weekly_fee_usd)")
      .order("created_at", { ascending: false })
  );
}

/**
 * Get city guide by city name
 */
export async function getCityGuide(city) {
  return query((sb) =>
    sb.from("city_guides").select("*").eq("city", city).single()
  );
}

/**
 * Get all city guides
 */
export async function getAllCityGuides() {
  return query((sb) =>
    sb.from("city_guides").select("*").order("city")
  );
}

/**
 * Get testimonials for a program
 */
export async function getTestimonials(programId) {
  return query((sb) =>
    sb
      .from("testimonials")
      .select("*")
      .eq("program_id", programId)
      .order("created_at", { ascending: false })
      .limit(3)
  );
}

/**
 * Get featured testimonials (for homepage)
 */
export async function getFeaturedTestimonials(limit = 4) {
  return query((sb) =>
    sb
      .from("testimonials")
      .select("*, program:programs(name, city)")
      .order("created_at", { ascending: false })
      .limit(limit)
  );
}

/**
 * Get aggregate stats (for homepage)
 */
export async function getStats() {
  const programs = await getAllPrograms();
  if (!programs || programs.length === 0) {
    return { schoolCount: 0, cityCount: 0, lowestFee: 0 };
  }

  const cities = new Set(programs.map((p) => p.city));
  const lowestFee = Math.min(...programs.map((p) => p.weekly_fee_usd));

  return {
    schoolCount: programs.length,
    cityCount: cities.size,
    lowestFee: Math.round(lowestFee),
  };
}
