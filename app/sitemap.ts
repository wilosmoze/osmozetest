import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://osmozetest.vercel.app";

// Sitemap for public-facing pages only. Private pages (admin, courier,
// tracking, checkout, legal/terms/privacy) are noindex + already excluded
// from robots.txt.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
