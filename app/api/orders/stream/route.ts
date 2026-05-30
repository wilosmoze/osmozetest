import { orderStore, listOrders, getOrder, type Order } from "@/lib/orders";
import { requireAdmin } from "@/lib/auth";
import { verifyOrderToken, safeExternalUrl } from "@/lib/security";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": ping\n\n"));
      }, 15000);

      const abort = () => {
        orderStore.emitter.off("update", handler);
        clearInterval(heartbeat);
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
