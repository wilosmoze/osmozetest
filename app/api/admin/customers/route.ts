import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listOrders, type Order } from "@/lib/orders";

export const runtime = "nodejs";

export type Customer = {
  phone: string;
  name: string;
  email: string | null;
  orderCount: number;
  totalSpent: number;
  firstOrderAt: number;
  lastOrderAt: number;
  cancelledCount: number;
  // Convenience precomputed on the server so the client doesn't
  // have to recompute every render (and stays consistent with any
  // future rule change).
  milestone: "vip" | "loyal" | null;
};

/**
 * Milestone rule (matches the admin request):
 *   - Order count multiple of 30 → 'vip' (red alert)
 *   - Order count multiple of 10 (but not 30) → 'loyal' (blue alert)
 *   - Otherwise → null
 */
function milestoneFor(count: number): Customer["milestone"] {
  if (count > 0 && count % 30 === 0) return "vip";
  if (count > 0 && count % 10 === 0) return "loyal";
  return null;
}

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const orders = await listOrders();

  const byPhone = new Map<string, Customer>();
  for (const o of orders) {
    const phone = o.customer.phone?.trim();
    if (!phone) continue;

    const existing = byPhone.get(phone);
    if (!existing) {
      byPhone.set(phone, buildFromFirstOrder(o));
      continue;
    }

    // Cancelled orders don't count as paid revenue but we track them
    // separately so admin can spot a customer who cancels a lot.
    if (o.status === "cancelled") {
      existing.cancelledCount += 1;
    } else if (o.paymentStatus === "paid") {
      existing.orderCount += 1;
      existing.totalSpent += o.total;
    }

    // Freshest name / email wins so admin sees the latest identity.
    if (o.createdAt > existing.lastOrderAt) {
      existing.name = fullName(o);
      if (o.customer.email) existing.email = o.customer.email;
      existing.lastOrderAt = o.createdAt;
    }
    if (o.createdAt < existing.firstOrderAt) {
      existing.firstOrderAt = o.createdAt;
    }
    // Fill email if any historical order has it and we don't yet.
    if (!existing.email && o.customer.email) existing.email = o.customer.email;
  }

  // Finalise milestone flag now that all counts are aggregated.
  const customers = Array.from(byPhone.values())
    .map((c) => ({ ...c, milestone: milestoneFor(c.orderCount) }))
    .sort(
      (a, b) => b.orderCount - a.orderCount || b.lastOrderAt - a.lastOrderAt,
    );

  return NextResponse.json({ customers });
}

function fullName(o: Order): string {
  return `${o.customer.firstName ?? ""} ${o.customer.lastName ?? ""}`.trim();
}

function buildFromFirstOrder(o: Order): Customer {
  const paid = o.paymentStatus === "paid" && o.status !== "cancelled";
  return {
    phone: o.customer.phone.trim(),
    name: fullName(o),
    email: o.customer.email ?? null,
    orderCount: paid ? 1 : 0,
    totalSpent: paid ? o.total : 0,
    firstOrderAt: o.createdAt,
    lastOrderAt: o.createdAt,
    cancelledCount: o.status === "cancelled" ? 1 : 0,
    milestone: null,
  };
}
