import type { Prisma } from "@prisma/client";

import { prisma } from "../db/prisma";
import { apiErrors } from "../http/api-error";

export type UserPayload = {
  addressLabel?: unknown;
  addressLines?: unknown;
  authId?: unknown;
  avatarInitials?: unknown;
  communicationPreference?: unknown;
  email?: unknown;
  membership?: unknown;
  name?: unknown;
  phone?: unknown;
};

export type UserDto = {
  addressLabel: string | null;
  addressLines: string[];
  authId: string;
  avatarInitials: string | null;
  communicationPreference: string | null;
  createdAt: string;
  email: string;
  id: string;
  lastLoginAt: string | null;
  membership: string;
  name: string;
  phone: string | null;
  updatedAt: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeAddressLines(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((line): line is string => typeof line === "string")
    .map((line) => line.trim())
    .filter(Boolean);
}

function createInitials(name: string) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "TS";
}

function normalizeUserPayload(payload: UserPayload) {
  if (!isRecord(payload)) {
    throw apiErrors.validation("User details are invalid.", {
      form: "Request body must be an object.",
    });
  }

  const fieldErrors: Record<string, string> = {};
  const authId = optionalString(payload.authId);
  const email = optionalString(payload.email).toLowerCase();
  const name = optionalString(payload.name);

  if (!authId) {
    fieldErrors.authId = "Auth ID is required.";
  }

  if (!email || !email.includes("@")) {
    fieldErrors.email = "A valid email is required.";
  }

  if (name.length < 2) {
    fieldErrors.name = "Name must be at least 2 characters.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw apiErrors.validation("User details are invalid.", fieldErrors);
  }

  return {
    addressLabel: optionalString(payload.addressLabel) || null,
    addressLines: normalizeAddressLines(payload.addressLines),
    authId,
    avatarInitials: optionalString(payload.avatarInitials) || createInitials(name),
    communicationPreference: optionalString(payload.communicationPreference) || null,
    email,
    membership: optionalString(payload.membership) || "Standard Member",
    name,
    phone: optionalString(payload.phone) || null,
  };
}

function toUserDto(user: {
  addressLabel: string | null;
  addressLines: Prisma.JsonValue;
  authId: string;
  avatarInitials: string | null;
  communicationPreference: string | null;
  createdAt: Date;
  email: string;
  id: string;
  lastLoginAt: Date | null;
  membership: string;
  name: string;
  phone: string | null;
  updatedAt: Date;
}): UserDto {
  const addressLines = Array.isArray(user.addressLines)
    ? user.addressLines.filter((line): line is string => typeof line === "string")
    : [];

  return {
    addressLabel: user.addressLabel,
    addressLines,
    authId: user.authId,
    avatarInitials: user.avatarInitials,
    communicationPreference: user.communicationPreference,
    createdAt: user.createdAt.toISOString(),
    email: user.email,
    id: user.id,
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    membership: user.membership,
    name: user.name,
    phone: user.phone,
    updatedAt: user.updatedAt.toISOString(),
  };
}

export async function getUserByAuthId(authId: string): Promise<UserDto | null> {
  const normalizedAuthId = authId.trim();

  if (!normalizedAuthId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      authId: normalizedAuthId,
    },
  });

  return user ? toUserDto(user) : null;
}

export async function upsertUser(payload: UserPayload): Promise<UserDto> {
  const user = normalizeUserPayload(payload);
  const savedUser = await prisma.user.upsert({
    create: {
      ...user,
      lastLoginAt: new Date(),
    },
    update: {
      ...user,
      lastLoginAt: new Date(),
    },
    where: {
      authId: user.authId,
    },
  });

  return toUserDto(savedUser);
}

function formatDashboardDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDashboardTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatDashboardMoney(value: number) {
  return `Rs ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value)}`;
}

function getPrimaryLocation(addressLines: string[]) {
  return addressLines[addressLines.length - 1] ?? "Customer";
}

function getOrderItemCount(order: { items: Array<{ quantity: number }> }) {
  return order.items.reduce((sum, item) => sum + item.quantity, 0);
}

function getDashboardOrderStatus(status: string) {
  if (status === "CANCELLED") {
    return "Cancelled";
  }

  if (status === "COMPLETED" || status === "DELIVERED") {
    return "Delivered";
  }

  return "In Transit";
}

function getTrackingSteps(status: string) {
  if (status === "CANCELLED") {
    return [
      {
        detail: "Cancelled before fulfillment",
        id: "cancelled",
        state: "current",
        title: "Cancelled",
      },
      {
        detail: "Order was received",
        id: "received",
        state: "completed",
        title: "Order Received",
      },
      {
        detail: "No shipment created",
        id: "shipment",
        state: "upcoming",
        title: "Shipment",
      },
    ];
  }

  if (status === "COMPLETED" || status === "DELIVERED") {
    return [
      {
        detail: "Package delivered to the customer",
        id: "delivered",
        state: "current",
        title: "Delivered",
      },
      {
        detail: "Out for delivery",
        id: "out-for-delivery",
        state: "completed",
        title: "Out for Delivery",
      },
      {
        detail: "Order packed and dispatched",
        id: "packed",
        state: "completed",
        title: "Packed",
      },
    ];
  }

  return [
    {
      detail: "Order is being prepared",
      id: "processing",
      state: "current",
      title: "Processing",
    },
    {
      detail: "Payment and inventory confirmed",
      id: "confirmed",
      state: "completed",
      title: "Order Confirmed",
    },
    {
      detail: "Awaiting dispatch",
      id: "dispatch",
      state: "upcoming",
      title: "Dispatch",
    },
  ];
}

function toDashboardUserRow(user: {
  addressLines: Prisma.JsonValue;
  authId: string;
  avatarInitials: string | null;
  createdAt: Date;
  email: string;
  membership: string;
  name: string;
  orders: Array<{ total: Prisma.Decimal }>;
  phone: string | null;
}) {
  const addressLines = Array.isArray(user.addressLines)
    ? user.addressLines.filter((line): line is string => typeof line === "string")
    : [];
  const totalSpend = user.orders.reduce(
    (sum, order) => sum + Number(order.total),
    0,
  );
  const initials = user.avatarInitials ?? createInitials(user.name);

  return {
    avatarFrom: "#4f7d49",
    avatarTo: "#1f2c47",
    cardFrom: "#eef4eb",
    cardTo: "#ffffff",
    email: user.email,
    id: user.authId,
    initials,
    joinedDate: formatDashboardDate(user.createdAt),
    joinedTime: formatDashboardTime(user.createdAt),
    location: getPrimaryLocation(addressLines),
    loyaltyPoints: String(Math.floor(totalSpend / 10)),
    memberLabel: user.membership,
    name: user.name,
    phone: user.phone ?? "Not provided",
    role: "Customer",
    slug: user.authId,
    status: "active",
    totalOrders: String(user.orders.length),
    totalSpend: formatDashboardMoney(totalSpend),
    userCode: `#USR-${user.authId.slice(-6).toUpperCase()}`,
  };
}

function toDashboardOrderDetail(
  user: {
    addressLabel: string | null;
    addressLines: Prisma.JsonValue;
    email: string;
    name: string;
    phone: string | null;
  },
  order: {
    createdAt: Date;
    deliveryFee: Prisma.Decimal;
    items: Array<{
      id: string;
      lineTotal: Prisma.Decimal;
      productImage: string;
      productName: string;
      quantity: number;
      unitPrice: Prisma.Decimal;
    }>;
    orderNumber: string;
    status: string;
    subtotal: Prisma.Decimal;
    tax: Prisma.Decimal;
    total: Prisma.Decimal;
  },
) {
  const addressLines = Array.isArray(user.addressLines)
    ? user.addressLines.filter((line): line is string => typeof line === "string")
    : [];
  const safeAddress =
    addressLines.length > 0
      ? addressLines
      : [user.addressLabel ?? "No saved address"];

  return {
    amount: formatDashboardMoney(Number(order.total)),
    billingAddress: safeAddress,
    billingName: user.name,
    date: formatDashboardDate(order.createdAt),
    id: order.orderNumber,
    items: order.items.map((item) => ({
      id: item.id,
      imageSrc: item.productImage,
      price: formatDashboardMoney(Number(item.unitPrice)),
      product: item.productName,
      qty: String(item.quantity).padStart(2, "0"),
      total: formatDashboardMoney(Number(item.lineTotal)),
    })),
    paymentNote: "Payment captured at checkout",
    shippingAddress: safeAddress,
    shippingAmount:
      Number(order.deliveryFee) === 0
        ? "FREE"
        : formatDashboardMoney(Number(order.deliveryFee)),
    shippingContact: user.phone ?? user.email,
    shippingLabel: "Shipping",
    shippingName: user.name,
    staffNote: "Order was created from the storefront checkout.",
    staffNoteAuthor: "Storefront",
    staffNoteTimestamp: formatDashboardDate(order.createdAt),
    status: getDashboardOrderStatus(order.status),
    subtotal: formatDashboardMoney(Number(order.subtotal)),
    taxAmount: formatDashboardMoney(Number(order.tax)),
    taxLabel: "Tax",
    totalAmount: formatDashboardMoney(Number(order.total)),
    trackingCarrier: "Standard delivery",
    trackingSteps: getTrackingSteps(order.status),
    weight: `${getOrderItemCount(order)} item${getOrderItemCount(order) === 1 ? "" : "s"}`,
  };
}

export async function listDashboardUsers() {
  const users = await prisma.user.findMany({
    include: {
      orders: {
        select: {
          total: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return users.map(toDashboardUserRow);
}

export async function getDashboardUserProfile(userId: string) {
  const normalizedUserId = userId.trim();

  if (!normalizedUserId) {
    throw apiErrors.notFound("User not found.");
  }

  const user = await prisma.user.findFirst({
    include: {
      orders: {
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
    },
    where: {
      OR: [{ authId: normalizedUserId }, { id: normalizedUserId }],
    },
  });

  if (!user) {
    throw apiErrors.notFound("User not found.");
  }

  const row = toDashboardUserRow(user);
  const orders = user.orders.map((order) => toDashboardOrderDetail(user, order));
  const totalSpend = user.orders.reduce(
    (sum, order) => sum + Number(order.total),
    0,
  );
  const primaryAddress = Array.isArray(user.addressLines)
    ? user.addressLines.filter((line): line is string => typeof line === "string")
    : [];
  const recentOrders = user.orders.slice(0, 3);

  return {
    activityTimeline: [],
    auditLog: [],
    avatarFrom: row.avatarFrom,
    avatarTo: row.avatarTo,
    bannerFrom: "#4d7741",
    bannerTo: "#477640",
    email: user.email,
    initialPasswordLabel: "Change Password",
    initials: row.initials,
    location: row.location,
    loyaltyPoints: row.loyaltyPoints,
    memberLabel: user.membership,
    name: user.name,
    nextReward: "Rs 25 voucher at 5,000 points.",
    notificationPreferences: [
      {
        description: "Order updates and account notices",
        enabled: true,
        icon: "mail",
        id: "email",
        label: "Email Alerts",
      },
      {
        description: "Delivery and checkout updates",
        enabled: Boolean(user.phone),
        icon: "message",
        id: "sms",
        label: "SMS Notifications",
      },
      {
        description: "Browser notifications",
        enabled: false,
        icon: "bell",
        id: "push",
        label: "Push Notifications",
      },
    ],
    orderTimeline: recentOrders.map((order) => ({
      amount: formatDashboardMoney(Number(order.total)),
      detail: `${getOrderItemCount(order)} item${getOrderItemCount(order) === 1 ? "" : "s"}`,
      id: order.id,
      orderId: `#${order.orderNumber}`,
      productName: order.items[0]?.productName ?? "Order items",
    })),
    orders,
    passwordLabel: "Change Password",
    phone: user.phone ?? "Not provided",
    primaryAddress:
      primaryAddress.length > 0 ? primaryAddress : ["No saved address"],
    recentActivityCards: recentOrders.slice(0, 2).map((order) => ({
      date: formatDashboardDate(order.createdAt),
      description: `${getOrderItemCount(order)} item${getOrderItemCount(order) === 1 ? "" : "s"} worth ${formatDashboardMoney(Number(order.total))}.`,
      icon: "bag",
      id: order.id,
      title: `Order #${order.orderNumber} ${getDashboardOrderStatus(order.status)}`,
      tone: order.status === "CANCELLED" ? "amber" : "green",
    })),
    rewardMessage: "Keep shopping to unlock it.",
    role: "Customer",
    securityStatusDescription:
      "Password authentication is enabled for this storefront account.",
    securityStatusTitle: "Account Security Status",
    sessionsLabel: user.lastLoginAt
      ? `Last login ${formatDashboardDate(user.lastLoginAt)}`
      : "No recent sessions",
    slug: user.authId,
    spendingTrend: [
      { month: "Jan", value: 18 },
      { month: "Feb", value: 34 },
      { month: "Mar", value: 28 },
      { month: "Apr", value: Math.min(Math.max(totalSpend / 100, 10), 92), highlight: true },
      { month: "May", value: 42 },
      { month: "Jun", value: 36 },
    ],
    status: "active",
    totalOrders: String(user.orders.length),
    totalSpend: formatDashboardMoney(totalSpend),
    twoFactorEnabled: false,
    twoFactorLabel: "2FA Authentication",
  };
}
