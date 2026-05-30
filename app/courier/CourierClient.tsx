"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  SignOut,
  NavigationArrow,
  MapPin,
  Phone,
  CheckCircle,
  Package,
  Motorcycle,
  Hourglass,
} from "@phosphor-icons/react";
import { themeConfig } from "@/config/theme.config";

type CourierOrder = {
  id: string;
  status: "ready" | "delivering" | "delivered";
  createdAt: number;
  updatedAt: number;
  assignedCourier?: string;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    locationUrl: string;
    notes?: string;
  };
  lines: { name: string; quantity: number }[];
};

function isSafeHref(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    const u = new URL(value);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function CourierClient() {
  const router = useRouter();
  const [orders, setOrders] = useState<CourierOrder[]>([]);
  const [courier, setCourier] = useState<string>("");
  const [tab, setTab] = useState<"ready" | "mine" | "done">("ready");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/courier/orders", { cache: "no-store" });
      if (res.status === 401) {
        router.push("/courier/login");
        return;
      }
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setCourier(data.courier);
      setOrders(data.orders);
    } catch (e) {
      setError("Couldn't refresh — check your connection.");
    }
  }, [router]);

  // Poll every 8 seconds — simple and bulletproof for small ops
  useEffect(() => {
    refresh();
    const id = setInterval(refresh, 8000);
    return () => clearInterval(id);
  }, [refresh]);

  const act = async (orderId: string, action: "pickup" | "delivered") => {
    setBusyId(orderId);
    setError(null);
    try {
      const res = await fetch(`/api/courier/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Action failed");
      }
      await refresh();
    } finally {
      setBusyId(null);
    }
  };

  const logout = async () => {
    await fetch("/api/courier/login", { method: "DELETE" });
    router.push("/courier/login");
    router.refresh();
  };

  const ready = orders.filter((o) => o.status === "ready");
  const mine = orders.filter(
    (o) => o.status === "delivering" && o.assignedCourier === courier,
  );
  const done = orders.filter(
    (o) => o.status === "delivered" && o.assignedCourier === courier,
  );

  const list = tab === "ready" ? ready : tab === "mine" ? mine : done;

  return (
    <main className="min-h-[100dvh] bg-bg text-white">
      {/* Topbar */}
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-bg/80 backdrop-blur-xl">
        <div className="container-app flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-bold tracking-tight">
              {themeConfig.brand.name}
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Courier · {courier}
            </span>
          </div>
          <button
            onClick={logout}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm transition-colors hover:bg-white/[0.05]"
          >
            <SignOut size={16} weight="duotone" />
            <span>Sign out</span>
          </button>
        </div>
      </header>

      <div className="container-app py-6">
        {/* Tabs */}
        <div className="grid grid-cols-3 gap-1 rounded-2xl border border-white/[0.06] bg-surface p-1">
          <TabBtn
            label="Ready"
            count={ready.length}
            icon={<Package size={16} weight="duotone" />}
            active={tab === "ready"}
            onClick={() => setTab("ready")}
          />
          <TabBtn
            label="My route"
            count={mine.length}
            icon={<Motorcycle size={16} weight="duotone" />}
            active={tab === "mine"}
            onClick={() => setTab("mine")}
          />
          <TabBtn
            label="Done"
            count={done.length}
            icon={<CheckCircle size={16} weight="duotone" />}
            active={tab === "done"}
            onClick={() => setTab("done")}
          />
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* List */}
        <div className="mt-5 space-y-3">
          <AnimatePresence initial={false}>
            {list.length === 0 ? (
              <EmptyState tab={tab} />
            ) : (
              list.map((o) => (
                <OrderCard
                  key={o.id}
                  order={o}
                  isMine={o.assignedCourier === courier}
                  onAction={act}
                  busy={busyId === o.id}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}

function TabBtn({
  label,
  count,
  icon,
  active,
  onClick,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-xl px-3 py-3 text-xs transition-all ${
        active
          ? "bg-accent text-zinc-950"
          : "text-zinc-400 hover:bg-white/[0.04]"
      }`}
    >
      <span className="flex items-center gap-1.5">
        {icon}
        <span className="font-medium uppercase tracking-wider">{label}</span>
      </span>
      <span
        className={`font-mono text-[10px] tabular-nums ${
          active ? "text-zinc-800" : "text-zinc-500"
        }`}
      >
        {count} order{count === 1 ? "" : "s"}
      </span>
    </button>
  );
}

function EmptyState({ tab }: { tab: "ready" | "mine" | "done" }) {
  const msg =
    tab === "ready"
      ? "Nothing ready to pick up yet."
      : tab === "mine"
        ? "No active deliveries — grab one from the Ready tab."
        : "No completed deliveries in the last 4 hours.";
  return (
    <div className="rounded-2xl border border-dashed border-white/[0.06] bg-surface/40 px-6 py-12 text-center text-sm text-zinc-500">
      <Hourglass
        size={28}
        weight="duotone"
        className="mx-auto mb-3 text-zinc-600"
      />
      {msg}
    </div>
  );
}

function OrderCard({
  order,
  isMine,
  onAction,
  busy,
}: {
  order: CourierOrder;
  isMine: boolean;
  onAction: (id: string, action: "pickup" | "delivered") => void;
  busy: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 200, damping: 22 }}
      className="rounded-3xl border border-white/[0.06] bg-surface p-5"
    >
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="font-mono text-xs tabular-nums text-zinc-500">
            #{order.id}
          </div>
          <div className="mt-1 font-display text-lg font-semibold leading-tight">
            {order.customer.firstName} {order.customer.lastName}
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-xs tabular-nums text-zinc-500">
            {new Date(order.createdAt).toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>

      {/* Items */}
      <ul className="mt-3 space-y-1 text-sm text-zinc-300">
        {order.lines.map((l, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="font-mono text-xs text-zinc-500">×{l.quantity}</span>
            <span>{l.name}</span>
          </li>
        ))}
      </ul>

      {/* Notes */}
      {order.customer.notes && (
        <div className="mt-3 rounded-xl border border-white/[0.06] bg-zinc-950/40 p-3 text-xs text-zinc-400">
          <span className="text-zinc-500">Note:</span> {order.customer.notes}
        </div>
      )}

      {/* Action row */}
      <div className="mt-4 grid grid-cols-2 gap-2">
        {isSafeHref(order.customer.locationUrl) ? (
          <a
            href={order.customer.locationUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 rounded-full border border-accent/40 bg-accent/[0.08] px-4 py-3 text-sm text-accent transition-colors hover:bg-accent hover:text-zinc-950 active:translate-y-[1px]"
          >
            <NavigationArrow size={16} weight="fill" />
            Navigate
          </a>
        ) : (
          <div className="rounded-full border border-red-500/30 bg-red-500/[0.06] px-4 py-3 text-center text-xs text-red-300">
            ⚠ Invalid location
          </div>
        )}

        <a
          href={`tel:${order.customer.phone}`}
          className="flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-sm transition-colors hover:bg-white/[0.08] active:translate-y-[1px]"
        >
          <Phone size={16} weight="duotone" />
          Call
        </a>
      </div>

      {/* Status action */}
      {order.status === "ready" && (
        <button
          onClick={() => onAction(order.id, "pickup")}
          disabled={busy}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-4 text-sm font-medium text-zinc-950 transition-all hover:brightness-110 active:translate-y-[1px] disabled:opacity-60"
        >
          <Motorcycle size={18} weight="duotone" />
          {busy ? "Picking up…" : "Pick up this order"}
        </button>
      )}

      {order.status === "delivering" && isMine && (
        <button
          onClick={() => onAction(order.id, "delivered")}
          disabled={busy}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-emerald-500/15 px-5 py-4 text-sm font-medium text-emerald-300 transition-all hover:bg-emerald-500 hover:text-zinc-950 active:translate-y-[1px] disabled:opacity-60"
        >
          <CheckCircle size={18} weight="duotone" />
          {busy ? "Confirming…" : "Mark as delivered"}
        </button>
      )}

      {order.status === "delivered" && (
        <div className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/[0.04] px-5 py-3 text-xs uppercase tracking-wider text-emerald-300">
          <CheckCircle size={14} weight="fill" />
          Delivered ·{" "}
          {new Date(order.updatedAt).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      )}
    </motion.div>
  );
}
