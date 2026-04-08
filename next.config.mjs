/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/guides": ["./content/guides/**/*"],
    "/guides/[slug]": ["./content/guides/**/*"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "pub-a8259d97bc254f95981092323524064c.r2.dev",
      },
    ],
  },
};

export default nextConfig;
