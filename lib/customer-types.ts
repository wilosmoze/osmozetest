// Shared shape between the /api/admin/customers response and the
// /admin/customers client page. Kept in lib/ so both the server
// Route Handler and the client component can import it without
// crossing the "server-only" boundary of lib/orders.ts.

export type Customer = {
  phone: string;
  name: string;
  email: string | null;
  orderCount: number;
  totalSpent: number;
  firstOrderAt: number;
  lastOrderAt: number;
  cancelledCount: number;
  milestone: "vip" | "loyal" | null;
};

/**
 * Milestone rule:
 *   - Multiple of 30 → 'vip'   (red alert — every 30 orders)
 *   - Multiple of 10 → 'loyal' (blue alert — every 10 orders)
 *   - Otherwise      → null
 * VIP takes precedence when both apply (30, 60, 90…).
 */
export function milestoneFor(count: number): Customer["milestone"] {
  if (count > 0 && count % 30 === 0) return "vip";
  if (count > 0 && count % 10 === 0) return "loyal";
  return null;
}
