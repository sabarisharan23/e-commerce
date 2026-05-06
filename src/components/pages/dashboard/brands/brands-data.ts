export type BrandCategoryStat = {
  id: string;
  label: string;
  value: string;
  icon: "leaf" | "grain" | "glass" | "root";
};

export type BrandDirectoryItem = {
  id: string;
  slug: string;
  name: string;
  category: string;
  badge: string;
  badgeTone: "green" | "blue" | "orange";
  totalProducts: string;
  growth: string;
  growthTone: "positive" | "negative" | "neutral";
  logoInitials: string;
  logoTone: "light" | "dark" | "cream" | "teal" | "stone";
  cardFrom: string;
  cardTo: string;
};

export type InventorySnapshotRow = {
  id: string;
  brandName: string;
  icon: "leaf" | "grain" | "glass";
  stockProgress: number;
  pendingShipments: string;
  status: "Healthy" | "Regular" | "Low Stock";
};

export type BrandCatalogItem = {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: string;
  stockTone: "in-stock" | "low-stock";
  imageSrc: string;
};

export type BrandProfile = {
  slug: string;
  name: string;
  status: string;
  tagline: string;
  joinedLabel: string;
  merchantLabel: string;
  totalRevenue: string;
  revenueDelta: string;
  orders: string;
  ordersProgress: number;
  averageRating: string;
  reviewCount: string;
  primaryContact: string;
  contactRole: string;
  email: string;
  phone: string;
  headquarters: string;
  compliance: string[];
  note: {
    eyebrow: string;
    quote: string;
    author: string;
    role: string;
    initials: string;
  };
  catalog: BrandCatalogItem[];
};

export const brandCategoryStats: BrandCategoryStat[] = [
  { id: "organic-millets", label: "Organic Millets", value: "24", icon: "leaf" },
  { id: "grains", label: "Grains", value: "18", icon: "grain" },
  { id: "drink-mix", label: "Drink Mix", value: "12", icon: "glass" },
  { id: "roots", label: "Roots", value: "09", icon: "root" },
];

export const brandFilterTabs = [
  "All Brands",
  "Organic Millets",
  "Grains",
  "Drink Mix",
  "Roots",
] as const;

export const brandDirectoryItems: BrandDirectoryItem[] = [
  {
    id: "earthbound",
    slug: "earthbound-organic",
    name: "Earthbound Organic",
    category: "Organic Millets",
    badge: "Top Performer",
    badgeTone: "green",
    totalProducts: "142",
    growth: "+12.4%",
    growthTone: "positive",
    logoInitials: "EO",
    logoTone: "light",
    cardFrom: "#dbdcff",
    cardTo: "#eef0ff",
  },
  {
    id: "primal",
    slug: "primal-grains",
    name: "Primal Grains",
    category: "Grains",
    badge: "Stable",
    badgeTone: "blue",
    totalProducts: "86",
    growth: "+2.1%",
    growthTone: "positive",
    logoInitials: "PG",
    logoTone: "dark",
    cardFrom: "#e7edf6",
    cardTo: "#f6f8fb",
  },
  {
    id: "sunmixed",
    slug: "sun-mixed-brews",
    name: "Sun-Mixed Brews",
    category: "Drink Mix",
    badge: "At Risk",
    badgeTone: "orange",
    totalProducts: "44",
    growth: "-4.2%",
    growthTone: "negative",
    logoInitials: "SB",
    logoTone: "cream",
    cardFrom: "#fde9c5",
    cardTo: "#fff8e8",
  },
  {
    id: "root-health",
    slug: "root-health-co",
    name: "Root Health Co.",
    category: "Roots",
    badge: "Top Performer",
    badgeTone: "green",
    totalProducts: "67",
    growth: "+18.9%",
    growthTone: "positive",
    logoInitials: "RH",
    logoTone: "teal",
    cardFrom: "#d7f7e8",
    cardTo: "#eefcf4",
  },
  {
    id: "velvet",
    slug: "velvet-millets",
    name: "Velvet Millets",
    category: "Organic Millets",
    badge: "Stable",
    badgeTone: "blue",
    totalProducts: "28",
    growth: "+1.5%",
    growthTone: "positive",
    logoInitials: "VM",
    logoTone: "stone",
    cardFrom: "#efe6ff",
    cardTo: "#f8f4ff",
  },
];

export const brandInventorySnapshot: InventorySnapshotRow[] = [
  {
    id: "row-earthbound",
    brandName: "Earthbound Organic",
    icon: "leaf",
    stockProgress: 84,
    pendingShipments: "12 Units",
    status: "Healthy",
  },
  {
    id: "row-primal",
    brandName: "Primal Grains",
    icon: "grain",
    stockProgress: 46,
    pendingShipments: "05 Units",
    status: "Regular",
  },
  {
    id: "row-sunmixed",
    brandName: "Sun-Mixed Brews",
    icon: "glass",
    stockProgress: 12,
    pendingShipments: "00 Units",
    status: "Low Stock",
  },
];

export const brandProfiles: BrandProfile[] = [
  {
    slug: "millet-master",
    name: "Millet Master",
    status: "Active",
    tagline: "Organic Millets & Sustainable Grains",
    joinedLabel: "Joined Oct 2023",
    merchantLabel: "Verified Merchant",
    totalRevenue: "$142,850.00",
    revenueDelta: "+12.4% from last month",
    orders: "1,284",
    ordersProgress: 75,
    averageRating: "4.9",
    reviewCount: "Based on 420 reviews",
    primaryContact: "Arjun Reddy",
    contactRole: "Founder & CEO",
    email: "arjun@milletmaster.eco",
    phone: "+1 (555) 892-0402",
    headquarters: "42 Sustain Way, Silicon Valley, California, US",
    compliance: ["VAT-Certified", "ISO-9001", "Organic-Reg"],
    note: {
      eyebrow: "The Architect's Note",
      quote:
        '"Millet Master has consistently demonstrated a commitment to high-grade organic production. Their integration into the Vault system has seen a 40% increase in supply chain efficiency over the last two quarters. They remain a tier-one partner in our sustainable grains vertical."',
      author: "Sarah Vance",
      role: "Head of Partner Relations",
      initials: "SV",
    },
    catalog: [
      {
        id: "catalog-1",
        name: "Organic Finger Millet Flour",
        category: "Flours & Grains",
        price: "$12.50",
        stock: "In Stock",
        stockTone: "in-stock",
        imageSrc: "/home/featured-categories/millet-flours.png",
      },
      {
        id: "catalog-2",
        name: "Honey-Glazed Millet Cookies",
        category: "Healthy Snacks",
        price: "$8.99",
        stock: "Low Stock",
        stockTone: "low-stock",
        imageSrc: "/home/featured-categories/healthy-ingredients.png",
      },
      {
        id: "catalog-3",
        name: "Ancient Grain Multi-Millet Mix",
        category: "Whole Grains",
        price: "$15.00",
        stock: "In Stock",
        stockTone: "in-stock",
        imageSrc: "/home/featured-categories/health-mix.png",
      },
      {
        id: "catalog-4",
        name: "Sprouted Pearl Millet Porridge",
        category: "Breakfast Foods",
        price: "$6.45",
        stock: "In Stock",
        stockTone: "in-stock",
        imageSrc: "/home/deal-of-day/pearl-millet.png",
      },
    ],
  },
];

