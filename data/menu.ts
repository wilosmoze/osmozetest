export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;          // En THB (฿)
  image: string;
  category: "burger" | "sauce" | "dessert";
  tag?: string;
  ingredients?: string[];
};

const seed = (s: string) => `https://picsum.photos/seed/${s}/800/900`;

export const menu: MenuItem[] = [
  // ---------- BURGERS (450–650 ฿) ----------
  {
    id: "b-patron",
    name: "Le Patron",
    description:
      "Black Angus 180g, 18-month aged cheddar, port-glazed onions, rocket, truffle mayo.",
    price: 580,
    image: seed("burger-patron-braise"),
    category: "burger",
    tag: "Signature",
    ingredients: ["Black Angus", "Aged cheddar", "Truffle"],
  },
  {
    id: "b-brasero",
    name: "Le Brasero",
    description:
      "Double Angus, melted cheddar, beech-smoked bacon, crispy onions, house bourbon BBQ.",
    price: 620,
    image: seed("burger-brasero"),
    category: "burger",
    tag: "Best-seller",
    ingredients: ["Double beef", "Smoked bacon", "Bourbon BBQ"],
  },
  {
    id: "b-italien",
    name: "L'Italien",
    description:
      "Beef, buffalo mozzarella, confit tomato, fresh basil, house pesto on brioche.",
    price: 490,
    image: seed("burger-italien"),
    category: "burger",
    ingredients: ["Buffalo mozzarella", "Pesto", "Basil"],
  },
  {
    id: "b-bleu",
    name: "Le Bleu",
    description:
      "Beef, Fourme d'Ambert blue cheese, wine-poached pear, caramelised walnuts, lamb's lettuce, honey-mustard mayo.",
    price: 510,
    image: seed("burger-bleu-fourme"),
    category: "burger",
    ingredients: ["Blue cheese", "Pear", "Walnut"],
  },
  {
    id: "b-volcan",
    name: "Le Volcan",
    description:
      "Beef, spicy cheddar, fresh jalapeños, red onion, smoked chipotle sauce.",
    price: 450,
    image: seed("burger-volcan-spicy"),
    category: "burger",
    tag: "Spicy",
    ingredients: ["Chipotle", "Jalapeño", "Sharp cheddar"],
  },
  {
    id: "b-forestier",
    name: "Le Forestier",
    description:
      "Beef, garlic-sautéed mushrooms, 24-month Comté, caramelised onions, wholegrain mustard.",
    price: 490,
    image: seed("burger-forestier-mushroom"),
    category: "burger",
    ingredients: ["Aged Comté", "Mushroom", "Garlic"],
  },

  // ---------- SAUCES (60–80 ฿) ----------
  {
    id: "s-truffe",
    name: "Truffle & Parmesan",
    description: "Silky mayo, black truffle shavings, grated 24-month Parmigiano.",
    price: 80,
    image: seed("sauce-truffe-noir"),
    category: "sauce",
  },
  {
    id: "s-chipotle",
    name: "Smoked Chipotle",
    description: "Chipotle, smoked paprika, acacia honey, hint of lime.",
    price: 60,
    image: seed("sauce-chipotle-fumee"),
    category: "sauce",
  },
  {
    id: "s-bbq",
    name: "Bourbon BBQ",
    description: "Smoked tomato, caramelised bourbon, molasses, roasted onion.",
    price: 60,
    image: seed("sauce-bbq-bourbon"),
    category: "sauce",
  },
  {
    id: "s-yuzu",
    name: "Yuzu Mayo",
    description: "Japanese mayo, fresh yuzu, toasted sesame.",
    price: 70,
    image: seed("sauce-yuzu-mayo"),
    category: "sauce",
    tag: "New",
  },
  {
    id: "s-miel",
    name: "Honey Mustard",
    description: "Wholegrain mustard, chestnut honey, cider vinegar.",
    price: 60,
    image: seed("sauce-miel-moutarde"),
    category: "sauce",
  },
  {
    id: "s-ail",
    name: "Black Garlic",
    description: "60-day fermented black garlic, mayo, chopped chives.",
    price: 80,
    image: seed("sauce-ail-noir"),
    category: "sauce",
    tag: "Rare",
  },

  // ---------- DESSERTS (230–290 ฿) ----------
  {
    id: "d-cookie",
    name: "Burnt Cookie",
    description:
      "Toasted brioche, Madagascar vanilla ice cream, cookie chunks, salted butter caramel.",
    price: 250,
    image: seed("dessert-cookie-brule"),
    category: "dessert",
  },
  {
    id: "d-volcan",
    name: "Chocolate Volcano",
    description:
      "Cocoa brioche, 70% ganache, flame-torched marshmallow, praline shards.",
    price: 290,
    image: seed("dessert-chocolat-volcan"),
    category: "dessert",
    tag: "Torched to order",
  },
  {
    id: "d-rouge",
    name: "Red Berry",
    description:
      "Soft brioche, vanilla mascarpone, red berry compote, pistachio crumble.",
    price: 230,
    image: seed("dessert-fruit-rouge"),
    category: "dessert",
  },
];
