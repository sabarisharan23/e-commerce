import { getProductsByIds } from "@/data/products";

export type ConcernTab = {
  id: string;
  label: string;
  productIds: string[];
};

export const concernTabs: ConcernTab[] = [
  {
    id: "weight-loss",
    label: "Weight Loss",
    productIds: [
      "diet-choize-quinoa-sorghum-flour",
      "karumponnu-black-kavuni-kanji-mix",
      "pearl-millet",
      "mappillai-samba-illuppai-poo-samba-laddu-mix",
    ],
  },
  {
    id: "fitness-protein",
    label: "Fitness / Protein",
    productIds: [
      "protein-mix",
      "froot-plus",
      "health-mix",
      "nutri-salt-moringa-infusion",
    ],
  },
  {
    id: "diabetes-care",
    label: "Diabetes Care",
    productIds: [
      "diabetic-mix",
      "foxtail-millet-quinoa-puttu-podi",
      "millet-flours",
      "uyirsathu-sathumavu",
    ],
  },
  {
    id: "daily-nutrition",
    label: "Daily Nutrition",
    productIds: [
      "pearl-millet",
      "health-mix",
      "bamboo-rice-quinoa-puttu-mix",
      "millet-vita-traditional-health-mix",
    ],
  },
  {
    id: "energy-boost",
    label: "Energy Boost",
    productIds: [
      "froot-plus",
      "amudhu-bajra-bamboo-rice-koozh-mix",
      "protein-mix",
      "nutri-salt-moringa-infusion",
    ],
  },
];

export const concernTabsWithProducts = concernTabs.map((tab) => ({
  ...tab,
  products: getProductsByIds(tab.productIds),
}));
