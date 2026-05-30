import { NextResponse } from "next/server";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { createOrder, type OrderLine, type OrderCustomer } from "@/lib/orders";
import { resolveZoneAndFee } from "@/lib/delivery";
import { themeConfig } from "@/config/theme.config";

export const runtime = "nodejs";

type Body = {
  customer: OrderCustomer;
  lines: OrderLine[];
  deliveryFee: number; // client-suggested fee — IGNORED for authority
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  // ---------- Basic payload validation ----------
  if (!body.lines?.length) {
    return NextResponse.json({ error: "Empty cart" }, { status: 400 });
  }
  if (!body.customer?.locationUrl || !body.customer?.phone) {
    return NextResponse.json(
      { error: "Missing customer information" },
      { status: 400 },
    );
  }
  const gmapsRegex =
    /^https?:\/\/(?:[\w.-]+\.)?(?:google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)/i;
  if (!gmapsRegex.test(body.customer.locationUrl.trim())) {
    return NextResponse.json(
      { error: "Invalid Google Maps link" },
      { status: 400 },
    );
  }

  // ---------- AUTHORITATIVE DELIVERY ZONE + FEE ----------
  // Re-resolve the zone server-side from the customer's Maps URL.
  // The client's deliveryFee is ignored; we always trust our own computation.
  const { zoneId, fee: serverFee, coordsResolved } = resolveZoneAndFee(
    body.customer.locationUrl,
  );

  // Telemetry: detect tampering attempts (client suggested a different fee).
  if (Math.abs((body.deliveryFee ?? 0) - serverFee) > 0.01) {
    console.warn(
      `[checkout] delivery fee mismatch: client=${body.deliveryFee} ฿, server=${serverFee} ฿ (zone=${zoneId}, coords resolved=${coordsResolved})`,
    );
  }

  // ---------- Recalculate totals server-side ----------
  const subtotal = body.lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const total = subtotal + serverFee;

  // ---------- Persist order with SERVER-VERIFIED amounts ----------
  const order = createOrder({
    customer: body.customer,
    lines: body.lines,
    subtotal,
    deliveryFee: serverFee,
    total,
  });

  // ---------- Stripe session ----------
  if (!stripeEnabled || !stripe) {
    return NextResponse.json(
      { error: "Stripe not configured on server" },
      { status: 503 },
    );
  }

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    mode: "payment",
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/tracking/${order.id}?session_id={CHECKOUT_SESSION_ID}`,
    line_items: [
      ...body.lines.map((l) => ({
        quantity: l.quantity,
        price_data: {
          currency: themeConfig.payment.currency.toLowerCase(),
          unit_amount: Math.round(l.price * 100),
          product_data: { name: l.name },
        },
      })),
      ...(serverFee > 0
        ? [
            {
              quantity: 1,
              price_data: {
                currency: themeConfig.payment.currency.toLowerCase(),
                unit_amount: Math.round(serverFee * 100),
                product_data: {
                  name: `Delivery (${zoneId === "rawai" ? "Rawai" : "Outside Rawai"})`,
                },
              },
            },
          ]
        : []),
    ],
    metadata: {
      orderId: order.id,
      zoneId,
      coordsResolved: String(coordsResolved),
    },
    payment_intent_data: { metadata: { orderId: order.id } },
  });

  return NextResponse.json({
    clientSecret: session.client_secret,
    orderId: order.id,
    zoneId,
    fee: serverFee,
  });
}
