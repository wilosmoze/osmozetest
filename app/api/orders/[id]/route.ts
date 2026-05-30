import { NextResponse } from "next/server";
import {
  advanceStatus,
  assignCourier,
  getOrder,
  updateOrder,
  type OrderStatus,
} from "@/lib/orders";
import { listCourierNames } from "@/lib/courier";
import { requireAdmin } from "@/lib/auth";
import { isSameOrigin, verifyOrderToken, safeExternalUrl } from "@/lib/security";

export const runtime = "nodejs";

const ALLOWED: OrderStatus[] = [
  "preparing", "ready", "delivering", "delivered", "cancelled",
];

/**
 * Public GET: requires a valid order token in ?t= (HMAC over orderId).
 * Without it we only expose status, no customer data — used by anyone
 * who has the original tracking URL but blocks ID enumeration.
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } },
) {
  const order = await getOrder(params.id);
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const url = new URL(req.url);
  const token = url.searchParams.get("t") ?? "";
  const authorized = verifyOrderToken(params.id, token);

  if (!authorized) {
    // Minimal payload — just enough to render the timeline progress.
    return NextResponse.json({
      order: { id: order.id, status: order.status, paymentStatus: order.paymentStatus },
    });
  }

  return NextResponse.json({
    order: {
      id: order.id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: order.total,
      createdAt: order.createdAt,
      // Sanitize URL before sending to client (defense in depth)
      customer: {
        ...order.customer,
        locationUrl: safeExternalUrl(order.customer.locationUrl),
      },
      lines: order.lines.map((l) => ({ name: l.name, quantity: l.quantity })),
    },
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json()) as {
    action?: "advance" | "assign";
    status?: OrderStatus;
    courier?: string;
  };

  if (body.action === "advance") {
    const updated = await advanceStatus(params.id, "admin");
    if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ order: updated });
  }

  if (body.action === "assign") {
    if (!body.courier || !listCourierNames().includes(body.courier)) {
      return NextResponse.json(
        { error: "Unknown courier" },
        { status: 400 },
      );
    }
    const updated = await assignCourier(params.id, body.courier, false);
    if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ order: updated });
  }

  if (body.status && ALLOWED.includes(body.status)) {
    const updated = await updateOrder(params.id, { status: body.status }, "admin");
    if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ order: updated });
  }

  return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
}
