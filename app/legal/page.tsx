import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { themeConfig } from "@/config/theme.config";

export const metadata: Metadata = {
  title: "Legal notice · bun&bass burgers",
  description: "Legal notice for bun&bass burgers, Rawai, Phuket.",
  robots: { index: false, follow: false },
};

export default function LegalPage() {
  return (
    <main className="min-h-[100dvh] bg-bg pt-32 pb-20 text-white">
      <Header />
      <section className="container-app mx-auto max-w-2xl">
        <span className="chip">Information</span>
        <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tighter md:text-5xl">
          Legal notice
        </h1>
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-300">
          <Block title="Publisher">
            <p><strong>{themeConfig.brand.name}</strong> — a burger dark kitchen based in Rawai, Phuket, Thailand.</p>
            <p>Contact: <a href={`mailto:${themeConfig.social.contactEmail}`} className="text-accent hover:underline">{themeConfig.social.contactEmail}</a></p>
            <p>Instagram: <a href={themeConfig.social.instagram.url} className="text-accent hover:underline">{themeConfig.social.instagram.handle}</a></p>
          </Block>

          <Block title="Site purpose">
            <p>
              This website is a menu showcase for the {themeConfig.brand.name} kitchen.
              During our soft-launch phase, all orders, payments, and deliveries are
              handled by <strong>Grab Food</strong> — this site does not process any
              transaction directly.
            </p>
          </Block>

          <Block title="Ordering platform">
            <p>
              Orders placed through the "Order on Grab Food" links are governed by
              Grab's own terms and conditions, privacy policy, delivery rules, and
              customer service.
            </p>
            <p>
              <a
                href={themeConfig.delivery.grabUrl}
                className="text-accent hover:underline"
              >
                Visit our Grab Food page →
              </a>
            </p>
          </Block>

          <Block title="Intellectual property">
            <p>
              The {themeConfig.brand.name} name, logo, sealed-bun stamp, sauce icons,
              vinyl artwork and menu compositions are the property of the kitchen
              and may not be reused without written permission.
            </p>
          </Block>

          <Block title="Hosting">
            <p>This site is hosted by Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA.</p>
          </Block>
        </div>

        <div className="mt-14 flex items-center gap-4 text-xs text-zinc-500">
          <Link href="/terms" className="hover:text-accent">Terms of use →</Link>
          <Link href="/privacy" className="hover:text-accent">Privacy policy →</Link>
          <Link href="/" className="ml-auto hover:text-accent">← Back home</Link>
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
