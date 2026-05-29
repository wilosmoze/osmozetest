import { NextResponse } from "next/server";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { createOrder, type OrderLine, type OrderCustomer } from "@/lib/orders";
import { themeConfig } from "@/config/theme.config";

export const runtime = "nodejs";

type Body = {
  customer: OrderCustomer;
  lines: OrderLine[];
  deliveryFee: number;
};

export async function POST(req: Request) {
  const body = (await req.json()) as Body;

  if (!body.lines?.length) {
    return NextResponse.json({ error: "Panier vide" }, { status: 400 });
  }
  if (!body.customer?.locationUrl || !body.customer?.phone) {
    return NextResponse.json({ error: "Informations client manquantes" }, { status: 400 });
  }
  const gmapsRegex = /^https?:\/\/(?:[\w.-]+\.)?(?:google\.[a-z.]+\/maps|goo\.gl\/maps|maps\.app\.goo\.gl)/i;
  if (!gmapsRegex.test(body.customer.locationUrl.trim())) {
    return NextResponse.json({ error: "Lien Google Maps invalide" }, { status: 400 });
  }

  const subtotal = body.lines.reduce((s, l) => s + l.price * l.quantity, 0);
  const total = subtotal + body.deliveryFee;

  const order = createOrder({
    customer: body.customer,
    lines: body.lines,
    subtotal,
    deliveryFee: body.deliveryFee,
    total,
  });

  if (!stripeEnabled || !stripe) {
    return NextResponse.json(
      { error: "Stripe non configuré côté serveur" },
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
      ...(body.deliveryFee > 0
        ? [{
            quantity: 1,
            price_data: {
              currency: themeConfig.payment.currency.toLowerCase(),
              unit_amount: Math.round(body.deliveryFee * 100),
              product_data: { name: "Livraison" },
            },
          }]
        : []),
    ],
    metadata: { orderId: order.id },
    payment_intent_data: { metadata: { orderId: order.id } },
  });

  return NextResponse.json({
    clientSecret: session.client_secret,
    orderId: order.id,
  });
}
