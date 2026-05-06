export type DashboardMenuItem = {
  id: string;
  label: string;
  href: string;
  children?: Array<{
    id: string;
    label: string;
    href: string;
  }>;
  icon:
    | "dashboard"
    | "categories"
    | "products"
    | "orders"
    | "inventory"
    | "vendors"
    | "users"
    | "reports"
    | "offers"
    | "reviews"
    | "brands"
    | "settings"
    | "support";
};

export type DashboardStat = {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: "positive" | "negative";
  barWidth: string;
};

export type CountryPurchase = {
  country: string;
  percentage: number;
};

export type SoldItem = {
  id: string;
  name: string;
  imageSrc: string;
  sales: string;
  stock: string;
  stockType: "in" | "out";
  price: string;
};

export type RecentOrder = {
  id: string;
  customer: string;
  date: string;
  amount: string;
  status: string;
  statusType: "shipped" | "pending" | "delivered" | "cancelled";
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  initials: string;
};

export const dashboardMenuItems: DashboardMenuItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  {
    id: "categories",
    label: "Categories",
    href: "/dashboard/categories",
    icon: "categories",
  },
  { id: "products", label: "Products", href: "/dashboard/products", icon: "products" },
  {
    id: "orders",
    label: "Orders",
    href: "/dashboard/orders",
    icon: "orders",
    children: [
      { id: "orders-dashboard", label: "Dashboard", href: "/dashboard/orders" },
      {
        id: "orders-management",
        label: "Order Management",
        href: "/dashboard/orders/management",
      },
    ],
  },
  {
    id: "inventory",
    label: "Inventory",
    href: "/dashboard/inventory",
    icon: "inventory",
    children: [
      { id: "inventory-dashboard", label: "Dashboard", href: "/dashboard/inventory" },
      {
        id: "inventory-stock",
        label: "Stock Inventory",
        href: "/dashboard/inventory/stock",
      },
    ],
  },
  { id: "vendors", label: "Vendors", href: "/dashboard/vendors", icon: "vendors" },
  { id: "users", label: "Users", href: "/dashboard/users", icon: "users" },
  { id: "reports", label: "Reports", href: "/dashboard/reports", icon: "reports" },
  {
    id: "offers",
    label: "Offers & Discounts",
    href: "/dashboard/offers",
    icon: "offers",
  },
  { id: "reviews", label: "Reviews", href: "/dashboard/reviews", icon: "reviews" },
  { id: "brands", label: "Brands", href: "/dashboard/brands", icon: "brands" },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: "settings" },
  { id: "support", label: "Support", href: "/dashboard/support", icon: "support" },
];

export const dashboardStats: DashboardStat[] = [
  {
    id: "signups",
    label: "Daily Signups",
    value: "2,145",
    change: "+12%",
    changeType: "positive",
    barWidth: "62%",
  },
  {
    id: "visitors",
    label: "Daily Visitors",
    value: "15,678",
    change: "+8%",
    changeType: "positive",
    barWidth: "46%",
  },
  {
    id: "orders",
    label: "Daily Orders",
    value: "1,240",
    change: "-3%",
    changeType: "negative",
    barWidth: "32%",
  },
  {
    id: "revenue",
    label: "Daily Revenue",
    value: "₹1,56,432",
    change: "+15%",
    changeType: "positive",
    barWidth: "74%",
  },
];

export const monthlyRevenuePoints = [
  18, 23, 22, 27, 44, 71, 68, 34, 26, 78, 132, 84,
];

export const weeklyUserActivity = [
  { day: "Mon", value: 36, accent: false },
  { day: "Tue", value: 54, accent: false },
  { day: "Wed", value: 27, accent: false },
  { day: "Thu", value: 73, accent: true },
  { day: "Fri", value: 49, accent: false },
  { day: "Sat", value: 88, accent: true },
  { day: "Sun", value: 42, accent: false },
];

export const currentUsersBars = [12, 24, 16, 38, 31, 57, 52, 75, 70, 73];

export const countryPurchases: CountryPurchase[] = [
  { country: "United States", percentage: 85 },
  { country: "United Kingdom", percentage: 62 },
  { country: "Germany", percentage: 48 },
  { country: "India", percentage: 32 },
];

export const topSoldItems: SoldItem[] = [
  {
    id: "diet-choize",
    name: "Diet Choice Chia Seeds",
    imageSrc: "/home/deal-of-day/diet-choize-chia-seed-finger-millet-flour.png",
    sales: "1,240",
    stock: "In Stock",
    stockType: "in",
    price: "₹399.00",
  },
  {
    id: "nutri-salt",
    name: "Nutri-Salt Moringa Infusion",
    imageSrc: "/home/deal-of-day/nutri-salt-moringa-infusion.png",
    sales: "982",
    stock: "In Stock",
    stockType: "in",
    price: "₹150.00",
  },
  {
    id: "froot-plus",
    name: "Froot Plus Healthy Fruit Drink Mix",
    imageSrc: "/home/deal-of-day/froot-plus.png",
    sales: "845",
    stock: "Out of Stock",
    stockType: "out",
    price: "₹348.00",
  },
  {
    id: "diet-choize-quinoa",
    name: "Diet Choice Quinoa-Sorghum",
    imageSrc: "/home/deal-of-day/diet-choize-quinoa-sorghum-flour.png",
    sales: "720",
    stock: "In Stock",
    stockType: "in",
    price: "₹89.00",
  },
];

export const recentOrders: RecentOrder[] = [
  {
    id: "#EK-8542",
    customer: "Emma Watson",
    date: "24 Oct 2023",
    amount: "₹1,240.00",
    status: "Shipped",
    statusType: "shipped",
  },
  {
    id: "#EK-8543",
    customer: "Tom Hardy",
    date: "23 Oct 2023",
    amount: "₹850.00",
    status: "Pending",
    statusType: "pending",
  },
  {
    id: "#EK-8544",
    customer: "Selena Gomez",
    date: "22 Oct 2023",
    amount: "₹425.00",
    status: "Delivered",
    statusType: "delivered",
  },
  {
    id: "#EK-8545",
    customer: "Brad Pitt",
    date: "21 Oct 2023",
    amount: "₹2,100.00",
    status: "Cancelled",
    statusType: "cancelled",
  },
  {
    id: "#EK-8546",
    customer: "Brad Pitt",
    date: "21 Oct 2023",
    amount: "₹2,100.00",
    status: "Cancelled",
    statusType: "cancelled",
  },
];

export const newCustomers: Customer[] = [
  {
    id: "emma",
    name: "Emma Watson",
    email: "emma@example.com",
    initials: "EW",
  },
  {
    id: "tom",
    name: "Tom Hardy",
    email: "tom@example.com",
    initials: "TH",
  },
  {
    id: "selena",
    name: "Selena Gomez",
    email: "selena@example.com",
    initials: "SG",
  },
  {
    id: "brad",
    name: "Brad Pitt",
    email: "brad@example.com",
    initials: "BP",
  },
];
