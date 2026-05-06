export type InventoryStatus = "in-stock" | "low-stock" | "out-of-stock";

export type InventoryProduct = {
  id: string;
  name: string;
  category: string;
  categoryTag: string;
  imageSrc: string;
  price: number;
  stockUnits: number;
  status: InventoryStatus;
};

export const productInventoryOverview = {
  heading: "All Products",
  description: "Manage and monitor your store's inventory in real-time.",
  cards: [
    { id: "total", label: "Total Items", value: "1,284", tone: "default" as const },
    { id: "low", label: "Low Stock", value: "42", tone: "warning" as const },
    { id: "out", label: "Out of Stock", value: "12", tone: "danger" as const },
    { id: "valuation", label: "Total Valuation", value: "$452,190", tone: "success" as const },
  ],
};

export const productCategoryOptions = [
  "All Categories",
  "Millet Flour",
  "Drink Mix",
  "Salt",
  "Healthy Mix",
];

export const productStatusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "In Stock", value: "in-stock" },
  { label: "Low Stock", value: "low-stock" },
  { label: "Out of Stock", value: "out-of-stock" },
];

export const inventoryProducts: InventoryProduct[] = [
  {
    id: "diet-choice-chia",
    name: "Diet Choice - Chia Seeds - Finger Millet Flour",
    category: "Millet Flour",
    categoryTag: "Millet",
    imageSrc: "/home/deal-of-day/diet-choize-chia-seed-finger-millet-flour.png",
    price: 250,
    stockUnits: 42,
    status: "in-stock",
  },
  {
    id: "very-nize-wheat",
    name: "Very Nize - Wheat Chapati Flour",
    category: "Millet Flour",
    categoryTag: "Millet",
    imageSrc: "/home/deal-of-day/froot-plus.png",
    price: 550,
    stockUnits: 0,
    status: "out-of-stock",
  },
  {
    id: "karumponnu",
    name: "Karumpon - Karuppu Kavu Mix",
    category: "Drink Mix",
    categoryTag: "Drink Mix",
    imageSrc: "/home/deal-of-day/pearl-millet.png",
    price: 500,
    stockUnits: 42,
    status: "in-stock",
  },
  {
    id: "nutri-salt",
    name: "Nutri-Salt - Moringa Infused Salt",
    category: "Salt",
    categoryTag: "Salt",
    imageSrc: "/home/deal-of-day/nutri-salt-moringa-infusion.png",
    price: 150,
    stockUnits: 12,
    status: "low-stock",
  },
  {
    id: "quinoa-sorghum",
    name: "Diet Choice Quinoa-Sorghum Flour",
    category: "Millet Flour",
    categoryTag: "Millet",
    imageSrc: "/home/deal-of-day/diet-choize-quinoa-sorghum-flour.png",
    price: 480,
    stockUnits: 88,
    status: "in-stock",
  },
  {
    id: "millet-vita",
    name: "Millet Vita - Traditional Health Mix",
    category: "Healthy Mix",
    categoryTag: "Healthy Mix",
    imageSrc: "/home/deal-of-day/millet-vita-traditional-health-mix.png",
    price: 250,
    stockUnits: 42,
    status: "low-stock",
  },
  {
    id: "bamboo-rice",
    name: "Bamboo Rice - Quinoa Puttu Mix",
    category: "Healthy Mix",
    categoryTag: "Healthy Mix",
    imageSrc: "/home/deal-of-day/bamboo-rice-quinoa-puttu-mix.png",
    price: 750,
    stockUnits: 64,
    status: "in-stock",
  },
  {
    id: "froot-plus",
    name: "Froot Plus Healthy Fruit Drink Mix",
    category: "Drink Mix",
    categoryTag: "Drink Mix",
    imageSrc: "/home/deal-of-day/froot-plus.png",
    price: 348,
    stockUnits: 0,
    status: "out-of-stock",
  },
  {
    id: "pearl-millet",
    name: "Pearl Millet",
    category: "Millet Flour",
    categoryTag: "Millet",
    imageSrc: "/home/deal-of-day/pearl-millet.png",
    price: 399,
    stockUnits: 420,
    status: "in-stock",
  },
  {
    id: "uyirsathu",
    name: "UyirSathu - Sathumavu",
    category: "Healthy Mix",
    categoryTag: "Healthy Mix",
    imageSrc: "/home/deal-of-day/uyirsathu-sathumavu.png",
    price: 250,
    stockUnits: 27,
    status: "low-stock",
  },
  {
    id: "chia-seed-second",
    name: "Diet Choice - Chia Seeds - Premium Pack",
    category: "Millet Flour",
    categoryTag: "Millet",
    imageSrc: "/home/deal-of-day/diet-choize-chia-seed-finger-millet-flour.png",
    price: 250,
    stockUnits: 42,
    status: "in-stock",
  },
  {
    id: "karumponnu-second",
    name: "Karumpon - Karuppu Kavu Family Pack",
    category: "Drink Mix",
    categoryTag: "Drink Mix",
    imageSrc: "/home/deal-of-day/pearl-millet.png",
    price: 500,
    stockUnits: 42,
    status: "in-stock",
  },
];
