// ============================================================
//  Order store — Postgres (when configured) or in-memory fallback.
//
//  All read/write APIs are async. The in-process EventEmitter is
//  kept for SSE pub/sub: writes inside the same Vercel function
//  notify subscribers immediately. For cross-instance fan-out
//  (multi-instance deployments) we'd add Postgres LISTEN/NOTIFY
//  or Redis — out of scope here, single-instance is enough for
//  small dark-kitchen ops.
// ============================================================
import "server-only";
import { EventEmitter } from "node:events";
import { randomBytes } from "node:crypto";
import { dbEnabled, ensureSchema, sql } from "@/lib/db";

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
  locationUrl: string;
  notes?: string;
};

export type StatusEvent = {
  status: OrderStatus;
  by: string;
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
  assignedCourier?: string;
  history: StatusEvent[];
};

// -------- Globals (survive HMR in dev) --------
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

// -------- TTL config --------
const ORDER_TTL_MS = 48 * 60 * 60 * 1000;
const ORDER_HARD_CAP = 1000;

export function generateOrderId() {
  return `BR-${randomBytes(4).toString("hex").toUpperCase()}`;
}

// =========================================================
//  Row mapping helpers (Postgres ↔ Order)
// =========================================================

type Row = {
  id: string;
  status: OrderStatus;
  payment_status: "unpaid" | "paid" | "failed";
  stripe_session_id: string | null;
  customer: OrderCustomer;
  lines: OrderLine[];
  subtotal: string | number;
  delivery_fee: string | number;
  total: string | number;
  assigned_courier: string | null;
  history: StatusEvent[];
  created_at: string | number;
  updated_at: string | number;
};

function rowToOrder(r: Row): Order {
  return {
    id: r.id,
    status: r.status,
    paymentStatus: r.payment_status,
    stripeSessionId: r.stripe_session_id ?? undefined,
    customer: r.customer,
    lines: r.lines,
    subtotal: Number(r.subtotal),
    deliveryFee: Number(r.delivery_fee),
    total: Number(r.total),
    assignedCourier: r.assigned_courier ?? undefined,
    history: r.history ?? [],
    createdAt: Number(r.created_at),
    updatedAt: Number(r.updated_at),
  };
}

// =========================================================
//  CRUD — async; Postgres-first with in-memory fallback
// =========================================================

export async function createOrder(
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
): Promise<Order> {
  const now = Date.now();
  const order: Order = {
    ...data,
    id: generateOrderId(),
    status: "pending_payment",
    paymentStatus: "unpaid",
    createdAt: now,
    updatedAt: now,
    history: [{ status: "pending_payment", by: "system", at: now }],
  };

  if (dbEnabled) {
    await ensureSchema();
    await sql`
      INSERT INTO orders (
        id, status, payment_status,
        customer, lines,
        subtotal, delivery_fee, total,
        history, created_at, updated_at
      ) VALUES (
        ${order.id}, ${order.status}, ${order.paymentStatus},
        ${JSON.stringify(order.customer)}::jsonb,
        ${JSON.stringify(order.lines)}::jsonb,
        ${order.subtotal}, ${order.deliveryFee}, ${order.total},
        ${JSON.stringify(order.history)}::jsonb,
        ${order.createdAt}, ${order.updatedAt}
      )
    `;
    // Opportunistic pruning (background)
    sql`DELETE FROM orders WHERE created_at < ${now - ORDER_TTL_MS}`.catch(
      () => {},
    );
  } else {
    pruneExpiredMemory(now);
    orderStore.orders.set(order.id, order);
  }

  orderStore.emitter.emit("update", order);
  return order;
}

export async function getOrder(id: string): Promise<Order | undefined> {
  if (dbEnabled) {
    await ensureSchema();
    const { rows } = await sql<Row>`SELECT * FROM orders WHERE id = ${id}`;
    return rows[0] ? rowToOrder(rows[0]) : undefined;
  }
  return orderStore.orders.get(id);
}

export async function listOrders(): Promise<Order[]> {
  if (dbEnabled) {
    await ensureSchema();
    const { rows } =
      await sql<Row>`SELECT * FROM orders ORDER BY created_at DESC LIMIT 500`;
    return rows.map(rowToOrder);
  }
  return [...orderStore.orders.values()].sort(
    (a, b) => b.createdAt - a.createdAt,
  );
}

export async function updateOrder(
  id: string,
  patch: Partial<Order>,
  actor: string = "admin",
): Promise<Order | null> {
  if (dbEnabled) {
    await ensureSchema();
    const current = await getOrder(id);
    if (!current) return null;
    const now = Date.now();
    const next: Order = { ...current, ...patch, updatedAt: now };
    if (patch.status && patch.status !== current.status) {
      next.history = [
        ...current.history,
        { status: patch.status, by: actor, at: now },
      ];
    }
    await sql`
      UPDATE orders SET
        status = ${next.status},
        payment_status = ${next.paymentStatus},
        stripe_session_id = ${next.stripeSessionId ?? null},
        customer = ${JSON.stringify(next.customer)}::jsonb,
        lines = ${JSON.stringify(next.lines)}::jsonb,
        subtotal = ${next.subtotal},
        delivery_fee = ${next.deliveryFee},
        total = ${next.total},
        assigned_courier = ${next.assignedCourier ?? null},
        history = ${JSON.stringify(next.history)}::jsonb,
        updated_at = ${now}
      WHERE id = ${id}
    `;
    orderStore.emitter.emit("update", next);
    return next;
  }

  // In-memory fallback
  const order = orderStore.orders.get(id);
  if (!order) return null;
  const now = Date.now();
  const next: Order = { ...order, ...patch, updatedAt: now };
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

export async function advanceStatus(
  id: string,
  actor: string = "admin",
): Promise<Order | null> {
  const order = await getOrder(id);
  if (!order) return null;
  const flow: OrderStatus[] = ["preparing", "ready", "delivering", "delivered"];
  const idx = flow.indexOf(order.status);
  if (idx === -1 || idx === flow.length - 1) return order;
  return updateOrder(id, { status: flow[idx + 1] }, actor);
}

export async function assignCourier(
  id: string,
  courierName: string,
  pickUp: boolean,
): Promise<Order | null> {
  const order = await getOrder(id);
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

// -------- Memory-only TTL pruning (DB version uses background DELETE) --------
function pruneExpiredMemory(now: number) {
  const m = orderStore.orders;
  for (const [id, order] of m) {
    if (now - order.createdAt > ORDER_TTL_MS) m.delete(id);
  }
  if (m.size > ORDER_HARD_CAP) {
    const sorted = [...m.entries()].sort(
      (a, b) => a[1].createdAt - b[1].createdAt,
    );
    for (let i = 0; i < m.size - ORDER_HARD_CAP; i++) m.delete(sorted[i][0]);
  }
}
