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
    name: "bun&bass burgers",
    shortName: "bun&bass",
    tagline: "Good food · Good vibes · Good bass.",
    description:
      "Premium closed-bun burgers, hand-crafted in Rawai. Good food, good vibes, good bass — house-made buns, house-made sauces, delivered to your door.",
    logoText: "bun&bass burgers",
    logoImage: "/images/hero-logo.png",
    favicon: "/favicon.ico",
  },

  colors: {
    background: "#09090b",
    surface: "#18181b",
    surfaceElevated: "#27272a",
    border: "rgba(255,255,255,0.08)",
    text: "#FAFAFA",
    textMuted: "#A1A1AA",
    accent: "#C9A35C",
    accentSoft: "rgba(201, 163, 92, 0.12)",
    success: "#10B981",
    danger: "#EF4444",
  },

  fonts: {
    display: "'Cabinet Grotesk', 'Geist Sans', system-ui, sans-serif",
    sans: "'Geist Sans', system-ui, sans-serif",
    mono: "'Geist Mono', ui-monospace, monospace",
  },

  delivery: {
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
    cutoffMessage: "Open Tue–Sun · 12 PM to 11 PM · Closed Mondays",
  },

  social: {
    instagram: {
      handle: "@bunNbass__burgers",
      url: "https://instagram.com/bunNbass__burgers",
      ctaTitle: "Follow the wave & share your burger",
      ctaBody:
        "Behind-the-scenes from the kitchen, new drops first, and DMs that actually reply. We read every comment.",
    },
    tiktok: {
      handle: "@bunNbass__burgers",
      url: "https://tiktok.com/@bunNbass__burgers",
    },
    contactEmail: "bunNbassburgers@gmail.com",
    contactPhone: "", // Line ID will be added later
  },

  payment: {
    stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "",
    currency: "THB",
    currencySymbol: "฿",
    locale: "en-GB",
  },

  hero: {
    eyebrow: "Premium burgers — Rawai",
    headline: ["Bun in.", "Bass on."],
    subline:
      "Six house-made creations, six house sauces, three brioche B-sides. Sealed tight, delivered to Rawai in under 30 minutes.",
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
        description: "Your burgers are being pressed and grilled to order.",
        icon: "flame",
      },
      {
        id: 2,
        title: "Your order is ready",
        description: "Sealed tight, waiting for the courier.",
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
