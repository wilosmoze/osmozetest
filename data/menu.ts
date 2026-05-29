export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "burger" | "sauce" | "dessert";
  tag?: string;
  ingredients?: string[];
};

const seed = (s: string) => `https://picsum.photos/seed/${s}/800/900`;

export const menu: MenuItem[] = [
  {
    id: "b-patron",
    name: "Le Patron",
    description:
      "Black Angus 180g, cheddar affiné 18 mois, oignons confits au porto, roquette, mayo truffe.",
    price: 17.5,
    image: seed("burger-patron-braise"),
    category: "burger",
    tag: "Signature",
    ingredients: ["Black Angus", "Cheddar 18 mois", "Truffe"],
  },
  {
    id: "b-brasero",
    name: "Le Brasero",
    description:
      "Double Angus, cheddar fondu, bacon fumé au bois de hêtre, oignons frits, BBQ bourbon maison.",
    price: 18.9,
    image: seed("burger-brasero"),
    category: "burger",
    tag: "Best-seller",
    ingredients: ["Double viande", "Bacon fumé", "BBQ bourbon"],
  },
  {
    id: "b-italien",
    name: "L'Italien",
    description:
      "Bœuf, mozzarella di bufala, tomate confite, basilic frais, pesto maison sur brioche briochée.",
    price: 16.5,
    image: seed("burger-italien"),
    category: "burger",
    ingredients: ["Bufala", "Pesto", "Basilic"],
  },
  {
    id: "b-bleu",
    name: "Le Bleu",
    description:
      "Bœuf, fourme d'Ambert, poire pochée au vin, noix caramélisées, mâche, mayo moutarde miel.",
    price: 16.9,
    image: seed("burger-bleu-fourme"),
    category: "burger",
    ingredients: ["Fourme d'Ambert", "Poire", "Noix"],
  },
  {
    id: "b-volcan",
    name: "Le Volcan",
    description:
      "Bœuf, cheddar piquant, jalapeños frais, oignons rouges, sauce chipotle fumée.",
    price: 15.9,
    image: seed("burger-volcan-spicy"),
    category: "burger",
    tag: "Piquant",
    ingredients: ["Chipotle", "Jalapeño", "Cheddar fort"],
  },
  {
    id: "b-forestier",
    name: "Le Forestier",
    description:
      "Bœuf, champignons sautés à l'ail, Comté 24 mois, oignons confits, moutarde à l'ancienne.",
    price: 16.5,
    image: seed("burger-forestier-mushroom"),
    category: "burger",
    ingredients: ["Comté 24 mois", "Champignons", "Ail"],
  },

  {
    id: "s-truffe",
    name: "Truffe & Parmesan",
    description: "Mayo onctueuse, brisures de truffe noire, parmesan 24 mois râpé.",
    price: 2.5,
    image: seed("sauce-truffe-noir"),
    category: "sauce",
  },
  {
    id: "s-chipotle",
    name: "Chipotle Fumée",
    description: "Chipotle, paprika fumé, miel d'acacia, touche de lime.",
    price: 1.9,
    image: seed("sauce-chipotle-fumee"),
    category: "sauce",
  },
  {
    id: "s-bbq",
    name: "BBQ Bourbon",
    description: "Tomate fumée, bourbon caramélisé, mélasse, oignon rôti.",
    price: 1.9,
    image: seed("sauce-bbq-bourbon"),
    category: "sauce",
  },
  {
    id: "s-yuzu",
    name: "Mayo Yuzu",
    description: "Mayo japonaise, yuzu frais, sésame torréfié.",
    price: 2.2,
    image: seed("sauce-yuzu-mayo"),
    category: "sauce",
    tag: "Nouveau",
  },
  {
    id: "s-miel",
    name: "Moutarde Miel",
    description: "Moutarde à l'ancienne, miel de châtaignier, vinaigre de cidre.",
    price: 1.9,
    image: seed("sauce-miel-moutarde"),
    category: "sauce",
  },
  {
    id: "s-ail",
    name: "Ail Noir",
    description: "Ail noir fermenté 60 jours, mayo, ciboulette ciselée.",
    price: 2.5,
    image: seed("sauce-ail-noir"),
    category: "sauce",
    tag: "Rare",
  },

  {
    id: "d-cookie",
    name: "Le Cookie Brûlé",
    description:
      "Brioche toastée, glace vanille de Madagascar, éclats de cookie, caramel beurre salé.",
    price: 8.5,
    image: seed("dessert-cookie-brule"),
    category: "dessert",
  },
  {
    id: "d-volcan",
    name: "Le Chocolat Volcan",
    description:
      "Brioche cacao, ganache 70%, marshmallow flambé minute, éclats de praliné.",
    price: 8.9,
    image: seed("dessert-chocolat-volcan"),
    category: "dessert",
    tag: "Flambé minute",
  },
  {
    id: "d-rouge",
    name: "Le Fruit Rouge",
    description:
      "Brioche moelleuse, mascarpone vanillé, compotée fruits rouges, crumble pistache.",
    price: 7.9,
    image: seed("dessert-fruit-rouge"),
    category: "dessert",
  },
];
