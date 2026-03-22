import { NextResponse } from "next/server";

export async function middleware(request) {
  // D4: Rate limiting for /api/lead — 3 requests/min/IP, fail-open
  if (request.nextUrl.pathname === "/api/lead" && request.method === "POST") {
    try {
      const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
      const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

      if (!redisUrl || !redisToken) {
        // No Redis configured — fail open
        return NextResponse.next();
      }

      const { Ratelimit } = await import("@upstash/ratelimit");
      const { Redis } = await import("@upstash/redis");

      const redis = new Redis({ url: redisUrl, token: redisToken });
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(3, "1 m"),
      });

      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "127.0.0.1";

      const { success } = await ratelimit.limit(ip);

      if (!success) {
        return NextResponse.json(
          { error: "Too many requests" },
          { status: 429 }
        );
      }
    } catch (error) {
      // D4: Redis down — fail open (every lead is precious in MVP)
      console.warn("Rate limiter unavailable, failing open:", error.message);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/lead"],
};
