import { ImageResponse } from "next/og";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=86400, s-maxage=86400",
};

function getFeeColor(weeklyFee) {
  if (weeklyFee < 250) return "#2D8B55";
  if (weeklyFee <= 400) return "#D4930D";
  return "#E07A5F";
}

// Fetch program via Supabase REST API (avoids SDK issues with ImageResponse streaming)
async function fetchProgram(slug) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  try {
    const res = await fetch(
      `${url}/rest/v1/programs?slug=eq.${encodeURIComponent(slug)}&select=name,city,weekly_fee_usd,google_rating,photo_url&limit=1`,
      {
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
        },
      }
    );
    if (!res.ok) return null;
    const rows = await res.json();
    return rows[0] || null;
  } catch {
    return null;
  }
}

export async function GET(request, { params }) {
  try {
  const { slug } = await params;
  const program = await fetchProgram(slug);

  // Fallback: generic branded image
  if (!program) {
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

  const feeColor = getFeeColor(program.weekly_fee_usd);

  const ratingText = program.google_rating > 0 ? `  |  ${program.google_rating} / 5` : "";

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
            {program.city}{ratingText}
          </div>
          <div style={{ fontSize: 52, fontWeight: 700, color: "white", lineHeight: 1.1 }}>
            {program.name}
          </div>
          <div style={{ fontSize: 48, fontWeight: 700, color: feeColor, marginTop: 24 }}>
            ${program.weekly_fee_usd} / week
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
