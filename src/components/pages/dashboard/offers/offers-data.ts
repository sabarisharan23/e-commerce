export type OfferTabId = "promo" | "bundle" | "seasonal";

export type OfferTab = {
  id: OfferTabId;
  label: string;
  heading: string;
  description: string;
};

export type PromoConfig = {
  couponCodePlaceholder: string;
  targetCategory: string;
  categoryNote: string;
  discountMode: "percentage" | "flat";
  value: string;
  maxDiscount: string;
  startDate: string;
  endDate: string;
  primaryButton: string;
  secondaryButton: string;
};

export type PromoAuditRow = {
  id: string;
  code: string;
  note: string;
  impact: string;
  cap: string;
  status: "Active" | "Expired";
  redemptions: string;
  redemptionProgress: number;
};

export type BundleComponent = {
  id: string;
  name: string;
  price: string;
  initial: string;
};

export type ExistingBundle = {
  id: string;
  name: string;
  code: string;
  createdLabel: string;
  components: string[];
  discount: string;
  totalSales: string;
  unitsSold: string;
  status: "Active" | "Scheduled";
};

export type SeasonalCampaign = {
  id: string;
  name: string;
  phase: "Happening Now" | "Upcoming" | "Planning";
  timeline: string;
  conversionGoal: string;
  projectedImpact?: string;
  actualRevenue?: string;
  launch?: string;
  statA?: { label: string; value: string };
  statB?: { label: string; value: string };
  icon: "sun" | "snow" | "tree";
};

export const offersTabs: OfferTab[] = [
  {
    id: "promo",
    label: "Promo Code",
    heading: "Promo Code Manager",
    description: "Architect specialized discount structures for Millet & Organic products.",
  },
  {
    id: "bundle",
    label: "Bundle Offers",
    heading: "Bundle Offers",
    description: "Design and manage multi-product combinations for increased AOV.",
  },
  {
    id: "seasonal",
    label: "Seasonal Campaigns",
    heading: "Seasonal Campaigns",
    description: "Manage, plan, and analyze your e-commerce promotional events.",
  },
];

export const offersToolbar = {
  rangeLabel: "Oct 12 - Oct 19, 2023",
  filterLabel: "Filters",
  exportLabel: "Export CSV",
};

export const promoConfiguration: PromoConfig = {
  couponCodePlaceholder: "e.g., MILLET20",
  targetCategory: "Organic Millet Mix",
  categoryNote: "Promotion will only apply to items in this specific category.",
  discountMode: "percentage",
  value: "20",
  maxDiscount: "500",
  startDate: "mm/dd/yyyy",
  endDate: "mm/dd/yyyy",
  primaryButton: "Deploy Campaign",
  secondaryButton: "Discard Draft",
};

export const promoPreview = {
  badge: "Preview Mode",
  title: "Heritage Organic Millet Mix",
  subtitle: "Superfood Grains & Ancient Seeds",
  standardPrice: "₹450.00",
  discountedPrice: "₹360.00",
  appliedLabel: "MILLET20 Applied",
  savedLabel: "- ₹90.0",
  imageSrc: "/home/featured-categories/millet-flours.png",
};

export const promoKpis = [
  {
    id: "lift",
    label: "Projected Lift",
    value: "₹12,450",
    helper: "Estimated additional revenue for the 14-day campaign duration",
    accent: "+12% Conversion",
    progress: undefined,
  },
  {
    id: "reach",
    label: "Reach",
    value: "45.2k",
    helper: "",
    accent: "",
    progress: 62,
  },
  {
    id: "margin",
    label: "Margin Hit",
    value: "-4.2%",
    helper: "",
    accent: "",
    progress: 28,
  },
];

export const promoArchitectTip = {
  title: "Architect Tip",
  description:
    "Codes with 20-30% discounts typically see a 3x higher redemption rate than flat amount offers in the Millet category.",
};

export const promoAuditRows: PromoAuditRow[] = [
  {
    id: "organi-c30",
    code: "ORGANI C30",
    note: "Ends in 2 days",
    impact: "30% OFF",
    cap: "Up to $15.00",
    status: "Active",
    redemptions: "1,248",
    redemptionProgress: 72,
  },
  {
    id: "welcome10",
    code: "WELCOME10",
    note: "Global",
    impact: "10% OFF",
    cap: "Global",
    status: "Expired",
    redemptions: "4,892",
    redemptionProgress: 92,
  },
];

export const bundleDraft = {
  primaryProduct: {
    name: "Millet Dosa Mix (500g)",
    code: "PROD-8829",
    basePrice: "$12.50",
  },
  components: [
    { id: "coconut", name: "Coconut Chutney Powder", price: "$4.50", initial: "C" },
    { id: "cashews", name: "Ghee Roasted Cashews", price: "$6.00", initial: "G" },
  ] satisfies BundleComponent[],
  discountPercent: "15",
  bundleStatus: "Active (Scheduled)",
  liveConfiguration: {
    combinedValue: "$23.00",
    bundleDiscount: "-$3.45",
    customerPrice: "$19.55",
    savings: "SAVES $3.45",
  },
  performanceEstimate: {
    conversionBoost: "+12.4%",
    projectedWeeklyRevenue: "$1,420.00",
    simulationButton: "Run Historical Simulation",
  },
};

export const existingBundles: ExistingBundle[] = [
  {
    id: "bundle-1",
    name: "Dosa Starter Pack",
    code: "BNDL-001",
    createdLabel: "Created 12 Oct",
    components: ["M", "D", "C"],
    discount: "20% OFF",
    totalSales: "$12,450.00",
    unitsSold: "842 units sold",
    status: "Active",
  },
  {
    id: "bundle-2",
    name: "Evening Snack Duo",
    code: "BNDL-042",
    createdLabel: "Created 05 Nov",
    components: ["S", "N"],
    discount: "10% OFF",
    totalSales: "$3,120.00",
    unitsSold: "210 units sold",
    status: "Scheduled",
  },
];

export const seasonalHighlights = {
  active: {
    badge: "Happening Now",
    name: "Harvest Summer Sale",
    timeline: "Duration: Aug 01 - Aug 15",
    projectedImpact: "$120k",
    actualRevenue: "$108k",
  },
  upcoming: {
    badge: "Upcoming",
    name: "Green Friday Specials",
    timeline: "Launch: Nov 24, 2024",
    statA: { label: "Early Signups", value: "4.2k" },
    statB: { label: "Inventory Check", value: "98%" },
  },
  draft: {
    title: "",
    startDate: "mm/dd/yyyy",
    endDate: "mm/dd/yyyy",
    incentive: "Store-wide 20% Off",
    audiences: ["Loyalists", "New Leads", "Dormant"],
  },
};

export const seasonalRoadmap: SeasonalCampaign[] = [
  {
    id: "summer",
    name: "Harvest Summer Sale",
    phase: "Happening Now",
    timeline: "Aug 01 - Aug 15",
    conversionGoal: "12.5%",
    icon: "sun",
  },
  {
    id: "year-end",
    name: "Year-End Clearance",
    phase: "Planning",
    timeline: "Dec 26 - Dec 31",
    conversionGoal: "18.0%",
    icon: "snow",
  },
  {
    id: "green-friday",
    name: "Green Friday Specials",
    phase: "Upcoming",
    timeline: "Nov 24 - Nov 27",
    conversionGoal: "22.2%",
    icon: "tree",
  },
];

export const seasonalTip = {
  quote:
    '"Last summer, campaigns with BOGO incentives saw a 34% higher retention rate than flat percentage discounts."',
  action: "View Recommendations",
};

export const seasonalResource = {
  title: "Seasonal Creative Kit",
  description: "Download updated banners and email templates for the Harvest Sale.",
  cta: "Download Assets (.ZIP)",
};
