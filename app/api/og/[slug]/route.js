import { ImageResponse } from "@vercel/og";
import { createClient } from "@supabase/supabase-js";

export const runtime = "edge";

const CACHE_HEADERS = {
  "Cache-Control": "public, max-age=86400, s-maxage=86400",
};

function getFeeColor(weeklyFee) {
  if (weeklyFee < 250) return "#2D8B55";
  if (weeklyFee <= 400) return "#D4930D";
  return "#E07A5F";
}

export async function GET(request, { params }) {
  const { slug } = await params;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  let program = null;

  if (supabaseUrl && supabaseKey) {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data } = await supabase
      .from("programs")
      .select("name, city, weekly_fee_usd, google_rating, photo_url")
      .eq("slug", slug)
      .single();
    program = data;
  }

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
          <div style={{ fontSize: 64, fontWeight: 800, color: "white", marginBottom: 16 }}>
            StudyGoda
          </div>
          <div style={{ fontSize: 28, color: "rgba(255,255,255,0.8)" }}>
            找到你的遊學 — 菲律賓語言學校比價平台
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: CACHE_HEADERS,
      }
    );
  }

  const feeColor = getFeeColor(program.weekly_fee_usd);

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: "flex",
          position: "relative",
          fontFamily: "sans-serif",
        }}
      >
        {/* Teal gradient background */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, #0F4D3F 0%, #1A6B5A 40%, #238C75 100%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: "60px 64px",
          }}
        >
          {/* Top: School info */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                }}
              >
                📍 {program.city}
              </div>
              {program.google_rating > 0 && (
                <div
                  style={{
                    fontSize: 16,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  ★ {program.google_rating}
                </div>
              )}
            </div>

            <div
              style={{
                fontSize: 52,
                fontWeight: 800,
                color: "white",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              {program.name}
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 8,
                marginTop: 24,
              }}
            >
              <span
                style={{
                  fontSize: 48,
                  fontWeight: 600,
                  color: feeColor,
                  fontFamily: "monospace",
                }}
              >
                ${program.weekly_fee_usd}/週
              </span>
            </div>
          </div>

          {/* Bottom: Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "white" }}>
                StudyGoda
              </div>
              <div style={{ fontSize: 16, color: "rgba(255,255,255,0.6)" }}>
                找到你的遊學
              </div>
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.4)" }}>
              studygoda.com
            </div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: CACHE_HEADERS,
    }
  );
}
