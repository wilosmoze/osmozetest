// Vintage line-art icons for the drinks list.
// Same stroke style as SauceIcons for a consistent visual system.
// Singha beer bottle is reused for all three colored labels — the
// list row itself carries the color hint via the tag chip and icon
// tint (yellow / red / pink).

import type { SVGProps } from "react";

const stroke = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// ── Cola contour bottle (Coca, Coca Zero) ─────────────────
function ColaBottle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke} {...props}>
      <path d="M13 4 L 19 4 L 19 7 C 20 8 20 10 20 11 C 22 13 22 16 21 19 C 20 22 20 25 20 27.5 L 12 27.5 C 12 25 12 22 11 19 C 10 16 10 13 12 11 C 12 10 12 8 13 7 Z" />
      <line x1="13" y1="6" x2="19" y2="6" />
      <line x1="12" y1="13" x2="20" y2="13" />
      <line x1="12.5" y1="20" x2="19.5" y2="20" />
    </svg>
  );
}

// ── Citrus bottle (Sprite) — bottle with a small lime slice ──
function CitrusBottle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke} {...props}>
      <path d="M13 4 L 19 4 L 19 7 L 20 9 C 21 12 21 16 20 19 C 20 22 20 25 20 27.5 L 12 27.5 C 12 25 12 22 12 19 C 11 16 11 12 12 9 L 13 7 Z" />
      <line x1="13" y1="6" x2="19" y2="6" />
      <circle cx="16" cy="17" r="2.4" />
      <line x1="16" y1="14.6" x2="16" y2="19.4" />
      <line x1="13.6" y1="17" x2="18.4" y2="17" />
    </svg>
  );
}

// ── Beer bottle (Singha × 3) — long-neck with cap + label ────
function BeerBottle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke} {...props}>
      <rect x="13.5" y="3" width="5" height="2.5" rx="0.4" />
      <path d="M13.5 5.5 L 13.5 10.5 C 12.5 12 11.5 13.5 11.5 16 L 11.5 26 C 11.5 27 12.3 27.5 13 27.5 L 19 27.5 C 19.7 27.5 20.5 27 20.5 26 L 20.5 16 C 20.5 13.5 19.5 12 18.5 10.5 L 18.5 5.5 Z" />
      <rect x="12.5" y="17" width="7" height="5.5" rx="0.4" />
    </svg>
  );
}

// ── Water bottle (Still Water) — sleek slim shape ────────────
function WaterBottle(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke} {...props}>
      <path d="M14 3 L 18 3 L 18 5 L 18.5 5 L 18.5 8 L 18 8 L 18 10 C 20 12 20 15 20 18 L 20 26 C 20 27 19.2 27.5 18.3 27.5 L 13.7 27.5 C 12.8 27.5 12 27 12 26 L 12 18 C 12 15 12 12 14 10 L 14 8 L 13.5 8 L 13.5 5 L 14 5 Z" />
      <line x1="13" y1="14" x2="19" y2="14" />
      <line x1="13" y1="18" x2="19" y2="18" />
      <line x1="13" y1="22" x2="19" y2="22" />
    </svg>
  );
}

// ── Sparkling glass (Soda Water) — glass with rising bubbles ─
function SparklingGlass(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke} {...props}>
      <path d="M9.5 8 L 22.5 8 L 21.5 26 C 21.5 27 20.7 27.5 19.8 27.5 L 12.2 27.5 C 11.3 27.5 10.5 27 10.5 26 Z" />
      <line x1="9.5" y1="12" x2="22.5" y2="12" />
      {[
        [13, 15],
        [17, 17],
        [20, 14],
        [15, 20],
        [19, 22],
        [13, 22],
      ].map(([cx, cy]) => (
        <circle
          key={`${cx}-${cy}`}
          cx={cx}
          cy={cy}
          r="0.85"
          fill="currentColor"
          stroke="none"
        />
      ))}
    </svg>
  );
}

const iconMap: Record<
  string,
  (p: SVGProps<SVGSVGElement>) => JSX.Element
> = {
  "d-coca": ColaBottle,
  "d-coca-zero": ColaBottle,
  "d-sprite": CitrusBottle,
  "d-singha-yellow": BeerBottle,
  "d-singha-red": BeerBottle,
  "d-singha-pink": BeerBottle,
  "d-water": WaterBottle,
  "d-soda-water": SparklingGlass,
};

export function DrinkIcon({
  id,
  className = "h-6 w-6",
}: {
  id: string;
  className?: string;
}) {
  const Icon = iconMap[id];
  if (!Icon) return null;
  return <Icon className={className} aria-hidden="true" />;
}
