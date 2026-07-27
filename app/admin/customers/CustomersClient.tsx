"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  MagnifyingGlass,
  Phone,
  EnvelopeSimple,
  Crown,
  Sparkle,
  Users,
} from "@phosphor-icons/react";
import { formatPrice } from "@/lib/utils";
import { themeConfig } from "@/config/theme.config";
import type { Customer } from "@/app/api/admin/customers/route";

export function CustomersClient() {
  const [customers, setCustomers] = useState<Customer[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    fetch("/api/admin/customers", { cache: "no-store" })
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load customers");
        return r.json();
      })
      .then((data) => setCustomers(data.customers))
      .catch((e) => setError((e as Error).message));
  }, []);

  const filtered = useMemo(() => {
    if (!customers) return [];
    const needle = q.trim().toLowerCase();
    if (!needle) return customers;
    return customers.filter(
      (c) =>
        c.phone.toLowerCase().includes(needle) ||
        c.name.toLowerCase().includes(needle) ||
        (c.email?.toLowerCase() ?? "").includes(needle),
    );
  }, [customers, q]);

  const totals = useMemo(() => {
    if (!customers) return { count: 0, orders: 0, revenue: 0, vip: 0, loyal: 0 };
    return customers.reduce(
      (acc, c) => ({
        count: acc.count + 1,
        orders: acc.orders + c.orderCount,
        revenue: acc.revenue + c.totalSpent,
        vip: acc.vip + (c.milestone === "vip" ? 1 : 0),
        loyal: acc.loyal + (c.milestone === "loyal" ? 1 : 0),
      }),
      { count: 0, orders: 0, revenue: 0, vip: 0, loyal: 0 },
    );
  }, [customers]);

  return (
    <main className="min-h-[100dvh] bg-bg text-white">
      <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-bg/80 backdrop-blur-xl">
        <div className="container-app flex items-center justify-between py-4">
          <div className="flex items-baseline gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm text-zinc-400 transition-colors hover:text-white"
            >
              <ArrowLeft size={14} weight="bold" />
              <span>Cockpit</span>
            </Link>
            <span className="text-zinc-700">/</span>
            <span className="font-display text-lg font-bold tracking-tight">
              {themeConfig.brand.name}
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-zinc-500">
              Customers
            </span>
          </div>
        </div>
      </header>

      <section className="container-app py-8 md:py-12">
        {/* Stats tiles */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          <StatTile
            icon={<Users size={16} weight="duotone" />}
            label="Unique customers"
            value={totals.count.toString()}
          />
          <StatTile
            icon={<span className="font-mono">Σ</span>}
            label="Total paid orders"
            value={totals.orders.toString()}
          />
          <StatTile
            icon={<span className="font-mono">฿</span>}
            label="Lifetime revenue"
            value={formatPrice(totals.revenue)}
            mono
          />
          <StatTile
            icon={<Crown size={16} weight="duotone" className="text-rose-400" />}
            label={`VIP × ${totals.vip}  ·  Loyal × ${totals.loyal}`}
            value="Milestones"
          />
        </div>

        {/* Search */}
        <div className="mt-8">
          <div className="relative">
            <MagnifyingGlass
              size={16}
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, phone, or email…"
              className="w-full rounded-full border border-white/[0.06] bg-surface/60 px-11 py-3 text-sm text-white placeholder:text-zinc-500 focus:border-accent/60 focus:outline-none"
            />
          </div>
        </div>

        {/* List */}
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/[0.06] bg-surface/40">
          {error ? (
            <div className="p-8 text-center text-rose-400">{error}</div>
          ) : !customers ? (
            <div className="p-8 text-center text-zinc-500">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-zinc-500">
              {q ? "No customer matches." : "No customer yet."}
            </div>
          ) : (
            <ul className="divide-y divide-white/[0.05]">
              {filtered.map((c) => (
                <CustomerRow key={c.phone} c={c} />
              ))}
            </ul>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-zinc-600">
          Grouped by phone number. Cancelled orders excluded from the count &
          revenue but shown separately per row.
        </p>
      </section>
    </main>
  );
}

// ─────────────────────────────────────────────────────────────

function StatTile({
  icon,
  label,
  value,
  mono,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-surface/60 p-4">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-zinc-500">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <div
        className={`mt-2 text-2xl font-semibold ${mono ? "font-mono tabular-nums" : "font-display tracking-tight"}`}
      >
        {value}
      </div>
    </div>
  );
}

function CustomerRow({ c }: { c: Customer }) {
  const tone =
    c.milestone === "vip"
      ? "border-l-2 border-l-rose-500/70 bg-rose-500/[0.04]"
      : c.milestone === "loyal"
        ? "border-l-2 border-l-sky-400/70 bg-sky-400/[0.04]"
        : "";

  return (
    <li
      className={`flex flex-col gap-3 px-5 py-4 transition-colors md:flex-row md:items-center md:gap-5 ${tone}`}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="font-display text-base font-semibold text-white">
            {c.name || "—"}
          </span>
          {c.milestone === "vip" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/40 bg-rose-500/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-rose-300">
              <Crown size={10} weight="fill" />
              VIP · {c.orderCount}
            </span>
          )}
          {c.milestone === "loyal" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-sky-400/40 bg-sky-400/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-sky-300">
              <Sparkle size={10} weight="fill" />
              Loyal · {c.orderCount}
            </span>
          )}
        </div>
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1.5 font-mono">
            <Phone size={12} weight="duotone" />
            <a
              href={`tel:${c.phone}`}
              className="hover:text-accent"
            >
              {c.phone}
            </a>
          </span>
          {c.email && (
            <span className="inline-flex items-center gap-1.5">
              <EnvelopeSimple size={12} weight="duotone" />
              <a
                href={`mailto:${c.email}`}
                className="hover:text-accent"
              >
                {c.email}
              </a>
            </span>
          )}
          {c.cancelledCount > 0 && (
            <span className="text-rose-400/70">
              {c.cancelledCount} cancelled
            </span>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-baseline gap-6 md:gap-8">
        <div className="text-right">
          <div className="font-mono text-sm tabular-nums text-white">
            {c.orderCount}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-zinc-500">
            orders
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-sm tabular-nums text-white">
            {formatPrice(c.totalSpent)}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-zinc-500">
            spent
          </div>
        </div>
        <div className="hidden text-right md:block">
          <div className="font-mono text-xs tabular-nums text-zinc-400">
            {new Date(c.lastOrderAt).toLocaleDateString()}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-zinc-500">
            last order
          </div>
        </div>
      </div>
    </li>
  );
}
