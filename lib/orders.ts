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
  locationUrl: string;   // Lien Google Maps partagé par le client
  notes?: string;        // Digicode, étage, instructions livreur
};

export type StatusEvent = {
  status: OrderStatus;
  by: string; // "admin" | "courier:<name>" | "system" | "stripe"
  at: number;
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
  assignedCourier?: string; // courier name who's delivering it
  history: StatusEvent[];   // append-only audit trail
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

/** Max age before an order is garbage-collected from the in-memory store.
 *  48h is a comfortable window for tracking + dispute resolution.        */
const ORDER_TTL_MS = 48 * 60 * 60 * 1000;

/** Hard cap on stored orders to bound memory in pathological cases. */
const ORDER_HARD_CAP = 1000;

function pruneExpired(now: number) {
  const m = orderStore.orders;
  for (const [id, order] of m) {
    if (now - order.createdAt > ORDER_TTL_MS) m.delete(id);
  }
  if (m.size > ORDER_HARD_CAP) {
    // Drop oldest until we're under the cap
    const sorted = [...m.entries()].sort((a, b) => a[1].createdAt - b[1].createdAt);
    for (let i = 0; i < m.size - ORDER_HARD_CAP; i++) m.delete(sorted[i][0]);
  }
}

export function createOrder(
  data: Omit<
    Order,
    | "id"
    | "createdAt"
    | "updatedAt"
    | "status"
    | "paymentStatus"
    | "history"
    | "assignedCourier"
  >,
): Order {
  const now = Date.now();
  pruneExpired(now); // opportunistic cleanup on every new order
  const order: Order = {
    ...data,
    id: generateOrderId(),
    status: "pending_payment",
    paymentStatus: "unpaid",
    createdAt: now,
    updatedAt: now,
    history: [{ status: "pending_payment", by: "system", at: now }],
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

export function updateOrder(
  id: string,
  patch: Partial<Order>,
  actor: string = "admin",
): Order | null {
  const order = orderStore.orders.get(id);
  if (!order) return null;
  const now = Date.now();
  const next: Order = { ...order, ...patch, updatedAt: now };
  // Append to audit trail when status actually changes
  if (patch.status && patch.status !== order.status) {
    next.history = [
      ...order.history,
      { status: patch.status, by: actor, at: now },
    ];
  }
  orderStore.orders.set(id, next);
  orderStore.emitter.emit("update", next);
  return next;
}

export function advanceStatus(id: string, actor: string = "admin"): Order | null {
  const order = orderStore.orders.get(id);
  if (!order) return null;
  const flow: OrderStatus[] = ["preparing", "ready", "delivering", "delivered"];
  const idx = flow.indexOf(order.status);
  if (idx === -1 || idx === flow.length - 1) return order;
  return updateOrder(id, { status: flow[idx + 1] }, actor);
}

/** Assign an order to a courier and (optionally) move it to delivering. */
export function assignCourier(
  id: string,
  courierName: string,
  pickUp: boolean,
): Order | null {
  const order = orderStore.orders.get(id);
  if (!order) return null;
  const patch: Partial<Order> = { assignedCourier: courierName };
  if (pickUp && order.status === "ready") patch.status = "delivering";
  return updateOrder(id, patch, `courier:${courierName}`);
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
