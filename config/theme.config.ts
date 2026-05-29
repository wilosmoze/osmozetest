// ============================================================
//  TOUT EST PARAMÉTRABLE DEPUIS CE FICHIER
//  Couleurs, marque, livraison, contacts, réseaux sociaux.
// ============================================================

export type DeliveryMode = "free" | "flat" | "by-distance";

export const themeConfig = {
  brand: {
    name: "BRAISE.",
    tagline: "Burgers flammés. Livrés exclusivement.",
    description:
      "La cuisine fantôme qui réinvente le burger premium. Cuit à la braise, livré à votre porte en moins de 30 minutes.",
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
    cutoffMessage: "Service de 18h30 à 23h00 — 7j/7",
  },

  social: {
    instagram: {
      handle: "@braise.kitchen",
      url: "https://instagram.com/braise.kitchen",
      ctaTitle: "Suivez l'aventure & partagez votre burger",
      ctaBody:
        "Coulisses du labo, nouveautés en avant-première, et un SAV qui répond. On lit chaque commentaire.",
    },
    tiktok: { handle: "@braise.kitchen", url: "https://tiktok.com/@braise.kitchen" },
    contactEmail: "hello@braise.kitchen",
    contactPhone: "+33 7 82 47 19 28",
  },

  payment: {
    stripePublicKey: process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY ?? "",
    currency: "EUR",
    currencySymbol: "€",
    locale: "fr-FR",
  },

  hero: {
    eyebrow: "Dark kitchen — Livraison uniquement",
    headline: ["Le burger,", "à sa juste", "intensité."],
    subline:
      "Six créations flammées à la braise, six sauces maison, trois desserts brioche. Livrés en 30 minutes, jamais en restaurant.",
    cta: "Commander maintenant",
    secondaryCta: "Voir la carte",
    reassurances: [
      { label: "30 min", sub: "livraison max" },
      { label: "100%", sub: "fait maison" },
      { label: "Black Angus", sub: "viande française" },
    ],
  },

  tracking: {
    steps: [
      {
        id: 1,
        title: "Commande confirmée",
        description: "Vos burgers sont en cours de préparation à la braise.",
        icon: "flame",
      },
      {
        id: 2,
        title: "Votre commande est prête",
        description: "Emballée chaude, en attente du livreur.",
        icon: "package",
      },
      {
        id: 3,
        title: "Le livreur est en route",
        description: "Préparez-vous, ça arrive.",
        icon: "scooter",
      },
    ],
    mockDurationsMs: [8000, 8000, 12000],
  },
} as const;

export type ThemeConfig = typeof themeConfig;
