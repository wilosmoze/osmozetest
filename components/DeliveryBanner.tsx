"use client";

import { Scooter, Clock, MapPin } from "@phosphor-icons/react";
import { themeConfig } from "@/config/theme.config";
import { formatPrice } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export function DeliveryBanner() {
  const t = useT();
  const { delivery } = themeConfig;
  const outside = delivery.zones.find((z) => z.id === "outside");

  const body = t("deliv.body", {
    fee: outside ? formatPrice(outside.fee) : "",
    minutes: delivery.estimatedMinutes.max,
    cutoff: t("deliv.cutoff"),
  });

  return (
    <section id="delivery" className="py-12 md:py-16">
      <div className="container-app">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-surface to-surface/40 p-8 md:p-12">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(201,163,92,0.18), transparent 70%)",
            }}
          />

          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="chip">{t("deliv.eyebrow")}</span>
              <h3 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
                {t("deliv.title.1")} <br />
                <span className="text-accent italic">{t("deliv.title.2")}</span>
              </h3>
              <p className="mt-4 max-w-[52ch] text-zinc-400">{body}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              <DeliveryStat
                icon={<MapPin size={22} weight="duotone" />}
                label={t("deliv.rawai")}
                value={t("cart.free")}
                hint={t("deliv.rawai.hint")}
                emphasized
              />
              <DeliveryStat
                icon={<Scooter size={22} weight="duotone" />}
                label={t("deliv.outside")}
                value={outside ? formatPrice(outside.fee) : ""}
                hint={t("deliv.outside.hint")}
              />
              <DeliveryStat
                icon={<Clock size={22} weight="duotone" />}
                label={t("deliv.avg")}
                value={`${delivery.estimatedMinutes.min}–${delivery.estimatedMinutes.max} min`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DeliveryStat({
  icon,
  label,
  value,
  hint,
  emphasized,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  emphasized?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border p-5 transition-colors ${
        emphasized
          ? "border-accent/30 bg-accent/[0.06]"
          : "border-white/[0.06] bg-white/[0.02]"
      }`}
    >
      <div
        className={`flex items-center gap-2 ${
          emphasized ? "text-accent" : "text-zinc-400"
        }`}
      >
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <div
        className={`mt-3 font-display text-2xl font-semibold tracking-tight ${
          emphasized ? "text-accent" : ""
        }`}
      >
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-zinc-500">{hint}</div>}
    </div>
  );
}
