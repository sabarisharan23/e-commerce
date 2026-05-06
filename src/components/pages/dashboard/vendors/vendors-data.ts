export type VendorStatus = "active" | "inactive" | "under-audit" | "fresh-onboard";

export type VendorMetric = {
  id: string;
  label: string;
  value: string;
  tone: "purple" | "green" | "amber" | "blue";
  helper?: string;
};

export type VendorTableRow = {
  id: string;
  slug: string;
  name: string;
  vendorCode: string;
  category: string;
  totalSales: string;
  salesDelta: string;
  stockCount: string;
  status: VendorStatus;
  initials: string;
};

export type VendorGridCard = {
  id: string;
  slug: string;
  name: string;
  category: string;
  rating: string;
  productsCount: string;
  joined: string;
  status: VendorStatus;
  badge?: string;
  accentFrom: string;
  accentTo: string;
  initials: string;
};

export type VendorProductRow = {
  id: string;
  name: string;
  sales: string;
  stock: string;
  stockState: "in-stock" | "out-of-stock";
  price: string;
  imageSrc: string;
};

export type VendorFeedback = {
  id: string;
  name: string;
  initials: string;
  rating: number;
  message: string;
};

export type VendorProfile = {
  slug: string;
  name: string;
  subtitle: string;
  bannerFrom: string;
  bannerTo: string;
  initials: string;
  location: string;
  primaryCategory: string;
  vendorId: string;
  vendorSince: string;
  lifetimeRevenue: string;
  revenueDelta: string;
  reviewCount: string;
  averageRating: string;
  returnRate: string;
  activeProducts: string;
  fulfillmentSpeed: string;
  supportSla: string;
  officialEmail: string;
  directLine: string;
  warehouseHub: string;
  recentProducts: VendorProductRow[];
  feedback: VendorFeedback[];
};

export const vendorsPageContent = {
  heading: "Vendor Network",
  description:
    "Manage and monitor your global vendor partnerships and their performance.",
};

export const vendorMetrics: VendorMetric[] = [
  { id: "total", label: "Total Vendors", value: "1,284", tone: "purple" },
  { id: "active", label: "Active Now", value: "942", tone: "green" },
  { id: "pending", label: "Pending Review", value: "18", tone: "amber" },
  { id: "rating", label: "Avg. Rating", value: "4.8", tone: "blue" },
];

export const vendorCategoryOptions = [
  "All Categories",
  "Fashion",
  "Home Decor",
  "Beauty",
  "Electronics",
  "Nature Foods",
];

export const vendorStatusOptions = [
  "All Status",
  "Active",
  "Inactive",
  "Under Audit",
  "Fresh Onboard",
];

export const vendorTableRows: VendorTableRow[] = [
  {
    id: "row-1",
    slug: "luxe-velvet",
    name: "Luxe Velvet Co.",
    vendorCode: "VND-48291",
    category: "Fashion",
    totalSales: "$24,850.00",
    salesDelta: "+12% growth",
    stockCount: "1,240 units",
    status: "active",
    initials: "LV",
  },
  {
    id: "row-2",
    slug: "nordic-home",
    name: "Nordic Home",
    vendorCode: "VND-48292",
    category: "Home Decor",
    totalSales: "$18,200.40",
    salesDelta: "-4% this month",
    stockCount: "452 units",
    status: "active",
    initials: "NH",
  },
  {
    id: "row-3",
    slug: "glow-skin-essentials",
    name: "Glow Skin Essentials",
    vendorCode: "VND-48293",
    category: "Beauty",
    totalSales: "$42,910.00",
    salesDelta: "+28% surge",
    stockCount: "Low: 12 units",
    status: "inactive",
    initials: "GS",
  },
  {
    id: "row-4",
    slug: "urban-tech-solutions",
    name: "Urban Tech Solutions",
    vendorCode: "VND-48294",
    category: "Electronics",
    totalSales: "$120,400.00",
    salesDelta: "+2% stable",
    stockCount: "3,120 units",
    status: "active",
    initials: "UT",
  },
];

export const vendorGridCards: VendorGridCard[] = [
  {
    id: "card-1",
    slug: "luxe-dynamics",
    name: "Luxe Dynamics",
    category: "Nature Foods",
    rating: "4.9",
    productsCount: "1,402",
    joined: "Jan 2026",
    status: "active",
    badge: "Premium",
    accentFrom: "#5d63f1",
    accentTo: "#4c2fd0",
    initials: "LD",
  },
  {
    id: "card-2",
    slug: "nova-threads",
    name: "Nova Threads",
    category: "Nature Foods",
    rating: "4.7",
    productsCount: "856",
    joined: "Mar 2025",
    status: "active",
    accentFrom: "#435066",
    accentTo: "#2e3645",
    initials: "NT",
  },
  {
    id: "card-3",
    slug: "pure-wellness",
    name: "Pure Wellness",
    category: "Nature Foods",
    rating: "4.9",
    productsCount: "342",
    joined: "May 2024",
    status: "under-audit",
    accentFrom: "#2cc49e",
    accentTo: "#2cae9f",
    initials: "PW",
  },
  {
    id: "card-4",
    slug: "swift-global",
    name: "Swift Global",
    category: "Nature Foods",
    rating: "4.6",
    productsCount: "2,190",
    joined: "Nov 2024",
    status: "active",
    accentFrom: "#ff9a4d",
    accentTo: "#ff4d73",
    initials: "SG",
  },
  {
    id: "card-5",
    slug: "aura-decor",
    name: "Aura Decor",
    category: "Nature Foods",
    rating: "5.0",
    productsCount: "124",
    joined: "Jun 2024",
    status: "fresh-onboard",
    badge: "New",
    accentFrom: "#8e5af7",
    accentTo: "#d236d4",
    initials: "AD",
  },
  {
    id: "card-6",
    slug: "peak-gear",
    name: "Peak Gear",
    category: "Nature Foods",
    rating: "4.8",
    productsCount: "567",
    joined: "Oct 2022",
    status: "active",
    accentFrom: "#69a8f8",
    accentTo: "#5b63e9",
    initials: "PG",
  },
];

const sharedVendorProducts: VendorProductRow[] = [
  {
    id: "product-1",
    name: "Diet Choice Chia Seeds",
    sales: "1,240",
    stock: "In Stock",
    stockState: "in-stock",
    price: "₹399.00",
    imageSrc: "/home/deal-of-day/diet-choize-chia-seed-finger-millet-flour.png",
  },
  {
    id: "product-2",
    name: "Nutri-Salt Moringa In...",
    sales: "982",
    stock: "In Stock",
    stockState: "in-stock",
    price: "₹150.00",
    imageSrc: "/home/deal-of-day/nutri-salt-moringa-infusion.png",
  },
  {
    id: "product-3",
    name: "Froot Plus Healthy Fr...",
    sales: "845",
    stock: "Out of Stock",
    stockState: "out-of-stock",
    price: "₹348.00",
    imageSrc: "/home/deal-of-day/froot-plus.png",
  },
  {
    id: "product-4",
    name: "Diet Choice Quinoa-So...",
    sales: "720",
    stock: "In Stock",
    stockState: "in-stock",
    price: "₹89.00",
    imageSrc: "/home/deal-of-day/diet-choize-quinoa-sorghum-flour.png",
  },
];

export const vendorProfiles: VendorProfile[] = [
  {
    slug: "ethereal-collective",
    name: "Ethereal Collective",
    subtitle: "Premium Apparel & Lifestyle Vendor since 2021",
    bannerFrom: "#1f3b00",
    bannerTo: "#0f2d13",
    initials: "EC",
    location: "Portland, Oregon, USA",
    primaryCategory: "Sustainable Fashion",
    vendorId: "#VND-8829-ETH",
    vendorSince: "2021",
    lifetimeRevenue: "$142,850.00",
    revenueDelta: "+12.4%",
    reviewCount: "482 reviews",
    averageRating: "4.9/5.0",
    returnRate: "1.2%",
    activeProducts: "124 Items",
    fulfillmentSpeed: "1.2 Days",
    supportSla: "98% Success",
    officialEmail: "partnership@ethereal-co.com",
    directLine: "+1 (503) 555-0192",
    warehouseHub: "921 SW Morrison St, Portland, OR 97205",
    recentProducts: sharedVendorProducts,
    feedback: [
      {
        id: "feedback-1",
        name: "Marcus S.",
        initials: "MS",
        rating: 5,
        message:
          "The quality of the overcoat is exceptional. Shipping was faster than expected. Highly recommend this vendor for premium basics.",
      },
      {
        id: "feedback-2",
        name: "Lydia R.",
        initials: "LR",
        rating: 4,
        message:
          "Great product, though the sizing runs a bit small. Customer service was helpful in facilitating an exchange.",
      },
    ],
  },
  {
    slug: "luxe-velvet",
    name: "Luxe Velvet Co.",
    subtitle: "Fashion-forward textiles and apparel vendor since 2020",
    bannerFrom: "#3826a0",
    bannerTo: "#5436d8",
    initials: "LV",
    location: "Milan, Italy",
    primaryCategory: "Fashion",
    vendorId: "#VND-48291-LV",
    vendorSince: "2020",
    lifetimeRevenue: "$124,400.00",
    revenueDelta: "+9.2%",
    reviewCount: "318 reviews",
    averageRating: "4.8/5.0",
    returnRate: "1.6%",
    activeProducts: "98 Items",
    fulfillmentSpeed: "1.4 Days",
    supportSla: "96% Success",
    officialEmail: "ops@luxevelvet.co",
    directLine: "+39 02 5550 1182",
    warehouseHub: "Via Torino 88, Milan, Italy",
    recentProducts: sharedVendorProducts,
    feedback: [
      {
        id: "lv-feedback-1",
        name: "Ariana T.",
        initials: "AT",
        rating: 5,
        message: "Elegant packaging and reliable dispatch windows. A strong luxury partner.",
      },
      {
        id: "lv-feedback-2",
        name: "Noah P.",
        initials: "NP",
        rating: 4,
        message: "Materials feel premium and stock consistency has improved this quarter.",
      },
    ],
  },
];

export const vendorQuickActions = [
  "Verify pending accounts",
  "Audit top 10 sellers",
  "Generate tax reports",
];

export const vendorGrowthReport = {
  title: "Merchant Growth Report",
  description:
    "Our internal metrics show a 14% increase in vendor onboarding this quarter. Review the updated compliance guidelines for new merchants.",
};
