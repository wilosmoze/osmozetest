import { getOrder } from "@/lib/orders";
import { notFound } from "next/navigation";
import { PrintClient } from "./PrintClient";
import { themeConfig } from "@/config/theme.config";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function PrintReceiptPage({
  params,
}: {
  params: { orderId: string };
}) {
  const order = getOrder(params.orderId);
  if (!order) notFound();

  const createdAt = new Date(order.createdAt);

  return (
    <main className="min-h-[100dvh] bg-white text-zinc-950 print:bg-white">
      <PrintClient />
      <style>{`
        @media print {
          @page { size: 80mm auto; margin: 4mm; }
          .no-print { display: none !important; }
        }
      `}</style>

      <div className="mx-auto max-w-[320px] p-4 font-mono text-[12px] leading-tight">
        {/* Toolbar — only visible on screen, not on paper */}
        <div className="no-print mb-6 flex items-center justify-between gap-2 rounded-lg bg-zinc-100 p-3 text-[11px] text-zinc-600">
          <span>📄 Receipt preview — printing dialog opens automatically</span>
          <button
            onClick={(e) => {
              e.preventDefault();
              window.print();
            }}
            className="rounded-md bg-zinc-900 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-zinc-800"
          >
            Print again
          </button>
        </div>

        {/* Header */}
        <div className="border-b-2 border-dashed border-zinc-900 pb-2 text-center">
          <div className="text-base font-bold">{themeConfig.brand.name}</div>
          <div className="mt-0.5 text-[10px] uppercase tracking-wider">
            {themeConfig.brand.tagline}
          </div>
        </div>

        {/* Meta */}
        <div className="mt-3 space-y-0.5">
          <Row label="Order" value={`#${order.id}`} />
          <Row
            label="Date"
            value={createdAt.toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          />
          <Row
            label="Zone"
            value={
              order.deliveryFee === 0 ? "Rawai (free)" : `Outside (+${formatPrice(order.deliveryFee)})`
            }
          />
        </div>

        {/* Customer */}
        <div className="mt-3 border-t border-dashed border-zinc-400 pt-2">
          <div className="font-bold uppercase">Customer</div>
          <div className="mt-1">
            {order.customer.firstName} {order.customer.lastName}
          </div>
          <div className="mt-0.5">{order.customer.phone}</div>
          {order.customer.notes && (
            <div className="mt-1 italic">Note: {order.customer.notes}</div>
          )}
          <div className="mt-1 break-all text-[10px] text-zinc-700">
            {order.customer.locationUrl.slice(0, 200)}
          </div>
        </div>

        {/* Items */}
        <div className="mt-3 border-t border-dashed border-zinc-400 pt-2">
          <div className="font-bold uppercase">Items</div>
          <ul className="mt-1 space-y-1">
            {order.lines.map((l, i) => (
              <li
                key={i}
                className="flex items-baseline justify-between gap-2"
              >
                <span>
                  {l.quantity}× {l.name}
                </span>
                <span>{formatPrice(l.price * l.quantity)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Totals */}
        <div className="mt-3 border-t border-dashed border-zinc-400 pt-2">
          <Row label="Subtotal" value={formatPrice(order.subtotal)} />
          <Row
            label="Delivery"
            value={
              order.deliveryFee === 0
                ? "Free"
                : formatPrice(order.deliveryFee)
            }
          />
          <div className="mt-1 flex items-baseline justify-between border-t-2 border-zinc-900 pt-1 text-base font-bold">
            <span>TOTAL</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t-2 border-dashed border-zinc-900 pt-2 text-center text-[10px]">
          <div>Thank you for your order</div>
          <div className="mt-0.5">
            {themeConfig.social.instagram.handle}
          </div>
        </div>

        {/* Spacer for thermal cutter */}
        <div className="h-8" />
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-2">
      <span className="text-zinc-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
