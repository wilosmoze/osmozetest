import { listOrders } from "@/lib/orders";
import { AdminClient } from "./AdminClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const initialOrders = await listOrders();
  return <AdminClient initialOrders={initialOrders} />;
}
