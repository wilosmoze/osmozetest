import { Scooter, Clock, MapPin } from "@phosphor-icons/react/dist/ssr";
import { themeConfig } from "@/config/theme.config";
import { formatPrice } from "@/lib/utils";

export function DeliveryBanner() {
  const { delivery } = themeConfig;
  const rawai = delivery.zones.find((z) => z.id === "rawai");
  const outside = delivery.zones.find((z) => z.id === "outside");

  return (
    <section id="delivery" className="py-12 md:py-16">
      <div className="container-app">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-br from-surface to-surface/40 p-8 md:p-12">
          <div
            aria-hidden
            className="absolute -right-20 -top-20 h-72 w-72 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(224,113,44,0.18), transparent 70%)",
            }}
          />

          <div className="relative grid grid-cols-1 gap-10 md:grid-cols-2 md:items-center">
            <div>
              <span className="chip">Delivery service</span>
              <h3 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
                Free across Rawai. <br />
                <span className="text-accent italic">Always.</span>
              </h3>
              <p className="mt-4 max-w-[52ch] text-zinc-400">
                Our kitchen is based in Rawai and we deliver throughout the
                whole area at no cost. Outside Rawai? A flat{" "}
                {outside ? formatPrice(outside.fee) : ""} fee covers the extra
                ride. Sealed tight, arrives hot in under{" "}
                {delivery.estimatedMinutes.max} minutes. {delivery.cutoffMessage}.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              <DeliveryStat
                icon={<MapPin size={22} weight="duotone" />}
                label="Rawai"
                value="Free"
                hint={rawai?.description}
                emphasized
              />
              <DeliveryStat
                icon={<Scooter size={22} weight="duotone" />}
                label="Outside Rawai"
                value={outside ? formatPrice(outside.fee) : ""}
                hint="Flat fee, nearby areas"
              />
              <DeliveryStat
                icon={<Clock size={22} weight="duotone" />}
                label="Avg. time"
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
