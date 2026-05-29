import { orderStore, listOrders, getOrder, type Order } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const orderId = url.searchParams.get("orderId");
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };

      if (orderId) {
        const order = getOrder(orderId);
        if (order) send("snapshot", order);
        else send("not_found", { orderId });
      } else {
        send("snapshot", listOrders());
      }

      const handler = (order: Order) => {
        if (!orderId || order.id === orderId) send("update", order);
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
