import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { themeConfig } from "@/config/theme.config";

export const metadata: Metadata = {
  title: "Terms of use · bun&bass burgers",
  description: "Terms of use for bun&bass burgers.",
  robots: { index: false, follow: false },
};

export default function TermsPage() {
  return (
    <main className="min-h-[100dvh] bg-bg pt-32 pb-20 text-white">
      <Header />
      <section className="container-app mx-auto max-w-2xl">
        <span className="chip">Information</span>
        <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tighter md:text-5xl">
          Terms of use
        </h1>
        <p className="mt-3 text-xs text-zinc-500">Last updated · August 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-300">
          <Block title="1. What this site is">
            <p>
              {themeConfig.brand.name} is a burger dark kitchen based in Rawai, Phuket.
              This website is a menu showcase only. It does not process orders,
              payments, or deliveries directly.
            </p>
          </Block>

          <Block title="2. Ordering through Grab Food">
            <p>
              Every "Order" button on this site redirects to our{" "}
              <a href={themeConfig.delivery.grabUrl} className="text-accent hover:underline">
                Grab Food page
              </a>. Once you click through, your order is placed, priced,
              paid, delivered and supported <strong>entirely by Grab</strong>.
            </p>
            <p>
              This means the following are governed by Grab's own terms and
              customer service — not ours:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li>Menu pricing, delivery fees, promotions</li>
              <li>Payment processing, refunds, disputes</li>
              <li>Delivery time, delivery zone, courier behaviour</li>
              <li>Order accuracy and packaging issues</li>
              <li>Personal data collected during checkout</li>
            </ul>
            <p>
              For all order-related matters, please contact Grab support
              directly through the Grab app.
            </p>
          </Block>

          <Block title="3. Product information">
            <p>
              We do our best to keep menu descriptions, ingredients and photos
              on this site accurate. Actual availability, exact prices and
              current promotions are the ones displayed on our Grab Food page
              at the moment of ordering — the Grab listing prevails.
            </p>
            <p>
              Please tell us or Grab if you have any food allergy or dietary
              restriction before ordering.
            </p>
          </Block>

          <Block title="4. Intellectual property">
            <p>
              All text, photos, illustrations, sauce icons, sealed-bun stamp,
              vinyl artwork and the {themeConfig.brand.name} name are our
              property. You may not reuse them without written permission.
            </p>
          </Block>

          <Block title="5. Liability">
            <p>
              This site is provided as-is for informational purposes. We can't
              be held liable for any issue arising from an order placed on Grab
              Food — that relationship is between you and Grab.
            </p>
          </Block>

          <Block title="6. Contact">
            <p>
              For brand-related questions (partnerships, press, feedback on
              the menu), email us at{" "}
              <a href={`mailto:${themeConfig.social.contactEmail}`} className="text-accent hover:underline">
                {themeConfig.social.contactEmail}
              </a>.
            </p>
          </Block>
        </div>

        <div className="mt-14 flex items-center gap-4 text-xs text-zinc-500">
          <Link href="/legal" className="hover:text-accent">← Legal notice</Link>
          <Link href="/privacy" className="hover:text-accent">Privacy policy →</Link>
          <Link href="/" className="ml-auto hover:text-accent">Back home</Link>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-display text-lg font-semibold tracking-tight text-white">
        {title}
      </h2>
      <div className="mt-2 space-y-2">{children}</div>
    </div>
  );
}
