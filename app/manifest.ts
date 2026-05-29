import type { MetadataRoute } from "next";
import { themeConfig } from "@/config/theme.config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${themeConfig.brand.name} — ${themeConfig.brand.tagline}`,
    short_name: themeConfig.brand.name.replace(".", ""),
    description: themeConfig.brand.description,
    start_url: "/",
    display: "standalone",
    background_color: themeConfig.colors.background,
    theme_color: themeConfig.colors.background,
    orientation: "portrait",
    categories: ["food", "delivery", "shopping", "lifestyle"],
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
