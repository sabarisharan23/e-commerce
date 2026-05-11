import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

import { calculateOfferDiscount, validateOffer } from "../offers/offer-service";
import { prisma } from "../db/prisma";
import { apiErrors } from "../http/api-error";
import { serverLogger } from "../observability/logger";
import {
  getUserByAuthId,
  upsertUser,
  type UserPayload,
} from "../users/user-service";

export type CreateOrderPayload = {
  deliveryFee?: unknown;
  items?: unknown;
  offerCode?: unknown;
  tax?: unknown;
  user?: UserPayload;
};

export type OrderDto = {
  createdAt: string;
  deliveryFee: number;
  discount: number;
  id: string;
  items: OrderItemDto[];
  offerCode: string | null;
  orderNumber: string;
  status: string;
  subtotal: number;
  tax: number;
  total: number;
};

export type OrderItemDto = {
  id: string;
  lineTotal: number;
  productImage: string;
  productName: string;
  productSlug: string;
  quantity: number;
  unitPrice: number;
};

export type PublicOrderTrackingDto = {
  itemSummary: string;
  orderNumber: string;
  placedOn: string;
  status: string;
  statusDetail: string;
  statusTone: "green" | "amber" | "red";
  trackingCarrier: string;
  trackingCode: string;
  trackingSteps: Array<{
    detail: string;
    id: string;
    state: "completed" | "current" | "upcoming";
    title: string;
  }>;
};

export type DashboardOrderMetric = {
  helper: string;
  id: string;
  label: string;
  tone: "green" | "amber" | "red" | "neutral";
  value: string;
};

export type DashboardOrderRow = {
  amount: string;
  customer: string;
  id: string;
  initials: string;
  product: string;
  status: "delivered" | "processing" | "cancelled" | "shipped" | "pending";
};

export type DashboardOrderManagementRow = {
  amount: string;
  customer: string;
  id: string;
  initials: string;
  orderDate: string;
  status: "delivered" | "shipped" | "pending" | "cancelled";
};

export type DashboardOrderStatusBreakdown = {
  color: string;
  label: string;
  percentage: number;
};

export type DashboardOrderOverview = {
  managementRows: DashboardOrderManagementRow[];
  metrics: DashboardOrderMetric[];
  recentRows: DashboardOrderRow[];
  statusBreakdown: DashboardOrderStatusBreakdown[];
  totalOrdersLabel: string;
};

export type DashboardOrderDetail = {
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  description: string;
  fulfillmentPercent: number;
  harvestChange: string;
  harvestValue: string;
  items: Array<{
    id: string;
    imageSrc: string;
    name: string;
    price: string;
    qty: string;
    type: string;
    unitPrice: string;
  }>;
  memberLabel: string;
  note: string;
  orderId: string;
  shippingAddress: string;
  status: string;
  subtotal: string;
  timeline: Array<{
    description: string;
    id: string;
    state: "done" | "current" | "pending";
    timeLabel: string;
    title: string;
  }>;
};

type DashboardOrderWithRelations = {
  createdAt: Date;
  orderNumber: string;
  status: string;
  total: Prisma.Decimal;
  user: {
    avatarInitials: string | null;
    name: string;
  };
  items: Array<{
    productName: string;
  }>;
};

const freeDeliveryThreshold = 2750;
const standardDeliveryFee = 50;
const taxRate = 0.18;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function formatTrackingDate(value: Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function getPublicTrackingStatus(status: string) {
  if (status === "CANCELLED") {
    return {
      detail: "This order was cancelled before shipment was created.",
      label: "Cancelled",
      tone: "red" as const,
    };
  }

  if (status === "COMPLETED" || status === "DELIVERED") {
    return {
      detail: "Your order has been delivered successfully.",
      label: "Delivered",
      tone: "green" as const,
    };
  }

  if (status === "SHIPPED") {
    return {
      detail: "Your package is on the way and moving through delivery.",
      label: "Shipped",
      tone: "amber" as const,
    };
  }

  return {
    detail: "Your order is confirmed and currently being prepared.",
    label: "Processing",
    tone: "amber" as const,
  };
}

function getPublicTrackingSteps(status: string): PublicOrderTrackingDto["trackingSteps"] {
  if (status === "CANCELLED") {
    return [
      {
        detail: "Order was cancelled before fulfillment began.",
        id: "cancelled",
        state: "current",
        title: "Cancelled",
      },
      {
        detail: "Order was received by the store.",
        id: "received",
        state: "completed",
        title: "Order Received",
      },
      {
        detail: "Shipment was not created.",
        id: "shipment",
        state: "upcoming",
        title: "Shipment",
      },
    ];
  }

  if (status === "COMPLETED" || status === "DELIVERED") {
    return [
      {
        detail: "Package has been delivered to the customer address.",
        id: "delivered",
        state: "current",
        title: "Delivered",
      },
      {
        detail: "Package was out for final delivery.",
        id: "out-for-delivery",
        state: "completed",
        title: "Out for Delivery",
      },
      {
        detail: "Order was packed and dispatched from the store.",
        id: "packed",
        state: "completed",
        title: "Packed",
      },
    ];
  }

  if (status === "SHIPPED") {
    return [
      {
        detail: "Shipment is currently moving through delivery.",
        id: "in-transit",
        state: "current",
        title: "In Transit",
      },
      {
        detail: "Order was packed and handed over for shipment.",
        id: "packed",
        state: "completed",
        title: "Packed",
      },
      {
        detail: "Order was confirmed successfully.",
        id: "confirmed",
        state: "completed",
        title: "Order Confirmed",
      },
    ];
  }

  return [
    {
      detail: "Order is being prepared by the store team.",
      id: "processing",
      state: "current",
      title: "Processing",
    },
    {
      detail: "Payment and order details have been confirmed.",
      id: "confirmed",
      state: "completed",
      title: "Confirmed",
    },
    {
      detail: "Shipment will be created after packing.",
      id: "shipment",
      state: "upcoming",
      title: "Shipment",
    },
  ];
}

function normalizeOrderItems(value: unknown) {
  if (!Array.isArray(value)) {
    throw apiErrors.validation("Order details are invalid.", {
      items: "At least one order item is required.",
    });
  }

  const quantitiesBySlug = new Map<string, number>();

  value.forEach((item) => {
    if (!isRecord(item)) {
      return;
    }

    const productSlug = optionalString(item.id || item.productSlug);
    const quantity = Number(item.quantity);

    if (!productSlug || !Number.isFinite(quantity) || quantity <= 0) {
      return;
    }

    quantitiesBySlug.set(
      productSlug,
      (quantitiesBySlug.get(productSlug) ?? 0) + Math.floor(quantity),
    );
  });

  const items = Array.from(quantitiesBySlug, ([productSlug, quantity]) => ({
    productSlug,
    quantity,
  }));

  if (items.length === 0) {
    throw apiErrors.validation("Order details are invalid.", {
      items: "At least one valid order item is required.",
    });
  }

  return items;
}

function normalizeMoney(value: unknown) {
  const numberValue = Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    return 0;
  }

  return Math.round(numberValue * 100) / 100;
}

function createOrderNumber() {
  return `TS-${randomUUID().slice(0, 8).toUpperCase()}`;
}

function toDecimal(value: number) {
  return new Prisma.Decimal(value.toFixed(2));
}

function formatDashboardMoney(value: number) {
  return `Rs ${new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  }).format(value)}`;
}

function formatDashboardDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function createInitials(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  return initials || "TS";
}

function normalizeDashboardOrderStatus(status: string): DashboardOrderRow["status"] {
  if (status === "CANCELLED") {
    return "cancelled";
  }

  if (status === "COMPLETED" || status === "DELIVERED") {
    return "delivered";
  }

  if (status === "SHIPPED") {
    return "shipped";
  }

  if (status === "PLACED" || status === "PROCESSING") {
    return "processing";
  }

  return "pending";
}

function normalizeManagementOrderStatus(
  status: string,
): DashboardOrderManagementRow["status"] {
  const normalized = normalizeDashboardOrderStatus(status);

  if (normalized === "processing") {
    return "pending";
  }

  if (normalized === "shipped" || normalized === "delivered" || normalized === "cancelled") {
    return normalized;
  }

  return "pending";
}

function getDashboardStatusLabel(status: string) {
  if (status === "CANCELLED") {
    return "Cancelled";
  }

  if (status === "COMPLETED" || status === "DELIVERED") {
    return "Delivered";
  }

  if (status === "SHIPPED") {
    return "Shipped";
  }

  return "Processing";
}

function shouldUseOrderFallback(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  return (
    /EACCES|ECONNREFUSED|ENOTFOUND|Can't reach database server|connect/i.test(message) ||
    /Cannot read properties of undefined \(reading '(findMany|findFirst|create|update)'\)/i.test(
      message,
    )
  );
}

function buildDashboardOrderOverview(orders: DashboardOrderWithRelations[]): DashboardOrderOverview {
  const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
  const activeOrders = orders.filter((order) =>
    ["PLACED", "PROCESSING", "SHIPPED"].includes(order.status),
  ).length;
  const completedOrders = orders.filter((order) =>
    ["COMPLETED", "DELIVERED"].includes(order.status),
  ).length;
  const cancelledOrders = orders.filter((order) => order.status === "CANCELLED").length;
  const totalOrders = Math.max(orders.length, 1);
  const statusBreakdown: DashboardOrderStatusBreakdown[] = [
    {
      color: "#477640",
      label: "Delivered",
      percentage: Math.round((completedOrders / totalOrders) * 100),
    },
    {
      color: "#f5a000",
      label: "In Transit",
      percentage: Math.round((activeOrders / totalOrders) * 100),
    },
    {
      color: "#d53b3b",
      label: "Cancelled",
      percentage: Math.round((cancelledOrders / totalOrders) * 100),
    },
  ];
  const recentRows = orders.slice(0, 8).map((order) => ({
    amount: formatDashboardMoney(Number(order.total)),
    customer: order.user.name,
    id: `#${order.orderNumber}`,
    initials: order.user.avatarInitials ?? createInitials(order.user.name),
    product: order.items[0]?.productName ?? "Order items",
    status: normalizeDashboardOrderStatus(order.status),
  }));
  const managementRows = orders.map((order) => ({
    amount: formatDashboardMoney(Number(order.total)),
    customer: order.user.name,
    id: `#${order.orderNumber}`,
    initials: order.user.avatarInitials ?? createInitials(order.user.name),
    orderDate: formatDashboardDate(order.createdAt),
    status: normalizeManagementOrderStatus(order.status),
  }));

  return {
    managementRows,
    metrics: [
      {
        helper: `${formatDashboardMoney(totalRevenue)} revenue`,
        id: "total-orders",
        label: "Total Orders",
        tone: "green",
        value: orders.length.toLocaleString("en-IN"),
      },
      {
        helper: "Needs fulfillment",
        id: "pending",
        label: "Pending",
        tone: activeOrders > 0 ? "amber" : "neutral",
        value: activeOrders.toLocaleString("en-IN"),
      },
      {
        helper: `${Math.round((completedOrders / totalOrders) * 100)}% success rate`,
        id: "completed",
        label: "Completed",
        tone: "green",
        value: completedOrders.toLocaleString("en-IN"),
      },
      {
        helper: cancelledOrders > 0 ? "Review needed" : "No cancellations",
        id: "returns",
        label: "Cancelled",
        tone: cancelledOrders > 0 ? "red" : "green",
        value: cancelledOrders.toLocaleString("en-IN"),
      },
    ],
    recentRows,
    statusBreakdown,
    totalOrdersLabel:
      orders.length >= 1000 ? `${(orders.length / 1000).toFixed(1)}k` : String(orders.length),
  };
}

function buildDashboardTimeline(status: string, createdAt: Date): DashboardOrderDetail["timeline"] {
  const createdLabel = formatDashboardDate(createdAt);

  if (status === "CANCELLED") {
    return [
      {
        description: "Customer order was cancelled before fulfillment.",
        id: "cancelled",
        state: "current",
        timeLabel: createdLabel,
        title: "Cancelled",
      },
      {
        description: "Order was originally received by the storefront.",
        id: "received",
        state: "done",
        timeLabel: createdLabel,
        title: "Order Received",
      },
    ];
  }

  if (status === "COMPLETED" || status === "DELIVERED") {
    return [
      {
        description: "Customer order was delivered successfully.",
        id: "delivered",
        state: "current",
        timeLabel: "Completed",
        title: "Delivered",
      },
      {
        description: "Package was dispatched from the fulfillment queue.",
        id: "dispatched",
        state: "done",
        timeLabel: createdLabel,
        title: "Dispatched",
      },
      {
        description: "Payment and inventory were confirmed.",
        id: "received",
        state: "done",
        timeLabel: createdLabel,
        title: "Order Received",
      },
    ];
  }

  return [
    {
      description: "Warehouse team is preparing the order.",
      id: "processing",
      state: "current",
      timeLabel: "In Progress",
      title: "In Curation",
    },
    {
      description: "Payment and inventory were confirmed.",
      id: "received",
      state: "done",
      timeLabel: createdLabel,
      title: "Order Received",
    },
    {
      description: "Delivery partner assignment is pending.",
      id: "delivery",
      state: "pending",
      timeLabel: "Pending",
      title: "Out for Delivery",
    },
  ];
}

function toOrderDto(order: {
  createdAt: Date;
  deliveryFee: Prisma.Decimal;
  discount: Prisma.Decimal;
  id: string;
  items: Array<{
    id: string;
    lineTotal: Prisma.Decimal;
    productImage: string;
    productName: string;
    productSlug: string;
    quantity: number;
    unitPrice: Prisma.Decimal;
  }>;
  offerCode: string | null;
  orderNumber: string;
  status: string;
  subtotal: Prisma.Decimal;
  tax: Prisma.Decimal;
  total: Prisma.Decimal;
}): OrderDto {
  return {
    createdAt: order.createdAt.toISOString(),
    deliveryFee: Number(order.deliveryFee),
    discount: Number(order.discount),
    id: order.id,
    items: order.items.map((item) => ({
      id: item.id,
      lineTotal: Number(item.lineTotal),
      productImage: item.productImage,
      productName: item.productName,
      productSlug: item.productSlug,
      quantity: item.quantity,
      unitPrice: Number(item.unitPrice),
    })),
    offerCode: order.offerCode,
    orderNumber: order.orderNumber,
    status: order.status,
    subtotal: Number(order.subtotal),
    tax: Number(order.tax),
    total: Number(order.total),
  };
}

export async function createOrder(
  payload: CreateOrderPayload,
  authenticatedAuthId?: string,
): Promise<OrderDto> {
  if (!isRecord(payload)) {
    throw apiErrors.validation("Order details are invalid.", {
      form: "Request body must be an object.",
    });
  }

  const user = authenticatedAuthId
    ? await getUserByAuthId(authenticatedAuthId)
    : isRecord(payload.user)
      ? await upsertUser(payload.user)
      : null;

  if (!user) {
    throw apiErrors.unauthorized("Please sign in before checkout.");
  }

  const requestedItems = normalizeOrderItems(payload.items);
  const products = await prisma.product.findMany({
    where: {
      slug: {
        in: requestedItems.map((item) => item.productSlug),
      },
    },
  });
  const productsBySlug = new Map(products.map((product) => [product.slug, product]));
  const orderItems = requestedItems.map((item) => {
    const product = productsBySlug.get(item.productSlug);

    if (!product) {
      throw apiErrors.validation("Order details are invalid.", {
        items: `Product ${item.productSlug} is not available.`,
      });
    }

    const unitPrice = Number(product.price);
    const lineTotal = Math.round(unitPrice * item.quantity * 100) / 100;

    return {
      lineTotal,
      product,
      productSlug: product.slug,
      quantity: item.quantity,
      unitPrice,
    };
  });
  const subtotal = Math.round(
    orderItems.reduce((sum, item) => sum + item.lineTotal, 0) * 100,
  ) / 100;
  const offerCode = optionalString(payload.offerCode).toUpperCase() || null;
  const offerValidation = offerCode
    ? await validateOffer({ code: offerCode, subtotal })
    : null;
  const discount = offerValidation
    ? calculateOfferDiscount(offerValidation.offer, subtotal)
    : 0;
  const deliveryFee =
    payload.deliveryFee === undefined
      ? subtotal >= freeDeliveryThreshold
        ? 0
        : standardDeliveryFee
      : normalizeMoney(payload.deliveryFee);
  const tax =
    payload.tax === undefined
      ? Math.round(Math.max(subtotal - discount, 0) * taxRate * 100) / 100
      : normalizeMoney(payload.tax);
  const total = Math.max(
    Math.round((subtotal - discount + deliveryFee + tax) * 100) / 100,
    0,
  );

  const order = await prisma.$transaction(async (tx) => {
    const createdOrder = await tx.order.create({
      data: {
        deliveryFee: toDecimal(deliveryFee),
        discount: toDecimal(discount),
        items: {
          create: orderItems.map((item) => ({
            lineTotal: toDecimal(item.lineTotal),
            productId: item.product.id,
            productImage: item.product.imageSrc,
            productName: item.product.name,
            productSlug: item.productSlug,
            quantity: item.quantity,
            unitPrice: toDecimal(item.unitPrice),
          })),
        },
        offerCode,
        offerId: offerValidation?.offer.id,
        orderNumber: createOrderNumber(),
        status: "PLACED",
        subtotal: toDecimal(subtotal),
        tax: toDecimal(tax),
        total: toDecimal(total),
        userId: user.id,
      },
      include: {
        items: true,
      },
    });

    if (offerValidation) {
      await tx.offer.update({
        data: {
          usedCount: {
            increment: 1,
          },
        },
        where: {
          id: offerValidation.offer.id,
        },
      });
    }

    return createdOrder;
  });

  return toOrderDto(order);
}

export async function listUserOrders(userAuthId: string): Promise<OrderDto[]> {
  const authId = userAuthId.trim();

  if (!authId) {
    throw apiErrors.validation("User details are invalid.", {
      userAuthId: "User auth ID is required.",
    });
  }

  const orders = await prisma.order.findMany({
    include: {
      items: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    where: {
      user: {
        authId,
      },
    },
  });

  return orders.map(toOrderDto);
}

export async function getDashboardOrderOverview(): Promise<DashboardOrderOverview> {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        user: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return buildDashboardOrderOverview(orders);
  } catch (error) {
    if (!shouldUseOrderFallback(error)) {
      throw error;
    }

    serverLogger.warn(
      "Order overview fell back to an empty dashboard because the order datasource is unavailable.",
      { error: error instanceof Error ? error.message : String(error) },
    );

    return buildDashboardOrderOverview([]);
  }
}

export async function getDashboardOrderDetail(
  orderId: string,
): Promise<DashboardOrderDetail> {
  const normalizedOrderId = orderId.trim().replace(/^#/, "");

  if (!normalizedOrderId) {
    throw apiErrors.notFound("Order was not found.");
  }

  const order = await prisma.order.findFirst({
    include: {
      items: true,
      user: true,
    },
    where: {
      OR: [{ orderNumber: normalizedOrderId }, { id: normalizedOrderId }],
    },
  });

  if (!order) {
    throw apiErrors.notFound("Order was not found.", { orderId });
  }

  const addressLines = Array.isArray(order.user.addressLines)
    ? order.user.addressLines.filter((line): line is string => typeof line === "string")
    : [];
  const shippingAddress =
    addressLines.length > 0
      ? addressLines.join(", ")
      : order.user.addressLabel ?? "No saved shipping address";

  return {
    customerEmail: order.user.email,
    customerName: order.user.name,
    customerPhone: order.user.phone ?? "Not provided",
    description: "Manage and track this customer order from the database.",
    fulfillmentPercent:
      order.status === "COMPLETED" || order.status === "DELIVERED"
        ? 100
        : order.status === "CANCELLED"
          ? 0
          : 65,
    harvestChange: `${order.items.reduce((sum, item) => sum + item.quantity, 0)} items in this order`,
    harvestValue: formatDashboardMoney(Number(order.total)),
    items: order.items.map((item) => ({
      id: item.id,
      imageSrc: item.productImage,
      name: item.productName,
      price: formatDashboardMoney(Number(item.lineTotal)),
      qty: String(item.quantity),
      type: "Product",
      unitPrice: formatDashboardMoney(Number(item.unitPrice)),
    })),
    memberLabel: order.user.membership,
    note:
      order.offerCode
        ? `Coupon ${order.offerCode} was applied during checkout.`
        : "No coupon was applied during checkout.",
    orderId: order.orderNumber,
    shippingAddress,
    status: getDashboardStatusLabel(order.status),
    subtotal: formatDashboardMoney(Number(order.subtotal)),
    timeline: buildDashboardTimeline(order.status, order.createdAt),
  };
}

export async function getPublicOrderTracking(
  orderCode: string,
): Promise<PublicOrderTrackingDto> {
  const normalizedOrderCode = orderCode.trim().replace(/^#/, "");

  if (!normalizedOrderCode) {
    throw apiErrors.notFound("Order was not found.");
  }

  const order = await prisma.order.findFirst({
    include: {
      items: {
        select: {
          quantity: true,
        },
      },
    },
    where: {
      orderNumber: normalizedOrderCode,
    },
  });

  if (!order) {
    throw apiErrors.notFound("Order was not found.", { orderCode });
  }

  const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
  const statusInfo = getPublicTrackingStatus(order.status);

  return {
    itemSummary: `${itemCount} item${itemCount === 1 ? "" : "s"}`,
    orderNumber: order.orderNumber,
    placedOn: formatTrackingDate(order.createdAt),
    status: statusInfo.label,
    statusDetail: statusInfo.detail,
    statusTone: statusInfo.tone,
    trackingCarrier: "Standard delivery",
    trackingCode: order.orderNumber,
    trackingSteps: getPublicTrackingSteps(order.status),
  };
}
