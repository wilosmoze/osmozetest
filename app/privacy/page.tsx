import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { themeConfig } from "@/config/theme.config";

export const metadata: Metadata = {
  title: "Privacy policy · bun&bass burgers",
  description: "Privacy policy for bun&bass burgers.",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-[100dvh] bg-bg pt-32 pb-20 text-white">
      <Header />
      <section className="container-app mx-auto max-w-2xl">
        <span className="chip">Information</span>
        <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tighter md:text-5xl">
          Privacy policy
        </h1>
        <p className="mt-3 text-xs text-zinc-500">Last updated · August 2026</p>

        <div className="mt-10 space-y-8 text-sm leading-relaxed text-zinc-300">
          <Block title="1. Short version">
            <p>
              This site does <strong>not</strong> collect any personal data
              and does <strong>not</strong> use tracking cookies. We use
              cookie-less analytics that count anonymous page views only
              (details in section 4). If you order from us, your data is
              handled by Grab Food, not by us.
            </p>
          </Block>

          <Block title="2. What this site stores locally in your browser">
            <p>
              Two small settings are saved in your browser (localStorage), and
              they never leave your device:
            </p>
            <ul className="list-disc list-inside space-y-1 text-zinc-400">
              <li>Your language preference (English / French / Russian / Thai)</li>
              <li>Your last known order state (only relevant when we're in own-site ordering mode — currently unused)</li>
            </ul>
            <p>
              You can wipe both at any time by clearing your browser's site
              data for this domain.
            </p>
          </Block>

          <Block title="3. Ordering data — handled by Grab Food">
            <p>
              Every "Order" button on this site sends you to our{" "}
              <a href={themeConfig.delivery.grabUrl} className="text-accent hover:underline">
                Grab Food page
              </a>. From that point on, any personal information you provide —
              name, phone number, delivery address, payment details — is
              collected and processed by Grab Holdings Inc. under their own
              privacy policy.
            </p>
            <p>
              We do not receive, store or process this information ourselves.
              For any data-privacy request related to your order (access,
              correction, deletion), please contact Grab directly through the
              Grab app or website.
            </p>
          </Block>

          <Block title="4. Cookies & analytics">
            <p>
              We do not set advertising or tracking cookies, and we never
              share data with third-party marketing platforms.
            </p>
            <p>
              We use <strong>Vercel Web Analytics</strong> — a privacy-first,
              cookie-less analytics tool built into our hosting platform.
              It counts anonymous page views, referrers (which site linked
              you to us) and rough country-level geography, so we can tell
              how many people are visiting and where they come from. It does
              <strong> not</strong> store your IP address, does <strong>not</strong> set
              any cookie, and does <strong>not</strong> follow you across other
              sites. See{" "}
              <a href="https://vercel.com/docs/analytics/privacy-policy" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                Vercel Analytics privacy details
              </a>.
            </p>
            <p>
              Our hosting provider (Vercel) also collects basic technical
              logs (IP address, requested page, timestamp) for infrastructure
              purposes, per{" "}
              <a href="https://vercel.com/legal/privacy-policy" className="text-accent hover:underline" target="_blank" rel="noopener noreferrer">
                Vercel's privacy policy
              </a>.
            </p>
          </Block>

          <Block title="5. Contact">
            <p>
              For any question about this policy, email{" "}
              <a href={`mailto:${themeConfig.social.contactEmail}`} className="text-accent hover:underline">
                {themeConfig.social.contactEmail}
              </a>.
            </p>
          </Block>
        </div>

        <div className="mt-14 flex items-center gap-4 text-xs text-zinc-500">
          <Link href="/legal" className="hover:text-accent">← Legal notice</Link>
          <Link href="/terms" className="hover:text-accent">← Terms of use</Link>
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
