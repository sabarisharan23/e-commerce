import type { ProductDetails } from "@/components/shared";

export type ProductCategory = {
  id: string;
  label: string;
};

export type ProductCategoryMap = Record<string, ProductDetails[]>;

export const productCategories: ProductCategory[] = [
  { id: "breakfast-mix", label: "Breakfast Mix" },
  { id: "cookies", label: "Cookies" },
  { id: "diabetic-mix", label: "Diabetic Mix" },
  { id: "drink-mix", label: "Drink Mix" },
  { id: "health-mix", label: "Health Mix" },
  { id: "millet-flour", label: "Millet Flour" },
  { id: "protein-mix", label: "Protein Mix" },
  { id: "puttu-mix", label: "Puttu Mix" },
  { id: "ready-mix", label: "Ready Mix" },
  { id: "seasoning", label: "Seasoning" },
  { id: "traditional-staples", label: "Traditional Staples" },
];

export const allProducts: ProductDetails[] = [
  {
    id: "diet-choize-chia-seed-finger-millet-flour",
    name: "Diet Choize Chia Seed Finger Millet Flour",
    href: "#",
    imageSrc: "/home/deal-of-day/diet-choize-chia-seed-finger-millet-flour.png",
    imageAlt: "Diet Choize chia seed finger millet flour package.",
    price: 250,
    originalPrice: 352,
    rating: 4.2,
    saleLabel: "Sale 50%",
    category: "Millet Flour",
    shortDescription: "Stone-ground flour blend for rotis, dosas, and wholesome baking.",
    description:
      "A nourishing flour blend made with finger millet and chia seeds to support balanced, fiber-rich everyday meals.",
    sku: "TS-MF-001",
    weight: "500 g",
    stockStatus: "In stock",
    highlights: [
      "Rich in calcium and dietary fiber.",
      "Works well for porridge, dosa batter, and soft rotis.",
      "No refined additives or artificial flavoring.",
    ],
  },
  {
    id: "pearl-millet",
    name: "Pearl Millet",
    href: "#",
    imageSrc: "/home/deal-of-day/pearl-millet.png",
    imageAlt: "Pearl millet product pack.",
    price: 250,
    originalPrice: 352,
    rating: 4.1,
    category: "Traditional Staples",
    shortDescription: "Wholesome pearl millet for porridges, puttu mixes, and hearty breakfasts.",
    description:
      "Carefully packed pearl millet with a naturally earthy flavor and a satisfying texture for traditional cooking.",
    sku: "TS-PS-008",
    weight: "500 g",
    stockStatus: "In stock",
    highlights: [
      "High in energy and everyday nourishment.",
      "Suitable for porridge, flour blends, and savory recipes.",
      "Packed to preserve freshness and aroma.",
    ],
  },
  {
    id: "nutri-salt-moringa-infusion",
    name: "Nutri-Salt Moringa Infusion",
    href: "#",
    imageSrc: "/home/deal-of-day/nutri-salt-moringa-infusion.png",
    imageAlt: "Nutri-Salt moringa infusion container.",
    price: 450,
    originalPrice: 560,
    rating: 4.0,
    category: "Seasoning",
    shortDescription: "Mineral-rich salt blend enhanced with moringa for mindful daily use.",
    description:
      "A refreshing seasoning option that combines pink salt notes with the gentle herbal character of moringa.",
    sku: "TS-NS-014",
    weight: "250 g",
    stockStatus: "Low stock",
    highlights: [
      "Balanced savory taste for soups, salads, and snacks.",
      "Packed in a reusable jar for easy storage.",
      "Made for families looking for a cleaner pantry.",
    ],
  },
  {
    id: "froot-plus",
    name: "Froot Plus Healthy Fruit Drink Mix",
    href: "#",
    imageSrc: "/home/deal-of-day/froot-plus.png",
    imageAlt: "Froot Plus healthy fruit drink mix packet.",
    price: 750,
    originalPrice: 856,
    rating: 4.3,
    category: "Drink Mix",
    shortDescription: "A fruity mix for quick shakes and refreshing breakfast drinks.",
    description:
      "Fruit-forward health drink mix crafted for convenient breakfasts, midday energy, and easy daily nutrition.",
    sku: "TS-DM-021",
    weight: "400 g",
    stockStatus: "In stock",
    highlights: [
      "Easy to prepare with milk or water.",
      "Balanced sweetness with fruit-based flavor notes.",
      "Useful for breakfast routines and quick snacks.",
    ],
  },
  {
    id: "diet-choize-quinoa-sorghum-flour",
    name: "Diet Choize Quinoa Sorghum Flour",
    href: "#",
    imageSrc: "/home/deal-of-day/diet-choize-quinoa-sorghum-flour.png",
    imageAlt: "Diet Choize quinoa sorghum flour package.",
    price: 650,
    originalPrice: 850,
    rating: 4.1,
    category: "Millet Flour",
    shortDescription: "A smooth flour mix ideal for healthy baking, pancakes, and flatbreads.",
    description:
      "This quinoa and sorghum flour blend brings together light texture and wholesome nutrition for versatile home cooking.",
    sku: "TS-MF-019",
    weight: "500 g",
    stockStatus: "In stock",
    highlights: [
      "Great for dosas, rotis, and gluten-conscious recipes.",
      "Blended for softer texture and better handling.",
      "Naturally filling and pantry friendly.",
    ],
  },
  {
    id: "bamboo-rice-quinoa-puttu-mix",
    name: "Bamboo Rice Quinoa Puttu Mix",
    href: "#",
    imageSrc: "/home/deal-of-day/bamboo-rice-quinoa-puttu-mix.png",
    imageAlt: "Bamboo rice quinoa puttu mix product pack.",
    price: 750,
    originalPrice: 850,
    rating: 4.0,
    category: "Puttu Mix",
    shortDescription: "Nutty, grain-forward mix crafted for soft puttu and idiyappam.",
    description:
      "A traditional breakfast mix with bamboo rice and quinoa for a richer texture and a more distinctive grain profile.",
    sku: "TS-PM-026",
    weight: "500 g",
    stockStatus: "In stock",
    highlights: [
      "Easy prep for busy mornings.",
      "Works for puttu, idiyappam, and steamed snacks.",
      "Made with thoughtfully selected grains.",
    ],
  },
  {
    id: "uyirsathu-sathumavu",
    name: "UyirSathu Sathumavu",
    href: "#",
    imageSrc: "/home/deal-of-day/uyirsathu-sathumavu.png",
    imageAlt: "UyirSathu Sathumavu product packet.",
    price: 250,
    originalPrice: 352,
    rating: 4.2,
    category: "Health Mix",
    shortDescription: "Traditional multi-grain health mix for porridge and nourishing drinks.",
    description:
      "A comforting staple made with grains and pulses, designed for family-friendly breakfasts and daily wellness routines.",
    sku: "TS-HM-010",
    weight: "400 g",
    stockStatus: "In stock",
    highlights: [
      "Traditional formula with a smooth drinking texture.",
      "Suitable for children and adults alike.",
      "Tastes great warm with milk or water.",
    ],
  },
  {
    id: "millet-vita-traditional-health-mix",
    name: "Millet Vita Traditional Health Mix",
    href: "#",
    imageSrc: "/home/deal-of-day/millet-vita-traditional-health-mix.png",
    imageAlt: "Millet Vita traditional health mix packet.",
    price: 250,
    originalPrice: 352,
    rating: 4.1,
    category: "Health Mix",
    shortDescription: "Everyday millet health mix for lighter breakfasts and nourishing snacks.",
    description:
      "A versatile traditional mix made for simple, satisfying home preparation with millet-led ingredients.",
    sku: "TS-HM-004",
    weight: "500 g",
    stockStatus: "In stock",
    highlights: [
      "Good for porridge, smoothies, and evening drinks.",
      "Balanced flavor for regular use.",
      "Packed fresh to keep texture and aroma intact.",
    ],
  },
  {
    id: "amudhu-bajra-bamboo-rice-koozh-mix",
    name: "Amudhu - Bajra & Bamboo Rice Koozh Mix",
    href: "#",
    imageSrc: "/home/top-picks/amudhu-bajra-bamboo-rice-koozh-mix.png",
    imageAlt: "Amudhu bajra and bamboo rice koozh mix packet.",
    price: 250,
    originalPrice: 352,
    rating: 4.1,
    category: "Breakfast Mix",
    shortDescription: "Traditional koozh mix made for earthy, nourishing breakfasts.",
    description:
      "A comforting koozh mix blending bajra and bamboo rice for a filling, traditional meal with a smooth finish.",
    sku: "TS-BM-032",
    weight: "300 g",
    stockStatus: "In stock",
    highlights: [
      "Designed for easy daily breakfast prep.",
      "Made with millet-forward pantry staples.",
      "Balanced texture for warm savory servings.",
    ],
  },
  {
    id: "karumponnu-black-kavuni-kanji-mix",
    name: "Karumponnu - Black Kavuni Kanji Mix",
    href: "#",
    imageSrc: "/home/top-picks/karumponnu-black-kavuni-kanji-mix.png",
    imageAlt: "Karumponnu black kavuni kanji mix packet.",
    price: 250,
    originalPrice: 352,
    rating: 4.0,
    category: "Health Mix",
    shortDescription: "A rich kanji mix with black kavuni notes and deep grain flavor.",
    description:
      "Crafted for wholesome porridge preparation, this kanji mix brings a darker grain profile and a satisfying body.",
    sku: "TS-HM-033",
    weight: "310 g",
    stockStatus: "In stock",
    highlights: [
      "Good for traditional porridge preparation.",
      "Distinctive taste from black kavuni rice.",
      "A pantry-friendly option for wellness routines.",
    ],
  },
  {
    id: "foxtail-millet-quinoa-puttu-podi",
    name: "Foxtail Millet & Quinoa Puttu Podi",
    href: "#",
    imageSrc: "/home/top-picks/foxtail-millet-quinoa-puttu-podi.png",
    imageAlt: "Foxtail millet and quinoa puttu podi packet.",
    price: 550,
    originalPrice: 752,
    rating: 4.2,
    category: "Puttu Mix",
    shortDescription: "A lighter puttu podi with foxtail millet and quinoa.",
    description:
      "This puttu podi is built for soft, fragrant steamed breakfasts with a more modern grain combination.",
    sku: "TS-PM-034",
    weight: "300 g",
    stockStatus: "In stock",
    highlights: [
      "Works well for puttu and steamed snack recipes.",
      "Balanced blend for soft texture.",
      "Easy to keep in rotation for weekly breakfasts.",
    ],
  },
  {
    id: "mappillai-samba-illuppai-poo-samba-laddu-mix",
    name: "Mappillai Samba & Illuppai Poo Samba Laddu Mix",
    href: "#",
    imageSrc: "/home/top-picks/mappillai-samba-illuppai-poo-samba-laddu-mix.png",
    imageAlt: "Mappillai samba and illuppai poo samba laddu ready mix packet.",
    price: 800,
    originalPrice: 1200,
    rating: 4.1,
    category: "Ready Mix",
    shortDescription: "A festive laddu mix for richer homemade sweets and snacks.",
    description:
      "A traditional ready mix designed for easy laddu preparation with robust grain character and a celebratory feel.",
    sku: "TS-RM-035",
    weight: "350 g",
    stockStatus: "In stock",
    highlights: [
      "Useful for festive treats and family gatherings.",
      "Ready-mix convenience with traditional grain identity.",
      "Pairs well with ghee-based sweet preparation.",
    ],
  },
  {
    id: "protein-mix",
    name: "Protein Mix",
    href: "#",
    imageSrc: "/home/featured-categories/protein-mix.png",
    imageAlt: "Protein ingredients arranged around a small chalkboard.",
    price: 520,
    originalPrice: 640,
    rating: 4.3,
    category: "Protein Mix",
    shortDescription: "Protein-led mix for shakes, breakfast bowls, and active routines.",
    description:
      "A flexible pantry mix built around a stronger protein profile for quick post-workout or breakfast use.",
    sku: "TS-PX-205",
    weight: "400 g",
    stockStatus: "In stock",
    highlights: [
      "Useful for active lifestyles.",
      "Quick to prepare.",
      "Works in smoothies and shakes.",
    ],
  },
  {
    id: "health-mix",
    name: "Health Mix",
    href: "#",
    imageSrc: "/home/featured-categories/health-mix.png",
    imageAlt: "Health mix served in cups and a bowl on a wooden table.",
    price: 430,
    originalPrice: 540,
    rating: 4.1,
    category: "Health Mix",
    shortDescription: "Versatile mix for mornings when you want something filling and fast.",
    description:
      "A broad-use health mix that supports a simpler breakfast routine without much extra effort.",
    sku: "TS-HM-214",
    weight: "450 g",
    stockStatus: "In stock",
    highlights: [
      "Quick prep.",
      "Balanced everyday taste.",
      "Useful for drink or porridge formats.",
    ],
  },
  {
    id: "diabetic-mix",
    name: "Diabetic Mix",
    href: "#",
    imageSrc: "/home/featured-categories/diabetic-mix.png",
    imageAlt: "Bowls of diabetic mix and grains arranged for cooking.",
    price: 410,
    originalPrice: 520,
    rating: 4.2,
    category: "Diabetic Mix",
    shortDescription: "Carefully chosen grain mix for more mindful everyday preparation.",
    description:
      "A pantry mix built for steadier daily meal planning, with flavor that stays approachable for the whole household.",
    sku: "TS-DC-209",
    weight: "500 g",
    stockStatus: "In stock",
    highlights: [
      "Mindful pantry choice.",
      "Easy to work into daily recipes.",
      "Gentle flavor profile.",
    ],
  },
  {
    id: "millet-flours",
    name: "Millet Flours",
    href: "#",
    imageSrc: "/home/featured-categories/millet-flours.png",
    imageAlt: "A bowl of millet flour with a wooden spoon beside it.",
    price: 320,
    originalPrice: 410,
    rating: 4.1,
    category: "Millet Flour",
    shortDescription: "Stone-ground millet flour options for familiar home cooking.",
    description:
      "A versatile flour category suited to repeated use in rotis, porridges, and breakfast dishes.",
    sku: "TS-MF-211",
    weight: "500 g",
    stockStatus: "In stock",
    highlights: [
      "Flexible for home recipes.",
      "Simple kitchen swap.",
      "Comfortable everyday fit.",
    ],
  },
  {
    id: "very-nize-wheat-cookies",
    name: "Very Nize - Wheat Cookies",
    href: "#",
    imageSrc: "/home/deal-of-day/froot-plus.png",
    imageAlt: "Very Nize wheat cookies placeholder product image.",
    price: 550,
    originalPrice: 640,
    rating: 4.0,
    category: "Cookies",
    shortDescription: "A pantry snack option inspired by wholesome grain choices.",
    description:
      "A simple snack product placeholder used in the story carousel while keeping the shared catalog structure intact.",
    sku: "TS-CK-301",
    weight: "250 g",
    stockStatus: "In stock",
    highlights: [
      "Good for lighter snack moments.",
      "Grain-inspired pantry option.",
      "Works as a visual stand-in for story-led content.",
    ],
  },
];

const productLookup = new Map(allProducts.map((product) => [product.id, product]));

export const productIdsByCategory: Record<string, string[]> = {
  "breakfast-mix": ["amudhu-bajra-bamboo-rice-koozh-mix"],
  cookies: ["very-nize-wheat-cookies"],
  "diabetic-mix": ["diabetic-mix"],
  "drink-mix": ["froot-plus"],
  "health-mix": [
    "uyirsathu-sathumavu",
    "millet-vita-traditional-health-mix",
    "karumponnu-black-kavuni-kanji-mix",
    "health-mix",
  ],
  "millet-flour": [
    "diet-choize-chia-seed-finger-millet-flour",
    "diet-choize-quinoa-sorghum-flour",
    "millet-flours",
  ],
  "protein-mix": ["protein-mix"],
  "puttu-mix": [
    "bamboo-rice-quinoa-puttu-mix",
    "foxtail-millet-quinoa-puttu-podi",
  ],
  "ready-mix": ["mappillai-samba-illuppai-poo-samba-laddu-mix"],
  seasoning: ["nutri-salt-moringa-infusion"],
  "traditional-staples": ["pearl-millet"],
};

export const productsByCategory: ProductCategoryMap = productCategories.reduce(
  (groups, category) => {
    groups[category.id] = productIdsByCategory[category.id].map((id) =>
      getProductById(id),
    );
    return groups;
  },
  {} as ProductCategoryMap,
);

export const productCategoriesWithProducts = productCategories.map((category) => ({
  ...category,
  products: productsByCategory[category.id],
}));

export function getProductById(id: string) {
  const product = productLookup.get(id);

  if (!product) {
    throw new Error(`Product not found for id: ${id}`);
  }

  return product;
}

export function getProductsByIds(ids: string[]) {
  return ids.map(getProductById);
}

export function getProductsByCategory(categoryId: string) {
  const products = productsByCategory[categoryId];

  if (!products) {
    throw new Error(`Product category not found for id: ${categoryId}`);
  }

  return products;
}

export function getProductHref(productId: string) {
  return `/products/${productId}`;
}
