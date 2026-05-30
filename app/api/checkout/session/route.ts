import { NextResponse } from "next/server";
import { stripe, stripeEnabled } from "@/lib/stripe";
import { createOrder, type OrderCustomer } from "@/lib/orders";
import { resolveZoneAndFeeAsync } from "@/lib/delivery";
import { themeConfig } from "@/config/theme.config";
import { menu } from "@/data/menu";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { isSameOrigin, signOrderToken } from "@/lib/security";

export const runtime = "nodejs";

/** What we ACCEPT from the client: only ids + quantities.
 *  We deliberately ignore client-supplied name & price — those are
 *  re-resolved server-side from data/menu.ts.                       */
type ClientLine = {
  itemId: string;
  quantity: number;
  /** Tolerated for backwards compat but ignored. */
  name?: string;
  price?: number;
};

type Body = {
  customer: OrderCustomer;
  lines: ClientLine[];
  /** Tolerated but ignored — recomputed authoritatively. */
  deliveryFee?: number;
};

export async function POST(req: Request) {
  // ---------- Lightweight CSRF + rate limit ----------
  if (!isSameOrigin(req)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const ip = clientIp(req);
  const rl = rateLimit(`checkout:${ip}`, 10, 60 * 1000); // 10/min/IP
  if (!rl.ok) {
    return NextResponse.json(
      { error: `Too many checkouts. Retry in ${rl.retryAfterSec}s.` },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

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

  // ---------- AUTHORITATIVE PRICES (look each line up in menu) ----------
  const serverLines: { itemId: string; name: string; price: number; quantity: number }[] = [];

  for (const clientLine of body.lines) {
    // Quantity sanity
    const qty = Number(clientLine.quantity);
    if (!Number.isInteger(qty) || qty < 1 || qty > 50) {
      return NextResponse.json(
        { error: `Invalid quantity for item ${clientLine.itemId}` },
        { status: 400 },
      );
    }

    // Look up the canonical menu entry by id
    const menuItem = menu.find((m) => m.id === clientLine.itemId);
    if (!menuItem) {
      return NextResponse.json(
        { error: `Unknown item: ${clientLine.itemId}` },
        { status: 400 },
      );
    }

    // Telemetry: detect tampering attempts on price/name
    if (
      typeof clientLine.price === "number" &&
      Math.abs(clientLine.price - menuItem.price) > 0.01
    ) {
      console.warn(
        `[checkout] price mismatch on ${menuItem.id}: client=${clientLine.price} ฿, server=${menuItem.price} ฿`,
      );
    }
    if (clientLine.name && clientLine.name !== menuItem.name) {
      console.warn(
        `[checkout] name mismatch on ${menuItem.id}: client="${clientLine.name}", server="${menuItem.name}"`,
      );
    }

    serverLines.push({
      itemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      quantity: qty,
    });
  }

  // ---------- AUTHORITATIVE DELIVERY ZONE + FEE ----------
  // Re-resolve the zone server-side from the customer's Maps URL.
  // The async version follows redirects on short links so a
  // maps.app.goo.gl share URL is correctly classified.
  const { zoneId, fee: serverFee, coordsResolved } =
    await resolveZoneAndFeeAsync(body.customer.locationUrl);

  // Telemetry: detect tampering attempts on the fee.
  if (
    typeof body.deliveryFee === "number" &&
    Math.abs(body.deliveryFee - serverFee) > 0.01
  ) {
    console.warn(
      `[checkout] delivery fee mismatch: client=${body.deliveryFee} ฿, server=${serverFee} ฿ (zone=${zoneId}, coords resolved=${coordsResolved})`,
    );
  }

  // ---------- Recompute totals from SERVER prices only ----------
  const subtotal = serverLines.reduce((s, l) => s + l.price * l.quantity, 0);
  const total = subtotal + serverFee;

  // ---------- Persist order with SERVER-VERIFIED amounts ----------
  const order = createOrder({
    customer: body.customer,
    lines: serverLines,
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

  const trackingToken = signOrderToken(order.id);

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    mode: "payment",
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/tracking/${order.id}?session_id={CHECKOUT_SESSION_ID}&t=${trackingToken}`,
    line_items: [
      ...serverLines.map((l) => ({
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
    trackingToken,
    zoneId,
    fee: serverFee,
  });
}
