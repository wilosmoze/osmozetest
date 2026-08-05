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
  /**
   * Ordering mode.
   *  - "grab_only": every order CTA on the site redirects to Grab
   *    Food (see delivery.grabUrl). The in-site cart, checkout and
   *    order-tracking flow are hidden. Use during soft-launch when
   *    the kitchen is only listed on Grab, not taking direct orders.
   *  - "own_site": normal cart + Stripe checkout + tracker.
   *
   * Flip the string when Grab launches or when in-site orders open.
   */
  ordering: {
    mode: "grab_only" as "grab_only" | "own_site",
  },

  brand: {
    name: "bun&bass burgers",
    shortName: "bun&bass",
    tagline: "Good food · Good vibes · Good bass.",
    description:
      "Premium closed-bun burgers, hand-crafted in Rawai. Good food, good vibes, good bass — premium buns, premium sauces, home-cut fries, delivered to your door.",
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
        description: "+20 ฿ flat fee, within 6 km",
      },
    ] as DeliveryZone[],
    defaultZoneId: "rawai",
    /** Reference point from which max-distance is computed. */
    kitchenLocation: { lat: 7.7780, lng: 98.3220 },
    /** Hard limit: refuse delivery beyond this many km from the kitchen. */
    maxDistanceKm: 6,
    /** Where to send the customer when they're out of range. */
    grabUrl: "https://r.grab.com/o/vy6fM7zy",
    // Kept for internal reference; the site no longer advertises a
    // delivery ETA — we only insist on the free-in-Rawai promise.
    estimatedMinutes: { min: 25, max: 45 },
    cutoffMessage: "Open every day · 6 PM to 11 PM",
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
      "Five signature burgers, nine premium sauces, home-cut fries. Sealed tight — free delivery across Rawai.",
    cta: "Order now",
    secondaryCta: "View the menu",
    reassurances: [
      { label: "Free", sub: "in Rawai" },
      { label: "100%", sub: "premium" },
      { label: "Sealed", sub: "signature bun" },
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
