import { ImageResponse } from "next/og";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=86400, s-maxage=86400",
};

function getFeeColor(weeklyFee) {
  if (weeklyFee < 250) return "#2D8B55";
  if (weeklyFee <= 400) return "#D4930D";
  return "#E07A5F";
}

// 8.6: Fetch school via Supabase REST API (updated from programs to schools + courses)
async function fetchSchool(slug) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  try {
    const res = await fetch(
      `${url}/rest/v1/schools?slug=eq.${encodeURIComponent(slug)}&select=name,city,country,google_rating,photo_url,courses(price_per_week_usd)&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    if (!rows[0]) return null;

    const school = rows[0];
    // Compute min weekly fee from courses
    const prices = (school.courses || [])
      .map((c) => c.price_per_week_usd)
      .filter(Boolean);
    const minFee = prices.length > 0 ? Math.min(...prices) : null;

    return {
      name: school.name,
      city: school.city,
      country: school.country,
      google_rating: school.google_rating,
      photo_url: school.photo_url,
      weekly_fee_usd: minFee,
    };
  } catch {
    return null;
  }
}

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const school = await fetchSchool(slug);

    // Fallback: generic branded image
    if (!school) {
      return new ImageResponse(
        (
          <div
            style={{
              width: 1200,
              height: 630,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #0F4D3F 0%, #1A6B5A 50%, #238C75 100%)",
              fontFamily: "sans-serif",
            }}
          >
            <div style={{ fontSize: 64, fontWeight: 700, color: "white", marginBottom: 16 }}>
              StudyGoda
            </div>
            <div style={{ fontSize: 28, color: "rgba(255,255,255,0.8)" }}>
              Study Abroad Comparison Platform
            </div>
          </div>
        ),
        { width: 1200, height: 630, headers: CACHE_HEADERS }
      );
    }

    const feeText = school.weekly_fee_usd
      ? `$${school.weekly_fee_usd} / week`
      : "View pricing";
    const feeColor = school.weekly_fee_usd
      ? getFeeColor(school.weekly_fee_usd)
      : "#FFFFFF";

    const ratingText = school.google_rating > 0 ? `  |  ${school.google_rating} / 5` : "";

    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 64px",
            background: "linear-gradient(135deg, #0F4D3F 0%, #1A6B5A 40%, #238C75 100%)",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.7)", marginBottom: 20 }}>
              {school.city}, {school.country}{ratingText}
            </div>
            <div style={{ fontSize: 52, fontWeight: 700, color: "white", lineHeight: 1.1 }}>
              {school.name}
            </div>
            <div style={{ fontSize: 48, fontWeight: 700, color: feeColor, marginTop: 24 }}>
              {feeText}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "white" }}>
              StudyGoda
            </div>
            <div style={{ fontSize: 16, color: "rgba(255,255,255,0.5)" }}>
              studygoda.com
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630, headers: CACHE_HEADERS }
    );
  } catch (e) {
    console.error("OG image error:", e);
    return new Response("OG generation failed", { status: 500 });
  }
}
