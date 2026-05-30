import { NextResponse } from "next/server";
import { listOrders } from "@/lib/orders";
import { requireAdmin } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ orders: await listOrders() });
}
