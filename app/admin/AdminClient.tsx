"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
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
  MapPin,
  NavigationArrow,
  Printer,
  SpeakerHigh,
  SpeakerSlash,
  User,
} from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import type { Order, OrderStatus } from "@/lib/orders";
import { themeConfig } from "@/config/theme.config";
import { formatPrice } from "@/lib/utils";

const STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; icon: Icon }
> = {
  pending_payment: { label: "Awaiting payment", color: "text-zinc-500", icon: Clock },
  preparing:       { label: "Preparing",        color: "text-amber-400", icon: CookingPot },
  ready:           { label: "Ready",            color: "text-blue-400",  icon: Package },
  delivering:      { label: "Out for delivery", color: "text-accent",    icon: Motorcycle },
  delivered:       { label: "Delivered",        color: "text-emerald-400", icon: CheckCircle },
  cancelled:       { label: "Cancelled",        color: "text-red-400",   icon: XCircle },
};

const STATUS_FLOW: OrderStatus[] = ["preparing", "ready", "delivering", "delivered"];

/** Only allow plain http(s) URLs to be used as hrefs (anti-`javascript:`). */
function isSafeHref(value: string | null | undefined): value is string {
  if (!value || typeof value !== "string") return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

/** Short two-tone chime using the Web Audio API (no asset needed). */
function playOrderBell() {
  try {
    const AudioCtx =
      (window as unknown as { AudioContext?: typeof AudioContext })
        .AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const tones = [880, 1320]; // A5 then E6
    tones.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0, ctx.currentTime + i * 0.16);
      gain.gain.linearRampToValueAtTime(0.22, ctx.currentTime + i * 0.16 + 0.02);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + i * 0.16 + 0.35,
      );
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.16);
      osc.stop(ctx.currentTime + i * 0.16 + 0.4);
    });
  } catch {
    /* audio may be blocked until first user gesture */
  }
}

export function AdminClient({ initialOrders }: { initialOrders: Order[] }) {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<"active" | "all">("active");
  const [soundOn, setSoundOn] = useState(true);
  const [couriers, setCouriers] = useState<string[]>([]);
  const knownIdsRef = useRef<Set<string>>(
    new Set(initialOrders.map((o) => o.id)),
  );
  const baseTitleRef = useRef<string>("");
  const flashTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load courier list on mount (for the assign dropdown)
  useEffect(() => {
    fetch("/api/admin/couriers")
      .then((r) => (r.ok ? r.json() : { couriers: [] }))
      .then((d) => setCouriers(d.couriers ?? []))
      .catch(() => {});
  }, []);

  // Persist sound toggle across page reloads
  useEffect(() => {
    const stored = localStorage.getItem("braise.adminSound");
    if (stored === "off") setSoundOn(false);
    baseTitleRef.current = document.title;
  }, []);
  useEffect(() => {
    localStorage.setItem("braise.adminSound", soundOn ? "on" : "off");
  }, [soundOn]);

  const flashTitle = useCallback(() => {
    if (flashTimerRef.current) return;
    let on = false;
    flashTimerRef.current = setInterval(() => {
      on = !on;
      document.title = on
        ? `🔔 New order — ${baseTitleRef.current}`
        : baseTitleRef.current;
    }, 700);
    const stop = () => {
      if (flashTimerRef.current) clearInterval(flashTimerRef.current);
      flashTimerRef.current = null;
      document.title = baseTitleRef.current;
      window.removeEventListener("focus", stop);
      window.removeEventListener("click", stop);
    };
    window.addEventListener("focus", stop, { once: true });
    window.addEventListener("click", stop, { once: true });
  }, []);

  useEffect(() => {
    const es = new EventSource("/api/orders/stream");

    es.addEventListener("snapshot", (e) => {
      const data = JSON.parse((e as MessageEvent).data) as Order[];
      knownIdsRef.current = new Set(data.map((o) => o.id));
      setOrders(data);
    });

    es.addEventListener("update", (e) => {
      const updated = JSON.parse((e as MessageEvent).data) as Order;
      const isNew = !knownIdsRef.current.has(updated.id);
      if (isNew) {
        knownIdsRef.current.add(updated.id);
        if (soundOn) playOrderBell();
        if (document.hidden) flashTitle();
      }
      setOrders((prev) => {
        const exists = prev.find((o) => o.id === updated.id);
        if (exists) return prev.map((o) => (o.id === updated.id ? updated : o));
        return [updated, ...prev];
      });
    });

    es.onerror = () => {};
    return () => es.close();
  }, [soundOn, flashTitle]);

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
    // Only paid & non-cancelled orders count as revenue for the day.
    // Demo-mode orders are auto-marked 'paid' + 'preparing' at checkout,
    // so a later cancel would otherwise inflate the revenue tile.
    const today = orders.filter(
      (o) =>
        o.createdAt > Date.now() - 86400_000 &&
        o.paymentStatus === "paid" &&
        o.status !== "cancelled",
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
              onClick={() => {
                setSoundOn((v) => !v);
                if (!soundOn) playOrderBell(); // test ping when turning on
              }}
              title={soundOn ? "Notifications: ON" : "Notifications: OFF"}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-colors ${
                soundOn
                  ? "border-accent/30 bg-accent/[0.08] text-accent"
                  : "border-white/10 text-zinc-500 hover:bg-white/[0.05]"
              }`}
            >
              {soundOn ? (
                <SpeakerHigh size={16} weight="duotone" />
              ) : (
                <SpeakerSlash size={16} weight="duotone" />
              )}
            </button>
            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm transition-colors hover:bg-white/[0.05]"
            >
              <SignOut size={16} weight="duotone" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="container-app py-8">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatCard label="Active orders" value={stats.active.toString()} />
          <StatCard label="Today" value={`${stats.todayCount} orders`} />
          <StatCard label="Today's revenue" value={formatPrice(stats.todayRevenue)} mono />
        </div>

        <div className="mt-10 flex items-center justify-between">
          <h2 className="font-display text-3xl font-bold tracking-tighter md:text-4xl">
            Orders
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
                {f === "active" ? "Active" : "All"}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 divide-y divide-white/[0.04] border-y border-white/[0.06]">
          <AnimatePresence initial={false}>
            {filtered.length === 0 ? (
              <div className="py-20 text-center text-zinc-500">
                No orders yet.
              </div>
            ) : (
              filtered.map((order) => (
                <OrderRow
                  key={order.id}
                  order={order}
                  couriers={couriers}
                />
              ))
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

function OrderRow({
  order,
  couriers,
}: {
  order: Order;
  couriers: string[];
}) {
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

  const assignTo = async (courier: string) => {
    setUpdating(true);
    await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "assign", courier }),
    });
    setUpdating(false);
  };

  const printUrl = `/admin/print/${order.id}`;

  const nextLabel =
    order.status === "preparing" ? "Mark ready"
    : order.status === "ready" ? "Hand to courier"
    : order.status === "delivering" ? "Mark delivered"
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
            <span className="font-mono tabular-nums">{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="font-mono text-xs tabular-nums text-zinc-500">
          {new Date(order.createdAt).toLocaleTimeString("en-GB", {
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
                <div className="text-xs uppercase tracking-wider text-zinc-500">Customer</div>
                <div className="mt-2 text-sm">
                  {order.customer.firstName} {order.customer.lastName}
                </div>
                <a href={`tel:${order.customer.phone}`} className="block font-mono text-sm text-accent hover:underline">
                  {order.customer.phone}
                </a>

                <div className="mt-4 space-y-2">
                  {isSafeHref(order.customer.locationUrl) ? (
                    <a
                      href={order.customer.locationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-between gap-2 rounded-2xl border border-accent/40 bg-accent/[0.08] px-4 py-3 text-sm text-accent transition-all hover:bg-accent hover:text-zinc-950 active:translate-y-[1px]"
                    >
                      <span className="flex items-center gap-2">
                        <NavigationArrow size={16} weight="fill" />
                        Navigate (Google Maps)
                      </span>
                      <MapPin size={16} weight="duotone" />
                    </a>
                  ) : (
                    <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.06] px-4 py-3 text-xs text-red-300">
                      ⚠ Unsafe or missing location URL — verify with the customer.
                    </div>
                  )}
                  {/* React already escapes text — but truncate to keep it sane */}
                  <div className="break-all rounded-lg border border-white/[0.04] bg-zinc-950/40 p-2.5 font-mono text-[10px] text-zinc-500">
                    {(order.customer.locationUrl ?? "").slice(0, 300)}
                  </div>
                </div>

                {order.customer.notes && (
                  <div className="mt-3 rounded-lg border border-white/[0.06] bg-zinc-950/40 p-3 text-xs text-zinc-400">
                    <span className="text-zinc-500">Courier note:</span> {order.customer.notes}
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-zinc-500">Items</div>
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
                  <span className="text-zinc-500">Delivery</span>
                  <span className="font-mono tabular-nums">
                    {order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}
                  </span>
                </div>
                <div className="mt-1 flex justify-between text-sm font-medium">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">{formatPrice(order.total)}</span>
                </div>
              </div>
            </div>

            {/* ---------- COURIER ASSIGNMENT + AUDIT ---------- */}
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/[0.06] pt-4">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <User size={14} weight="duotone" />
                <span className="uppercase tracking-wider">Courier:</span>
                <span
                  className={`font-medium ${
                    order.assignedCourier ? "text-accent" : "text-zinc-600"
                  }`}
                >
                  {order.assignedCourier ?? "Unassigned"}
                </span>
              </div>

              {couriers.length > 0 && order.status !== "delivered" && order.status !== "cancelled" && (
                <select
                  value={order.assignedCourier ?? ""}
                  onChange={(e) => {
                    if (e.target.value) assignTo(e.target.value);
                  }}
                  disabled={updating}
                  className="ml-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300 focus:border-accent/60 focus:outline-none"
                >
                  <option value="" className="bg-zinc-900">
                    Assign to…
                  </option>
                  {couriers.map((c) => (
                    <option key={c} value={c} className="bg-zinc-900">
                      {c}
                    </option>
                  ))}
                </select>
              )}

              <Link
                href={`/admin/print/${order.id}`}
                target="_blank"
                className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs text-zinc-300 transition-colors hover:bg-white/[0.08] hover:text-white"
              >
                <Printer size={13} weight="duotone" />
                Print receipt
              </Link>
            </div>

            {/* ---------- AUDIT TRAIL ---------- */}
            {order.history && order.history.length > 1 && (
              <details className="mt-3 group">
                <summary className="cursor-pointer text-[10px] uppercase tracking-widest text-zinc-600 hover:text-zinc-400">
                  Audit trail ({order.history.length})
                </summary>
                <ul className="mt-2 space-y-1 text-[11px] text-zinc-500 font-mono">
                  {order.history.map((h, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="text-zinc-600">
                        {new Date(h.at).toLocaleTimeString("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                      <span className="rounded bg-white/[0.04] px-1.5 py-0.5">
                        {h.by}
                      </span>
                      <span className="text-zinc-400">{h.status}</span>
                    </li>
                  ))}
                </ul>
              </details>
            )}

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
                    Cancel
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
