// Vintage line-art icons for the sauces list.
// Designed to echo the icons drawn on the SIDE A menu photo:
// mayo swirl, tomato + leaf, chili, lemon slice, garlic bulb,
// tartare dots, herb leaf. Single stroke color via currentColor.

import type { SVGProps } from "react";

const stroke = {
  viewBox: "0 0 32 32",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// ── Mayo swirl (Chef Mayo) ────────────────────────────────
function MayoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke} {...props}>
      <path d="M7 26 L25 26" />
      <path d="M8.5 26 C 8.5 22 23.5 22 23.5 26" />
      <path d="M10.5 23 C 10.5 19 21.5 19 21.5 23" />
      <path d="M12.5 20 C 12.5 16 19.5 16 19.5 20" />
      <path d="M14 17 C 14 14 18 14 18 17" />
      <path d="M15.2 14 C 15.2 12 16.8 12 16.8 14" />
      <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ── Dijon mustard dollop ─────────────────────────────────
function DijonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke} {...props}>
      <path d="M7 26 L25 26" />
      <path d="M8.5 26 C 8.5 21 23.5 21 23.5 26" />
      <path d="M11 21 C 11 15 21 15 21 21" />
      <path d="M13.5 15 C 13.5 11 18.5 11 18.5 15" />
      <circle cx="16" cy="9" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ── Tomato with leaf (Ketchup) ───────────────────────────
function TomatoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke} {...props}>
      <circle cx="16" cy="19" r="8" />
      <path d="M16 11 L 16 8" />
      <path d="M11 12 C 13 10 16 10.5 16 11 C 16 10.5 19 10 21 12 C 20 13.5 18 13.5 16 13 C 14 13.5 12 13.5 11 12 Z" />
    </svg>
  );
}

// ── Chili pepper (Andalousia + Samouraï) ─────────────────
function ChiliIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke} {...props}>
      <path d="M22.5 8.5 L 24.5 6" />
      <path d="M19 9.5 C 22 8 24 10 23 12" />
      <path d="M23 12 C 25 16 22 22 16 25 C 10 27 6 25 7 22 C 9 18 13 15 19 12" />
    </svg>
  );
}

// ── Lemon slice (Pink Sauce) ─────────────────────────────
function LemonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke} {...props}>
      <circle cx="16" cy="16" r="9" />
      <circle cx="16" cy="16" r="6.5" />
      <line x1="16" y1="9.5" x2="16" y2="22.5" />
      <line x1="9.5" y1="16" x2="22.5" y2="16" />
      <line x1="11.4" y1="11.4" x2="20.6" y2="20.6" />
      <line x1="20.6" y1="11.4" x2="11.4" y2="20.6" />
      <circle cx="16" cy="16" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

// ── Garlic bulb (Garlic Mayo) ────────────────────────────
function GarlicIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke} {...props}>
      <path d="M16 5 C 15 7 14.5 9.5 13.5 12 C 11 15 9 18 10 22 C 11 26 14 27 16 27 C 18 27 21 26 22 22 C 23 18 21 15 18.5 12 C 17.5 9.5 17 7 16 5 Z" />
      <path d="M13 14 L 13.5 26" />
      <path d="M16 13 L 16 27" />
      <path d="M19 14 L 18.5 26" />
    </svg>
  );
}

// ── Tartare (dotted bowl) ────────────────────────────────
function TartareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke} {...props}>
      <circle cx="16" cy="16" r="9" />
      {[
        [12, 12.5],
        [16, 11],
        [20, 13],
        [14, 15],
        [17.5, 14.5],
        [21, 17],
        [12.5, 18],
        [15.5, 19],
        [19, 20],
        [16, 21.5],
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

// ── Leaf / herb (Spicy Chef) ─────────────────────────────
function LeafIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...stroke} {...props}>
      <path d="M16 6 C 22 8 25 14 22.5 20 C 20.5 24.5 16 26.5 12 24.5 C 8 21 9 12 16 6 Z" />
      <path d="M15.5 8 L 14.5 25" />
      <path d="M14.5 12 L 19 10" />
      <path d="M14 16 L 20.5 14" />
      <path d="M13.5 20 L 20.5 18.5" />
    </svg>
  );
}

// ── Mapping ──────────────────────────────────────────────
const iconMap: Record<
  string,
  (p: SVGProps<SVGSVGElement>) => JSX.Element
> = {
  "s-chef-mayo": MayoIcon,
  "s-dijon": DijonIcon,
  "s-ketchup": TomatoIcon,
  "s-andalousia": ChiliIcon,
  "s-samourai": ChiliIcon,
  "s-pink": LemonIcon,
  "s-garlic-mayo": GarlicIcon,
  "s-tartare": TartareIcon,
  "s-algerienne": LeafIcon,
};

export function SauceIcon({
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
