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
