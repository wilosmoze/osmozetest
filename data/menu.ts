import type { LocalizedString } from "@/lib/i18n";

export type MenuItem = {
  id: string;
  name: string; // brand name — not translated
  description: LocalizedString;
  price: number; // THB — the "solo" price for the item alone
  image: string;
  category: "burger" | "sauce" | "fries" | "drink";
  tag?: string;
  ingredients?: string[];
  // Combo/menu price: only set on burgers. When defined, the burger
  // card shows a second "Menu" add button at this price which stands
  // for burger + fries (2 sauces) + drink.
  menuPrice?: number;
};

const SIDE = "/images/burger-side.jpg"; // fallback for sauces

export const menu: MenuItem[] = [
  // ---------- BURGERS ----------
  {
    id: "b-bassline",
    name: "The Bassline",
    description: {
      en: "The timeless classic. Double Charolais steak, white & orange cheddar, lettuce, tomato, cornichons, onions, Dijon mustard & ketchup on a fresh bakery bun.",
      fr: "Le classique intemporel. Double steak charolais, cheddar blanc & orange, laitue, tomate, cornichons, oignons, moutarde de Dijon & ketchup sur bun boulanger.",
      ru: "Классика вне времени. Двойной стейк шароле, белый и оранжевый чеддер, салат, помидор, корнишоны, лук, дижонская горчица и кетчуп на свежей булке.",
      th: "คลาสสิกไม่มีวันตกยุค เนื้อชาโรเลส์คู่ ชีสเชดดาร์ขาวและส้ม ผักสลัด มะเขือเทศ แตงกวาดอง หอมใหญ่ มัสตาร์ดดิจอง และซอสมะเขือเทศ บนบันสด",
    },
    price: 259,
    menuPrice: 359,
    image: "/images/burger-bassline.jpg",
    category: "burger",
    tag: "Signature",
    ingredients: ["Double Charolais", "Cheddar", "Dijon & ketchup"],
  },
  {
    id: "b-deep-groove",
    name: "Deep Groove",
    description: {
      en: "Deep and savoury. Double Charolais steak, Grana Padano, orange cheddar (2 slices), red mayo, green salad, tomato and onions.",
      fr: "Profond et savoureux. Double steak charolais, Grana Padano, cheddar orange (2 tranches), mayo rouge, salade verte, tomate et oignons.",
      ru: "Глубокий и насыщенный. Двойной стейк шароле, Грана Падано, оранжевый чеддер (2 ломтика), красный майонез, зелёный салат, помидор и лук.",
      th: "เข้มข้นและมีรสอูมามิ เนื้อชาโรเลส์คู่ กราน่า ปาดาโน่ ชีสเชดดาร์ส้ม 2 แผ่น มายองเนสแดง สลัดผัก มะเขือเทศ และหอมใหญ่",
    },
    price: 299,
    menuPrice: 399,
    image: "/images/burger-deep-groove.jpg",
    category: "burger",
    ingredients: ["Double Charolais", "Grana Padano", "Red mayo"],
  },
  {
    id: "b-soul",
    name: "Soul",
    description: {
      en: "Rich and soulful. Double Charolais steak, emmental, orange cheddar (2 slices), crispy bacon, caramelized onions, green salad, mustard & ketchup.",
      fr: "Riche et soulful. Double steak charolais, emmental, cheddar orange (2 tranches), bacon croustillant, oignons caramélisés, salade verte, moutarde & ketchup.",
      ru: "Богатый и душевный. Двойной стейк шароле, эмменталь, оранжевый чеддер (2 ломтика), хрустящий бекон, карамелизованный лук, зелёный салат, горчица и кетчуп.",
      th: "เข้มข้นและมีจิตวิญญาณ เนื้อชาโรเลส์คู่ ชีสเอมเมนทาล ชีสเชดดาร์ส้ม 2 แผ่น เบคอนกรอบ หอมใหญ่คาราเมล สลัดผัก มัสตาร์ดและซอสมะเขือเทศ",
    },
    price: 309,
    menuPrice: 409,
    image: "/images/burger-soul.jpg",
    category: "burger",
    tag: "Best-seller",
    ingredients: ["Bacon", "Emmental", "Caramelized onions"],
  },
  {
    id: "b-electro-bass",
    name: "Electro Bass",
    description: {
      en: "Bright and electric. Chicken, goat feta, cassis sauce, mayo, green salad, onions and a drizzle of honey.",
      fr: "Vif et électrique. Poulet, feta de chèvre, sauce cassis, mayonnaise, salade verte, oignons et un filet de miel.",
      ru: "Яркий и электрический. Курица, фета из козьего молока, соус кассис, майонез, зелёный салат, лук и капля мёда.",
      th: "สดใสและมีชีวิตชีวา ไก่ ชีสฟีต้าแพะ ซอสแคสซิส มายองเนส สลัดผัก หอมใหญ่ และน้ำผึ้งเล็กน้อย",
    },
    price: 289,
    menuPrice: 389,
    image: "/images/burger-electro-bass.jpg",
    category: "burger",
    tag: "Spicy",
    ingredients: ["Chicken", "Goat feta", "Cassis & honey"],
  },
  {
    id: "b-808-smash",
    name: "808 Chicken",
    description: {
      en: "Bold and unexpected. Chicken, avocado mash, fried egg, red cabbage pickles, green salad and pink sauce.",
      fr: "Audacieux et inattendu. Poulet, avocat écrasé, œuf au plat, chou rouge pickles, salade verte et sauce pink.",
      ru: "Смелый и неожиданный. Курица, авокадо-смэш, яичница-глазунья, маринованная краснокочанная капуста, зелёный салат и розовый соус.",
      th: "กล้าและเซอร์ไพรส์ ไก่ อะโวคาโดบด ไข่ดาว กะหล่ำม่วงดอง สลัดผัก และซอสชมพู",
    },
    price: 289,
    menuPrice: 389,
    image: "/images/burger-808-smash.jpg",
    category: "burger",
    tag: "New",
    ingredients: ["Chicken", "Avocado", "Fried egg"],
  },

  // ---------- SAUCES ----------
  //   20 ฿ — Chef Mayo (house), Ketchup, Dijon Mustard
  //   25 ฿ — all the others
  {
    id: "s-chef-mayo",
    name: "Chef Mayo",
    description: {
      en: "The signature: creamy, seasoned to hit every bite.",
      fr: "La signature : onctueuse, assaisonnée pour chaque bouchée.",
      ru: "Фирменный: кремовый, приправленный до последнего кусочка.",
      th: "ซอสประจำร้าน: ครีมมี่ ปรุงรสจัดจ้าน",
    },
    price: 20,
    image: SIDE,
    category: "sauce",
    tag: "House",
  },
  {
    id: "s-ketchup",
    name: "Ketchup",
    description: {
      en: "House tomato ketchup — the essential.",
      fr: "Ketchup tomate maison — l'essentiel.",
      ru: "Домашний томатный кетчуп — обязательный.",
      th: "ซอสมะเขือเทศโฮมเมด — สิ่งจำเป็น",
    },
    price: 20,
    image: SIDE,
    category: "sauce",
  },
  {
    id: "s-dijon",
    name: "Dijon Mustard",
    description: {
      en: "Strong, smooth, unmistakable Dijon.",
      fr: "Moutarde de Dijon forte, lisse, sans détour.",
      ru: "Сильная и гладкая дижонская горчица.",
      th: "มัสตาร์ดดิจองเข้มข้นเนียน",
    },
    price: 20,
    image: SIDE,
    category: "sauce",
  },
  {
    id: "s-andalousia",
    name: "Andalousia Sauce",
    description: {
      en: "Tomato, pepper, garlic — Andalusian warmth.",
      fr: "Tomate, poivron, ail — chaleur andalouse.",
      ru: "Томат, перец, чеснок — андалузское тепло.",
      th: "มะเขือเทศ พริกยักษ์ กระเทียม — ความอบอุ่นแบบอันดาลูเซีย",
    },
    price: 25,
    image: SIDE,
    category: "sauce",
  },
  {
    id: "s-pink",
    name: "Pink Sauce",
    description: {
      en: "Cream, tomato, a squeeze of lemon.",
      fr: "Crème, tomate, un trait de citron.",
      ru: "Сливки, томат, штрих лимона.",
      th: "ครีม มะเขือเทศ กลิ่นมะนาว",
    },
    price: 25,
    image: SIDE,
    category: "sauce",
  },
  {
    id: "s-garlic-mayo",
    name: "Garlic Mayo",
    description: {
      en: "Fresh garlic, whipped mayo, quiet punch.",
      fr: "Ail frais, mayo montée, punch discret.",
      ru: "Свежий чеснок, взбитый майонез, лёгкий удар.",
      th: "กระเทียมสด มายองเนส หมัดเบาๆ",
    },
    price: 25,
    image: SIDE,
    category: "sauce",
  },
  {
    id: "s-samourai",
    name: "Samouraï Sauce",
    description: {
      en: "Harissa & chili on a mayo base. Handle with respect.",
      fr: "Harissa et piment sur base mayo. À manier avec respect.",
      ru: "Хариса и чили на основе майонеза. Осторожно, жгучий.",
      th: "ฮาริสซ่าและพริกในมายองเนส เผ็ดต้องระวัง",
    },
    price: 25,
    image: SIDE,
    category: "sauce",
    tag: "Spicy",
  },
  {
    id: "s-tartare",
    name: "Tartare",
    description: {
      en: "Mayo, capers, pickles, herbs — cold, sharp, classic.",
      fr: "Mayo, câpres, cornichons, herbes — froid, vif, classique.",
      ru: "Майонез, каперсы, корнишоны, травы — холодный, острый, классический.",
      th: "มายองเนส เคเปอร์ แตงกวาดอง สมุนไพร — เย็น จี๊ด คลาสสิก",
    },
    price: 25,
    image: SIDE,
    category: "sauce",
  },
  {
    id: "s-algerienne",
    name: "Spicy Chef",
    description: {
      en: "Bell pepper, tomato, harissa, garlic — the chef's fiery side.",
      fr: "Poivron, tomate, harissa, ail — le côté brûlant du chef.",
      ru: "Перец, томат, хариса, чеснок — огненная сторона шефа.",
      th: "พริกยักษ์ มะเขือเทศ ฮาริสซ่า กระเทียม — ด้านเผ็ดร้อนของเชฟ",
    },
    price: 25,
    image: SIDE,
    category: "sauce",
  },

  // ---------- FRIES ----------
  {
    id: "f-fries",
    name: "Homemade French Fries",
    description: {
      en: "Hand-cut potatoes, twice-fried to golden crisp, sea salt finish.",
      fr: "Pommes de terre coupées main, doublement frites jusqu'à la croûte dorée, fleur de sel.",
      ru: "Картофель ручной нарезки, двойной прожарки до золотистой корочки, морская соль.",
      th: "มันฝรั่งตัดมือ ทอดสองครั้งจนเป็นสีทองกรอบ โรยเกลือทะเล",
    },
    price: 100,
    image: "/images/fries.jpg",
    category: "fries",
  },

  // ---------- DRINKS ----------
  //   30 ฿ — Coca, Coca Zero, Sprite, Singha (Yellow / Red / Pink)
  //   25 ฿ — Still Water, Soda Water
  {
    id: "d-coca",
    name: "Coca-Cola",
    description: {
      en: "Classic Coca-Cola, ice-cold.",
      fr: "Coca-Cola classique, glacé.",
      ru: "Классическая Coca-Cola, ледяная.",
      th: "โคคา-โคล่าคลาสสิก เย็นชื่นใจ",
    },
    price: 30,
    image: "/images/drinks/coca.jpg",
    category: "drink",
  },
  {
    id: "d-coca-zero",
    name: "Coca-Cola Zero",
    description: {
      en: "Zero sugar, all fizz.",
      fr: "Zéro sucre, toutes les bulles.",
      ru: "Ноль сахара, все пузырьки.",
      th: "ไม่มีน้ำตาล ซ่าเต็มร้อย",
    },
    price: 30,
    image: "/images/drinks/coca-zero.jpg",
    category: "drink",
  },
  {
    id: "d-sprite",
    name: "Sprite",
    description: {
      en: "Cool lemon-lime, sharp finish.",
      fr: "Citron-lime frais, finale nette.",
      ru: "Свежий лимон-лайм, чёткий вкус.",
      th: "เลม่อน-ไลม์เย็นซ่า จบสะอาด",
    },
    price: 30,
    image: "/images/drinks/sprite.jpg",
    category: "drink",
  },
  {
    id: "d-singha-yellow",
    name: "Singha Lemon Soda",
    description: {
      en: "Lemon soda, bright and citrusy.",
      fr: "Soda citron, frais et pétillant.",
      ru: "Лимонная сода, яркая и цитрусовая.",
      th: "โซดามะนาว สดชื่นซิตรัส",
    },
    price: 30,
    image: "/images/drinks/singha-yellow.jpg",
    category: "drink",
    tag: "Yellow",
  },
  {
    id: "d-singha-red",
    name: "Singha Red Lemon Soda",
    description: {
      en: "Bold red-label lemon soda, deeper citrus.",
      fr: "Soda citron étiquette rouge, agrume plus profond.",
      ru: "Насыщенная лимонная сода с красной этикеткой.",
      th: "โซดามะนาวฉลากแดง รสเข้มขึ้น",
    },
    price: 30,
    image: "/images/drinks/singha-red.jpg",
    category: "drink",
    tag: "Red",
  },
  {
    id: "d-singha-pink",
    name: "Singha Pink Lemon Soda",
    description: {
      en: "Pink lemon soda, strawberry-lemon twist.",
      fr: "Soda citron rose, twist fraise-citron.",
      ru: "Розовая лимонная сода с ноткой клубники.",
      th: "โซดามะนาวสีชมพู กลิ่นสตรอว์เบอร์รี่",
    },
    price: 30,
    image: "/images/drinks/singha-pink.jpg",
    category: "drink",
    tag: "Pink",
  },
  {
    id: "d-water",
    name: "Aura Still Water",
    description: {
      en: "Aura natural spring water, chilled.",
      fr: "Aura eau de source naturelle, fraîche.",
      ru: "Aura природная родниковая вода, охлаждённая.",
      th: "น้ำแร่ธรรมชาติ Aura แช่เย็น",
    },
    price: 25,
    image: "/images/drinks/water.jpg",
    category: "drink",
  },
  {
    id: "d-soda-water",
    name: "Singha Soda Water",
    description: {
      en: "Singha sparkling soda water, all bubbles no sugar.",
      fr: "Singha eau gazeuse, toutes les bulles zéro sucre.",
      ru: "Singha газированная вода, только пузырьки, без сахара.",
      th: "โซดา Singha น้ำอัดลมไม่มีน้ำตาล",
    },
    price: 25,
    image: "/images/drinks/soda-water.jpg",
    category: "drink",
  },
];
