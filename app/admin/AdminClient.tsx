"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  SignOut,
  CookingPot,
  Package,
  Motorcycle,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { Order, OrderStatus } from "@/lib/orders";
import { themeConfig } from "@/config/theme.config";
import { formatPrice } from "@/lib/utils";

const STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; icon: Icon }
> = {
  pending_payment: { label: "En attente paiement", color: "text-zinc-500", icon: Clock },
  preparing:       { label: "En préparation",      color: "text-amber-400", icon: CookingPot },
  ready:           { label: "Prête",               color: "text-blue-400",  icon: Package },
  delivering:      { label: "En livraison",        color: "text-accent",    icon: Motorcycle },
  delivered:       { label: "Livrée",              color: "text-emerald-400", icon: CheckCircle },
  cancelled:       { label: "Annulée",             color: "text-red-400",   icon: XCircle },
};

const STATUS_FLOW: OrderStatus[] = ["preparing", "ready", "delivering", "delivered"];

export function AdminClient({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<"active" | "all">("active");

  useEffect(() => {
    const es = new EventSource("/api/orders/stream");

    es.addEventListener("snapshot", (e) => {
      setOrders(JSON.parse((e as MessageEvent).data));
    });

    es.addEventListener("update", (e) => {
      const updated = JSON.parse((e as MessageEvent).data) as Order;
      setOrders((prev) => {
        const exists = prev.find((o) => o.id === updated.id);
        if (exists) return prev.map((o) => (o.id === updated.id ? updated : o));
        return [updated, ...prev];
      });
    });

    es.onerror = () => {};
    return () => es.close();
  }, []);

  const logout = async () => {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  };

  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter(
      (o) => o.status !== "delivered" && o.status !== "cancelled",
    );
  }, [orders, filter]);

  const stats = useMemo(() => {
    const today = orders.filter(
      (o) => o.createdAt > Date.now() - 86400_000 && o.paymentStatus === "paid",
    );
    return {
      active: orders.filter((o) =>
        ["preparing", "ready", "delivering"].includes(o.status),
      ).length,
      todayCount: today.length,
      todayRevenue: today.reduce((s, o) => s + o.total, 0),
    };
  }, [orders]);

  return (
    <main className="min-h-[100dvh] bg-bg text-white">
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-bg/80 backdrop-blur-xl">
        <div className="container-app flex items-center justify-between py-4">
          <div className="flex items-baseline gap-3">
            <span className="font-display text-lg font-bold tracking-tight">
              {themeConfig.brand.name}
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Cockpit
            </span>
          </div>
          <div className="flex items-center gap-2">
            <LiveDot />
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm transition-colors hover:bg-white/[0.05]"
            >
              <SignOut size={16} weight="duotone" />
              <span>Déconnexion</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container-app py-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="Commandes actives" value={stats.active.toString()} />
          <StatCard label="Aujourd'hui" value={`${stats.todayCount} commandes`} />
          <StatCard label="CA jour" value={formatPrice(stats.todayRevenue)} mono />
        </div>

        <div className="mt-10 flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold tracking-tighter md:text-4xl">
            Commandes
          </h2>
          <div className="inline-flex rounded-full border border-white/10 p-1">
            {(["active", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-4 py-1.5 text-xs uppercase tracking-wider transition-colors ${
                  filter === f ? "bg-white text-zinc-950" : "text-zinc-400 hover:text-white"
                }`}
              >
                {f === "active" ? "Actives" : "Toutes"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 divide-y divide-white/[0.04] border-y border-white/[0.06]">
          <AnimatePresence initial={false}>
            {filtered.length === 0 ? (
              <div className="py-20 text-center text-zinc-500">
                Aucune commande pour l'instant.
              </div>
            ) : (
              filtered.map((order) => <OrderRow key={order.id} order={order} />)
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

function LiveDot() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.02] px-3 py-1.5">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
      </span>
      <span className="text-xs uppercase tracking-wider text-zinc-400">Live</span>
    </div>
  );
}

function StatCard({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-3xl border border-white/[0.06] bg-surface p-5">
      <div className="text-xs uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`mt-3 font-display text-3xl font-bold tracking-tight ${mono ? "font-mono tabular-nums" : ""}`}>
        {value}
      </div>
    </div>
  );
}

function OrderRow({ order }: { order: Order }) {
  const [expanded, setExpanded] = useState(false);
  const [updating, setUpdating] = useState(false);
  const meta = STATUS_META[order.status];
  const Icon = meta.icon;

  const advance = async () => {
    setUpdating(true);
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "advance" }),
    });
    setUpdating(false);
  };

  const setStatus = async (status: OrderStatus) => {
    setUpdating(true);
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setUpdating(false);
  };

  const nextLabel =
    order.status === "preparing" ? "Marquer prête"
    : order.status === "ready" ? "Confier au livreur"
    : order.status === "delivering" ? "Marquer livrée"
    : null;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="py-5"
    >
      <button
        onClick={() => setExpanded((v) => !v)}
        className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 text-left"
      >
        <div className={`flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.06] bg-white/[0.02] ${meta.color}`}>
          <Icon size={18} weight="duotone" />
        </div>

        <div className="min-w-0">
          <div className="flex items-baseline gap-3">
            <span className="font-mono text-sm tabular-nums text-white">#{order.id}</span>
            <span className={`text-xs ${meta.color}`}>{meta.label}</span>
          </div>
          <div className="mt-0.5 truncate text-sm text-zinc-400">
            {order.customer.firstName} {order.customer.lastName} ·{" "}
            <span className="text-zinc-500">{order.customer.city}</span> ·{" "}
            <span className="font-mono tabular-nums">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="font-mono text-xs tabular-nums text-zinc-500">
          {new Date(order.createdAt).toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-5 grid grid-cols-1 gap-6 rounded-2xl bg-white/[0.02] p-5 md:grid-cols-2">
              <div>
                <div className="text-xs uppercase tracking-wider text-zinc-500">Client</div>
                <div className="mt-2 text-sm">
                  {order.customer.firstName} {order.customer.lastName}
                </div>
                <a href={`tel:${order.customer.phone}`} className="block font-mono text-sm text-accent hover:underline">
                  {order.customer.phone}
                </a>
                <div className="mt-3 text-sm text-zinc-400">
                  {order.customer.address}<br />
                  {order.customer.zip} {order.customer.city}
                </div>
                {order.customer.notes && (
                  <div className="mt-3 rounded-lg border border-white/[0.06] bg-zinc-950/40 p-3 text-xs text-zinc-400">
                    <span className="text-zinc-500">Note livreur :</span> {order.customer.notes}
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-zinc-500">Articles</div>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {order.lines.map((l) => (
                    <li key={l.itemId} className="flex items-center justify-between">
                      <span>
                        <span className="font-mono text-zinc-500">×{l.quantity}</span>{" "}{l.name}
                      </span>
                      <span className="font-mono text-xs tabular-nums text-zinc-400">
                        {formatPrice(l.price * l.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 flex justify-between border-t border-white/[0.06] pt-3 text-sm">
                  <span className="text-zinc-500">Livraison</span>
                  <span className="font-mono tabular-nums">
                    {order.deliveryFee === 0 ? "Offerte" : formatPrice(order.deliveryFee)}
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-sm font-medium">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {nextLabel && (
                <button
                  onClick={advance}
                  disabled={updating}
                  className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-zinc-950 transition-all hover:brightness-110 active:translate-y-[1px] disabled:opacity-60"
                >
                  {nextLabel}
                  <ArrowRight size={14} weight="bold" />
                </button>
              )}

              <div className="ml-auto flex flex-wrap gap-1.5">
                {STATUS_FLOW.map((s) => {
                  const active = order.status === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setStatus(s)}
                      disabled={updating}
                      className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-wider transition-colors ${
                        active
                          ? "border-accent bg-accent/10 text-accent"
                          : "border-white/[0.06] text-zinc-500 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {STATUS_META[s].label}
                    </button>
                  );
                })}
                {order.status !== "cancelled" && (
                  <button
                    onClick={() => setStatus("cancelled")}
                    disabled={updating}
                    className="rounded-full border border-white/[0.06] px-3 py-1 text-[11px] uppercase tracking-wider text-zinc-500 hover:border-red-500/30 hover:text-red-400"
                  >
                    Annuler
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
