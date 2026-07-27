import { orderStore, listOrders, getOrder, type Order } from "@/lib/orders";
import { requireAdmin } from "@/lib/auth";
import { verifyOrderToken, safeExternalUrl } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
// Allow the SSE connection to stay open longer than the default 10s.
// EventSource will auto-reconnect and re-hydrate from the DB anyway
// when the connection times out.
export const maxDuration = 60;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("orderId");
  const token = url.searchParams.get("t") ?? "";

  // Admin (no orderId) → must be authenticated
  if (!orderId) {
    const auth = await requireAdmin();
    if (!auth.ok) return new Response("Unauthorized", { status: 401 });
  } else {
    // Per-order stream → must have a valid token
    if (!verifyOrderToken(orderId, token)) {
      // Allow the connection but only push minimal data
    }
  }

  const authorized = orderId ? verifyOrderToken(orderId, token) : true;

  const encoder = new TextEncoder();

  /** Strip customer info if the caller isn't authorized for that order. */
  const project = (order: Order) =>
    authorized
      ? {
          ...order,
          customer: {
            ...order.customer,
            locationUrl: safeExternalUrl(order.customer.locationUrl),
          },
        }
      : { id: order.id, status: order.status, paymentStatus: order.paymentStatus };

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      // Initial snapshot (async — fire-and-forget inside the sync start cb)
      (async () => {
        try {
          if (orderId) {
            const order = await getOrder(orderId);
            if (order) send("snapshot", project(order));
            else send("not_found", { orderId });
          } else {
            send("snapshot", await listOrders());
          }
        } catch {
          /* stream may have been aborted */
        }
      })();

      const handler = (order: Order) => {
        if (!orderId || order.id === orderId) send("update", project(order));
      };
      orderStore.emitter.on("update", handler);

      // Cross-instance fallback poll. The in-process emitter only fires
      // updates written on the SAME Lambda instance — on Vercel, admin
      // and courier writes routinely land on a different instance than
      // the customer's SSE stream, so the emitter alone misses them.
      // We poll the DB every 3s (2s for admin list stream) and re-send
      // when the underlying status changed. Duplicates are harmless —
      // React state dedupes.
      let lastKey = "";
      const poll = setInterval(async () => {
        try {
          if (orderId) {
            const o = await getOrder(orderId);
            if (!o) return;
            const key = `${o.status}|${o.paymentStatus}|${o.updatedAt}`;
            if (key !== lastKey) {
              lastKey = key;
              send("update", project(o));
            }
          } else {
            const all = await listOrders();
            const key = all
              .map((o) => `${o.id}:${o.status}:${o.updatedAt}`)
              .join(",");
            if (key !== lastKey) {
              lastKey = key;
              send("snapshot", all);
            }
          }
        } catch {
          /* swallow — poll will retry */
        }
      }, orderId ? 3000 : 5000);

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": ping\n\n"));
      }, 15000);

      const abort = () => {
        orderStore.emitter.off("update", handler);
        clearInterval(heartbeat);
        clearInterval(poll);
        try { controller.close(); } catch {}
      };
      req.signal.addEventListener("abort", abort);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
