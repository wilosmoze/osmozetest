"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { themeConfig } from "@/config/theme.config";
import type { MenuItem } from "@/data/menu";

export type CartLine = { item: MenuItem; quantity: number };

type CartState = {
  lines: CartLine[];
  drawerOpen: boolean;
  add: (item: MenuItem, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  subtotal: () => number;
  deliveryFee: (km?: number) => number;
  total: (km?: number) => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      drawerOpen: false,

      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.item.id === item.id);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.item.id === item.id ? { ...l, quantity: l.quantity + qty } : l,
              ),
              drawerOpen: true,
            };
          }
          return { lines: [...s.lines, { item, quantity: qty }], drawerOpen: true };
        }),

      remove: (id) =>
        set((s) => ({ lines: s.lines.filter((l) => l.item.id !== id) })),

      setQty: (id, qty) =>
        set((s) => ({
          lines:
            qty <= 0
              ? s.lines.filter((l) => l.item.id !== id)
              : s.lines.map((l) =>
                  l.item.id === id ? { ...l, quantity: qty } : l,
                ),
        })),

      clear: () => set({ lines: [] }),
      openDrawer: () => set({ drawerOpen: true }),
      closeDrawer: () => set({ drawerOpen: false }),

      subtotal: () =>
        get().lines.reduce((acc, l) => acc + l.item.price * l.quantity, 0),

      deliveryFee: (km = 4) => {
        const { mode, flatFee, freeAbove, zones } = themeConfig.delivery;
        const sub = get().subtotal();
        if (sub >= freeAbove) return 0;
        if (mode === "free") return 0;
        if (mode === "flat") return flatFee;
        const zone = zones.find((z) => km <= z.maxKm);
        return zone ? zone.fee : zones[zones.length - 1].fee;
      },

      total: (km) => get().subtotal() + get().deliveryFee(km),
      count: () => get().lines.reduce((acc, l) => acc + l.quantity, 0),
    }),
    { name: "braise-cart" },
  ),
);

type OrderState = {
  step: 0 | 1 | 2 | 3;
  start: (orderId: string) => void;
  reset: () => void;
};

export const useOrder = create<OrderState>((set) => ({
  step: 0,
  start: () => {
    set({ step: 1 });
    const [a, b, c] = themeConfig.tracking.mockDurationsMs;
    setTimeout(() => set({ step: 2 }), a);
    setTimeout(() => set({ step: 3 }), a + b);
    setTimeout(() => set({ step: 3 }), a + b + c);
  },
  reset: () => set({ step: 0 }),
}));
