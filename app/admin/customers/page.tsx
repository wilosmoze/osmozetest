import type { Metadata } from "next";
import { CustomersClient } from "./CustomersClient";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Customers · bun&bass admin",
};

// Auth is handled globally by middleware — /admin/* requires a valid
// admin HMAC cookie, so reaching this page means the request is
// authenticated. We just render the client shell that fetches the
// aggregate from /api/admin/customers.
export default function CustomersPage() {
  return <CustomersClient />;
}
