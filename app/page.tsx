import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { MenuSections } from "@/components/MenuSections";
import { SocialBlock } from "@/components/SocialBlock";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingCartBar } from "@/components/FloatingCartBar";
import { MenuModal } from "@/components/MenuModal";
import { GrabFloatingBar } from "@/components/GrabFloatingBar";
import { isGrabOnly } from "@/lib/ordering";

export default function HomePage() {
  const grabOnly = isGrabOnly();
  return (
    <main className="min-h-[100dvh] bg-bg text-white">
      <Header />
      <Hero />
      <Marquee />
      <MenuSections />
      <SocialBlock />
      <Footer />
      {/* In grab_only mode the cart is fully hidden and a single sticky */}
      {/* Grab CTA replaces the cart bar at the bottom of every page.    */}
      {grabOnly ? (
        <GrabFloatingBar />
      ) : (
        <>
          <CartDrawer />
          <FloatingCartBar />
        </>
      )}
      <MenuModal />
    </main>
  );
}
