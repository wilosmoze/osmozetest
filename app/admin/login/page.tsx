"use client";

// Note: client component — robots/noindex set via app/robots.ts disallow
// rule (matches /admin/* prefix). Kept simple to avoid Metadata in CC.

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKey, ArrowRight } from "@phosphor-icons/react";
import { themeConfig } from "@/config/theme.config";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Error");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-bg px-6">
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-3xl border border-white/[0.06] bg-surface p-8"
      >
        <div className="font-display text-2xl font-bold tracking-tighter">
          {themeConfig.brand.name}
        </div>
        <div className="mt-1 text-xs uppercase tracking-wider text-zinc-500">
          Team area
        </div>

        <label className="mt-8 block">
          <span className="text-xs uppercase tracking-wider text-zinc-500">
            Password
          </span>
          <div className="relative mt-2">
            <LockKey
              size={16}
              weight="duotone"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
            />
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.02] py-3.5 pl-11 pr-4 text-sm focus:border-accent/60 focus:outline-none"
            />
          </div>
        </label>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/[0.06] px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="mt-6 flex w-full items-center justify-between rounded-full bg-accent px-5 py-4 text-sm font-medium text-zinc-950 transition-all hover:brightness-110 active:translate-y-[1px] disabled:opacity-60"
        >
          <span>{loading ? "Signing in…" : "Access dashboard"}</span>
          <ArrowRight size={18} weight="bold" />
        </button>
      </form>
    </main>
  );
}
