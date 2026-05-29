import { Scooter, Clock, MapPin } from "@phosphor-icons/react/dist/ssr";
import { themeConfig } from "@/config/theme.config";

export function DeliveryBanner() {
  const { delivery } = themeConfig;

  const feeLabel =
    delivery.mode === "free"
      ? "Toujours offerte"
      : delivery.mode === "flat"
        ? `${delivery.flatFee.toFixed(2)} €`
        : `dès ${delivery.zones[0].fee.toFixed(2)} €`;

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
              <span className="chip">Service livraison</span>
              <h3 className="mt-5 font-display text-3xl font-bold leading-tight tracking-tighter md:text-5xl">
                On vient à vous. <br />
                <span className="text-accent italic">Toujours.</span>
              </h3>
              <p className="mt-4 max-w-[52ch] text-zinc-400">
                Notre dark kitchen ne fait pas de salle. Nous livrons directement
                à votre porte, chaud, soigné, en moins de {delivery.estimatedMinutes.max}{" "}
                minutes. {delivery.cutoffMessage}.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3">
              <DeliveryStat
                icon={<Scooter size={22} weight="duotone" />}
                label="Livraison"
                value={feeLabel}
                hint={
                  delivery.mode === "by-distance"
                    ? `Offerte dès ${delivery.freeAbove} €`
                    : undefined
                }
              />
              <DeliveryStat
                icon={<Clock size={22} weight="duotone" />}
                label="Délai moyen"
                value={`${delivery.estimatedMinutes.min}–${delivery.estimatedMinutes.max} min`}
              />
              <DeliveryStat
                icon={<MapPin size={22} weight="duotone" />}
                label="Zones"
                value={`${delivery.zones[delivery.zones.length - 1].maxKm} km max`}
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
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
      <div className="flex items-center gap-2 text-zinc-400">
        {icon}
        <span className="text-xs uppercase tracking-wider">{label}</span>
      </div>
      <div className="mt-3 font-display text-2xl font-semibold tracking-tight">
        {value}
      </div>
      {hint && <div className="mt-1 text-xs text-zinc-500">{hint}</div>}
    </div>
  );
}
