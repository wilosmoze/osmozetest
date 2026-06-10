import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { MenuSections } from "@/components/MenuSections";
import { DeliveryBanner } from "@/components/DeliveryBanner";
import { SocialBlock } from "@/components/SocialBlock";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingCartBar } from "@/components/FloatingCartBar";
import { MenuModal } from "@/components/MenuModal";

export default function HomePage() {
  return (
    <main className="min-h-[100dvh] bg-bg text-white">
      <Header />
      <Hero />
      <Marquee />
      <MenuSections />
      <SocialBlock />
      <Footer />
      <CartDrawer />
      <FloatingCartBar />
      <MenuModal />
    </main>
  );
}
