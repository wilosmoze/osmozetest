import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listCourierNames } from "@/lib/courier";

export const runtime = "nodejs";

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ couriers: listCourierNames() });
}
