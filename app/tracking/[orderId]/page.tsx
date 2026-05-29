import { Header } from "@/components/Header";
import { OrderTracker } from "@/components/OrderTracker";
import { SocialBlock } from "@/components/SocialBlock";

export default function TrackingPage({
  params,
}: {
  params: { orderId: string };
}) {
  return (
    <main className="min-h-[100dvh] bg-bg pt-32 pb-20">
      <Header />
      <OrderTracker orderId={params.orderId} />
      <SocialBlock variant="post-purchase" />
    </main>
  );
}
