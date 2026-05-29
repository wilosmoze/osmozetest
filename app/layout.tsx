import "./globals.css";
import type { Metadata, Viewport } from "next";
import { themeConfig } from "@/config/theme.config";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://osmozetest.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${themeConfig.brand.name} — ${themeConfig.brand.tagline}`,
    template: `%s · ${themeConfig.brand.name}`,
  },
  description: themeConfig.brand.description,
  applicationName: themeConfig.brand.name,
  keywords: [
    "burger delivery",
    "Rawai",
    "Phuket",
    "dark kitchen",
    "premium burger",
    "flame grilled",
    "food delivery",
  ],
  openGraph: {
    type: "website",
    siteName: themeConfig.brand.name,
    title: `${themeConfig.brand.name} — ${themeConfig.brand.tagline}`,
    description: themeConfig.brand.description,
    locale: "en_US",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: `${themeConfig.brand.name} — ${themeConfig.brand.tagline}`,
    description: themeConfig.brand.description,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: themeConfig.brand.name.replace(".", ""),
  },
  formatDetection: {
    telephone: true,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: themeConfig.colors.background,
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="grain-overlay">{children}</body>
    </html>
  );
}
