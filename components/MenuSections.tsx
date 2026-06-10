"use client";

import { MenuSection } from "./MenuSection";
import { DeliveryBanner } from "./DeliveryBanner";
import { menu } from "@/data/menu";
import { useT } from "@/lib/i18n";

export function MenuSections() {
  const t = useT();
  const burgers = menu.filter((m) => m.category === "burger");
  const sauces = menu.filter((m) => m.category === "sauce");
  const desserts = menu.filter((m) => m.category === "dessert");

  return (
    <>
      <MenuSection
        id="burgers"
        eyebrow={t("menu.burgers.eyebrow")}
        title={t("menu.burgers.title")}
        items={burgers}
        variant="hero"
      />
      <DeliveryBanner />
      <MenuSection
        id="sauces"
        eyebrow={t("menu.sauces.eyebrow")}
        title={t("menu.sauces.title")}
        items={sauces}
        variant="compact"
      />
      <MenuSection
        id="desserts"
        eyebrow={t("menu.desserts.eyebrow")}
        title={t("menu.desserts.title")}
        items={desserts}
        variant="hero"
      />
    </>
  );
}
