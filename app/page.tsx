import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { MenuSection } from "@/components/MenuSection";
import { DeliveryBanner } from "@/components/DeliveryBanner";
import { SocialBlock } from "@/components/SocialBlock";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
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
        eyebrow="01 — La carte signature"
        title="Six burgers, six tempéraments."
        items={burgers}
        variant="hero"
      />
      <DeliveryBanner />
      <MenuSection
        id="sauces"
        eyebrow="02 — Sauces maison"
        title="Six sauces. Choisissez votre alliée."
        items={sauces}
        variant="compact"
      />
      <MenuSection
        id="desserts"
        eyebrow="03 — Desserts brioche"
        title="Trois finales. Une seule règle : la gourmandise."
        items={desserts}
        variant="hero"
      />
      <SocialBlock />
      <Footer />
      <CartDrawer />
    </main>
  );
}
