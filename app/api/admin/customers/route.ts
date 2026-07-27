import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listOrders, type Order } from "@/lib/orders";
import { milestoneFor, type Customer } from "@/lib/customer-types";

export const runtime = "nodejs";

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
