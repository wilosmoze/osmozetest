import type { LocalizedString } from "@/lib/i18n";

export type MenuItem = {
  id: string;
  name: string; // brand name — not translated
  description: LocalizedString;
  price: number; // THB
  image: string;
  category: "burger" | "sauce" | "dessert";
  tag?: string;
  ingredients?: string[];
};

const HERO = "/images/burger-hero.jpg";
const SIDE = "/images/burger-side.jpg";
const DESSERT = "/images/dessert-brioche.jpg";

export const menu: MenuItem[] = [
  // ---------- BURGERS ----------
  {
    id: "b-patron",
    name: "Le Patron",
    description: {
      en: "Black Angus 180g, 18-month aged cheddar, port-glazed onions, rocket, truffle mayo.",
      fr: "Black Angus 180g, cheddar affiné 18 mois, oignons confits au porto, roquette, mayo truffe.",
      ru: "Блэк Ангус 180 г, чеддер выдержки 18 месяцев, лук в портвейне, руккола, трюфельный майо.",
      th: "เนื้อแบล็คแองกัส 180 ก. ชีสเชดดาร์บ่ม 18 เดือน หอมเคี่ยวพอร์ต ผักร็อกเก็ต มายองเนสทรัฟเฟิล",
    },
    price: 580,
    image: HERO,
    category: "burger",
    tag: "Signature",
    ingredients: ["Black Angus", "Aged cheddar", "Truffle"],
  },
  {
    id: "b-brasero",
    name: "Le Brasero",
    description: {
      en: "Double Angus, melted cheddar, beech-smoked bacon, crispy onions, house bourbon BBQ.",
      fr: "Double Angus, cheddar fondu, bacon fumé au hêtre, oignons croustillants, BBQ bourbon maison.",
      ru: "Двойной Ангус, плавленый чеддер, бекон копчёный на буке, хрустящий лук, домашний BBQ с бурбоном.",
      th: "เนื้อแองกัสคู่ ชีสเชดดาร์ละลาย เบคอนรมควันไม้บีช หอมกรอบ บาร์บีคิวเบอร์เบินโฮมเมด",
    },
    price: 620,
    image: HERO,
    category: "burger",
    tag: "Best-seller",
    ingredients: ["Double beef", "Smoked bacon", "Bourbon BBQ"],
  },
  {
    id: "b-italien",
    name: "L'Italien",
    description: {
      en: "Beef, buffalo mozzarella, confit tomato, fresh basil, house pesto on brioche.",
      fr: "Bœuf, mozzarella di bufala, tomate confite, basilic frais, pesto maison sur brioche.",
      ru: "Говядина, моцарелла из буйволиного молока, томаты конфи, свежий базилик, домашний песто на бриоши.",
      th: "เนื้อ มอสซาเรลล่าควาย มะเขือเทศคอนฟิต โหระพาสด เพสโต้โฮมเมด บนขนมปังบรียอช",
    },
    price: 490,
    image: SIDE,
    category: "burger",
    ingredients: ["Buffalo mozzarella", "Pesto", "Basil"],
  },
  {
    id: "b-bleu",
    name: "Le Bleu",
    description: {
      en: "Beef, Fourme d'Ambert blue cheese, wine-poached pear, caramelised walnuts, lamb's lettuce, honey-mustard mayo.",
      fr: "Bœuf, Fourme d'Ambert, poire pochée au vin, noix caramélisées, mâche, mayo miel-moutarde.",
      ru: "Говядина, голубой сыр Фурм д'Амбер, груша в вине, карамелизированные грецкие орехи, валерианица, майо мёд-горчица.",
      th: "เนื้อ ชีสบลูฟูร์ม ดี อมแบรต์ ลูกแพร์ตุ๋นไวน์ วอลนัทคาราเมล ผักสลัด มายองเนสน้ำผึ้งมัสตาร์ด",
    },
    price: 510,
    image: SIDE,
    category: "burger",
    ingredients: ["Blue cheese", "Pear", "Walnut"],
  },
  {
    id: "b-volcan",
    name: "Le Volcan",
    description: {
      en: "Beef, spicy cheddar, fresh jalapeños, red onion, smoked chipotle sauce.",
      fr: "Bœuf, cheddar épicé, jalapeños frais, oignon rouge, sauce chipotle fumée.",
      ru: "Говядина, острый чеддер, свежие халапеньо, красный лук, копчёный соус чипотле.",
      th: "เนื้อ ชีสเชดดาร์เผ็ด ฮาลาเปญโญ่สด หอมแดง ซอสชิโพเทเล่รมควัน",
    },
    price: 450,
    image: HERO,
    category: "burger",
    tag: "Spicy",
    ingredients: ["Chipotle", "Jalapeño", "Sharp cheddar"],
  },
  {
    id: "b-forestier",
    name: "Le Forestier",
    description: {
      en: "Beef, garlic-sautéed mushrooms, 24-month Comté, caramelised onions, wholegrain mustard.",
      fr: "Bœuf, champignons sautés à l'ail, Comté 24 mois, oignons confits, moutarde à l'ancienne.",
      ru: "Говядина, грибы, обжаренные с чесноком, Конте 24 месяца, лук карамелизированный, зерновая горчица.",
      th: "เนื้อ เห็ดผัดกระเทียม ชีสกงเต้บ่ม 24 เดือน หอมคาราเมล มัสตาร์ดเมล็ดเต็ม",
    },
    price: 490,
    image: SIDE,
    category: "burger",
    ingredients: ["Aged Comté", "Mushroom", "Garlic"],
  },

  // ---------- SAUCES ----------
  {
    id: "s-truffe",
    name: "Truffle & Parmesan",
    description: {
      en: "Silky mayo, black truffle shavings, grated 24-month Parmigiano.",
      fr: "Mayo soyeuse, copeaux de truffe noire, parmigiano 24 mois râpé.",
      ru: "Шёлковый майонез, стружка чёрного трюфеля, тёртый пармезан 24 месяца.",
      th: "มายองเนสเนียน เกล็ดเห็ดทรัฟเฟิลดำ พาร์เมซานบ่ม 24 เดือนขูด",
    },
    price: 80,
    image: SIDE,
    category: "sauce",
  },
  {
    id: "s-chipotle",
    name: "Smoked Chipotle",
    description: {
      en: "Chipotle, smoked paprika, acacia honey, hint of lime.",
      fr: "Chipotle, paprika fumé, miel d'acacia, touche de citron vert.",
      ru: "Чипотле, копчёная паприка, акациевый мёд, оттенок лайма.",
      th: "ชิโพเทเล่ พริกปาปริก้ารมควัน น้ำผึ้งอเคเซีย กลิ่นมะนาว",
    },
    price: 60,
    image: SIDE,
    category: "sauce",
  },
  {
    id: "s-yuzu",
    name: "Yuzu Mayo",
    description: {
      en: "Japanese mayo, fresh yuzu, toasted sesame.",
      fr: "Mayo japonaise, yuzu frais, sésame torréfié.",
      ru: "Японский майонез, свежий юдзу, обжаренный кунжут.",
      th: "มายองเนสญี่ปุ่น ยูสุสด งาคั่ว",
    },
    price: 70,
    image: SIDE,
    category: "sauce",
    tag: "New",
  },
  {
    id: "s-ail",
    name: "Black Garlic",
    description: {
      en: "60-day fermented black garlic, mayo, chopped chives.",
      fr: "Ail noir fermenté 60 jours, mayo, ciboulette ciselée.",
      ru: "Чёрный чеснок 60-дневной ферментации, майонез, рубленый шнитт-лук.",
      th: "กระเทียมดำหมัก 60 วัน มายองเนส ต้นหอมซอย",
    },
    price: 80,
    image: SIDE,
    category: "sauce",
    tag: "Rare",
  },

  // ---------- DESSERTS ----------
  {
    id: "d-cookie",
    name: "Burnt Cookie",
    description: {
      en: "Toasted brioche, Madagascar vanilla ice cream, cookie chunks, salted butter caramel.",
      fr: "Brioche toastée, glace vanille de Madagascar, éclats de cookie, caramel beurre salé.",
      ru: "Поджаренная бриошь, мадагаскарское ванильное мороженое, кусочки печенья, солёная карамель.",
      th: "บรียอชย่าง ไอศกรีมวานิลลามาดากัสการ์ คุกกี้แตก คาราเมลเกลือ",
    },
    price: 250,
    image: DESSERT,
    category: "dessert",
  },
  {
    id: "d-volcan",
    name: "Chocolate Volcano",
    description: {
      en: "Cocoa brioche, 70% chocolate ganache, torched marshmallow, praline shards.",
      fr: "Brioche cacao, ganache chocolat 70%, guimauve flambée, éclats de praliné.",
      ru: "Какао-бриошь, шоколадный ганаш 70%, обожжённый зефир, осколки пралине.",
      th: "บรียอชโกโก้ กาน่าชช็อกโกแลต 70% มาร์ชแมลโลว์เผา เกล็ดพราลิเน่",
    },
    price: 290,
    image: DESSERT,
    category: "dessert",
    tag: "Torched to order",
  },
  {
    id: "d-rouge",
    name: "Red Berry",
    description: {
      en: "Soft brioche, vanilla mascarpone, red berry compote, pistachio crumble.",
      fr: "Brioche moelleuse, mascarpone vanillé, compote de fruits rouges, crumble pistache.",
      ru: "Мягкая бриошь, ванильный маскарпоне, компот из красных ягод, фисташковый крамбл.",
      th: "บรียอชนุ่ม มาสคาร์โปเน่วานิลลา แยมเบอร์รี่แดง ครัมเบิ้ลพิสตาชิโอ",
    },
    price: 230,
    image: DESSERT,
    category: "dessert",
  },
];
