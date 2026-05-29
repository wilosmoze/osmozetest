import "./globals.css";
import type { Metadata } from "next";
import { themeConfig } from "@/config/theme.config";

export const metadata: Metadata = {
  title: `${themeConfig.brand.name} — ${themeConfig.brand.tagline}`,
  description: themeConfig.brand.description,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="grain-overlay">{children}</body>
    </html>
  );
}
