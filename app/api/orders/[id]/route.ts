import { NextResponse } from "next/server";
import { advanceStatus, getOrder, updateOrder, type OrderStatus } from "@/lib/orders";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

const ALLOWED: OrderStatus[] = [
  "preparing", "ready", "delivering", "delivered", "cancelled",
];

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const order = getOrder(params.id);
  if (!order) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({
    order: {
      id: order.id,
      status: order.status,
      paymentStatus: order.paymentStatus,
      total: order.total,
      createdAt: order.createdAt,
      lines: order.lines.map((l) => ({ name: l.name, quantity: l.quantity })),
    },
  });
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } },
) {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await req.json()) as { action?: "advance"; status?: OrderStatus };

  if (body.action === "advance") {
    const updated = advanceStatus(params.id);
    if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ order: updated });
  }

  if (body.status && ALLOWED.includes(body.status)) {
    const updated = updateOrder(params.id, { status: body.status });
    if (!updated) return NextResponse.json({ error: "not_found" }, { status: 404 });
    return NextResponse.json({ order: updated });
  }

  return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
}
