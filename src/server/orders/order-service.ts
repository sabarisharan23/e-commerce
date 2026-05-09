import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

import { calculateOfferDiscount, validateOffer } from "../offers/offer-service";
import { prisma } from "../db/prisma";
import { apiErrors } from "../http/api-error";
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

const freeDeliveryThreshold = 2750;
const standardDeliveryFee = 50;
const taxRate = 0.18;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function optionalString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
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
