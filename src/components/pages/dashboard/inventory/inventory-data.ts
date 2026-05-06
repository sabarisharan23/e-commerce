export type InventoryMetricCard = {
  id: string;
  label: string;
  value: string;
  helper: string;
  badge: string;
  tone: "green" | "red" | "amber" | "neutral";
};

export type TrendBar = {
  day: string;
  incoming: number;
  outgoing: number;
};

export type LowStockAlert = {
  id: string;
  name: string;
  sku: string;
  units: string;
  severity: "critical" | "warning" | "low";
  imageSrc: string;
};

export type WarehouseActivity = {
  id: string;
  name: string;
  sku: string;
  category: string;
  status: "in-stock" | "low-stock";
  inventory: string;
  locations: string;
  movement: string;
  imageSrc: string;
};

export type WarehouseSpread = {
  total: string;
  breakdown: Array<{
    name: string;
    share: string;
    color: string;
  }>;
};

export type StockInventoryRow = {
  id: string;
  name: string;
  sku: string;
  availableQty: string;
  threshold: string;
  status: "low-stock" | "in-stock" | "critical";
  imageSrc: string;
};

export type StockInventorySummary = {
  id: string;
  label: string;
  value: string;
  tone: "green" | "amber" | "neutral";
};

export type OrdersMetricCard = {
  id: string;
  label: string;
  value: string;
  helper: string;
  tone: "green" | "amber" | "red" | "neutral";
};

export type OrderRow = {
  id: string;
  customer: string;
  initials: string;
  product: string;
  amount: string;
  status: "delivered" | "processing" | "cancelled" | "shipped" | "pending";
};

export type RegionalDemand = {
  region: string;
  percentage: number;
};

export type OrderManagementRow = {
  id: string;
  customer: string;
  initials: string;
  orderDate: string;
  amount: string;
  status: "delivered" | "shipped" | "pending" | "cancelled";
};

export type OrderDetailItem = {
  id: string;
  name: string;
  type: string;
  qty: string;
  unitPrice: string;
  price: string;
  imageSrc: string;
};

export type TimelineStep = {
  id: string;
  timeLabel: string;
  title: string;
  description: string;
  state: "done" | "current" | "pending";
};

export const inventoryDashboardContent = {
  heading: "Inventory Dashboard",
  description: "Real-time metrics and operational alerts for Indigo Vault.",
  dateRange: "Oct 12 - Oct 19, 2023",
};

export const inventoryMetricCards: InventoryMetricCard[] = [
  {
    id: "active-skus",
    label: "Total Active SKUs",
    value: "1,284",
    helper: "Updated 12 mins ago",
    badge: "+2.4%",
    tone: "green",
  },
  {
    id: "critical-stock",
    label: "Critical Stock",
    value: "12",
    helper: "Below threshold levels",
    badge: "Action Required",
    tone: "red",
  },
  {
    id: "in-transit",
    label: "In-Transit",
    value: "45",
    helper: "Orders currently moving",
    badge: "4 Arrivals Today",
    tone: "amber",
  },
  {
    id: "capacity",
    label: "Warehouse Capacity",
    value: "82%",
    helper: "High Load",
    badge: "Global Avg",
    tone: "neutral",
  },
];

export const inventoryTrendBars: TrendBar[] = [
  { day: "Mon", incoming: 58, outgoing: 82 },
  { day: "Tue", incoming: 39, outgoing: 68 },
  { day: "Wed", incoming: 86, outgoing: 62 },
  { day: "Thu", incoming: 53, outgoing: 77 },
  { day: "Fri", incoming: 72, outgoing: 91 },
  { day: "Sat", incoming: 29, outgoing: 44 },
  { day: "Sun", incoming: 18, outgoing: 34 },
];

export const lowStockAlerts: LowStockAlert[] = [
  {
    id: "alert-1",
    name: "Millet Flour",
    sku: "MF-0023",
    units: "5 units",
    severity: "critical",
    imageSrc: "/home/deal-of-day/diet-choize-chia-seed-finger-millet-flour.png",
  },
  {
    id: "alert-2",
    name: "Dosa Mix",
    sku: "DM-1142",
    units: "8 units",
    severity: "warning",
    imageSrc: "/home/featured-categories/dosa-mix.png",
  },
  {
    id: "alert-3",
    name: "Brown Rice",
    sku: "BR-9901",
    units: "15 units",
    severity: "low",
    imageSrc: "/home/top-picks/amudhu-bajra-bamboo-rice-koozh-mix.png",
  },
];

export const warehouseActivities: WarehouseActivity[] = [
  {
    id: "activity-1",
    name: "Whole Grain Oats",
    sku: "WGO-4522",
    category: "Grains",
    status: "in-stock",
    inventory: "450 Units",
    locations: "4 Locations",
    movement: "2 hours ago",
    imageSrc: "/home/deal-of-day/pearl-millet.png",
  },
  {
    id: "activity-2",
    name: "Quinoa Seeds",
    sku: "QS-1102",
    category: "Superfoods",
    status: "low-stock",
    inventory: "22 Units",
    locations: "1 Location",
    movement: "Yesterday, 14:30",
    imageSrc: "/home/top-picks/mappillai-samba-illuppai-poo-samba-laddu-mix.png",
  },
];

export const warehouseSpread: WarehouseSpread = {
  total: "64%",
  breakdown: [
    { name: "North Grain Silo", share: "42%", color: "#5f6d4a" },
    { name: "East Processing Plant", share: "28%", color: "#7a8662" },
    { name: "South Holding Facility", share: "30%", color: "#d9e2c7" },
  ],
};

export const stockInventoryContent = {
  heading: "Stock Inventory",
  description: "Manage and track your global warehouse stock levels.",
  tableCountText: "Showing 4 of 1,204 items",
};

export const stockInventoryRows: StockInventoryRow[] = [
  {
    id: "millet-flour",
    name: "Millet Flour",
    sku: "MIL-001",
    availableQty: "12 units",
    threshold: "20 units",
    status: "low-stock",
    imageSrc: "/home/featured-categories/millet-flours.png",
  },
  {
    id: "drink-mix",
    name: "Drink Mix",
    sku: "DRN-045",
    availableQty: "145 units",
    threshold: "50 units",
    status: "in-stock",
    imageSrc: "/home/featured-categories/health-mix.png",
  },
  {
    id: "dosa-mix",
    name: "Dosa Mix",
    sku: "DOS-088",
    availableQty: "88 units",
    threshold: "30 units",
    status: "in-stock",
    imageSrc: "/home/featured-categories/dosa-mix.png",
  },
  {
    id: "almond-meal",
    name: "Almond Meal",
    sku: "ALM-005",
    availableQty: "5 units",
    threshold: "15 units",
    status: "critical",
    imageSrc: "/home/featured-categories/protein-mix.png",
  },
];

export const stockInventorySummary: StockInventorySummary[] = [
  { id: "sku", label: "Total SKU", value: "1,204", tone: "green" },
  { id: "low", label: "Low Stock Items", value: "18", tone: "amber" },
  { id: "warehouses", label: "Active Warehouses", value: "4", tone: "neutral" },
  { id: "updated", label: "Updated Recently", value: "142", tone: "neutral" },
];

export const orderDashboardContent = {
  heading: "Order Dashboard",
  description: "Real-time overview of your store's transaction flow.",
  dateRange: "Oct 12 - Oct 19, 2023",
};

export const orderDashboardMetrics: OrdersMetricCard[] = [
  {
    id: "total-orders",
    label: "Total Orders",
    value: "1,284",
    helper: "+12.5% vs last week",
    tone: "green",
  },
  {
    id: "pending",
    label: "Pending",
    value: "42",
    helper: "Action required",
    tone: "amber",
  },
  {
    id: "completed",
    label: "Completed",
    value: "1,198",
    helper: "94% Success rate",
    tone: "green",
  },
  {
    id: "returns",
    label: "Returns",
    value: "14",
    helper: "-2% improvement",
    tone: "red",
  },
];

export const orderStatusBreakdown = [
  { label: "Delivered", percentage: 82, color: "#477640" },
  { label: "In Transit", percentage: 12, color: "#f5a000" },
  { label: "Processing", percentage: 6, color: "#cbd5e1" },
];

export const recentOrderRows: OrderRow[] = [
  {
    id: "#ORD-9021",
    customer: "Jane Doe",
    initials: "JD",
    product: "Diet Choice Chia Seeds",
    amount: "₹399.00",
    status: "delivered",
  },
  {
    id: "#ORD-9022",
    customer: "Marcus Smith",
    initials: "MS",
    product: "Diet Choice Chia Seeds",
    amount: "₹450.00",
    status: "processing",
  },
  {
    id: "#ORD-9023",
    customer: "David Lee",
    initials: "DL",
    product: "Diet Choice Chia Seeds",
    amount: "₹299.00",
    status: "delivered",
  },
  {
    id: "#ORD-9024",
    customer: "Alice Wong",
    initials: "AW",
    product: "Diet Choice Chia Seeds",
    amount: "₹899.00",
    status: "cancelled",
  },
  {
    id: "#ORD-9025",
    customer: "Alice Wong",
    initials: "AW",
    product: "Diet Choice Chia Seeds",
    amount: "₹899.00",
    status: "cancelled",
  },
];

export const regionalDemand: RegionalDemand[] = [
  { region: "North America", percentage: 62 },
  { region: "Europe", percentage: 24 },
  { region: "Asia Pacific", percentage: 14 },
];

export const orderManagementContent = {
  heading: "Order Management",
  description: "Manage and track all customer orders from one place.",
  dateRange: "Oct 1, 2023 - Oct 31, 2023",
};

export const orderManagementMetrics: OrdersMetricCard[] = [
  {
    id: "revenue",
    label: "Total Revenue",
    value: "₹128,430",
    helper: "+12.5%",
    tone: "green",
  },
  {
    id: "active",
    label: "Active Orders",
    value: "432",
    helper: "Normal",
    tone: "green",
  },
  {
    id: "fulfillment",
    label: "Avg. Fulfillment",
    value: "1.2 Days",
    helper: "-4h",
    tone: "green",
  },
  {
    id: "refunds",
    label: "Pending Refunds",
    value: "08",
    helper: "Attention",
    tone: "amber",
  },
];

export const orderManagementTabs = [
  "All Orders",
  "Pending",
  "Shipped",
  "Delivered",
  "Cancelled",
];

export const orderManagementRows: OrderManagementRow[] = [
  {
    id: "#ORD-7721",
    customer: "Alice Johnson",
    initials: "AJ",
    orderDate: "Oct 12, 2023",
    amount: "₹580.00",
    status: "delivered",
  },
  {
    id: "#ORD-7722",
    customer: "Bob Smith",
    initials: "BS",
    orderDate: "Oct 13, 2023",
    amount: "₹750.00",
    status: "shipped",
  },
  {
    id: "#ORD-7723",
    customer: "Charlie Brown",
    initials: "CB",
    orderDate: "Oct 14, 2023",
    amount: "₹1200.00",
    status: "pending",
  },
  {
    id: "#ORD-7724",
    customer: "Diana Prince",
    initials: "DP",
    orderDate: "Oct 14, 2023",
    amount: "₹580.00",
    status: "cancelled",
  },
  {
    id: "#ORD-7725",
    customer: "Edward Norton",
    initials: "EN",
    orderDate: "Oct 15, 2023",
    amount: "₹650.00",
    status: "delivered",
  },
];

export const orderDetailContent = {
  orderId: "ORD-88291",
  status: "Processing",
  description: "Manage and track all customer orders from one place.",
  customerName: "Eleanor Vance",
  customerEmail: "evance@agrariancollective.com",
  customerPhone: "+1 (555) 924-1102",
  shippingAddress: "882 Willow Creek Way, Apt 4C Bozeman, MT 59715",
  memberLabel: "Premium Member",
  harvestValue: "₹790.80",
  harvestChange: "+12% from last season",
  fulfillmentPercent: 85,
  subtotal: "$412.80",
  note:
    '"Customer requested sustainable jute packaging instead of standard recycled cardboard. Verified by Fulfillment Team."',
};

export const orderDetailItems: OrderDetailItem[] = [
  {
    id: "item-1",
    name: "Diet Choice Chia Seeds",
    type: "Millet",
    qty: "10Kg",
    unitPrice: "₹399.00",
    price: "₹3990.00",
    imageSrc: "/home/deal-of-day/diet-choize-chia-seed-finger-millet-flour.png",
  },
  {
    id: "item-2",
    name: "Nutri-Salt Moringa In...",
    type: "Salt",
    qty: "15Kg",
    unitPrice: "₹150.00",
    price: "₹2250.00",
    imageSrc: "/home/deal-of-day/nutri-salt-moringa-infusion.png",
  },
  {
    id: "item-3",
    name: "Froot Plus Healthy Fr...",
    type: "Drink",
    qty: "5Kg",
    unitPrice: "₹348.00",
    price: "₹1740.00",
    imageSrc: "/home/deal-of-day/froot-plus.png",
  },
  {
    id: "item-4",
    name: "Diet Choice Quinoa-So...",
    type: "Millet",
    qty: "10Kg",
    unitPrice: "₹89.00",
    price: "₹890.00",
    imageSrc: "/home/deal-of-day/diet-choize-quinoa-sorghum-flour.png",
  },
];

export const orderTimeline: TimelineStep[] = [
  {
    id: "received",
    timeLabel: "Oct 24, 09:12 AM",
    title: "Order Received",
    description: "System validated transaction through Agrarian Pay.",
    state: "done",
  },
  {
    id: "curation",
    timeLabel: "Oct 24, 02:45 PM",
    title: "In Curation",
    description: "Inventory picked and moisture-sealed in warehouse B.",
    state: "done",
  },
  {
    id: "dispatched",
    timeLabel: "Oct 25, 08:30 AM",
    title: "Dispatched",
    description: "Handed over to Green-Track Logistics. Tracking: GT-99211",
    state: "done",
  },
  {
    id: "delivery",
    timeLabel: "In Transit",
    title: "Out for Delivery",
    description: "Arrived at Bozeman Regional Sorting Hub.",
    state: "current",
  },
  {
    id: "fulfilled",
    timeLabel: "Pending",
    title: "Fulfilled",
    description: "",
    state: "pending",
  },
];
