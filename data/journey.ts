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
    title: "The Pressing",
    date: "Daily",
    content:
      "House brioche pressed every morning. Natural sourdough, 24-hour proof, sealed tight to lock the heat in.",
    category: "Bakery",
    icon: Wheat,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 3,
    title: "The Drop",
    date: "Cooking",
    content:
      "Patty seared at 280°C on cast iron. Caramelised crust, pink heart. The drop happens here.",
    category: "Cooking",
    icon: Flame,
    relatedIds: [1, 2, 4],
    status: "in-progress" as const,
    energy: 95,
  },
  {
    id: 4,
    title: "The Mix",
    date: "Build",
    content:
      "House sauces, fresh toppings, careful mastering. Each burger sealed tight for the road.",
    category: "Workshop",
    icon: Layers,
    relatedIds: [3, 5],
    status: "in-progress" as const,
    energy: 70,
  },
  {
    id: 5,
    title: "The Release",
    date: "30 min max",
    content:
      "Dedicated courier, insulated bag, arrives hot at your door. Live tracking.",
    category: "Logistics",
    icon: Bike,
    relatedIds: [4],
    status: "pending" as const,
    energy: 55,
  },
];
