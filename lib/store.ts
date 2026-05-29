"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { themeConfig } from "@/config/theme.config";
import type { MenuItem } from "@/data/menu";

export type CartLine = { item: MenuItem; quantity: number };

type CartState = {
  lines: CartLine[];
  drawerOpen: boolean;
  deliveryZoneId: string;
  add: (item: MenuItem, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setDeliveryZone: (zoneId: string) => void;
  subtotal: () => number;
  deliveryFee: () => number;
  total: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      drawerOpen: false,
      deliveryZoneId: themeConfig.delivery.defaultZoneId,

      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.lines.find((l) => l.item.id === item.id);
          if (existing) {
            return {
              lines: s.lines.map((l) =>
                l.item.id === item.id ? { ...l, quantity: l.quantity + qty } : l,
              ),
            };
          }
          return { lines: [...s.lines, { item, quantity: qty }] };
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

      setDeliveryZone: (zoneId) => set({ deliveryZoneId: zoneId }),

      subtotal: () =>
        get().lines.reduce((acc, l) => acc + l.item.price * l.quantity, 0),

      deliveryFee: () => {
        const zone = themeConfig.delivery.zones.find(
          (z) => z.id === get().deliveryZoneId,
        );
        return zone ? zone.fee : 0;
      },

      total: () => get().subtotal() + get().deliveryFee(),
      count: () => get().lines.reduce((acc, l) => acc + l.quantity, 0),
    }),
    { name: "braise-cart" },
  ),
);

export type OrderSnapshot = {
  id: string;
  lines: { itemId: string; name: string; price: number; quantity: number }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: number;
};

type OrderState = {
  step: 0 | 1 | 2 | 3;
  lastOrder: OrderSnapshot | null;
  start: (snapshot: OrderSnapshot) => void;
  reset: () => void;
};

// ---------- UI state (menu modal, etc.) ----------
type UIState = {
  menuOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

export const useUI = create<UIState>((set) => ({
  menuOpen: false,
  openMenu: () => set({ menuOpen: true }),
  closeMenu: () => set({ menuOpen: false }),
}));

export const useOrder = create<OrderState>((set) => ({
  step: 0,
  lastOrder: null,
  start: (snapshot) => {
    set({ step: 1, lastOrder: snapshot });
    const [a, b, c] = themeConfig.tracking.mockDurationsMs;
    setTimeout(() => set({ step: 2 }), a);
    setTimeout(() => set({ step: 3 }), a + b);
    setTimeout(() => set({ step: 3 }), a + b + c);
  },
  reset: () => set({ step: 0, lastOrder: null }),
}));
