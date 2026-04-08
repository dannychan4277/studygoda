/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    "/guides": ["./content/**/*"],
    "/guides/[slug]": ["./content/**/*"],
    "/guides-sitemap.xml": ["./content/**/*"],
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
