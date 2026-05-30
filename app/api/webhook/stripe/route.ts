import { NextResponse } from "next/server";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { updateOrder } from "@/lib/orders";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  if (!stripeEnabled || !stripe) {
    return NextResponse.json({ error: "Stripe disabled" }, { status: 503 });
  }

  const sig = req.headers.get("stripe-signature");
  if (!sig) return NextResponse.json({ error: "No signature" }, { status: 400 });

  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      raw,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature invalide: ${(err as Error).message}` },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;
      if (orderId) {
        await updateOrder(
          orderId,
          {
            paymentStatus: "paid",
            status: "preparing",
            stripeSessionId: session.id,
          },
          "stripe",
        );
      }
      break;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object as Stripe.PaymentIntent;
      const orderId = intent.metadata?.orderId;
      if (orderId) await updateOrder(orderId, { paymentStatus: "failed" }, "stripe");
      break;
    }
  }

  return NextResponse.json({ received: true });
}
