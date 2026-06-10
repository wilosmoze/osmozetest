"use client";

import { useT } from "@/lib/i18n";

export function Marquee() {
  const t = useT();
  const items = [
    t("marquee.0"),
    t("marquee.1"),
    t("marquee.2"),
    t("marquee.3"),
    t("marquee.4"),
    t("marquee.5"),
  ];
  return (
    <div className="border-y border-white/[0.05] bg-surface/40 py-4 overflow-hidden">
      <div className="flex animate-marquee gap-12 whitespace-nowrap">
        {[...items, ...items, ...items].map((s, i) => (
          <span
            key={i}
            className="font-display text-xl tracking-tight text-zinc-500"
          >
            {s}{" "}
            <span className="ml-12 inline-block h-1 w-1 rounded-full bg-accent align-middle" />
          </span>
        ))}
      </div>
    </div>
  );
}
