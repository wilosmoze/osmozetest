import type { LocalizedString } from "@/lib/i18n";

export type MenuItem = {
  id: string;
  name: string; // brand name — not translated
  description: LocalizedString;
  price: number; // THB
  image: string;
  category: "burger" | "sauce" | "fries" | "drink";
  tag?: string;
  ingredients?: string[];
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
    image: "/images/burger-bassline.jpg",
    category: "burger",
    tag: "Signature",
    ingredients: ["Double Charolais", "Cheddar", "Dijon & ketchup"],
  },
  {
    id: "b-deep-groove",
    name: "Deep Groove",
    description: {
      en: "Deep and savoury. Double Charolais, Grana Padano 25g, orange cheddar, fried shiitake, cabbage vinaigrette, garlic, red onions, garlic mayo.",
      fr: "Profond et savoureux. Double charolais, Grana Padano 25g, cheddar orange, shiitakes poêlés, chou vinaigrette, ail, oignons rouges, mayo à l'ail.",
      ru: "Глубокий и насыщенный. Двойной шароле, Грана Падано 25 г, оранжевый чеддер, жареные шиитаке, капуста винегрет, чеснок, красный лук, чесночный майо.",
      th: "เข้มข้นและมีรสอูมามิ ชาโรเลส์คู่ กราน่า ปาดาโน่ 25 ก. ชีสเชดดาร์ส้ม เห็ดชิตาเกะทอด สลัดกะหล่ำ กระเทียม หอมแดง มายองเนสกระเทียม",
    },
    price: 299,
    image: "/images/burger-deep-groove.jpg",
    category: "burger",
    ingredients: ["Grana Padano", "Shiitake", "Garlic mayo"],
  },
  {
    id: "b-soul",
    name: "Soul",
    description: {
      en: "Rich and soulful. Double Charolais, emmental, orange cheddar, crispy bacon, lettuce, tomato, pickled onions, tartare sauce.",
      fr: "Riche et soulful. Double charolais, emmental, cheddar orange, bacon croustillant, laitue, tomate, oignons pickles, sauce tartare.",
      ru: "Богатый и душевный. Двойной шароле, эмменталь, оранжевый чеддер, хрустящий бекон, салат, помидор, маринованный лук, соус тартар.",
      th: "เข้มข้นและมีจิตวิญญาณ ชาโรเลส์คู่ ชีสเอมเมนทาล ชีสเชดดาร์ส้ม เบคอนกรอบ ผักสลัด มะเขือเทศ หอมดอง ซอสทาร์ทาร์",
    },
    price: 309,
    image: "/images/burger-soul.jpg",
    category: "burger",
    tag: "Best-seller",
    ingredients: ["Bacon", "Emmental", "Tartare"],
  },
  {
    id: "b-electro-bass",
    name: "Electro Bass",
    description: {
      en: "Bright and electric. Grilled chicken, goat feta, red onions, green salad, spicy sauce & cassis, drizzle of honey.",
      fr: "Vif et électrique. Poulet grillé, feta de chèvre, oignons rouges, salade verte, sauce épicée & cassis, filet de miel.",
      ru: "Яркий и электрический. Гриль-курица, фета из козьего молока, красный лук, зелёный салат, острый соус и кассис, капля мёда.",
      th: "สดใสและมีชีวิตชีวา ไก่ย่าง ชีสฟีต้าแพะ หอมแดง สลัดผัก ซอสเผ็ดและแคสซิส น้ำผึ้งเล็กน้อย",
    },
    price: 289,
    image: "/images/burger-electro-bass.jpg",
    category: "burger",
    tag: "Spicy",
    ingredients: ["Grilled chicken", "Goat feta", "Honey"],
  },
  {
    id: "b-808-smash",
    name: "808 Smash",
    description: {
      en: "Bold and unexpected. Grilled chicken, smashed avocado, fried egg, cabbage slices, red cabbage pickles, pink sauce.",
      fr: "Audacieux et inattendu. Poulet grillé, avocat écrasé, œuf au plat, tranches de chou, chou rouge pickles, sauce pink.",
      ru: "Смелый и неожиданный. Гриль-курица, авокадо-смэш, яичница-глазунья, ломтики капусты, маринованная краснокочанная капуста, розовый соус.",
      th: "กล้าและเซอร์ไพรส์ ไก่ย่าง อะโวคาโดบด ไข่ดาว กะหล่ำสไลซ์ กะหล่ำม่วงดอง ซอสชมพู",
    },
    price: 289,
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
    name: "Algérienne",
    description: {
      en: "Bell pepper, tomato, harissa, garlic — Algerian heat.",
      fr: "Poivron, tomate, harissa, ail — chaleur algérienne.",
      ru: "Перец, томат, хариса, чеснок — алжирская острота.",
      th: "พริกยักษ์ มะเขือเทศ ฮาริสซ่า กระเทียม — เผ็ดสไตล์แอลจีเรีย",
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
    image: SIDE,
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
    image: SIDE,
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
    image: SIDE,
    category: "drink",
  },
  {
    id: "d-singha-yellow",
    name: "Singha",
    description: {
      en: "Thailand's classic lager, crisp and hoppy.",
      fr: "Lager classique de Thaïlande, croquante et houblonnée.",
      ru: "Классический тайский лагер, свежий и хмельной.",
      th: "ลาเกอร์คลาสสิกของไทย สดชื่นและหอมฮอปส์",
    },
    price: 30,
    image: SIDE,
    category: "drink",
    tag: "Yellow",
  },
  {
    id: "d-singha-red",
    name: "Singha",
    description: {
      en: "Bold red-label lager, full-bodied.",
      fr: "Lager étiquette rouge, corsée.",
      ru: "Насыщенный лагер с красной этикеткой.",
      th: "ลาเกอร์ฉลากแดง เข้มข้น",
    },
    price: 30,
    image: SIDE,
    category: "drink",
    tag: "Red",
  },
  {
    id: "d-singha-pink",
    name: "Singha",
    description: {
      en: "Lighter, brighter session lager.",
      fr: "Lager plus légère et fraîche.",
      ru: "Лёгкий и освежающий сессионный лагер.",
      th: "ลาเกอร์เบาสดชื่น",
    },
    price: 30,
    image: SIDE,
    category: "drink",
    tag: "Pink",
  },
  {
    id: "d-water",
    name: "Still Water",
    description: {
      en: "Chilled bottled water.",
      fr: "Eau plate en bouteille, fraîche.",
      ru: "Охлаждённая бутилированная вода.",
      th: "น้ำเปล่าขวดเย็น",
    },
    price: 25,
    image: SIDE,
    category: "drink",
  },
  {
    id: "d-soda-water",
    name: "Soda Water",
    description: {
      en: "Sparkling water, all bubbles no sugar.",
      fr: "Eau pétillante, toutes les bulles zéro sucre.",
      ru: "Газированная вода, только пузырьки, без сахара.",
      th: "โซดา น้ำอัดลมไม่มีน้ำตาล",
    },
    price: 25,
    image: SIDE,
    category: "drink",
  },
];
