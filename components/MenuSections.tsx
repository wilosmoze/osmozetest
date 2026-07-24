"use client";

import { MenuSection } from "./MenuSection";
import { DeliveryBanner } from "./DeliveryBanner";
import { menu } from "@/data/menu";
import { useT } from "@/lib/i18n";

export function MenuSections() {
  const t = useT();
  const burgers = menu.filter((m) => m.category === "burger");
  const sauces = menu.filter((m) => m.category === "sauce");
  const fries = menu.filter((m) => m.category === "fries");

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
        id="fries"
        eyebrow={t("menu.fries.eyebrow")}
        title={t("menu.fries.title")}
        items={fries}
        variant="compact"
      />
    </>
  );
}
