export type UserStatus = "active" | "inactive" | "suspended";

export type UserRole =
  | "Administrator"
  | "Merchant"
  | "Customer"
  | "Support Agent";

export type UserMetric = {
  id: string;
  label: string;
  value: string;
  tone: "purple" | "green" | "blue" | "slate";
};

export type UserListRow = {
  id: string;
  slug: string;
  userCode: string;
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  joinedTime: string;
  location: string;
  status: UserStatus;
  role: UserRole;
  initials: string;
  avatarFrom: string;
  avatarTo: string;
  cardFrom: string;
  cardTo: string;
  totalOrders: string;
  totalSpend: string;
  loyaltyPoints: string;
  memberLabel?: string;
};

export type UserActivityCard = {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: "bag" | "review" | "shield";
  tone: "green" | "amber" | "blue";
};

export type SpendingBar = {
  month: string;
  value: number;
  highlight?: boolean;
};

export type ProfileTimelineItem = {
  id: string;
  productName: string;
  orderId: string;
  detail: string;
  amount: string;
};

export type NotificationPreference = {
  id: string;
  label: string;
  description: string;
  icon: "mail" | "message" | "bell";
  enabled: boolean;
};

export type AuditLogEntry = {
  id: string;
  userName: string;
  userInitials: string;
  action: string;
  actionTone: "green" | "blue" | "red" | "purple";
  module: string;
  ipAddress: string;
  timestamp: string;
};

export type ActivityTimelineEntry = {
  id: string;
  title: string;
  description: string;
  metaLeft: string;
  metaRight: string;
  badge: string;
  badgeTone: "purple" | "slate" | "green";
  icon: "store" | "trend" | "cloud";
};

export type TrackingStep = {
  id: string;
  title: string;
  detail: string;
  state: "current" | "completed" | "upcoming";
};

export type OrderLineItem = {
  id: string;
  product: string;
  imageSrc: string;
  qty: string;
  price: string;
  total: string;
};

export type UserOrderDetail = {
  id: string;
  status: "In Transit" | "Delivered" | "Cancelled";
  date: string;
  amount: string;
  weight: string;
  shippingLabel: string;
  taxLabel: string;
  items: OrderLineItem[];
  subtotal: string;
  shippingAmount: string;
  taxAmount: string;
  totalAmount: string;
  billingName: string;
  billingAddress: string[];
  shippingName: string;
  shippingAddress: string[];
  shippingContact: string;
  paymentNote: string;
  staffNoteAuthor: string;
  staffNoteTimestamp: string;
  staffNote: string;
  trackingCarrier: string;
  trackingSteps: TrackingStep[];
};

export type UserProfile = {
  slug: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  memberLabel: string;
  totalOrders: string;
  totalSpend: string;
  loyaltyPoints: string;
  nextReward: string;
  rewardMessage: string;
  role: UserRole;
  status: UserStatus;
  initials: string;
  avatarFrom: string;
  avatarTo: string;
  bannerFrom: string;
  bannerTo: string;
  primaryAddress: string[];
  recentActivityCards: UserActivityCard[];
  spendingTrend: SpendingBar[];
  orderTimeline: ProfileTimelineItem[];
  twoFactorLabel: string;
  twoFactorEnabled: boolean;
  passwordLabel: string;
  sessionsLabel: string;
  securityStatusTitle: string;
  securityStatusDescription: string;
  notificationPreferences: NotificationPreference[];
  activityTimeline: ActivityTimelineEntry[];
  auditLog: AuditLogEntry[];
  orders: UserOrderDetail[];
};

export const usersPageContent = {
  heading: "User Network",
  description:
    "Manage and monitor all platform members and their activity.",
};

export const userMetrics: UserMetric[] = [
  { id: "total", label: "Total Users", value: "12,482", tone: "purple" },
  { id: "active", label: "Active Now", value: "1,240", tone: "green" },
  { id: "verified", label: "Verified", value: "98.2%", tone: "blue" },
  { id: "suspended", label: "Suspended", value: "45", tone: "slate" },
];

export const userRoleOptions = [
  "All Roles",
  "Administrator",
  "Merchant",
  "Customer",
  "Support Agent",
];

export const userStatusOptions = [
  "All Status",
  "Active",
  "Inactive",
  "Suspended",
];

export const userNetworkRows: UserListRow[] = [
  {
    id: "user-1",
    slug: "alex-rivers",
    userCode: "#USR-8821",
    name: "Alex Rivers",
    email: "alex.rivers@example.com",
    phone: "+1 (555) 012-3456",
    joinedDate: "Oct 12, 2023",
    joinedTime: "10:45 AM",
    location: "Portland, Oregon",
    status: "active",
    role: "Administrator",
    initials: "AR",
    avatarFrom: "#ff596d",
    avatarTo: "#f4a261",
    cardFrom: "#eef4eb",
    cardTo: "#ffffff",
    totalOrders: "188",
    totalSpend: "Rs 24,200",
    loyaltyPoints: "1,180",
  },
  {
    id: "user-2",
    slug: "sarah-chen",
    userCode: "#USR-8822",
    name: "Sarah Chen",
    email: "s.chen@techmail.io",
    phone: "+1 (555) 987-6543",
    joinedDate: "Oct 11, 2023",
    joinedTime: "02:15 PM",
    location: "Singapore",
    status: "active",
    role: "Merchant",
    initials: "SC",
    avatarFrom: "#6aa7ff",
    avatarTo: "#273c75",
    cardFrom: "#eef4eb",
    cardTo: "#ffffff",
    totalOrders: "264",
    totalSpend: "Rs 54,820",
    loyaltyPoints: "2,340",
  },
  {
    id: "user-3",
    slug: "julian-vane",
    userCode: "#USR-8823",
    name: "Julian Vane",
    email: "j.vane@domain.com",
    phone: "+1 (555) 234-5678",
    joinedDate: "Oct 10, 2023",
    joinedTime: "09:30 AM",
    location: "Austin, Texas",
    status: "inactive",
    role: "Support Agent",
    initials: "JV",
    avatarFrom: "#1f2430",
    avatarTo: "#6b7280",
    cardFrom: "#edf2fb",
    cardTo: "#ffffff",
    totalOrders: "72",
    totalSpend: "Rs 9,430",
    loyaltyPoints: "420",
  },
  {
    id: "user-4",
    slug: "elena-frost",
    userCode: "#USR-8824",
    name: "Elena Frost",
    email: "elena@frost-design.net",
    phone: "+1 (555) 456-7890",
    joinedDate: "Oct 09, 2023",
    joinedTime: "05:22 PM",
    location: "London, UK",
    status: "active",
    role: "Customer",
    initials: "EF",
    avatarFrom: "#9ad7f5",
    avatarTo: "#1f5f8b",
    cardFrom: "#eef4eb",
    cardTo: "#ffffff",
    totalOrders: "94",
    totalSpend: "Rs 18,900",
    loyaltyPoints: "980",
  },
  {
    id: "user-5",
    slug: "johnathan-doe",
    userCode: "#USR-8825",
    name: "Johnathan Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 110-2234",
    joinedDate: "Sep 28, 2023",
    joinedTime: "11:20 AM",
    location: "Bengaluru, India",
    status: "active",
    role: "Administrator",
    initials: "JD",
    avatarFrom: "#8bc6c8",
    avatarTo: "#284b63",
    cardFrom: "#eef4eb",
    cardTo: "#ffffff",
    totalOrders: "212",
    totalSpend: "Rs 36,280",
    loyaltyPoints: "1,860",
  },
  {
    id: "user-6",
    slug: "sarah-jenkins",
    userCode: "#USR-8826",
    name: "Sarah Jenkins",
    email: "s.jenkins@workmail.com",
    phone: "+1 (555) 990-8432",
    joinedDate: "Sep 22, 2023",
    joinedTime: "03:05 PM",
    location: "Manchester, UK",
    status: "active",
    role: "Merchant",
    initials: "SJ",
    avatarFrom: "#1f4b99",
    avatarTo: "#dd6b4d",
    cardFrom: "#eef4eb",
    cardTo: "#ffffff",
    totalOrders: "305",
    totalSpend: "Rs 42,760",
    loyaltyPoints: "2,120",
  },
  {
    id: "user-7",
    slug: "robert-wilson",
    userCode: "#USR-8827",
    name: "Robert Wilson",
    email: "robert.w@corporate.net",
    phone: "+1 (555) 654-4433",
    joinedDate: "Sep 20, 2023",
    joinedTime: "08:40 AM",
    location: "San Francisco, California",
    status: "inactive",
    role: "Support Agent",
    initials: "RW",
    avatarFrom: "#25364d",
    avatarTo: "#64748b",
    cardFrom: "#edf2fb",
    cardTo: "#ffffff",
    totalOrders: "58",
    totalSpend: "Rs 6,840",
    loyaltyPoints: "310",
  },
  {
    id: "user-8",
    slug: "emily-chen",
    userCode: "#USR-8828",
    name: "Emily Chen",
    email: "echen.design@gmail.com",
    phone: "+1 (555) 980-5520",
    joinedDate: "Sep 19, 2023",
    joinedTime: "12:10 PM",
    location: "Toronto, Canada",
    status: "active",
    role: "Customer",
    initials: "EC",
    avatarFrom: "#f1c75b",
    avatarTo: "#f07d4f",
    cardFrom: "#eef4eb",
    cardTo: "#ffffff",
    totalOrders: "142",
    totalSpend: "Rs 12,450",
    loyaltyPoints: "4,820",
    memberLabel: "Premium Member",
  },
  {
    id: "user-9",
    slug: "michael-ross",
    userCode: "#USR-8829",
    name: "Michael Ross",
    email: "m.ross@legal.inc",
    phone: "+1 (555) 112-5541",
    joinedDate: "Sep 14, 2023",
    joinedTime: "04:55 PM",
    location: "Chicago, Illinois",
    status: "active",
    role: "Merchant",
    initials: "MR",
    avatarFrom: "#355c7d",
    avatarTo: "#2a3b32",
    cardFrom: "#eef4eb",
    cardTo: "#ffffff",
    totalOrders: "168",
    totalSpend: "Rs 29,040",
    loyaltyPoints: "1,510",
  },
  {
    id: "user-10",
    slug: "jessica-lee",
    userCode: "#USR-8830",
    name: "Jessica Lee",
    email: "jlee@fashionshop.com",
    phone: "+1 (555) 433-1180",
    joinedDate: "Sep 10, 2023",
    joinedTime: "01:15 PM",
    location: "Seoul, South Korea",
    status: "active",
    role: "Customer",
    initials: "JL",
    avatarFrom: "#f6d365",
    avatarTo: "#fda085",
    cardFrom: "#eef4eb",
    cardTo: "#ffffff",
    totalOrders: "126",
    totalSpend: "Rs 15,760",
    loyaltyPoints: "1,220",
  },
  {
    id: "user-11",
    slug: "kevin-spacer",
    userCode: "#USR-8831",
    name: "Kevin Spacer",
    email: "k.spacer@invalid.net",
    phone: "+1 (555) 807-1140",
    joinedDate: "Sep 08, 2023",
    joinedTime: "09:05 AM",
    location: "Denver, Colorado",
    status: "suspended",
    role: "Customer",
    initials: "KS",
    avatarFrom: "#6c7a89",
    avatarTo: "#2f4858",
    cardFrom: "#fff0f0",
    cardTo: "#ffffff",
    totalOrders: "12",
    totalSpend: "Rs 1,950",
    loyaltyPoints: "80",
  },
  {
    id: "user-12",
    slug: "eleanor-fitzwilliam",
    userCode: "#USR-8832",
    name: "Eleanor Fitzwilliam",
    email: "eleanor.fitz@example.com",
    phone: "+44 7700 900452",
    joinedDate: "Oct 08, 2023",
    joinedTime: "09:10 AM",
    location: "Theni, Tamilnadu",
    status: "active",
    role: "Customer",
    initials: "EF",
    avatarFrom: "#2f4858",
    avatarTo: "#9daaa2",
    cardFrom: "#eef4eb",
    cardTo: "#ffffff",
    totalOrders: "142",
    totalSpend: "Rs 12,450",
    loyaltyPoints: "4,820",
    memberLabel: "Premium Member",
  },
];

export const userQuickActions = [
  "Verify pending accounts",
  "Audit top 10 sellers",
  "Generate tax reports",
];

export const userGrowthReport = {
  title: "Member Growth Report",
  description:
    "Platform signups and high-value member retention are trending upward this quarter. Review onboarding quality and keep momentum strong.",
};

function buildOrderItems(): OrderLineItem[] {
  return [
    {
      id: "line-1",
      product: "Diet Choice Chia Seeds",
      imageSrc: "/home/deal-of-day/diet-choize-chia-seed-finger-millet-flour.png",
      qty: "01",
      price: "Rs 899.00",
      total: "Rs 899.00",
    },
    {
      id: "line-2",
      product: "Nutri-Salt Moringa Infusion",
      imageSrc: "/home/deal-of-day/nutri-salt-moringa-infusion.png",
      qty: "01",
      price: "Rs 299.00",
      total: "Rs 299.00",
    },
    {
      id: "line-3",
      product: "Froot Plus Healthy Fruit Mix",
      imageSrc: "/home/deal-of-day/froot-plus.png",
      qty: "01",
      price: "Rs 51.50",
      total: "Rs 51.50",
    },
  ];
}

function buildUserOrders(row: UserListRow): UserOrderDetail[] {
  return [
    {
      id: "ord-88291-jk",
      status: "In Transit",
      date: "Oct 12, 2025",
      amount: "Rs 1,249.50",
      weight: "Weight: 4.2kg",
      shippingLabel: "Shipping (Express)",
      taxLabel: "Tax (VAT 0%)",
      items: buildOrderItems(),
      subtotal: "Rs 1,249.50",
      shippingAmount: "FREE",
      taxAmount: "Rs 0.00",
      totalAmount: "Rs 1,249.50",
      billingName: row.name,
      billingAddress: [
        "882 High Street, Suite 400",
        "Palo Alto, CA 94301",
        "United States",
      ],
      shippingName: row.name,
      shippingAddress: [
        "1200 San Bruno Ave",
        "San Francisco, CA 94110",
        "United States",
      ],
      shippingContact: "+1 (555) 012-3456",
      paymentNote: "Payment verified via Stripe",
      staffNoteAuthor: "Marcus Chen (Operations)",
      staffNoteTimestamp: "Oct 11, 2023 - 10:15 AM",
      staffNote:
        "Customer requested express delivery for a birthday gift. Upgraded from Standard at no extra cost as per loyalty program tier 2.",
      trackingCarrier: "Via FedEx Express",
      trackingSteps: [
        {
          id: "track-1",
          title: "Out for Delivery",
          detail: "San Francisco, CA - 08:30 AM",
          state: "current",
        },
        {
          id: "track-2",
          title: "Arrived at Sort Facility",
          detail: "Oakland, CA - Oct 11, 11:20 PM",
          state: "completed",
        },
        {
          id: "track-3",
          title: "Departed Origin",
          detail: "Los Angeles, CA - Oct 10, 04:45 PM",
          state: "completed",
        },
      ],
    },
    {
      id: "ord-77102-ll",
      status: "Delivered",
      date: "Sep 28, 2025",
      amount: "Rs 450.00",
      weight: "Weight: 1.1kg",
      shippingLabel: "Shipping (Standard)",
      taxLabel: "Tax (GST 0%)",
      items: [
        {
          id: "line-a",
          product: "Millet Vita Traditional Health Mix",
          imageSrc: "/home/deal-of-day/millet-vita-traditional-health-mix.png",
          qty: "01",
          price: "Rs 450.00",
          total: "Rs 450.00",
        },
      ],
      subtotal: "Rs 450.00",
      shippingAmount: "FREE",
      taxAmount: "Rs 0.00",
      totalAmount: "Rs 450.00",
      billingName: row.name,
      billingAddress: [
        "24 Kensington Gardens",
        "Theni, Tamilnadu",
        "India",
      ],
      shippingName: row.name,
      shippingAddress: [
        "24 Kensington Gardens",
        "Theni, Tamilnadu",
        "India",
      ],
      shippingContact: row.phone,
      paymentNote: "Payment captured successfully",
      staffNoteAuthor: "Nila Raj (Support)",
      staffNoteTimestamp: "Sep 27, 2025 - 06:10 PM",
      staffNote:
        "Customer requested contactless delivery and confirmed package receipt on first attempt.",
      trackingCarrier: "Via BlueDart",
      trackingSteps: [
        {
          id: "track-a1",
          title: "Delivered",
          detail: "Theni - Sep 28, 03:15 PM",
          state: "current",
        },
        {
          id: "track-a2",
          title: "Out for Delivery",
          detail: "Theni - Sep 28, 09:05 AM",
          state: "completed",
        },
        {
          id: "track-a3",
          title: "Arrived at Local Hub",
          detail: "Madurai - Sep 27, 10:40 PM",
          state: "completed",
        },
      ],
    },
    {
      id: "ord-66291-mm",
      status: "Delivered",
      date: "Aug 15, 2025",
      amount: "Rs 2,810.20",
      weight: "Weight: 8.6kg",
      shippingLabel: "Shipping (Bulk)",
      taxLabel: "Tax (VAT 0%)",
      items: buildOrderItems(),
      subtotal: "Rs 2,810.20",
      shippingAmount: "FREE",
      taxAmount: "Rs 0.00",
      totalAmount: "Rs 2,810.20",
      billingName: row.name,
      billingAddress: [
        "24 Kensington Gardens",
        "Theni, Tamilnadu",
        "India",
      ],
      shippingName: row.name,
      shippingAddress: [
        "24 Kensington Gardens",
        "Theni, Tamilnadu",
        "India",
      ],
      shippingContact: row.phone,
      paymentNote: "Verified via Razorpay",
      staffNoteAuthor: "Priya Raman (Warehouse)",
      staffNoteTimestamp: "Aug 14, 2025 - 09:45 AM",
      staffNote:
        "Bulk pantry bundle packed with reinforced eco boxes and marked fragile due to glass jars.",
      trackingCarrier: "Via Delhivery",
      trackingSteps: [
        {
          id: "track-b1",
          title: "Delivered",
          detail: "Theni - Aug 15, 01:40 PM",
          state: "current",
        },
        {
          id: "track-b2",
          title: "Shipped from Hub",
          detail: "Chennai - Aug 14, 05:20 PM",
          state: "completed",
        },
        {
          id: "track-b3",
          title: "Order Packed",
          detail: "Warehouse A - Aug 14, 12:10 PM",
          state: "completed",
        },
      ],
    },
    {
      id: "ord-55012-zz",
      status: "Cancelled",
      date: "Jul 02, 2025",
      amount: "Rs 120.00",
      weight: "Weight: 0.3kg",
      shippingLabel: "Shipping",
      taxLabel: "Tax",
      items: [
        {
          id: "line-c1",
          product: "Healthy Ingredients Trial Pack",
          imageSrc: "/home/featured-categories/health-mix.png",
          qty: "01",
          price: "Rs 120.00",
          total: "Rs 120.00",
        },
      ],
      subtotal: "Rs 120.00",
      shippingAmount: "Rs 0.00",
      taxAmount: "Rs 0.00",
      totalAmount: "Rs 120.00",
      billingName: row.name,
      billingAddress: [
        "24 Kensington Gardens",
        "Theni, Tamilnadu",
        "India",
      ],
      shippingName: row.name,
      shippingAddress: [
        "24 Kensington Gardens",
        "Theni, Tamilnadu",
        "India",
      ],
      shippingContact: row.phone,
      paymentNote: "Refund initiated",
      staffNoteAuthor: "Hari Bala (Care)",
      staffNoteTimestamp: "Jul 01, 2025 - 07:35 PM",
      staffNote:
        "Order cancelled on customer request before dispatch. Full refund released to original payment method.",
      trackingCarrier: "Not dispatched",
      trackingSteps: [
        {
          id: "track-c1",
          title: "Cancelled",
          detail: "Refund requested before dispatch",
          state: "current",
        },
        {
          id: "track-c2",
          title: "Order Confirmed",
          detail: "Awaiting fulfillment assignment",
          state: "completed",
        },
        {
          id: "track-c3",
          title: "Warehouse Scan Pending",
          detail: "No movement recorded",
          state: "upcoming",
        },
      ],
    },
  ];
}

function buildActivityTimeline(row: UserListRow): ActivityTimelineEntry[] {
  return [
    {
      id: "activity-1",
      title: "New Vendor Registered",
      description:
        "Vendor 'Aurora Global Supply' has completed their onboarding documentation and system verification.",
      metaLeft: "14 minutes ago",
      metaRight: "Module: CRM",
      badge: "Automated",
      badgeTone: "purple",
      icon: "store",
    },
    {
      id: "activity-2",
      title: "Bulk Price Update Completed",
      description:
        "Price revision for 1,450 items in the 'Holiday Season' category successfully applied across all regions.",
      metaLeft: "2 hours ago",
      metaRight: `By: ${row.name}`,
      badge: "Manual",
      badgeTone: "slate",
      icon: "trend",
    },
    {
      id: "activity-3",
      title: "System Backup Successful",
      description:
        "Weekly full-system image created and verified. Encrypted archive stored in Secondary Vault Region (EU-West-1).",
      metaLeft: "6 hours ago",
      metaRight: "Size: 14.2 GB",
      badge: "System",
      badgeTone: "green",
      icon: "cloud",
    },
  ];
}

function buildAuditLog(row: UserListRow): AuditLogEntry[] {
  return [
    {
      id: "audit-1",
      userName: "Jane Doe",
      userInitials: "JD",
      action: "Updated Stock",
      actionTone: "green",
      module: "Inventory",
      ipAddress: "192.168.1.104",
      timestamp: "Oct 24, 2023 14:22:01",
    },
    {
      id: "audit-2",
      userName: "Alexander Sterling",
      userInitials: "AS",
      action: "Processed Order",
      actionTone: "blue",
      module: "Orders",
      ipAddress: "204.12.88.12",
      timestamp: "Oct 24, 2023 13:45:12",
    },
    {
      id: "audit-3",
      userName: "Alexander Sterling",
      userInitials: "AS",
      action: "Deleted Vendor",
      actionTone: "red",
      module: "Procurement",
      ipAddress: "204.12.88.12",
      timestamp: "Oct 24, 2023 12:30:55",
    },
    {
      id: "audit-4",
      userName: "Ryan Miller",
      userInitials: "RM",
      action: "System Config Change",
      actionTone: "purple",
      module: "Core Settings",
      ipAddress: "10.0.0.45",
      timestamp: "Oct 24, 2023 10:15:00",
    },
    {
      id: "audit-5",
      userName: row.name,
      userInitials: row.initials,
      action: "Approved Refund",
      actionTone: "blue",
      module: "Customer Care",
      ipAddress: "172.16.20.19",
      timestamp: "Oct 23, 2023 18:42:17",
    },
  ];
}

function buildUserProfile(row: UserListRow): UserProfile {
  const orders = buildUserOrders(row);

  return {
    slug: row.slug,
    name: row.name,
    email: row.email,
    phone: row.phone,
    location: row.location,
    memberLabel: row.memberLabel ?? "Member",
    totalOrders: row.totalOrders,
    totalSpend: row.totalSpend,
    loyaltyPoints: row.loyaltyPoints,
    nextReward: "Rs 25 Voucher at 5,000 points.",
    rewardMessage: "Keep shopping to unlock!",
    role: row.role,
    status: row.status,
    initials: row.initials,
    avatarFrom: row.avatarFrom,
    avatarTo: row.avatarTo,
    bannerFrom: "#4d7741",
    bannerTo: "#477640",
    primaryAddress: [
      "24 Kensington Gardens",
      "Theni, Tamilnadu.",
    ],
    recentActivityCards: [
      {
        id: "card-1",
        title: "Order #VAULT-9921 Delivered",
        description:
          "The signature collection set was successfully delivered to primary address.",
        date: "12 Oct, 2023",
        icon: "bag",
        tone: "green",
      },
      {
        id: "card-2",
        title: "Product Review Submitted",
        description:
          "Rated 'Obsidian Cufflinks' 5 stars and added a photo review.",
        date: "08 Oct, 2023",
        icon: "review",
        tone: "amber",
      },
    ],
    spendingTrend: [
      { month: "Apr", value: 38 },
      { month: "May", value: 64 },
      { month: "Jun", value: 54 },
      { month: "Jul", value: 82, highlight: true },
      { month: "Aug", value: 68 },
      { month: "Sep", value: 44 },
    ],
    orderTimeline: [
      {
        id: "timeline-1",
        productName: "Millet Flours",
        orderId: "#VAULT-9921",
        detail: "Confirmed Payment",
        amount: "Rs 890.00",
      },
      {
        id: "timeline-2",
        productName: "Dosa Mix",
        orderId: "#VAULT-8812",
        detail: "2 Items",
        amount: "Rs 420.00",
      },
      {
        id: "timeline-3",
        productName: "Millet & Dosa Mix",
        orderId: "#VAULT-7654",
        detail: "4 Items",
        amount: "Rs 215.00",
      },
    ],
    twoFactorLabel: "2FA Authentication",
    twoFactorEnabled: true,
    passwordLabel: "Change Password",
    sessionsLabel: "Active Sessions",
    securityStatusTitle: "Account Security Status",
    securityStatusDescription:
      "This user has Two-Factor Authentication (2FA) enabled via SMS. Last password change was 4 months ago. No suspicious login attempts detected in the last 30 days.",
    notificationPreferences: [
      {
        id: "notify-1",
        label: "Email Alerts",
        description: "Critical system logs and reports",
        icon: "mail",
        enabled: true,
      },
      {
        id: "notify-2",
        label: "SMS Notifications",
        description: "Login attempts and security alerts",
        icon: "message",
        enabled: true,
      },
      {
        id: "notify-3",
        label: "Push Notifications",
        description: "Instant mobile/browser alerts",
        icon: "bell",
        enabled: false,
      },
    ],
    activityTimeline: buildActivityTimeline(row),
    auditLog: buildAuditLog(row),
    orders,
  };
}

export const userProfiles: UserProfile[] = userNetworkRows.map(buildUserProfile);

export function getUserProfile(userId: string) {
  return userProfiles.find((profile) => profile.slug === userId) ?? userProfiles[0];
}

export function getUserOrder(userId: string, orderId: string) {
  const profile = getUserProfile(userId);
  const order = profile.orders.find((entry) => entry.id === orderId) ?? profile.orders[0];

  return { profile, order };
}
