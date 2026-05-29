import { listOrders } from "@/lib/orders";
import { AdminClient } from "./AdminClient";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  return <AdminClient initialOrders={listOrders()} />;
}
