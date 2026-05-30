import { NextResponse } from "next/server";
import { listOrders } from "@/lib/orders";
import { requireCourier } from "@/lib/courier";

export const runtime = "nodejs";

/**
 * Returns the orders relevant to a courier:
 *  - ALL orders currently "ready" (anyone can pick up)
 *  - HIS own "delivering" orders
 *  - HIS recently "delivered" orders (last 4h, useful for history)
 *
 * Customer prices/totals are stripped — couriers don't need them.
 */
export async function GET() {
  const auth = await requireCourier();
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const fourHoursAgo = Date.now() - 4 * 60 * 60 * 1000;

  const all = await listOrders();
  const orders = all
    .filter((o) => {
      if (o.status === "ready") return true;
      if (o.status === "delivering" && o.assignedCourier === auth.name) return true;
      if (
        o.status === "delivered" &&
        o.assignedCourier === auth.name &&
        o.updatedAt > fourHoursAgo
      )
        return true;
      return false;
    })
    .map((o) => ({
      id: o.id,
      status: o.status,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
      assignedCourier: o.assignedCourier,
      customer: {
        firstName: o.customer.firstName,
        lastName: o.customer.lastName,
        phone: o.customer.phone,
        locationUrl: o.customer.locationUrl,
        notes: o.customer.notes,
      },
      lines: o.lines.map((l) => ({ name: l.name, quantity: l.quantity })),
      // No price, no subtotal — couriers don't need money info
    }));

  return NextResponse.json({ courier: auth.name, orders });
}
