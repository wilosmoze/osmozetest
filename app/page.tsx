import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { MenuSection } from "@/components/MenuSection";
import { DeliveryBanner } from "@/components/DeliveryBanner";
import { SocialBlock } from "@/components/SocialBlock";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { FloatingCartBar } from "@/components/FloatingCartBar";
import { menu } from "@/data/menu";

export default function HomePage() {
  const burgers = menu.filter((m) => m.category === "burger");
  const sauces = menu.filter((m) => m.category === "sauce");
  const desserts = menu.filter((m) => m.category === "dessert");

  return (
    <main className="min-h-[100dvh] bg-bg text-white">
      <Header />
      <Hero />
      <Marquee />
      <MenuSection
        id="burgers"
        eyebrow="01 — The lineup"
        title="Six burgers. Sealed tight."
        items={burgers}
        variant="hero"
      />
      <DeliveryBanner />
      <MenuSection
        id="sauces"
        eyebrow="02 — House sauces"
        title="Six mixers. Pick your tone."
        items={sauces}
        variant="compact"
      />
      <MenuSection
        id="desserts"
        eyebrow="03 — Brioche B-sides"
        title="Three B-sides. One rule: indulgence."
        items={desserts}
        variant="hero"
      />
      <SocialBlock />
      <Footer />
      <CartDrawer />
      <FloatingCartBar />
    </main>
  );
}
