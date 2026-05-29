import { Beef, Wheat, Flame, Layers, Bike } from "lucide-react";

export const journeyTimeline = [
  {
    id: 1,
    title: "Sourcing",
    date: "Origin",
    content:
      "French Black Angus beef, sourced from our partner farmers in the Aubrac region. Minimum 21-day dry-aged.",
    category: "Raw material",
    icon: Beef,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "The Bun",
    date: "Daily",
    content:
      "Brioche kneaded every morning by our partner baker. Natural sourdough, 24-hour proof.",
    category: "Bakery",
    icon: Wheat,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 3,
    title: "The Flame",
    date: "Cooking",
    content:
      "Patty seared to order at 280°C on our cast-iron grill. Caramelised crust, pink centre.",
    category: "Cooking",
    icon: Flame,
    relatedIds: [1, 2, 4],
    status: "in-progress" as const,
    energy: 95,
  },
  {
    id: 4,
    title: "Assembly",
    date: "Build",
    content:
      "House sauces, fresh toppings, careful build, insulated packaging to lock in the heat.",
    category: "Workshop",
    icon: Layers,
    relatedIds: [3, 5],
    status: "in-progress" as const,
    energy: 70,
  },
  {
    id: 5,
    title: "Delivery",
    date: "30 min max",
    content:
      "Dedicated courier, large insulated bag, arrives hot at your door. Live tracking.",
    category: "Logistics",
    icon: Bike,
    relatedIds: [4],
    status: "pending" as const,
    energy: 55,
  },
];
