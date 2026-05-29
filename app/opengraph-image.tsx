import { ImageResponse } from "next/og";
import { themeConfig } from "@/config/theme.config";

export const runtime = "edge";

export const alt = `${themeConfig.brand.name} — ${themeConfig.brand.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  // Use shortName for the big title (fits the 1200px canvas at large font).
  // The full canonical name lives in metadata/title tags.
  const brandClean = themeConfig.brand.shortName
    .replace(/[.]$/, "")
    .toUpperCase();
  const titleSize = brandClean.length > 7 ? 150 : 220;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: themeConfig.colors.background,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          position: "relative",
          color: themeConfig.colors.text,
          fontFamily: "sans-serif",
        }}
      >
        {/* Ember glow top-right */}
        <div
          style={{
            position: "absolute",
            top: -200,
            right: -200,
            width: 800,
            height: 800,
            borderRadius: 800,
            background: `radial-gradient(circle, ${themeConfig.colors.accent}66, transparent 70%)`,
            display: "flex",
          }}
        />
        {/* Ember glow bottom-left */}
        <div
          style={{
            position: "absolute",
            bottom: -300,
            left: -200,
            width: 700,
            height: 700,
            borderRadius: 700,
            background: `radial-gradient(circle, ${themeConfig.colors.accent}33, transparent 70%)`,
            display: "flex",
          }}
        />

        {/* Top: chip eyebrow */}
        <div style={{ display: "flex", alignItems: "center", zIndex: 1 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 24px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.04)",
              fontSize: 22,
              color: "#A1A1AA",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: 10,
                background: themeConfig.colors.accent,
                display: "flex",
              }}
            />
            Premium burgers · Rawai
          </div>
        </div>

        {/* Middle: brand + tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            zIndex: 1,
            gap: 32,
          }}
        >
          <div
            style={{
              fontSize: titleSize,
              fontWeight: 800,
              letterSpacing: "-0.06em",
              lineHeight: 0.95,
              display: "flex",
            }}
          >
            <span>{brandClean}</span>
            <span style={{ color: themeConfig.colors.accent }}>.</span>
          </div>
          <div
            style={{
              fontSize: 42,
              color: "#A1A1AA",
              maxWidth: 900,
              lineHeight: 1.3,
              display: "flex",
            }}
          >
            {themeConfig.brand.tagline}
          </div>
        </div>

        {/* Bottom: 3 reassurances + handle */}
        <div
          style={{
            display: "flex",
            gap: 24,
            zIndex: 1,
            alignItems: "center",
          }}
        >
          {themeConfig.hero.reassurances.map((r) => (
            <div
              key={r.label}
              style={{
                display: "flex",
                flexDirection: "column",
                padding: "20px 32px",
                borderRadius: 24,
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                minWidth: 200,
              }}
            >
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  display: "flex",
                }}
              >
                {r.label}
              </div>
              <div
                style={{
                  fontSize: 20,
                  color: "#71717A",
                  marginTop: 4,
                  display: "flex",
                }}
              >
                {r.sub}
              </div>
            </div>
          ))}

          {/* Handle right */}
          <div
            style={{
              marginLeft: "auto",
              display: "flex",
              fontSize: 24,
              color: themeConfig.colors.accent,
              fontFamily: "monospace",
            }}
          >
            {themeConfig.social.instagram.handle}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
