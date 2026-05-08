import { Prisma } from "@prisma/client";

import { prisma } from "../db/prisma";
import { apiErrors } from "../http/api-error";

export type OfferPayload = {
  code?: unknown;
  description?: unknown;
  endsAt?: unknown;
  maxDiscount?: unknown;
  minSubtotal?: unknown;
  startsAt?: unknown;
  status?: unknown;
  title?: unknown;
  type?: unknown;
  usageLimit?: unknown;
  value?: unknown;
};

export type OfferDto = {
  code: string;
  createdAt: string;
  description: string | null;
  endsAt: string | null;
  id: string;
  maxDiscount: number | null;
  minSubtotal: number;
  startsAt: string | null;
  status: OfferStatus;
  title: string;
  type: OfferType;
  updatedAt: string;
  usageLimit: number | null;
  usedCount: number;
  value: number;
};

export type OfferValidationPayload = {
  code?: unknown;
  subtotal?: unknown;
};

export type OfferValidationResult = {
  code: string;
  discount: number;
  message: string;
  offer: OfferDto;
};

export const offerTypes = ["PERCENTAGE", "FLAT"] as const;
export type OfferType = (typeof offerTypes)[number];

export const offerStatuses = ["ACTIVE", "PAUSED", "EXPIRED"] as const;
export type OfferStatus = (typeof offerStatuses)[number];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function hasOwnField(payload: Record<string, unknown>, field: string) {
  return Object.prototype.hasOwnProperty.call(payload, field);
}

function optionalString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCode(value: unknown) {
  return optionalString(value).toUpperCase().replace(/[^A-Z0-9_-]/g, "");
}

function normalizeMoney(
  value: unknown,
  field: string,
  label: string,
  fieldErrors: Record<string, string>,
  required: boolean,
) {
  if (value === undefined || value === null || value === "") {
    if (required) {
      fieldErrors[field] = `${label} is required.`;
    }

    return undefined;
  }

  const numberValue = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(numberValue) || numberValue < 0) {
    fieldErrors[field] = `${label} must be a valid non-negative amount.`;
    return undefined;
  }

  return Math.round(numberValue * 100) / 100;
}

function normalizeDate(value: unknown, field: string, fieldErrors: Record<string, string>) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  if (typeof value !== "string") {
    fieldErrors[field] = "Enter a valid date.";
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    fieldErrors[field] = "Enter a valid date.";
    return null;
  }

  return date;
}

function normalizeInteger(
  value: unknown,
  field: string,
  label: string,
  fieldErrors: Record<string, string>,
) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numberValue = typeof value === "number" ? value : Number(value);

  if (!Number.isInteger(numberValue) || numberValue < 1) {
    fieldErrors[field] = `${label} must be a whole number greater than zero.`;
    return null;
  }

  return numberValue;
}

function normalizeType(value: unknown, fieldErrors: Record<string, string>) {
  const type = optionalString(value).toUpperCase();

  if (!offerTypes.includes(type as OfferType)) {
    fieldErrors.type = "Choose percentage or flat discount.";
    return "PERCENTAGE" as OfferType;
  }

  return type as OfferType;
}

function normalizeStatus(value: unknown, fieldErrors: Record<string, string>) {
  if (value === undefined || value === null || value === "") {
    return "ACTIVE" as OfferStatus;
  }

  const status = optionalString(value).toUpperCase();

  if (!offerStatuses.includes(status as OfferStatus)) {
    fieldErrors.status = "Choose a valid offer status.";
    return "ACTIVE" as OfferStatus;
  }

  return status as OfferStatus;
}

function toDecimal(value: number) {
  return new Prisma.Decimal(value.toFixed(2));
}

function toOfferDto(offer: {
  code: string;
  createdAt: Date;
  description: string | null;
  endsAt: Date | null;
  id: string;
  maxDiscount: Prisma.Decimal | null;
  minSubtotal: Prisma.Decimal;
  startsAt: Date | null;
  status: string;
  title: string;
  type: string;
  updatedAt: Date;
  usageLimit: number | null;
  usedCount: number;
  value: Prisma.Decimal;
}): OfferDto {
  return {
    code: offer.code,
    createdAt: offer.createdAt.toISOString(),
    description: offer.description,
    endsAt: offer.endsAt?.toISOString() ?? null,
    id: offer.id,
    maxDiscount: offer.maxDiscount === null ? null : Number(offer.maxDiscount),
    minSubtotal: Number(offer.minSubtotal),
    startsAt: offer.startsAt?.toISOString() ?? null,
    status: offerStatuses.includes(offer.status as OfferStatus)
      ? (offer.status as OfferStatus)
      : "ACTIVE",
    title: offer.title,
    type: offerTypes.includes(offer.type as OfferType)
      ? (offer.type as OfferType)
      : "PERCENTAGE",
    updatedAt: offer.updatedAt.toISOString(),
    usageLimit: offer.usageLimit,
    usedCount: offer.usedCount,
    value: Number(offer.value),
  };
}

function normalizeCreateOfferPayload(payload: OfferPayload) {
  if (!isRecord(payload)) {
    throw apiErrors.validation("Offer details are invalid.", {
      form: "Request body must be an object.",
    });
  }

  const fieldErrors: Record<string, string> = {};
  const code = normalizeCode(payload.code);
  const title = optionalString(payload.title);
  const type = normalizeType(payload.type, fieldErrors);
  const value = normalizeMoney(payload.value, "value", "Discount value", fieldErrors, true) ?? 0;
  const maxDiscount = normalizeMoney(
    payload.maxDiscount,
    "maxDiscount",
    "Maximum discount",
    fieldErrors,
    false,
  );
  const minSubtotal =
    normalizeMoney(payload.minSubtotal, "minSubtotal", "Minimum subtotal", fieldErrors, false) ??
    0;
  const startsAt = normalizeDate(payload.startsAt, "startsAt", fieldErrors);
  const endsAt = normalizeDate(payload.endsAt, "endsAt", fieldErrors);
  const usageLimit = normalizeInteger(
    payload.usageLimit,
    "usageLimit",
    "Usage limit",
    fieldErrors,
  );
  const status = normalizeStatus(payload.status, fieldErrors);

  if (code.length < 3) {
    fieldErrors.code = "Coupon code must be at least 3 characters.";
  }

  if (title.length < 2) {
    fieldErrors.title = "Offer title must be at least 2 characters.";
  }

  if (type === "PERCENTAGE" && value > 100) {
    fieldErrors.value = "Percentage discount cannot exceed 100.";
  }

  if (startsAt && endsAt && startsAt > endsAt) {
    fieldErrors.endsAt = "End date must be after start date.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw apiErrors.validation("Offer details are invalid.", fieldErrors);
  }

  return {
    code,
    description: optionalString(payload.description) || null,
    endsAt,
    maxDiscount,
    minSubtotal,
    startsAt,
    status,
    title,
    type,
    usageLimit,
    value,
  };
}

function normalizeUpdateOfferPayload(payload: OfferPayload) {
  if (!isRecord(payload)) {
    throw apiErrors.validation("Offer details are invalid.", {
      form: "Request body must be an object.",
    });
  }

  const fieldErrors: Record<string, string> = {};
  const normalized: Record<string, unknown> = {};

  if (hasOwnField(payload, "code")) {
    const code = normalizeCode(payload.code);

    if (code.length < 3) {
      fieldErrors.code = "Coupon code must be at least 3 characters.";
    }

    normalized.code = code;
  }

  if (hasOwnField(payload, "title")) {
    const title = optionalString(payload.title);

    if (title.length < 2) {
      fieldErrors.title = "Offer title must be at least 2 characters.";
    }

    normalized.title = title;
  }

  if (hasOwnField(payload, "description")) {
    normalized.description = optionalString(payload.description) || null;
  }

  if (hasOwnField(payload, "type")) {
    normalized.type = normalizeType(payload.type, fieldErrors);
  }

  if (hasOwnField(payload, "value")) {
    normalized.value = normalizeMoney(
      payload.value,
      "value",
      "Discount value",
      fieldErrors,
      true,
    );
  }

  if (hasOwnField(payload, "maxDiscount")) {
    normalized.maxDiscount =
      payload.maxDiscount === null || payload.maxDiscount === ""
        ? null
        : normalizeMoney(
            payload.maxDiscount,
            "maxDiscount",
            "Maximum discount",
            fieldErrors,
            false,
          );
  }

  if (hasOwnField(payload, "minSubtotal")) {
    normalized.minSubtotal =
      normalizeMoney(
        payload.minSubtotal,
        "minSubtotal",
        "Minimum subtotal",
        fieldErrors,
        false,
      ) ?? 0;
  }

  if (hasOwnField(payload, "startsAt")) {
    normalized.startsAt = normalizeDate(payload.startsAt, "startsAt", fieldErrors);
  }

  if (hasOwnField(payload, "endsAt")) {
    normalized.endsAt = normalizeDate(payload.endsAt, "endsAt", fieldErrors);
  }

  if (hasOwnField(payload, "status")) {
    normalized.status = normalizeStatus(payload.status, fieldErrors);
  }

  if (hasOwnField(payload, "usageLimit")) {
    normalized.usageLimit = normalizeInteger(
      payload.usageLimit,
      "usageLimit",
      "Usage limit",
      fieldErrors,
    );
  }

  const type = (normalized.type ?? optionalString(payload.type).toUpperCase()) as string;
  const value = Number(normalized.value ?? payload.value);

  if (type === "PERCENTAGE" && Number.isFinite(value) && value > 100) {
    fieldErrors.value = "Percentage discount cannot exceed 100.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw apiErrors.validation("Offer details are invalid.", fieldErrors);
  }

  if (Object.keys(normalized).length === 0) {
    throw apiErrors.badRequest("At least one offer field must be provided.");
  }

  const data: Prisma.OfferUncheckedUpdateInput = {};

  if (normalized.code !== undefined) data.code = normalized.code as string;
  if (normalized.title !== undefined) data.title = normalized.title as string;
  if (normalized.description !== undefined) data.description = normalized.description as string | null;
  if (normalized.type !== undefined) data.type = normalized.type as string;
  if (normalized.value !== undefined) data.value = toDecimal(normalized.value as number);
  if (normalized.maxDiscount !== undefined) {
    data.maxDiscount =
      normalized.maxDiscount === null ? null : toDecimal(normalized.maxDiscount as number);
  }
  if (normalized.minSubtotal !== undefined) data.minSubtotal = toDecimal(normalized.minSubtotal as number);
  if (normalized.startsAt !== undefined) data.startsAt = normalized.startsAt as Date | null;
  if (normalized.endsAt !== undefined) data.endsAt = normalized.endsAt as Date | null;
  if (normalized.status !== undefined) data.status = normalized.status as string;
  if (normalized.usageLimit !== undefined) data.usageLimit = normalized.usageLimit as number | null;

  return data;
}

function isUniqueConstraintError(error: unknown, field: string) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002" &&
    Array.isArray(error.meta?.target) &&
    error.meta.target.includes(field)
  );
}

function isRecordNotFoundError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025";
}

export function calculateOfferDiscount(
  offer: Pick<OfferDto, "maxDiscount" | "minSubtotal" | "type" | "value">,
  subtotal: number,
) {
  if (subtotal < offer.minSubtotal) {
    return 0;
  }

  const rawDiscount =
    offer.type === "PERCENTAGE" ? (subtotal * offer.value) / 100 : offer.value;
  const cappedDiscount =
    offer.maxDiscount === null ? rawDiscount : Math.min(rawDiscount, offer.maxDiscount);

  return Math.min(Math.round(cappedDiscount * 100) / 100, subtotal);
}

function assertOfferCanApply(offer: OfferDto, subtotal: number) {
  const now = Date.now();

  if (offer.status !== "ACTIVE") {
    throw apiErrors.badRequest("This coupon is not active.");
  }

  if (offer.startsAt && new Date(offer.startsAt).getTime() > now) {
    throw apiErrors.badRequest("This coupon is not active yet.");
  }

  if (offer.endsAt && new Date(offer.endsAt).getTime() < now) {
    throw apiErrors.badRequest("This coupon has expired.");
  }

  if (offer.usageLimit !== null && offer.usedCount >= offer.usageLimit) {
    throw apiErrors.badRequest("This coupon has reached its usage limit.");
  }

  if (subtotal < offer.minSubtotal) {
    throw apiErrors.badRequest(
      `Add Rs ${Math.ceil(offer.minSubtotal - subtotal)} more to use this coupon.`,
    );
  }
}

export async function listOffers(): Promise<OfferDto[]> {
  const offers = await prisma.offer.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return offers.map(toOfferDto);
}

export async function createOffer(payload: OfferPayload): Promise<OfferDto> {
  const offer = normalizeCreateOfferPayload(payload);

  try {
    const createdOffer = await prisma.offer.create({
      data: {
        code: offer.code,
        description: offer.description,
        endsAt: offer.endsAt,
        maxDiscount:
          offer.maxDiscount === undefined ? undefined : toDecimal(offer.maxDiscount),
        minSubtotal: toDecimal(offer.minSubtotal),
        startsAt: offer.startsAt,
        status: offer.status,
        title: offer.title,
        type: offer.type,
        usageLimit: offer.usageLimit,
        value: toDecimal(offer.value),
      },
    });

    return toOfferDto(createdOffer);
  } catch (error) {
    if (isUniqueConstraintError(error, "code")) {
      throw apiErrors.conflict("An offer with this coupon code already exists.", {
        code: offer.code,
      });
    }

    throw error;
  }
}

export async function updateOffer(
  offerId: string,
  payload: OfferPayload,
): Promise<OfferDto> {
  const data = normalizeUpdateOfferPayload(payload);

  try {
    const updatedOffer = await prisma.offer.update({
      data,
      where: {
        id: offerId,
      },
    });

    return toOfferDto(updatedOffer);
  } catch (error) {
    if (isUniqueConstraintError(error, "code")) {
      throw apiErrors.conflict("An offer with this coupon code already exists.");
    }

    if (isRecordNotFoundError(error)) {
      throw apiErrors.notFound("Offer was not found.", { offerId });
    }

    throw error;
  }
}

export async function deleteOffer(offerId: string): Promise<void> {
  try {
    await prisma.offer.delete({
      where: {
        id: offerId,
      },
    });
  } catch (error) {
    if (isRecordNotFoundError(error)) {
      throw apiErrors.notFound("Offer was not found.", { offerId });
    }

    throw error;
  }
}

export async function validateOffer(
  payload: OfferValidationPayload,
): Promise<OfferValidationResult> {
  if (!isRecord(payload)) {
    throw apiErrors.validation("Coupon details are invalid.", {
      form: "Request body must be an object.",
    });
  }

  const code = normalizeCode(payload.code);
  const subtotal = Number(payload.subtotal);

  if (!code) {
    throw apiErrors.validation("Coupon details are invalid.", {
      code: "Coupon code is required.",
    });
  }

  if (!Number.isFinite(subtotal) || subtotal <= 0) {
    throw apiErrors.validation("Coupon details are invalid.", {
      subtotal: "Subtotal must be greater than zero.",
    });
  }

  const offer = await prisma.offer.findUnique({
    where: {
      code,
    },
  });

  if (!offer) {
    throw apiErrors.notFound("Coupon code was not found.", { code });
  }

  const offerDto = toOfferDto(offer);

  assertOfferCanApply(offerDto, subtotal);

  const discount = calculateOfferDiscount(offerDto, subtotal);

  if (discount <= 0) {
    throw apiErrors.badRequest("This coupon does not apply to the current cart.");
  }

  return {
    code,
    discount,
    message: `${code} applied successfully.`,
    offer: offerDto,
  };
}
