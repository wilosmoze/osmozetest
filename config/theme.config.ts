// ============================================================
//  ALL CONTENT IS CONFIGURABLE FROM THIS FILE
//  Colors, brand, delivery, contacts, social.
// ============================================================

export type DeliveryMode = "free" | "flat" | "by-distance";

export const themeConfig = {
  brand: {
    name: "BRAISE.",
    tagline: "Flame-grilled burgers. Delivery only.",
    description:
      "The ghost kitchen reinventing the premium burger. Cooked over open flame, delivered to your door in under 30 minutes.",
    logoText: "BRAISE.",
    logoImage: "",
    favicon: "/favicon.ico",
  },

  colors: {
    background: "#09090b",
    surface: "#18181b",
    surfaceElevated: "#27272a",
    border: "rgba(255,255,255,0.08)",
    text: "#FAFAFA",
    textMuted: "#A1A1AA",
    accent: "#E0712C",
    accentSoft: "rgba(224, 113, 44, 0.12)",
    success: "#10B981",
    danger: "#EF4444",
  },

  fonts: {
    display: "'Cabinet Grotesk', 'Geist Sans', system-ui, sans-serif",
    sans: "'Geist Sans', system-ui, sans-serif",
    mono: "'Geist Mono', ui-monospace, monospace",
  },

  delivery: {
    mode: "by-distance" as DeliveryMode,
    flatFee: 3.9,
    freeAbove: 45,
    zones: [
      { maxKm: 3, fee: 0 },
      { maxKm: 6, fee: 2.9 },
      { maxKm: 10, fee: 4.9 },
    ],
    estimatedMinutes: { min: 25, max: 35 },
    cutoffMessage: "Open 6:30 PM to 11:00 PM — 7 days a week",
  },

  social: {
    instagram: {
      handle: "@braise.kitchen",
      url: "https://instagram.com/braise.kitchen",
      ctaTitle: "Follow the journey & share your burger",
      ctaBody:
        "Behind-the-scenes from the lab, new drops first, and customer support that actually replies. We read every comment.",
    },
    tiktok: { handle: "@braise.kitchen", url: "https://tiktok.com/@braise.kitchen" },
    contactEmail: "hello@braise.kitchen",
    contactPhone: "+33 7 82 47 19 28",
  },

  payment: {
    stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "",
    currency: "EUR",
    currencySymbol: "€",
    locale: "en-GB",
  },

  hero: {
    eyebrow: "Dark kitchen — Delivery only",
    headline: ["The burger,", "at its sharpest", "intensity."],
    subline:
      "Six flame-grilled creations, six house sauces, three brioche desserts. Delivered in 30 minutes, never served in-house.",
    cta: "Order now",
    secondaryCta: "View the menu",
    reassurances: [
      { label: "30 min", sub: "max delivery" },
      { label: "100%", sub: "house-made" },
      { label: "Black Angus", sub: "French beef" },
    ],
  },

  tracking: {
    steps: [
      {
        id: 1,
        title: "Order confirmed",
        description: "Your burgers are being grilled over the flame.",
        icon: "flame",
      },
      {
        id: 2,
        title: "Your order is ready",
        description: "Packed hot, waiting for the courier.",
        icon: "package",
      },
      {
        id: 3,
        title: "Courier on the way",
        description: "Get ready, it's coming.",
        icon: "scooter",
      },
    ],
    mockDurationsMs: [8000, 8000, 12000],
  },
} as const;

export type ThemeConfig = typeof themeConfig;
