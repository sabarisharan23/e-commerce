export type ReportTabId = "sales" | "product" | "customer";

export type ReportTab = {
  id: ReportTabId;
  label: string;
  heading: string;
  description: string;
};

export type SalesMetric = {
  id: string;
  label: string;
  value: string;
  helper: string;
  badge?: string;
  progress?: number;
  icon: "trend" | "bag" | "chart";
};

export type SalesBarPoint = {
  month: string;
  value: number;
  accent: "emerald" | "green" | "lime" | "forest" | "muted";
};

export type ChannelRow = {
  id: string;
  name: string;
  share: string;
  revenue: string;
  delta: string;
  deltaType: "positive" | "negative";
  icon: "web" | "store" | "share" | "mail";
};

export type ProductCategorySlice = {
  id: string;
  label: string;
  value: number;
  color: string;
};

export type ProductTopItem = {
  id: string;
  name: string;
  imageSrc: string;
  category: string;
  unitsSold: string;
  revenue: string;
  growth: string;
  growthType: "positive" | "negative";
};

export type CustomerMetric = {
  id: string;
  label: string;
  value: string;
  helper: string;
  badge?: string;
  miniBars?: number[];
  progress?: number;
  insetStats?: Array<{
    label: string;
    value: string;
  }>;
  icon: "users" | "retention" | "spend";
};

export type CustomerVolumeWeek = {
  week: string;
  returning: number;
  newUsers: number;
};

export type TopCustomer = {
  id: string;
  name: string;
  initials: string;
  status: "Premium" | "Standard";
  orderCount: string;
  totalSpend: string;
  tone: "sage" | "indigo" | "slate";
};

export const reportsTabs: ReportTab[] = [
  {
    id: "sales",
    label: "Sales Performance",
    heading: "Sales Performance",
    description: "Institutional revenue tracking and channel distribution analysis.",
  },
  {
    id: "product",
    label: "Product Performance",
    heading: "Product Performance",
    description: "Detailed SKU analysis and distribution metrics for Q3 2023.",
  },
  {
    id: "customer",
    label: "Customer Insights",
    heading: "Customer Insights",
    description: "Deep dive into user behavior and retention metrics",
  },
];

export const reportsToolbar = {
  rangeLabel: "Oct 12 - Oct 19, 2023",
  filterLabel: "Filters",
  exportLabel: "Export CSV",
};

export const salesMetrics: SalesMetric[] = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "$124,592.00",
    helper: "v.s. $110,748.00 previous period",
    badge: "12.5%",
    icon: "trend",
  },
  {
    id: "orders",
    label: "Orders Count",
    value: "1,842",
    helper: "75% of quarterly target",
    progress: 75,
    icon: "bag",
  },
  {
    id: "aov",
    label: "Avg. Order Value",
    value: "$67.63",
    helper: "Across 12 product categories",
    icon: "chart",
  },
];

export const salesBars: SalesBarPoint[] = [
  { month: "Apr", value: 16, accent: "emerald" },
  { month: "May", value: 19, accent: "green" },
  { month: "Jun", value: 21, accent: "lime" },
  { month: "Jul", value: 18, accent: "forest" },
  { month: "Aug", value: 23, accent: "muted" },
  { month: "Sep", value: 23, accent: "forest" },
];

export const topChannels: ChannelRow[] = [
  {
    id: "web",
    name: "Direct Web",
    share: "34% of traffic",
    revenue: "$42,810",
    delta: "+8.2%",
    deltaType: "positive",
    icon: "web",
  },
  {
    id: "retail",
    name: "Retail Stores",
    share: "31% of traffic",
    revenue: "$38,202",
    delta: "+12.5%",
    deltaType: "positive",
    icon: "store",
  },
  {
    id: "social",
    name: "Social Media",
    share: "20% of traffic",
    revenue: "$24,912",
    delta: "-2.1%",
    deltaType: "negative",
    icon: "share",
  },
  {
    id: "email",
    name: "Email Marketing",
    share: "15% of traffic",
    revenue: "$18,670",
    delta: "+4.3%",
    deltaType: "positive",
    icon: "mail",
  },
];

export const salesMilestone = {
  title: "Growth Milestone Detected",
  description:
    'Your sales velocity in September has surpassed all historical Q3 benchmarks. We recommend scaling the "Direct Web" ad spend by 15% to capitalize on this seasonal momentum before October begins.',
  actionLabel: "Apply Strategy",
};

export const productCategoryShare: ProductCategorySlice[] = [
  { id: "millet", label: "Millet Mix", value: 45, color: "#477640" },
  { id: "dosa", label: "Dosa Mix", value: 30, color: "#18a84a" },
  { id: "drink", label: "Drink Mix", value: 15, color: "#6f82a0" },
  { id: "other", label: "Others", value: 10, color: "#e7edf6" },
];

export const topPerformingProducts: ProductTopItem[] = [
  {
    id: "fox-tail",
    name: "Spiced Foxtail Millet",
    imageSrc: "/home/featured-categories/millet-flours.png",
    category: "Millet Mix",
    unitsSold: "12,450",
    revenue: "$45,200",
    growth: "+24%",
    growthType: "positive",
  },
  {
    id: "multi-dosa",
    name: "Multi-Grain Dosa",
    imageSrc: "/home/featured-categories/dosa-mix.png",
    category: "Dosa Mix",
    unitsSold: "9,120",
    revenue: "$31,800",
    growth: "+18%",
    growthType: "positive",
  },
  {
    id: "ragi-choco",
    name: "Ragi Chocolate Mix",
    imageSrc: "/home/deal-of-day/froot-plus.png",
    category: "Drink Mix",
    unitsSold: "4,300",
    revenue: "$12,900",
    growth: "-5%",
    growthType: "negative",
  },
];

export const productInsight = {
  eyebrow: "Growth Insight",
  title: "Millet Mix demand is peaking in Northern regions.",
  description:
    "Based on current velocity, your inventory for Spiced Foxtail Millet will deplete in 12 days. We recommend increasing production by 15% to capture the seasonal uptick in health-conscious purchasing behavior.",
  primaryAction: "Adjust Production",
  secondaryAction: "Dismiss Suggestion",
};

export const productSummaryCards = [
  {
    id: "revenue-potential",
    label: "Global Revenue Potential",
    value: "$1.2M",
    helper: "On track to beat yearly forecast",
    tone: "green" as const,
  },
  {
    id: "promotions",
    label: "Active Promotions",
    value: "08",
    helper: "75%",
    progress: 75,
    tone: "default" as const,
  },
  {
    id: "sentiment",
    label: "Customer Sentiment",
    value: "4.8",
    helper: "Positive feedback increased by 12% following the Dosa Mix reformulation.",
    stars: 4.8,
    tone: "default" as const,
  },
];

export const customerMetrics: CustomerMetric[] = [
  {
    id: "active-users",
    label: "Total Active Users",
    value: "12,842",
    helper: "",
    badge: "+14.2%",
    miniBars: [18, 24, 20, 31, 28, 38],
    icon: "users",
  },
  {
    id: "retention",
    label: "Retention Rate",
    value: "68.5%",
    helper: "Retention is 6.5% higher than the industry benchmark for financial SaaS platforms.",
    progress: 68.5,
    badge: "Avg. 62%",
    icon: "retention",
  },
  {
    id: "avg-spend",
    label: "Avg Spend",
    value: "$142.10",
    helper: "$12.40",
    insetStats: [
      { label: "Monthly", value: "$2,450.00" },
      { label: "Quarterly", value: "$6,820.00" },
    ],
    icon: "spend",
  },
];

export const customerVolume: CustomerVolumeWeek[] = [
  { week: "Week 1", returning: 58, newUsers: 26 },
  { week: "Week 2", returning: 62, newUsers: 34 },
  { week: "Week 3", returning: 68, newUsers: 18 },
  { week: "Week 4", returning: 72, newUsers: 29 },
];

export const customerInsight = {
  title: "Growth Insight",
  description:
    "Users who engage with the 'Reports Engine' in their first 48 hours are 3.4x more likely to become long-term active subscribers.",
  actionLabel: "View Strategy Guide",
};

export const customerBenchmarks = {
  title: "Upcoming Benchmarks",
  quarter: "Q4",
  usersTarget: "15,000 Users",
  retentionTarget: "72%",
};

export const topCustomers: TopCustomer[] = [
  {
    id: "marcus",
    name: "Marcus Holloway",
    initials: "MH",
    status: "Premium",
    orderCount: "42 orders",
    totalSpend: "$12,450.00",
    tone: "sage",
  },
  {
    id: "elena",
    name: "Elena Rodriguez",
    initials: "ER",
    status: "Premium",
    orderCount: "38 orders",
    totalSpend: "$10,120.50",
    tone: "indigo",
  },
  {
    id: "julian",
    name: "Julian Chen",
    initials: "JC",
    status: "Standard",
    orderCount: "29 orders",
    totalSpend: "$8,940.00",
    tone: "slate",
  },
];
