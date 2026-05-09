import { Prisma } from "@prisma/client";
import { randomUUID } from "crypto";

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
  targetCategory?: unknown;
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
  targetCategory: string | null;
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

export type BundleOfferPayload = {
  bundleCode?: unknown;
  components?: unknown;
  discountPercent?: unknown;
  name?: unknown;
  primaryProduct?: unknown;
  status?: unknown;
};

export type BundleOfferDto = {
  bundleCode: string;
  components: string[];
  createdAt: string;
  discountPercent: number;
  id: string;
  name: string;
  primaryProduct: string;
  status: BundleOfferStatus;
  totalSales: number;
  unitsSold: number;
};

export type SeasonalCampaignPayload = {
  audience?: unknown;
  campaignCode?: unknown;
  conversionGoal?: unknown;
  endsAt?: unknown;
  incentive?: unknown;
  projectedImpact?: unknown;
  startsAt?: unknown;
  status?: unknown;
  title?: unknown;
};

export type SeasonalCampaignDto = {
  actualRevenue: number;
  audience: string[];
  campaignCode: string;
  conversionGoal: number;
  createdAt: string;
  endsAt: string | null;
  id: string;
  incentive: string;
  projectedImpact: number;
  startsAt: string | null;
  status: SeasonalCampaignStatus;
  title: string;
};

export const offerTypes = ["PERCENTAGE", "FLAT"] as const;
export type OfferType = (typeof offerTypes)[number];

export const offerStatuses = ["ACTIVE", "PAUSED", "EXPIRED"] as const;
export type OfferStatus = (typeof offerStatuses)[number];

export const bundleOfferStatuses = ["DRAFT", "ACTIVE", "SCHEDULED", "PAUSED"] as const;
export type BundleOfferStatus = (typeof bundleOfferStatuses)[number];

export const seasonalCampaignStatuses = [
  "HAPPENING_NOW",
  "UPCOMING",
  "PLANNING",
] as const;
export type SeasonalCampaignStatus = (typeof seasonalCampaignStatuses)[number];

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

function normalizeBundleStatus(value: unknown, fieldErrors: Record<string, string>) {
  if (value === undefined || value === null || value === "") {
    return "DRAFT" as BundleOfferStatus;
  }

  const status = optionalString(value).toUpperCase().replace(/\s+/g, "_");

  if (!bundleOfferStatuses.includes(status as BundleOfferStatus)) {
    fieldErrors.status = "Choose a valid bundle status.";
    return "DRAFT" as BundleOfferStatus;
  }

  return status as BundleOfferStatus;
}

function normalizeSeasonalStatus(value: unknown, fieldErrors: Record<string, string>) {
  if (value === undefined || value === null || value === "") {
    return "PLANNING" as SeasonalCampaignStatus;
  }

  const status = optionalString(value).toUpperCase().replace(/\s+/g, "_");

  if (!seasonalCampaignStatuses.includes(status as SeasonalCampaignStatus)) {
    fieldErrors.status = "Choose a valid campaign status.";
    return "PLANNING" as SeasonalCampaignStatus;
  }

  return status as SeasonalCampaignStatus;
}

function normalizeStringList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
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
  targetCategory: string | null;
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
    targetCategory: offer.targetCategory,
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

function createRecordCode(prefix: string) {
  return `${prefix}-${randomUUID().slice(0, 6).toUpperCase()}`;
}

function toBundleOfferDto(bundle: {
  bundleCode: string;
  components: Prisma.JsonValue;
  createdAt: Date;
  discountPercent: Prisma.Decimal;
  id: string;
  name: string;
  primaryProduct: string;
  status: string;
  totalSales: Prisma.Decimal;
  unitsSold: number;
}): BundleOfferDto {
  const components = Array.isArray(bundle.components)
    ? bundle.components.filter((item): item is string => typeof item === "string")
    : [];

  return {
    bundleCode: bundle.bundleCode,
    components,
    createdAt: bundle.createdAt.toISOString(),
    discountPercent: Number(bundle.discountPercent),
    id: bundle.id,
    name: bundle.name,
    primaryProduct: bundle.primaryProduct,
    status: bundleOfferStatuses.includes(bundle.status as BundleOfferStatus)
      ? (bundle.status as BundleOfferStatus)
      : "DRAFT",
    totalSales: Number(bundle.totalSales),
    unitsSold: bundle.unitsSold,
  };
}

function toSeasonalCampaignDto(campaign: {
  actualRevenue: Prisma.Decimal;
  audience: Prisma.JsonValue;
  campaignCode: string;
  conversionGoal: Prisma.Decimal;
  createdAt: Date;
  endsAt: Date | null;
  id: string;
  incentive: string;
  projectedImpact: Prisma.Decimal;
  startsAt: Date | null;
  status: string;
  title: string;
}): SeasonalCampaignDto {
  const audience = Array.isArray(campaign.audience)
    ? campaign.audience.filter((item): item is string => typeof item === "string")
    : [];

  return {
    actualRevenue: Number(campaign.actualRevenue),
    audience,
    campaignCode: campaign.campaignCode,
    conversionGoal: Number(campaign.conversionGoal),
    createdAt: campaign.createdAt.toISOString(),
    endsAt: campaign.endsAt?.toISOString() ?? null,
    id: campaign.id,
    incentive: campaign.incentive,
    projectedImpact: Number(campaign.projectedImpact),
    startsAt: campaign.startsAt?.toISOString() ?? null,
    status: seasonalCampaignStatuses.includes(campaign.status as SeasonalCampaignStatus)
      ? (campaign.status as SeasonalCampaignStatus)
      : "PLANNING",
    title: campaign.title,
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
  const targetCategory = optionalString(payload.targetCategory) || null;

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
    targetCategory,
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

  if (hasOwnField(payload, "targetCategory")) {
    normalized.targetCategory = optionalString(payload.targetCategory) || null;
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
  if (normalized.targetCategory !== undefined) data.targetCategory = normalized.targetCategory as string | null;
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
        targetCategory: offer.targetCategory,
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

function normalizeBundleOfferPayload(payload: BundleOfferPayload) {
  if (!isRecord(payload)) {
    throw apiErrors.validation("Bundle details are invalid.", {
      form: "Request body must be an object.",
    });
  }

  const fieldErrors: Record<string, string> = {};
  const name = optionalString(payload.name);
  const primaryProduct = optionalString(payload.primaryProduct);
  const bundleCode =
    normalizeCode(payload.bundleCode) || createRecordCode("BNDL");
  const discountPercent =
    normalizeMoney(
      payload.discountPercent,
      "discountPercent",
      "Bundle discount",
      fieldErrors,
      true,
    ) ?? 0;
  const status = normalizeBundleStatus(payload.status, fieldErrors);
  const components = normalizeStringList(payload.components);

  if (name.length < 2) {
    fieldErrors.name = "Bundle name must be at least 2 characters.";
  }

  if (primaryProduct.length < 2) {
    fieldErrors.primaryProduct = "Primary product is required.";
  }

  if (discountPercent > 100) {
    fieldErrors.discountPercent = "Bundle discount cannot exceed 100%.";
  }

  if (components.length === 0) {
    fieldErrors.components = "Add at least one bundled product.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw apiErrors.validation("Bundle details are invalid.", fieldErrors);
  }

  return {
    bundleCode,
    components,
    discountPercent,
    name,
    primaryProduct,
    status,
  };
}

function normalizeSeasonalCampaignPayload(payload: SeasonalCampaignPayload) {
  if (!isRecord(payload)) {
    throw apiErrors.validation("Campaign details are invalid.", {
      form: "Request body must be an object.",
    });
  }

  const fieldErrors: Record<string, string> = {};
  const title = optionalString(payload.title);
  const campaignCode =
    normalizeCode(payload.campaignCode) || createRecordCode("CMP");
  const incentive = optionalString(payload.incentive) || "Store-wide 20% Off";
  const status = normalizeSeasonalStatus(payload.status, fieldErrors);
  const startsAt = normalizeDate(payload.startsAt, "startsAt", fieldErrors);
  const endsAt = normalizeDate(payload.endsAt, "endsAt", fieldErrors);
  const conversionGoal =
    normalizeMoney(
      payload.conversionGoal,
      "conversionGoal",
      "Conversion goal",
      fieldErrors,
      false,
    ) ?? 12.5;
  const projectedImpact =
    normalizeMoney(
      payload.projectedImpact,
      "projectedImpact",
      "Projected impact",
      fieldErrors,
      false,
    ) ?? 0;
  const audience = normalizeStringList(payload.audience);

  if (title.length < 2) {
    fieldErrors.title = "Campaign title must be at least 2 characters.";
  }

  if (startsAt && endsAt && startsAt > endsAt) {
    fieldErrors.endsAt = "End date must be after start date.";
  }

  if (Object.keys(fieldErrors).length > 0) {
    throw apiErrors.validation("Campaign details are invalid.", fieldErrors);
  }

  return {
    audience,
    campaignCode,
    conversionGoal,
    endsAt,
    incentive,
    projectedImpact,
    startsAt,
    status,
    title,
  };
}

export async function listBundleOffers(): Promise<BundleOfferDto[]> {
  const bundles = await prisma.bundleOffer.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return bundles.map(toBundleOfferDto);
}

export async function createBundleOffer(
  payload: BundleOfferPayload,
): Promise<BundleOfferDto> {
  const bundle = normalizeBundleOfferPayload(payload);

  try {
    const createdBundle = await prisma.bundleOffer.create({
      data: {
        bundleCode: bundle.bundleCode,
        components: bundle.components,
        discountPercent: toDecimal(bundle.discountPercent),
        name: bundle.name,
        primaryProduct: bundle.primaryProduct,
        status: bundle.status,
      },
    });

    return toBundleOfferDto(createdBundle);
  } catch (error) {
    if (isUniqueConstraintError(error, "bundleCode")) {
      throw apiErrors.conflict("A bundle with this code already exists.", {
        bundleCode: bundle.bundleCode,
      });
    }

    throw error;
  }
}

export async function listSeasonalCampaigns(): Promise<SeasonalCampaignDto[]> {
  const campaigns = await prisma.seasonalCampaign.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return campaigns.map(toSeasonalCampaignDto);
}

export async function createSeasonalCampaign(
  payload: SeasonalCampaignPayload,
): Promise<SeasonalCampaignDto> {
  const campaign = normalizeSeasonalCampaignPayload(payload);

  try {
    const createdCampaign = await prisma.seasonalCampaign.create({
      data: {
        audience: campaign.audience,
        campaignCode: campaign.campaignCode,
        conversionGoal: toDecimal(campaign.conversionGoal),
        endsAt: campaign.endsAt,
        incentive: campaign.incentive,
        projectedImpact: toDecimal(campaign.projectedImpact),
        startsAt: campaign.startsAt,
        status: campaign.status,
        title: campaign.title,
      },
    });

    return toSeasonalCampaignDto(createdCampaign);
  } catch (error) {
    if (isUniqueConstraintError(error, "campaignCode")) {
      throw apiErrors.conflict("A campaign with this code already exists.", {
        campaignCode: campaign.campaignCode,
      });
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
