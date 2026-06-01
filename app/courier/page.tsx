import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { requireCourier } from "@/lib/courier";
import { CourierClient } from "./CourierClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function CourierPage() {
  const auth = await requireCourier();
  if (!auth.ok) redirect("/courier/login");
  return <CourierClient />;
}
