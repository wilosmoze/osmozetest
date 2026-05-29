import { Beef, Wheat, Flame, Layers, Bike } from "lucide-react";

export const journeyTimeline = [
  {
    id: 1,
    title: "Sélection",
    date: "Origine",
    content:
      "Bœuf Black Angus français, sélectionné chez nos éleveurs partenaires de l'Aubrac. Maturation 21 jours minimum.",
    category: "Matière première",
    icon: Beef,
    relatedIds: [2, 3],
    status: "completed" as const,
    energy: 100,
  },
  {
    id: 2,
    title: "Le Pain",
    date: "Quotidien",
    content:
      "Brioche briochée pétrie chaque matin par notre boulanger partenaire. Levain naturel, 24h de pousse.",
    category: "Boulangerie",
    icon: Wheat,
    relatedIds: [1, 3],
    status: "completed" as const,
    energy: 85,
  },
  {
    id: 3,
    title: "La Braise",
    date: "Cuisson",
    content:
      "Steak flammé minute à 280°C sur notre braisière en fonte. Croûte caramélisée, cœur saignant.",
    category: "Cuisson",
    icon: Flame,
    relatedIds: [1, 2, 4],
    status: "in-progress" as const,
    energy: 95,
  },
  {
    id: 4,
    title: "Assemblage",
    date: "Composition",
    content:
      "Sauces maison, garniture fraîche, montage soigné, emballage isotherme pour préserver la chaleur.",
    category: "Atelier",
    icon: Layers,
    relatedIds: [3, 5],
    status: "in-progress" as const,
    energy: 70,
  },
  {
    id: 5,
    title: "Livraison",
    date: "30 min max",
    content:
      "Coursier dédié, sac isotherme grand format, arrivée chaude à votre porte. Suivi temps réel.",
    category: "Logistique",
    icon: Bike,
    relatedIds: [4],
    status: "pending" as const,
    energy: 55,
  },
];
