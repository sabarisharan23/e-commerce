export type AccountSection =
  | "profile"
  | "orders"
  | "addresses"
  | "payments"
  | "settings";

export type AccountMenuItem = {
  id: AccountSection;
  label: string;
  icon: "profile" | "orders" | "addresses" | "payments" | "settings";
};

export type AccountStat = {
  id: string;
  label: string;
  value: string;
  accent: string;
  note: string;
};

export type AccountActivity = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  icon: "delivery" | "payment" | "points";
};

export type OrderStatus = "delivered" | "in-progress" | "completed";

export type OrderHistoryRecord = {
  id: string;
  orderId: string;
  date: string;
  itemName: string;
  itemMeta: string;
  total: string;
  status: OrderStatus;
};

export type SavedAddressRecord = {
  id: string;
  label: string;
  type: "home" | "office";
  lines: string[];
  phone: string;
  isDefault?: boolean;
};

export type SavedCardRecord = {
  id: string;
  brand: "visa" | "mastercard";
  name: string;
  maskedNumber: string;
  expiry: string;
  holder: string;
  isDefault?: boolean;
};

export type AlternatePaymentMethod = {
  id: string;
  title: string;
  description: string;
  value: string;
  icon: "upi" | "bank";
};

export const accountMenuItems: AccountMenuItem[] = [
  { id: "profile", label: "Profile Details", icon: "profile" },
  { id: "orders", label: "Order History", icon: "orders" },
  { id: "addresses", label: "Saved Addresses", icon: "addresses" },
  { id: "payments", label: "Payment Methods", icon: "payments" },
  { id: "settings", label: "Account Settings", icon: "settings" },
];

export const accountStats: AccountStat[] = [
  {
    id: "orders",
    label: "Total Orders",
    value: "24",
    accent: "+2 this month",
    note: "text-[#2bb354]",
  },
  {
    id: "points",
    label: "Loyalty Points",
    value: "1,250",
    accent: "Gold Tier",
    note: "text-[#4f7d49]",
  },
  {
    id: "deliveries",
    label: "Pending Deliveries",
    value: "01",
    accent: "Arriving Today",
    note: "text-[#9aa7bb]",
  },
];

export const accountActivity: AccountActivity[] = [
  {
    id: "delivery",
    title: "Order #THN-8821 out for delivery",
    description:
      'Your order containing "Organic Apples" and 3 other items is on its way to your address.',
    timestamp: "2 hours ago",
    icon: "delivery",
  },
  {
    id: "payment",
    title: "Payment successful",
    description:
      "Payment of $42.50 was successfully processed for your latest order.",
    timestamp: "Yesterday, 4:30 PM",
    icon: "payment",
  },
  {
    id: "points",
    title: "Earned 50 points",
    description:
      'You earned 50 loyalty points for reviewing "Premium Roasted Coffee Beans".',
    timestamp: "Oct 24, 2023",
    icon: "points",
  },
];

export const accountOrders: OrderHistoryRecord[] = [
  {
    id: "1",
    orderId: "#TS-8942",
    date: "Oct 24, 2023",
    itemName: "Millet Flour",
    itemMeta: "4 items total",
    total: "₹2000.00",
    status: "delivered",
  },
  {
    id: "2",
    orderId: "#TS-8955",
    date: "Oct 28, 2023",
    itemName: "Diet Choize",
    itemMeta: "2 items total",
    total: "₹800.00",
    status: "in-progress",
  },
  {
    id: "3",
    orderId: "#TS-8910",
    date: "Oct 15, 2023",
    itemName: "Froot Plus",
    itemMeta: "2 items total",
    total: "₹1200.00",
    status: "completed",
  },
  {
    id: "4",
    orderId: "#TS-8899",
    date: "Oct 02, 2023",
    itemName: "Karupu Kavuni Mix",
    itemMeta: "500g crate",
    total: "₹2000.00",
    status: "delivered",
  },
  {
    id: "5",
    orderId: "#TS-8876",
    date: "Sep 29, 2023",
    itemName: "Nutri Salt",
    itemMeta: "1 bottle",
    total: "₹450.00",
    status: "completed",
  },
  {
    id: "6",
    orderId: "#TS-8868",
    date: "Sep 27, 2023",
    itemName: "Protein Mix",
    itemMeta: "3 jars",
    total: "₹1450.00",
    status: "in-progress",
  },
  {
    id: "7",
    orderId: "#TS-8844",
    date: "Sep 24, 2023",
    itemName: "Bamboo Rice Puttu",
    itemMeta: "2 packs",
    total: "₹980.00",
    status: "delivered",
  },
  {
    id: "8",
    orderId: "#TS-8821",
    date: "Sep 21, 2023",
    itemName: "Healthy Ingredients",
    itemMeta: "6 items total",
    total: "₹2300.00",
    status: "completed",
  },
  {
    id: "9",
    orderId: "#TS-8808",
    date: "Sep 19, 2023",
    itemName: "Millet Vita",
    itemMeta: "2 packs",
    total: "₹700.00",
    status: "delivered",
  },
  {
    id: "10",
    orderId: "#TS-8791",
    date: "Sep 14, 2023",
    itemName: "Health Mix",
    itemMeta: "4 items total",
    total: "₹1250.00",
    status: "in-progress",
  },
  {
    id: "11",
    orderId: "#TS-8754",
    date: "Sep 09, 2023",
    itemName: "Diabetic Mix",
    itemMeta: "2 packs",
    total: "₹820.00",
    status: "completed",
  },
  {
    id: "12",
    orderId: "#TS-8722",
    date: "Sep 04, 2023",
    itemName: "Foxtail Podi",
    itemMeta: "3 items total",
    total: "₹1320.00",
    status: "delivered",
  },
];

export const savedAddresses: SavedAddressRecord[] = [
  {
    id: "home",
    label: "Home",
    type: "home",
    lines: ["123 Organic Lane, Green Valley", "Theni, Tamil Nadu - 625531"],
    phone: "+91 98765 43210",
    isDefault: true,
  },
  {
    id: "office",
    label: "Office",
    type: "office",
    lines: ["Plot No. 45, Agro Industrial Estate", "Bypass Road, Theni - 625513"],
    phone: "+91 98765 43211",
  },
];

export const savedCards: SavedCardRecord[] = [
  {
    id: "visa-1234",
    brand: "visa",
    name: "Visa Classic",
    maskedNumber: "•••• 1234",
    expiry: "12/26",
    holder: "John Doe",
    isDefault: true,
  },
  {
    id: "mastercard-5678",
    brand: "mastercard",
    name: "Mastercard World",
    maskedNumber: "•••• 5678",
    expiry: "09/25",
    holder: "John Doe",
  },
];

export const alternatePaymentMethods: AlternatePaymentMethod[] = [
  {
    id: "upi",
    title: "UPI ID",
    description: "Pay using GPay, PhonePe, or BHIM",
    value: "johndoe@okaxis",
    icon: "upi",
  },
  {
    id: "bank",
    title: "Net Banking",
    description: "Direct bank transfer for large orders",
    value: "HDFC Bank •••• 9901",
    icon: "bank",
  },
];
