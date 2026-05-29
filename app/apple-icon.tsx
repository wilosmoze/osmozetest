import { ImageResponse } from "next/og";
import { themeConfig } from "@/config/theme.config";

export const runtime = "edge";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: themeConfig.colors.background,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        {/* Ember glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 50% 50%, ${themeConfig.colors.accent}55, transparent 70%)`,
            display: "flex",
          }}
        />
        {/* B mark */}
        <div
          style={{
            fontSize: 130,
            fontWeight: 800,
            color: themeConfig.colors.accent,
            letterSpacing: "-0.06em",
            display: "flex",
            zIndex: 1,
          }}
        >
          B
        </div>
        {/* Accent dot */}
        <div
          style={{
            position: "absolute",
            bottom: 38,
            right: 38,
            width: 14,
            height: 14,
            background: themeConfig.colors.accent,
            borderRadius: 14,
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
