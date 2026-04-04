import "./globals.css";
import BottomTabBar from "@/components/BottomTabBar";
import DesktopNav from "@/components/DesktopNav";

export const metadata = {
  title: {
    template: "%s | StudyGoda 遊學比價",
    default: "StudyGoda — 美國遊學比價平台",
  },
  description:
    "找到最適合你的美國語言學校。透明週費比較、課程推薦、費用計算，美國遊學一站搞定。",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://studygoda.com"
  ),
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://studygoda.com",
  },
  openGraph: {
    type: "website",
    locale: "zh_TW",
    siteName: "StudyGoda",
  },
};

export const viewport = {
  themeColor: "#1A6B5A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.bunny.net"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.bunny.net/css?family=plus-jakarta-sans:500,600,700,800|geist-mono:500,600"
          rel="stylesheet"
        />
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          跳到主要內容
        </a>
        <DesktopNav />
        <main id="main-content" role="main">
          {children}
        </main>
        <BottomTabBar />
      </body>
    </html>
  );
}
