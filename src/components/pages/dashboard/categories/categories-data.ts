export type ProductCategoryItem = {
  id: string;
  name: string;
  description: string;
  slug: string;
  count: number;
  parent: string;
};

export type ProductTagItem = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

export const categoriesPageContent = {
  heading: "Categories & Tags",
  description: "Organize your products with a robust taxonomy system.",
};

export const categoryParentOptions = [
  "None",
  "Millet Mix",
  "Drink Mix",
  "Healthy Mix",
];

export const categoryRecords: ProductCategoryItem[] = [
  {
    id: "millet-mix",
    name: "Millet Mix",
    description: "Healthy alternative grains and flour blends.",
    slug: "millet-mix",
    count: 12,
    parent: "None",
  },
  {
    id: "dosa-mix",
    name: "Dosa Mix",
    description: "Instant batter mixes for breakfast recipes.",
    slug: "dosa-mix",
    count: 8,
    parent: "None",
  },
  {
    id: "drink-mix",
    name: "Drink Mix",
    description: "Natural health drinks and herbal nutrition mixes.",
    slug: "drink-mix",
    count: 8,
    parent: "None",
  },
];

export const tagRecords: ProductTagItem[] = [
  {
    id: "organic",
    name: "Organic",
    slug: "organic",
    description: "Naturally sourced ingredients grown with care.",
  },
  {
    id: "gluten-free",
    name: "Gluten-Free",
    slug: "gluten-free",
    description: "Suitable for gluten-conscious shoppers.",
  },
  {
    id: "high-protein",
    name: "High Protein",
    slug: "high-protein",
    description: "Protein-rich mixes for daily strength.",
  },
  {
    id: "breakfast",
    name: "Breakfast",
    slug: "breakfast",
    description: "Quick recipes for everyday breakfast.",
  },
  {
    id: "no-sugar",
    name: "No Sugar",
    slug: "no-sugar",
    description: "No added sugar formulations.",
  },
  {
    id: "vegan",
    name: "Vegan",
    slug: "vegan",
    description: "Plant-based nutrition essentials.",
  },
];
