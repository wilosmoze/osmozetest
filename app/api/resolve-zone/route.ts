import { NextResponse } from "next/server";
import { resolveZoneAndFeeAsync } from "@/lib/delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { locationUrl } = (await req.json()) as { locationUrl?: string };
  if (typeof locationUrl !== "string" || !locationUrl.trim()) {
    return NextResponse.json({ error: "Missing locationUrl" }, { status: 400 });
  }

  const result = await resolveZoneAndFeeAsync(locationUrl);
  return NextResponse.json(result);
}
