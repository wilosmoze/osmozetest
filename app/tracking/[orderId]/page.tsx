import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { OrderTracker } from "@/components/OrderTracker";
import { SocialBlock } from "@/components/SocialBlock";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function TrackingPage({
  params,
  searchParams,
}: {
  params: { orderId: string };
  searchParams: { t?: string };
}) {
  return (
    <main className="min-h-[100dvh] bg-bg pt-32 pb-20">
      <Header />
      <OrderTracker orderId={params.orderId} token={searchParams.t} />
      <SocialBlock variant="post-purchase" />
    </main>
  );
}
