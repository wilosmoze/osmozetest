import { NextResponse } from "next/server";
import { assignCourier, getOrder, updateOrder } from "@/lib/orders";
import { requireCourier } from "@/lib/courier";
import { isSameOrigin } from "@/lib/security";

export const runtime = "nodejs";

/**
 * PATCH actions a courier can take on an order:
 *  - { action: "pickup" }    → status: ready → delivering, assigns self
 *  - { action: "delivered" } → status: delivering → delivered (must be assigned)
 *
 * Strictly scoped: a courier cannot touch orders not in his lane.
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const auth = await requireCourier();
  if (!auth.ok)
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const order = getOrder(params.id);
  if (!order)
    return NextResponse.json({ error: "not_found" }, { status: 404 });

  const body = (await req.json()) as { action?: "pickup" | "delivered" };

  if (body.action === "pickup") {
    if (order.status !== "ready") {
      return NextResponse.json(
        { error: `Order is ${order.status}, can't be picked up` },
        { status: 409 },
      );
    }
    // Race-condition guard: someone else already grabbed it
    if (order.assignedCourier && order.assignedCourier !== auth.name) {
      return NextResponse.json(
        { error: `Already assigned to ${order.assignedCourier}` },
        { status: 409 },
      );
    }
    const updated = assignCourier(params.id, auth.name, true);
    return NextResponse.json({ order: updated });
  }

  if (body.action === "delivered") {
    if (order.status !== "delivering") {
      return NextResponse.json(
        { error: `Order is ${order.status}, not in delivery` },
        { status: 409 },
      );
    }
    if (order.assignedCourier !== auth.name) {
      return NextResponse.json(
        { error: "Not your delivery" },
        { status: 403 },
      );
    }
    const updated = updateOrder(
      params.id,
      { status: "delivered" },
      `courier:${auth.name}`,
    );
    return NextResponse.json({ order: updated });
  }

  return NextResponse.json({ error: "invalid_action" }, { status: 400 });
}
