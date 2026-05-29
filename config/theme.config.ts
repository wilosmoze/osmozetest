// ============================================================
//  ALL CONTENT IS CONFIGURABLE FROM THIS FILE
//  Colors, brand, delivery, contacts, social.
// ============================================================

export type DeliveryZone = {
  id: string;
  name: string;
  fee: number;
  description: string;
};

export const themeConfig = {
  brand: {
    name: "BRAISE.",
    tagline: "Flame-grilled burgers. Delivery only.",
    description:
      "The Rawai ghost kitchen reinventing the premium burger. Cooked over open flame, delivered to your door in under 30 minutes.",
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
    // Rawai → gratuit. Hors Rawai → 20 ฿.
    zones: [
      {
        id: "rawai",
        name: "Rawai",
        fee: 0,
        description: "Free delivery across all of Rawai",
      },
      {
        id: "outside",
        name: "Outside Rawai",
        fee: 20,
        description: "+20 ฿ flat fee for nearby areas",
      },
    ] as DeliveryZone[],
    defaultZoneId: "rawai",
    estimatedMinutes: { min: 25, max: 35 },
    cutoffMessage: "Open 6:30 PM to 11:00 PM — 7 days a week",
  },

  social: {
    instagram: {
      handle: "@braise.rawai",
      url: "https://instagram.com/braise.rawai",
      ctaTitle: "Follow the journey & share your burger",
      ctaBody:
        "Behind-the-scenes from the lab, new drops first, and customer support that actually replies. We read every comment.",
    },
    tiktok: { handle: "@braise.rawai", url: "https://tiktok.com/@braise.rawai" },
    contactEmail: "hello@braise.kitchen",
    contactPhone: "+66 0 00 00 00 00",
  },

  payment: {
    stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "",
    currency: "THB",
    currencySymbol: "฿",
    locale: "en-GB",
  },

  hero: {
    eyebrow: "Dark kitchen — Rawai only",
    headline: ["The burger,", "at its sharpest", "intensity."],
    subline:
      "Six flame-grilled creations, six house sauces, three brioche desserts. Delivered in 30 minutes, never served in-house.",
    cta: "Order now",
    secondaryCta: "View the menu",
    reassurances: [
      { label: "30 min", sub: "max delivery" },
      { label: "100%", sub: "house-made" },
      { label: "Free", sub: "in Rawai" },
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
