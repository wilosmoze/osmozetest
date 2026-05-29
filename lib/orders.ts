// ============================================================
//  SERVER-ONLY: order store + pub/sub bus pour SSE.
//  En production : remplacer par Postgres + Redis pub/sub.
// ============================================================
import "server-only";
import { EventEmitter } from "node:events";
import { randomBytes } from "node:crypto";

export type OrderStatus =
  | "pending_payment"
  | "preparing"
  | "ready"
  | "delivering"
  | "delivered"
  | "cancelled";

export type OrderLine = {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderCustomer = {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  zip: string;
  notes?: string;
};

export type Order = {
  id: string;
  status: OrderStatus;
  paymentStatus: "unpaid" | "paid" | "failed";
  stripeSessionId?: string;
  customer: OrderCustomer;
  lines: OrderLine[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: number;
  updatedAt: number;
};

type Store = {
  orders: Map<string, Order>;
  emitter: EventEmitter;
};

const g = globalThis as unknown as { __braiseStore?: Store };
if (!g.__braiseStore) {
  const emitter = new EventEmitter();
  emitter.setMaxListeners(0);
  g.__braiseStore = { orders: new Map(), emitter };
}
export const orderStore = g.__braiseStore;

export function generateOrderId() {
  return `BR-${randomBytes(4).toString("hex").toUpperCase()}`;
}

export function createOrder(
  data: Omit<Order, "id" | "createdAt" | "updatedAt" | "status" | "paymentStatus">,
): Order {
  const now = Date.now();
  const order: Order = {
    ...data,
    id: generateOrderId(),
    status: "pending_payment",
    paymentStatus: "unpaid",
    createdAt: now,
    updatedAt: now,
  };
  orderStore.orders.set(order.id, order);
  orderStore.emitter.emit("update", order);
  return order;
}

export function getOrder(id: string): Order | undefined {
  return orderStore.orders.get(id);
}

export function listOrders(): Order[] {
  return [...orderStore.orders.values()].sort(
    (a, b) => b.createdAt - a.createdAt,
  );
}

export function updateOrder(id: string, patch: Partial<Order>): Order | null {
  const order = orderStore.orders.get(id);
  if (!order) return null;
  const next: Order = { ...order, ...patch, updatedAt: Date.now() };
  orderStore.orders.set(id, next);
  orderStore.emitter.emit("update", next);
  return next;
}

export function advanceStatus(id: string): Order | null {
  const order = orderStore.orders.get(id);
  if (!order) return null;
  const flow: OrderStatus[] = ["preparing", "ready", "delivering", "delivered"];
  const idx = flow.indexOf(order.status);
  if (idx === -1 || idx === flow.length - 1) return order;
  return updateOrder(id, { status: flow[idx + 1] });
}

export function statusToStep(s: OrderStatus): 0 | 1 | 2 | 3 {
  switch (s) {
    case "preparing": return 1;
    case "ready": return 2;
    case "delivering":
    case "delivered": return 3;
    default: return 0;
  }
}
