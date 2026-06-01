import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { listOrders } from "@/lib/orders";
import { requireAdmin } from "@/lib/auth";
import { AdminClient } from "./AdminClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const auth = await requireAdmin();
  if (!auth.ok) redirect("/admin/login");
  const initialOrders = await listOrders();
  return <AdminClient initialOrders={initialOrders} />;
}
